<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    // Handle POST request to insert loan request
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Extract loan request details from JSON data
    $userId = $data['user_id'];
    $amount = $data['amount'];
    $paymentDuration = $data['payment_duration'];
    $mobileNumber = $data['mobile_number'];

    // Prepare SQL statement to insert loan request into database
    $stmt = $pdo->prepare('INSERT INTO loans (user_id, amount, payment_duration, mobile_number, status) VALUES (?, ?, ?, ?, ?)');
    
    // Execute the SQL statement with loan request details
    if ($stmt->execute([$userId, $amount, $paymentDuration, $mobileNumber, 'Pending'])) {
        // If insertion is successful, return success message
        echo json_encode(['message' => 'Loan requested successfully']);
    } else {
        // If insertion fails, return failure message
        echo json_encode(['message' => 'Loan request failed']);
    }

} elseif ($method === 'GET') {
    // Handle GET request to fetch loans
    // We will retrieve loans for the last 2 weeks
    $dateTwoWeeksAgo = date('Y-m-d', strtotime('-2 weeks'));
    
    $stmt = $pdo->prepare('SELECT * FROM loans WHERE loan_date >= ?');
    $stmt->execute([$dateTwoWeeksAgo]);
    $loans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($loans);

} elseif ($method === 'PUT') {
    // Handle PUT request to update loan status
    $data = json_decode(file_get_contents('php://input'), true);
    $loanId = $data['id'];
    $status = $data['status'];

    // Prepare SQL statement to update loan status
    $stmt = $pdo->prepare('UPDATE loans SET status = ? WHERE id = ?');
    
    // Execute the SQL statement with loan status update
    if ($stmt->execute([$status, $loanId])) {
        // If update is successful, return success message
        echo json_encode(['message' => 'Loan status updated successfully']);
    } else {
        // If update fails, return failure message
        echo json_encode(['message' => 'Loan status update failed']);
    }

} elseif ($method === 'PATCH') {
    // Handle PATCH request to disburse loan
    $data = json_decode(file_get_contents('php://input'), true);
    $loanId = $data['id'];
    $mpesaNumber = $data['mpesa_number'];

    // Prepare SQL statement to disburse loan
    $stmt = $pdo->prepare('UPDATE loans SET status = ? WHERE id = ?');
    $stmtDisburse = $pdo->prepare('INSERT INTO disbursements (loan_id, mpesa_number, amount, disburse_date) SELECT id, ?, amount, NOW() FROM loans WHERE id = ?');

    // Execute the SQL statement with loan status update and disbursement record
    if ($stmt->execute(['Disbursed', $loanId]) && $stmtDisburse->execute([$mpesaNumber, $loanId])) {
        // If update is successful, return success message
        echo json_encode(['message' => 'Loan disbursed successfully']);
    } else {
        // If update fails, return failure message
        echo json_encode(['message' => 'Loan disbursement failed']);
    }

} else {
    // Return error message for invalid request method
    echo json_encode(['message' => 'Invalid request method']);
}
?>






