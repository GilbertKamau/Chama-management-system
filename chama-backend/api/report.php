<?php
require_once '../cors.php';
require_once '../db.php';
require 'vendor/autoload.php'; // Ensure PHPExcel and FPDF are installed via Composer

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use FPDF;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT * FROM loans');
    $loans = $stmt->fetchAll();

    $reportType = $_GET['type'] ?? 'excel'; // Default to Excel

    if ($reportType === 'pdf') {
        generatePDF($loans);
    } else {
        generateExcel($loans);
    }
}

function generateExcel($loans) {
    $spreadsheet = new Spreadsheet();
    $sheet = $spreadsheet->getActiveSheet();

    $sheet->setCellValue('A1', 'User ID');
    $sheet->setCellValue('B1', 'Amount');
    $sheet->setCellValue('C1', 'Payment Duration');
    $sheet->setCellValue('D1', 'Mobile Number');
    $sheet->setCellValue('E1', 'Approved');
    $sheet->setCellValue('F1', 'Created At');

    $row = 2;
    foreach ($loans as $loan) {
        $sheet->setCellValue('A' . $row, $loan['user_id']);
        $sheet->setCellValue('B' . $row, $loan['amount']);
        $sheet->setCellValue('C' . $row, $loan['payment_duration']);
        $sheet->setCellValue('D' . $row, $loan['mobile_number']);
        $sheet->setCellValue('E' . $row, $loan['approved'] ? 'Yes' : 'No');
        $sheet->setCellValue('F' . $row, $loan['created_at']);
        $row++;
    }

    $writer = new Xlsx($spreadsheet);
    $filename = 'loan_report_' . date('Y-m-d') . '.xlsx';
    $writer->save($filename);

    echo json_encode(['message' => 'Excel report generated', 'file' => $filename]);
}

function generatePDF($loans) {
    $pdf = new FPDF();
    $pdf->AddPage();
    $pdf->SetFont('Arial', 'B', 12);

    $pdf->Cell(20, 10, 'User ID', 1);
    $pdf->Cell(30, 10, 'Amount', 1);
    $pdf->Cell(40, 10, 'Payment Duration', 1);
    $pdf->Cell(50, 10, 'Mobile Number', 1);
    $pdf->Cell(20, 10, 'Approved', 1);
    $pdf->Cell(30, 10, 'Created At', 1);
    $pdf->Ln();

    foreach ($loans as $loan) {
        $pdf->Cell(20, 10, $loan['user_id'], 1);
        $pdf->Cell(30, 10, $loan['amount'], 1);
        $pdf->Cell(40, 10, $loan['payment_duration'], 1);
        $pdf->Cell(50, 10, $loan['mobile_number'], 1);
        $pdf->Cell(20, 10, $loan['approved'] ? 'Yes' : 'No', 1);
        $pdf->Cell(30, 10, $loan['created_at'], 1);
        $pdf->Ln();
    }

    $filename = 'loan_report_' . date('Y-m-d') . '.pdf';
    $pdf->Output('F', $filename);

    echo json_encode(['message' => 'PDF report generated', 'file' => $filename]);
}
?>
