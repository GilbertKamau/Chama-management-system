<?php
require_once '../cors.php';
require_once '../db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['user_id'];
    $amount = $data['amount'];
    $paymentDuration = $data['payment_duration'];
    $mobileNumber = $data['mobile_number'];

    $stmt = $pdo->prepare('INSERT INTO loans (user_id, amount, payment_duration, mobile_number, status, loan_date) VALUES (?, ?, ?, ?, ?, NOW())');
    if ($stmt->execute([$userId, $amount, $paymentDuration, $mobileNumber, 'Pending'])) {
        echo json_encode(['message' => 'Loan requested successfully']);
    } else {
        echo json_encode(['message' => 'Loan request failed']);
    }

} elseif ($method === 'GET') {
    $dateTwoWeeksAgo = date('Y-m-d', strtotime('-2 weeks'));
    $stmt = $pdo->prepare('SELECT * FROM loans WHERE loan_date >= ?');
    $stmt->execute([$dateTwoWeeksAgo]);
    $loans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($loans);

} elseif ($method === 'PUT') {
    $data = json_decode(file_get_contents('php://input'), true);
    $loanId = $data['id'];
    $status = $data['status'];

    $stmt = $pdo->prepare('UPDATE loans SET status = ? WHERE id = ?');
    if ($stmt->execute([$status, $loanId])) {
        echo json_encode(['message' => 'Loan status updated successfully']);
    } else {
        echo json_encode(['message' => 'Loan status update failed']);
    }

} elseif ($method === 'PATCH') {
    $data = json_decode(file_get_contents('php://input'), true);
    $loanId = $data['id'];
    $mpesaNumber = $data['mpesa_number'];

    $stmt = $pdo->prepare('UPDATE loans SET status = ? WHERE id = ?');
    $stmtDisburse = $pdo->prepare('INSERT INTO disbursements (loan_id, mpesa_number, amount, disburse_date) SELECT id, ?, amount, NOW() FROM loans WHERE id = ?');

    if ($stmt->execute(['Disbursed', $loanId]) && $stmtDisburse->execute([$mpesaNumber, $loanId])) {
        echo json_encode(['message' => 'Loan disbursed successfully']);
    } else {
        echo json_encode(['message' => 'Loan disbursement failed']);
    }

} else {
    echo json_encode(['message' => 'Invalid request method']);
}
?>






