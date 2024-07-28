<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['user_id'])) {
        $userId = intval($_GET['user_id']);

        // Query to fetch loan statuses for the specified user
        $stmt = $pdo->prepare('SELECT status FROM loans WHERE user_id = ?');
        $stmt->execute([$userId]);
        $loanStatuses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($loanStatuses);
    } else {
        echo json_encode(['error' => 'User ID is required']);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>


