<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\IncidentController;
use App\Http\Controllers\Api\AdminIncidentController;
use App\Http\Controllers\Api\TeamIncidentController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\IncidentCategoryController as CategoryController;
use App\Http\Controllers\Api\AnalyticsController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\MapController;
use App\Http\Controllers\Api\MediaController;

Route::prefix('v1')->group(function () {

    // Public Auth & Map Routes
    Route::middleware('throttle:5,1')->group(function () {
        Route::post('/auth/register', [AuthController::class, 'register']);
        Route::post('/auth/login', [AuthController::class, 'login']);
    });
    Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);
    Route::post('/auth/anonymous-report', [IncidentController::class, 'anonymousReport']);

    Route::get('/map/incidents', [MapController::class, 'incidents']);
    Route::get('/announcements', [AnnouncementController::class, 'active']);
    Route::get('/incidents/track/{reference_number}', [IncidentController::class, 'track']);

    // Authenticated Routes
    Route::middleware('auth:sanctum')->group(function () {
        
        // Auth Protected Profile
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
        Route::put('/auth/change-password', [AuthController::class, 'changePassword']);
        Route::post('/auth/profile-photo', [AuthController::class, 'updateProfilePhoto']);

        // Reporter Incident Routes
        Route::get('/incidents', [IncidentController::class, 'index']);
        Route::post('/incidents', [IncidentController::class, 'store']);
        Route::get('/incidents/{id}', [IncidentController::class, 'show']);
        Route::put('/incidents/{id}', [IncidentController::class, 'update']);
        Route::delete('/incidents/{id}', [IncidentController::class, 'destroy']);
        Route::post('/incidents/{id}/media', [MediaController::class, 'upload']);
        Route::delete('/incidents/{id}/media/{mediaId}', [MediaController::class, 'destroy']);
        Route::get('/incidents/{id}/timeline', [IncidentController::class, 'timeline']);
        Route::post('/incidents/{id}/feedback', [IncidentController::class, 'submitFeedback']);

        // Notifications
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::put('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
        Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);

        // Response Team Routes
        Route::middleware(['role:response_team|admin|super_admin'])->prefix('team')->group(function () {
            Route::get('/incidents', [TeamIncidentController::class, 'index']);
            Route::get('/incidents/{id}', [TeamIncidentController::class, 'show']);
            Route::put('/incidents/{id}/acknowledge', [TeamIncidentController::class, 'acknowledge']);
            Route::put('/incidents/{id}/update', [TeamIncidentController::class, 'updateProgress']);
            Route::put('/incidents/{id}/resolve', [TeamIncidentController::class, 'resolve']);
            Route::post('/incidents/{id}/media', [TeamIncidentController::class, 'uploadResponseMedia']);
        });

        // Admin Operations
        Route::middleware(['role:admin|super_admin'])->prefix('admin')->group(function () {
            
            // Incident Admin
            Route::get('/incidents/export', [AdminIncidentController::class, 'exportCSV']);
            Route::get('/incidents', [AdminIncidentController::class, 'index']);
            Route::get('/incidents/{id}', [AdminIncidentController::class, 'show']);
            Route::put('/incidents/{id}/verify', [AdminIncidentController::class, 'verify']);
            Route::put('/incidents/{id}/reject', [AdminIncidentController::class, 'reject']);
            Route::put('/incidents/{id}/assign', [AdminIncidentController::class, 'assign']);
            Route::put('/incidents/{id}/reassign', [AdminIncidentController::class, 'reassign']);
            Route::put('/incidents/{id}/status', [AdminIncidentController::class, 'updateStatus']);
            Route::put('/incidents/{id}/priority', [AdminIncidentController::class, 'updatePriority']);
            Route::post('/incidents/{id}/notes', [AdminIncidentController::class, 'addNote']);
            Route::post('/incidents/{id}/public-update', [AdminIncidentController::class, 'addPublicUpdate']);
            Route::put('/incidents/{id}/duplicate', [AdminIncidentController::class, 'markDuplicate']);
            Route::put('/incidents/{id}/close', [AdminIncidentController::class, 'close']);

            // User Management
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::get('/users/{id}', [UserController::class, 'show']);
            Route::put('/users/{id}', [UserController::class, 'update']);
            Route::delete('/users/{id}', [UserController::class, 'destroy']);
            Route::put('/users/{id}/role', [UserController::class, 'changeRole']);
            Route::put('/users/{id}/toggle-active', [UserController::class, 'toggleActive']);

            // Team Management
            Route::get('/teams', [TeamController::class, 'index']);
            Route::post('/teams', [TeamController::class, 'store']);
            Route::get('/teams/{id}', [TeamController::class, 'show']);
            Route::put('/teams/{id}', [TeamController::class, 'update']);
            Route::delete('/teams/{id}', [TeamController::class, 'destroy']);
            Route::post('/teams/{id}/members', [TeamController::class, 'addMember']);
            Route::delete('/teams/{id}/members/{userId}', [TeamController::class, 'removeMember']);
            Route::put('/teams/{id}/leader', [TeamController::class, 'assignLeader']);

            // Category Management
            Route::get('/categories', [CategoryController::class, 'index']);
            Route::post('/categories', [CategoryController::class, 'store']);
            Route::put('/categories/{id}', [CategoryController::class, 'update']);
            Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

            // Announcements Management
            Route::get('/announcements', [AnnouncementController::class, 'index']);
            Route::post('/announcements', [AnnouncementController::class, 'store']);
            Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
            Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);

            // Analytics
            Route::get('/analytics/overview', [AnalyticsController::class, 'overview']);
            Route::get('/analytics/incidents-by-category', [AnalyticsController::class, 'incidentsByCategory']);
            Route::get('/analytics/incidents-by-status', [AnalyticsController::class, 'incidentsByStatus']);
            Route::get('/analytics/incidents-by-severity', [AnalyticsController::class, 'incidentsBySeverity']);
            Route::get('/analytics/incidents-by-month', [AnalyticsController::class, 'incidentsByMonth']);
            Route::get('/analytics/response-times', [AnalyticsController::class, 'responseTimes']);
            Route::get('/analytics/team-performance', [AnalyticsController::class, 'teamPerformance']);
            Route::get('/analytics/resolution-rates', [AnalyticsController::class, 'resolutionRates']);
            Route::get('/analytics/map-data', [AnalyticsController::class, 'mapData']);

            // Audit Logs (Super Admin only)
            Route::middleware(['role:super_admin'])->get('/audit-logs', [AuditLogController::class, 'index']);
        });
    });
});

// Legacy backward-compatibility routes for un-versioned frontend calls
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/incidents', [IncidentController::class, 'index']);
    Route::post('/incidents', [IncidentController::class, 'store']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/teams', [TeamController::class, 'index']);
    Route::get('/announcements/active', [AnnouncementController::class, 'active']);
});
