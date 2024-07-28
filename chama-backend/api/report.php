<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        // Fetch all payments
        $stmtPayments = $pdo->query('SELECT * FROM payments');
        $payments = $stmtPayments->fetchAll(PDO::FETCH_ASSOC);

        // Fetch all loans
        $stmtLoans = $pdo->query('SELECT * FROM loans');
        $loans = $stmtLoans->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'payments' => $payments,
            'loans' => $loans
        ]);
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>


