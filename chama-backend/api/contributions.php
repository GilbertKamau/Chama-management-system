<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        if (isset($_GET['user_id'])) {
            // Fetch contributions for a specific user
            $user_id = intval($_GET['user_id']);
            $stmt = $pdo->prepare('SELECT * FROM contributions WHERE user_id = ?');
            $stmt->execute([$user_id]);
        } elseif (isset($_GET['start_date']) && isset($_GET['end_date'])) {
            // Fetch contributions within a specific timeframe
            $start_date = $_GET['start_date'];
            $end_date = $_GET['end_date'];
            $stmt = $pdo->prepare('SELECT * FROM contributions WHERE contribution_date BETWEEN ? AND ?');
            $stmt->execute([$start_date, $end_date]);
        } else {
            // Fetch all contributions by default
            $stmt = $pdo->query('SELECT * FROM contributions');
        }

        // Fetch contributions based on the adjusted SQL query
        $contributions = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($contributions);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} elseif ($method === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $userId = $data['user_id'];
        $amount = $data['amount'];
        $contributionDate = $data['contribution_date']; // Optional, use current timestamp if not provided
        $description = $data['description'] ?? ''; // Optional description

        // Prepare SQL statement to insert contribution into database
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

