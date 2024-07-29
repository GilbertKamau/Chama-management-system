<?php
require_once '../cors.php';
require_once '../db.php';
header('Content-Type: application/json');

session_start(); // Start the session to access session variables

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);

        // Ensure user_id is provided
        if (!isset($data['user_id'])) {
            throw new Exception('User ID is required');
        }

        $userId = intval($data['user_id']);
        $amount = filter_var($data['amount'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
        $paymentReference = filter_var($data['payment_reference'], FILTER_SANITIZE_STRING);
        $mobileNumber = filter_var($data['mobile_number'], FILTER_SANITIZE_STRING);

        // Check if user ID is valid
        $stmtUser = $pdo->prepare('SELECT * FROM users WHERE id = ?');
        $stmtUser->execute([$userId]);
        $user = $stmtUser->fetch();

        if (!$user) {
            throw new Exception('User not authenticated');
        }

        // Insert the payment into the database
        $stmt = $pdo->prepare('INSERT INTO payments (user_id, amount, payment_reference, mobile_number) VALUES (?, ?, ?, ?)');
        if ($stmt->execute([$userId, $amount, $paymentReference, $mobileNumber])) {
            echo json_encode(['message' => 'Payment recorded successfully']);
        } else {
            echo json_encode(['message' => 'Payment recording failed']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'GET') {
    try {
        function isAdmin() {
            return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
        }

        $isAdmin = isAdmin();

        if ($isAdmin) {
            $stmt = $pdo->query('SELECT * FROM payments');
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            if (!isset($_GET['user_id'])) {
                throw new Exception('User ID is required');
            }

            $userId = intval($_GET['user_id']);
            if ($userId <= 0) {
                throw new Exception('Invalid user ID');
            }

            $stmt = $pdo->prepare('SELECT * FROM payments WHERE user_id = ?');
            $stmt->execute([$userId]);
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($payments);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>














