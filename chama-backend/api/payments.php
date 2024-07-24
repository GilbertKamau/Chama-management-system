<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        if (isset($_GET['user_id'])) {
            // Fetch payments for a specific user
            $user_id = intval($_GET['user_id']);
            $stmt = $pdo->prepare('SELECT * FROM payments WHERE user_id = ?');
            $stmt->execute([$user_id]);
        } else {
            // Fetch all payments
            $stmt = $pdo->query('SELECT * FROM payments');
        }

        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($payments);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $data['user_id'];
        $amount = $data['amount'];
        $paymentDate = $data['payment_date'] ?? date('Y-m-d H:i:s'); // Use current timestamp if not provided
        $referenceNumber = $data['reference_number'];
        $mobileNumber = $data['mobile_number'];

        $stmt = $pdo->prepare('INSERT INTO payments (user_id, amount, payment_date, reference_number, mobile_number) VALUES (?, ?, ?, ?, ?)');

        if ($stmt->execute([$userId, $amount, $paymentDate, $referenceNumber, $mobileNumber])) {
            echo json_encode(['message' => 'Payment recorded successfully']);
        } else {
            echo json_encode(['message' => 'Payment recording failed']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['message' => 'Invalid request method']);
}
?>








