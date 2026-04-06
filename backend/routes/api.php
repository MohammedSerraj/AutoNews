<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\VerificationController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\ProfileController;

Route::middleware('throttle:api')->group(function () {
    // Public Auth Routes (With strict throttling)
    Route::middleware('throttle:auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail']);
        Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);
    });

    // Email Verification
    Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
        ->name('verification.verify');

    // OAuth Social Login
    Route::get('/auth/{provider}/redirect', [SocialAuthController::class, 'redirectToProvider']);
    Route::get('/auth/{provider}/callback', [SocialAuthController::class, 'handleProviderCallback']);

    // Articles
    Route::get('articles/categories', [ArticleController::class, 'categories']);
    Route::get('articles/{id}/related', [ArticleController::class, 'related']);
    Route::apiResource('articles', ArticleController::class)->only(['index', 'show', 'destroy']);

    // Social Actions (Public)
    Route::post('/like', [LikeController::class, 'toggle']);

    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        
        Route::middleware('throttle:auth')->post('/email/resend', [VerificationController::class, 'resend']);
        
        // Comments (With specific anti-spam throttling)
        Route::middleware('throttle:comments')->group(function () {
            Route::post('/comments', [CommentController::class, 'store']);
            Route::delete('/comments/{id}', [CommentController::class, 'destroy']);
        });
        // Profile Management
        Route::post('/profile/update', [ProfileController::class, 'update']);
        Route::post('/profile/password', [ProfileController::class, 'updatePassword']);
    });
});

