<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication routes
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/user', [AuthController::class, 'user']);
    });
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Dashboard routes
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/trends', [DashboardController::class, 'trends']);
        Route::get('/performance', [DashboardController::class, 'performance']);
    });

    // Ticket routes
    Route::prefix('tickets')->group(function () {
        Route::get('/', [TicketController::class, 'index']);
        Route::post('/', [TicketController::class, 'store']);
        Route::get('/{id}', [TicketController::class, 'show']);
        Route::put('/{id}', [TicketController::class, 'update']);
        Route::delete('/{id}', [TicketController::class, 'destroy']);

// Ticket actions
    Route::post('/{id}/assign', [TicketController::class, 'assign']);
    Route::post('/{id}/status', [TicketController::class, 'updateStatus']);
    Route::post('/{id}/reopen', [TicketController::class, 'reopen']);

    // Comments
        Route::get('/{id}/comments', [TicketController::class, 'getComments']);
        Route::post('/{id}/comments', [TicketController::class, 'addComment']);

// Attachments
    Route::post('/{id}/attachments', [TicketController::class, 'uploadAttachment']);
    Route::delete('/{ticketId}/attachments/{attachmentId}', [TicketController::class, 'deleteAttachment']);
  });

  // User routes (admin/ict only)
  Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::get('/{id}', [UserController::class, 'show']);
    Route::put('/{id}', [UserController::class, 'update']);
    Route::delete('/{id}', [UserController::class, 'destroy']);

    // Special endpoints
    Route::get('/role/ict-officers', [UserController::class, 'ictOfficers']);
  });
});
