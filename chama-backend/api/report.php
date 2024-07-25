<?php
require_once '../cors.php'; // Ensure CORS headers are properly handled
require_once '../db.php'; // Include your database connection
require '../vendor/autoload.php'; // Ensure you have required libraries installed via Composer

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Dompdf\Dompdf;

header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $type = $_GET['type'] ?? 'pdf'; // Default to PDF if not specified

    try {
        // Fetch contributions and loans
        $contributionsStmt = $pdo->query('SELECT * FROM contributions');
        $contributions = $contributionsStmt->fetchAll(PDO::FETCH_ASSOC);

        $loansStmt = $pdo->query('SELECT * FROM loans');
        $loans = $loansStmt->fetchAll(PDO::FETCH_ASSOC);

        if ($type === 'pdf') {
            // Generate PDF report
            $dompdf = new Dompdf();
            $html = '<h1>Contributions Report</h1><table><tr><th>User ID</th><th>Amount</th><th>Date</th><th>Description</th></tr>';
            foreach ($contributions as $contribution) {
                $html .= "<tr><td>{$contribution['user_id']}</td><td>{$contribution['amount']}</td><td>{$contribution['contribution_date']}</td><td>{$contribution['description']}</td></tr>";
            }
            $html .= '</table><h1>Loans Report</h1><table><tr><th>User ID</th><th>Amount</th><th>Status</th><th>Date</th></tr>';
            foreach ($loans as $loan) {
                $html .= "<tr><td>{$loan['user_id']}</td><td>{$loan['amount']}</td><td>{$loan['status']}</td><td>{$loan['created_at']}</td></tr>";
            }
            $html .= '</table>';

            $dompdf->loadHtml($html);
            $dompdf->setPaper('A4', 'landscape');
            $dompdf->render();
            $output = $dompdf->output();

            header('Content-Type: application/pdf');
            header('Content-Disposition: attachment; filename="report.pdf"');
            echo $output;
        } elseif ($type === 'excel') {
            // Generate Excel report
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();

            $sheet->setCellValue('A1', 'Contributions Report');
            $sheet->setCellValue('A2', 'User ID');
            $sheet->setCellValue('B2', 'Amount');
            $sheet->setCellValue('C2', 'Date');
            $sheet->setCellValue('D2', 'Description');
            $row = 3;
            foreach ($contributions as $contribution) {
                $sheet->setCellValue("A{$row}", $contribution['user_id']);
                $sheet->setCellValue("B{$row}", $contribution['amount']);
                $sheet->setCellValue("C{$row}", $contribution['contribution_date']);
                $sheet->setCellValue("D{$row}", $contribution['description']);
                $row++;
            }

            $sheet->setCellValue("A{$row}", 'Loans Report');
            $sheet->setCellValue("A" . ($row + 1), 'User ID');
            $sheet->setCellValue("B" . ($row + 1), 'Amount');
            $sheet->setCellValue("C" . ($row + 1), 'Status');
            $sheet->setCellValue("D" . ($row + 1), 'Date');
            $row += 2;
            foreach ($loans as $loan) {
                $sheet->setCellValue("A{$row}", $loan['user_id']);
                $sheet->setCellValue("B{$row}", $loan['amount']);
                $sheet->setCellValue("C{$row}", $loan['status']);
                $sheet->setCellValue("D{$row}", $loan['created_at']);
                $row++;
            }

            $writer = new Xlsx($spreadsheet);
            $filename = 'report.xlsx';

            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header("Content-Disposition: attachment; filename=\"{$filename}\"");
            $writer->save('php://output');
        } else {
            echo json_encode(['message' => 'Invalid report type']);
        }
    } catch (Exception $e) {
        echo json_encode(['error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['message' => 'Invalid request method']);
}
?>

