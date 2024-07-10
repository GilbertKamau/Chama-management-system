<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Handle GET request to fetch contributions

    if (isset($_GET['user_id'])) {
        // Fetch contributions for a specific user
        $user_id = $_GET['user_id'];
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

} elseif ($method === 'POST') {
    // Handle POST request to insert new contribution
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Extract contribution details from JSON data
    $userId = $data['user_id'];
    $amount = $data['amount'];
    // You may have additional fields like contribution date, description, etc.

    // Prepare SQL statement to insert contribution into database
    $stmt = $pdo->prepare('INSERT INTO contributions (user_id, amount) VALUES (?, ?)');
    
    // Execute the SQL statement with contribution details
    if ($stmt->execute([$userId, $amount])) {
        // If insertion is successful, return success message
        echo json_encode(['message' => 'Contribution added successfully']);
    } else {
        // If insertion fails, return failure message
        echo json_encode(['message' => 'Contribution addition failed']);
    }

} else {
    // Return error message for invalid request method
    echo json_encode(['message' => 'Invalid request method']);
}
?>
