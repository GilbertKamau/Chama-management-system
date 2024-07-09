<?php
require_once '../cors.php';
require_once '../db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action']; // 'login' or 'signup'
    $email = $data['email'];
    $password = $data['password'];

    if ($action === 'signup') {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $pdo->prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
        if ($stmt->execute([$email, $hashedPassword, 'user'])) {
            echo json_encode(['message' => 'User created']);
        } else {
            echo json_encode(['message' => 'User creation failed']);
        }
    } elseif ($action === 'login') {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            echo json_encode(['message' => 'Login successful', 'role' => $user['role']]);
        } else {
            echo json_encode(['message' => 'Invalid credentials or user not found']);
        }
    }
}
?>


