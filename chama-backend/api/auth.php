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
    $adminPassword = $data['adminPassword'] ?? ''; // Admin password from the signup form

    // List of predefined admin emails and their hashed passwords
    $adminCredentials = [
        'eve@e.com' => password_hash('0000', PASSWORD_DEFAULT),
        'roro@r.com' => password_hash('1111', PASSWORD_DEFAULT)
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
            // Determine role based on email and admin password
            $role = 'user'; // Default role
            if (isset($adminCredentials[$email]) && password_verify($adminPassword, $adminCredentials[$email])) {
                $role = 'admin';
            }

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





