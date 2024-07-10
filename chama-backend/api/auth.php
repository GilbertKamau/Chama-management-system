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
        if ($email === 'admin@example.com') { // Adjust with your admin check logic
            $role = 'admin';
        }

        $stmt = $pdo->prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)');
        if ($stmt->execute([$email, $hashedPassword, $role])) {
            echo json_encode(['message' => 'User created', 'role' => $role]);
        } else {
            echo json_encode(['message' => 'User creation failed']);
        }
    }
}



