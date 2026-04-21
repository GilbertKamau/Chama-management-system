<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChamaController;
use App\Http\Controllers\ContributionController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\UssdController;
use Illuminate\Support\Facades\Route;

// ─── Public routes ──────────────────────────────────────────────────────────
Route::post('/signup', [AuthController::class, 'signup']);
Route::post('/login',  [AuthController::class, 'login']);

// USSD callback (Africa's Talking calls this endpoint, no auth needed)
Route::post('/ussd', [UssdController::class, 'handle']);

// ─── Protected routes (Sanctum Bearer token) ────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);

    // Current user's Chama info
    Route::get('/chama', [ChamaController::class, 'show']);
    Route::get('/chama/summary', [ChamaController::class, 'summary']);

    // Constitution upload (Admin only)
    Route::post('/chama/constitution', [ChamaController::class, 'uploadConstitution']);

    // Contributions
    Route::get('/contributions',  [ContributionController::class, 'index']);
    Route::post('/contributions', [ContributionController::class, 'store']);

    // Loans
    Route::get('/loans',              [LoanController::class, 'index']);
    Route::post('/loans',             [LoanController::class, 'store']);
    Route::put('/loans/{id}/status',  [LoanController::class, 'updateStatus']);

    // Payments
    Route::get('/payments',  [PaymentController::class, 'index']);
    Route::post('/payments', [PaymentController::class, 'store']);

    // Super-Admin: system-wide overview
    Route::get('/admin/chamas', [ChamaController::class, 'index']);
    // Super-Admin / Admin: user management
    Route::get('/admin/users',       [AuthController::class, 'listUsers']);
    Route::post('/admin/users',      [AuthController::class, 'addUser']);
    Route::delete('/admin/users/{id}', [AuthController::class, 'deleteUser']);
    Route::get('/admin/reports',       [ChamaController::class, 'reports']);
});
