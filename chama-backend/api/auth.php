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

    // List of predefined admin emails
    $adminEmails = [
        'admin@example.com',
        'roro@r.com',
        'eve@e.gmail.com'
    ];

    if ($action === 'signup') {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Check if email already exists
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode(['message' => 'Email already exists']);
        } else {
            // Determine role based on email
            $role = in_array($email, $adminEmails) ? 'admin' : 'user';

            $stmt = $pdo->prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
            if ($stmt->execute([$email, $hashedPassword, $role])) {
                echo json_encode(['message' => 'User created', 'role' => $role]);
            } else {
                echo json_encode(['message' => 'User creation failed']);
            }
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




