<?php
require_once '../cors.php';
require_once '../db.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['userId'];

    $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
    if ($stmt->execute([$userId])) {
        echo json_encode(['message' => 'User removed']);
    } else {
        echo json_encode(['message' => 'User removal failed']);
    }
}
?>
