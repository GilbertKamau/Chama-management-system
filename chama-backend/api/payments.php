<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

session_start(); // Start the session to access session variables

if ($method === 'GET') {
    try {
        // Implement logic to check if the user is an admin
        function isAdmin() {
            return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
        }

        if (isAdmin()) {
            // Fetch all payments if the user is an admin
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







