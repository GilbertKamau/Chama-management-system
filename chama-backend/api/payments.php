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
            // Check if the user role is set in the session and if it equals 'admin'
            return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
        }

        $isAdmin = isAdmin();

        if ($isAdmin) {
            // Fetch all payments if the user is an admin
            $stmt = $pdo->query('SELECT * FROM payments');
            $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            // Fetch payments of a particular user
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

        // Return payments as a JSON response
        echo json_encode($payments);

    } catch (Exception $e) {
        // Handle exceptions and return an error message
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    // Return an error message for invalid request method
    echo json_encode(['error' => 'Invalid request method']);
}
?>







