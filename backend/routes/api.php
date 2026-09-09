<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\BankAccountController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\WhatsAppSessionController;

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
Route::post('/orders/{order}/receipt', [OrderController::class, 'uploadReceipt']);
Route::get('/orders/{order}', [OrderController::class, 'show']);

// Development-only access for the Vue WhatsApp session page.
if (app()->environment('local')) {
    Route::prefix('whatsapp')->group(function () {
        Route::get('/session', [WhatsAppSessionController::class, 'show']);
        Route::post('/session/start', [WhatsAppSessionController::class, 'start']);
    });
}

// Protected Endpoints
Route::middleware('auth:api')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/change-password', [AuthController::class, 'changePassword']);

    if (! app()->environment('local')) {
        Route::middleware('role:superadmin')->prefix('whatsapp')->group(function () {
            Route::get('/session', [WhatsAppSessionController::class, 'show']);
            Route::post('/session/start', [WhatsAppSessionController::class, 'start']);
        });
    }

    // Admin & Superadmin Only Routes
    Route::middleware('role:superadmin,admin')->group(function () {
        // Category Management
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{category}', [CategoryController::class, 'update']);
        Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

        // Product Management
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);

        // Bank Accounts Management
        Route::get('/bank-accounts', [BankAccountController::class, 'index']);
        Route::get('/bank-accounts/{bank_account}', [BankAccountController::class, 'show']);
        Route::post('/bank-accounts', [BankAccountController::class, 'store']);
        Route::put('/bank-accounts/{bank_account}', [BankAccountController::class, 'update']);
        Route::delete('/bank-accounts/{bank_account}', [BankAccountController::class, 'destroy']);

        // Order Monitoring & Management
        Route::get('/orders', [OrderController::class, 'index']);
        Route::put('/orders/{order}/status', [OrderController::class, 'updateStatus']);

        // Reports & Analytics
        Route::get('/reports/dashboard', [ReportController::class, 'dashboard']);
        Route::get('/reports/transactions', [ReportController::class, 'transactions']);
        Route::get('/reports/financial', [ReportController::class, 'financial']);
        Route::get('/admin/dashboard', [ReportController::class, 'dashboard']);

        // User Management (Access Control)
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

});
