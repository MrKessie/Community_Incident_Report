<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', function (Request $request) {
            return response()->json([
                'user' => $request->user()->load('role'),
            ]);
        });
    });
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::get('users/maintenance', [UserController::class, 'maintenanceUsers'])
        ->middleware('role:Admin');

    Route::get('incidents/{incident}/comments', [CommentController::class, 'index']);
    Route::post('incidents/{incident}/comments', [CommentController::class, 'store']);

    Route::post('incidents/{incident}/status', [IncidentController::class, 'updateStatus'])
        ->middleware('role:Admin,Maintenance');

    Route::post('incidents/{incident}/assign', [IncidentController::class, 'assign'])
        ->middleware('role:Admin');

    Route::apiResource('incidents', IncidentController::class);
});
