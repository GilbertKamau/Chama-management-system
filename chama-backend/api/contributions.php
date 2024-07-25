<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

session_start(); // Start the session to access session variables

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        function isAdmin() {
            return isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
        }

        if (isAdmin()) {
            // Admin can view all contributions
            $stmt = $pdo->query('SELECT * FROM contributions');
            $contributions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            // Regular users can view only their contributions
            if (!isset($_SESSION['user_id'])) {
                throw new Exception('User ID is required');
            }

            $user_id = intval($_SESSION['user_id']);
            if ($user_id <= 0) {
                throw new Exception('Invalid user ID');
            }

            $stmt = $pdo->prepare('SELECT * FROM contributions WHERE user_id = ?');
            $stmt->execute([$user_id]);
            $contributions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        echo json_encode($contributions);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $data['user_id'];
        $amount = $data['amount'];
        $contributionDate = $data['contribution_date'] ?? date('Y-m-d H:i:s'); // Use current timestamp if not provided
        $description = $data['description'] ?? ''; // Optional description

        $stmt = $pdo->prepare('INSERT INTO contributions (user_id, amount, contribution_date, description) VALUES (?, ?, ?, ?)');

        if ($stmt->execute([$userId, $amount, $contributionDate, $description])) {
            echo json_encode(['message' => 'Contribution added successfully']);
        } else {
            echo json_encode(['message' => 'Contribution addition failed']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['message' => 'Invalid request method']);
}
?>



