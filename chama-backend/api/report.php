<?php
require_once '../db.php';
require_once '../cors.php';
header('Content-Type: application/json');

$type = $_GET['type'] ?? 'loans';

if ($type === 'loans') {
    $stmt = $pdo->query('SELECT user_id, amount, payment_duration, mobile_number, status, loan_date FROM loans');
    $loans = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($loans);
} elseif ($type === 'contributions') {
    $stmt = $pdo->query('SELECT user_id, amount, payment_date FROM contributions');
    $contributions = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($contributions);
} else {
    echo json_encode(['message' => 'Invalid report type']);
}
?>


  return (
    <div>
      <h2>Generate Reports</h2>
      <button onClick={() => fetchReport('loans')}>Fetch Loan Report</button>
      <button onClick={() => fetchReport('contributions')}>Fetch Contribution Report</button>

      {error && <p>{error}</p>}

      <h3>Loan Report</h3>
      {loans.length > 0 ? (
        <table border="1">
          <thead>
            <tr>

