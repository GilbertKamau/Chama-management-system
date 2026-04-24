<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChamaController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\MpesaController;
use App\Http\Controllers\UssdController;
use App\Http\Controllers\WhatsappController;
use Illuminate\Support\Facades\Route;

// --- Public Routes ---
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login', [AuthController::class, 'login']);

// --- Webhook Routes (Public) ---
Route::any('/ussd', [UssdController::class, 'handle']);
Route::any('/mpesa/callback', [MpesaController::class, 'callback']);
Route::any('/whatsapp/webhook', [WhatsappController::class, 'handle']);

// --- Protected Routes ---
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // User / Member Management
    Route::get('/users', [AuthController::class, 'listUsers']);
    Route::post('/users/add', [AuthController::class, 'addUser']);
    Route::delete('/users/{id}', [AuthController::class, 'deleteUser']);

    // Chama & Summary
    Route::get('/chama/summary', [ChamaController::class, 'summary']);
    Route::get('/chama/details', [ChamaController::class, 'show']);
    Route::post('/chama/settings', [ChamaController::class, 'updateSettings']);
    Route::post('/chama/upload-constitution', [ChamaController::class, 'uploadConstitution']);
    Route::get('/chama/reports', [ChamaController::class, 'reports']);

    // Payments & Contributions
    Route::post('/mpesa/stk-push', [MpesaController::class, 'initiateStkPush']);
    
    // Loans
    Route::get('/loans', [LoanController::class, 'index']);
    Route::post('/loans', [LoanController::class, 'store']);
    Route::post('/loans/{id}/status', [LoanController::class, 'updateStatus']);

    // Voice Command
    Route::post('/voice-command', [WhatsappController::class, 'handleVoice']);
});
