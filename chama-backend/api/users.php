<?php
require_once '../cors.php';
require_once '../db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    // Handle GET request to fetch all users
    $stmt = $pdo->query('SELECT id, email, role FROM users');
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($users);

} elseif ($method === 'POST') {
    // Handle POST request to add a new user
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT); // Hash password for security

    $stmt = $pdo->prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
    if ($stmt->execute([$email, $password, 'user'])) {
        $newUserId = $pdo->lastInsertId();
        echo json_encode(['message' => 'User added successfully', 'id' => $newUserId]);
    } else {
        echo json_encode(['message' => 'User addition failed']);
    }

} elseif ($method === 'DELETE') {
    // Handle DELETE request to remove a user
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['userId'];

    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    if ($stmt->execute([$userId])) {
        echo json_encode(['message' => 'User removed successfully']);
    } else {
        echo json_encode(['message' => 'User removal failed']);
    }

} else {
    echo json_encode(['message' => 'Invalid request method']);
}
?>


