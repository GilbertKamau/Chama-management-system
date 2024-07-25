<?php
require_once '../cors.php';
require_once '../db.php';
header('Content-Type: application/json');

// Function to create an admin user if not exists
function createAdminUser($pdo) {
    $adminEmail = 'roro@r.com';
    $adminPassword = '1234';
    $hashedPassword = password_hash($adminPassword, PASSWORD_DEFAULT);

    // Check if the admin user already exists
    $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$adminEmail]);
    $admin = $stmt->fetch();

    if (!$admin) {
        // Create admin user
        $stmt = $pdo->prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
        $stmt->execute([$adminEmail, $hashedPassword, 'admin']);
    }
}

// Create admin user on script load
createAdminUser($pdo);

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $action = $data['action']; // 'login' or 'signup'
    $email = $data['email'];
    $password = $data['password'];

    if ($action === 'signup') {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        // Check if email already exists
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user) {
            echo json_encode(['message' => 'Email already exists']);
        } else {
            $role = 'user'; // Default role
            $stmt = $pdo->prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
            if ($stmt->execute([$email, $hashedPassword, $role])) {
                echo json_encode(['message' => 'User created', 'user' => ['email' => $email, 'role' => $role]]);
            } else {
                echo json_encode(['message' => 'User creation failed']);
            }
        }
    } elseif ($action === 'login') {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            session_start();
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['user_role'] = $user['role'];
            echo json_encode([
                'message' => 'Login successful',
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'role' => $user['role']
                ]
            ]);
        } else {
            echo json_encode(['message' => 'Invalid credentials or user not found']);
        }
    }
}



?>






