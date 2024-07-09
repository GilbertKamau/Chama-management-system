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
    $stmt = $pdo->prepare('INSERT INTO loans (user_id, amount, payment_duration, mobile_number) VALUES (?, ?, ?, ?)');
    
    // Execute the SQL statement with loan request details
    if ($stmt->execute([$userId, $amount, $paymentDuration, $mobileNumber])) {
        // If insertion is successful, return success message
        echo json_encode(['message' => 'Loan requested successfully']);
    } else {
        // If insertion fails, return failure message
        echo json_encode(['message' => 'Loan request failed']);
    }

} elseif ($method === 'GET') {
    // Handle GET request to fetch all loans
    $stmt = $pdo->query('SELECT * FROM loans');
    $loans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($loans);
    
} else {
    // Return error message for invalid request method
    echo json_encode(['message' => 'Invalid request method']);
}
?>



