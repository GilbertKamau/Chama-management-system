<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Check if user is an admin (you need to implement this logic)
    $isAdmin = false; // Replace with actual logic to check if user is admin

    if ($isAdmin) {
        // Fetch all payments if user is admin
        $stmt = $pdo->query('SELECT * FROM payments');
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    } else {
        // Fetch payments of particular user (assuming user_id is passed via query parameter)
        $userId = $_GET['user_id']; // Replace with actual logic to fetch user_id
        
        $stmt = $pdo->prepare('SELECT * FROM payments WHERE user_id = ?');
        $stmt->execute([$userId]);
        $payments = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    // Return payments as JSON response
    echo json_encode($payments);

} else {
    // Return error message for invalid request method
    echo json_encode([]);
}
?>



