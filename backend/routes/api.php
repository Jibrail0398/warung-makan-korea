<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\ReportController;

// Auth Routes (Public)
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/otp/send', [AuthController::class, 'sendOtp']);
Route::post('/auth/otp/verify', [AuthController::class, 'verifyOtp']);

// Public Endpoints
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/bank-accounts', [BankAccountController::class, 'index']); 
Route::post('/orders', [OrderController::class, 'store']);

// Protected Endpoints
Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Admin & Superadmin Only Routes
    Route::middleware('role:superadmin,admin')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        Route::get('/bank-accounts', [BankAccountController::class, 'index']);
        Route::get('/bank-accounts/{bank_account}', [BankAccountController::class, 'show']);
        Route::post('/bank-accounts', [BankAccountController::class, 'store']);
        Route::put('/bank-accounts/{bank_account}', [BankAccountController::class, 'update']);
        Route::delete('/bank-accounts/{bank_account}', [BankAccountController::class, 'destroy']);

        Route::get('/orders', [OrderController::class, 'index']);
        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

        // Route untuk mengelola pengguna (Manajemen Akses)
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);

        // Rekap Laporan Penjualan (Harian, Mingguan, Bulanan, Tahunan)
        Route::get('/reports/sales', [ReportController::class, 'sales']);
        Route::get('/reports/sales/daily', [ReportController::class, 'daily']);
        Route::get('/reports/sales/weekly', [ReportController::class, 'weekly']);
        Route::get('/reports/sales/monthly', [ReportController::class, 'monthly']);
        Route::get('/reports/sales/yearly', [ReportController::class, 'yearly']);
    });

    Route::middleware('role:superadmin')->group(function () {
        Route::put('/users/{user}/password', [UserController::class, 'changePassword']);

        Route::get('/activity-logs', [ActivityLogController::class, 'index']);
        Route::get('/activity-logs/{activity_log}', [ActivityLogController::class, 'show']);
    });
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/receipt', [OrderController::class, 'uploadReceipt']);
});

