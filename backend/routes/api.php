<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PrayerController;
use App\Http\Controllers\Api\ChallengeController;
use App\Http\Controllers\Api\DuaController;
use App\Http\Controllers\Api\QuranController;
use App\Http\Controllers\Api\KhirahController;
use App\Http\Controllers\Api\UserController;

// Public routes
Route::post('/auth/register', [AuthController::class, 'register'])->name('api.register');
Route::post('/auth/login', [AuthController::class, 'login'])->name('api.login');

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user/profile', [AuthController::class, 'user']);
    
    // User
    Route::put('/user/profile/update', [UserController::class, 'updateProfile']);
    Route::post('/user/password/change', [UserController::class, 'changePassword']);
    Route::get('/user/settings', [UserController::class, 'getSettings']);
    Route::put('/user/settings', [UserController::class, 'updateSettings']);
    
    // Prayer Times
    Route::get('/prayer-times', [PrayerController::class, 'getPrayerTimes']);
    Route::post('/prayer-times/log', [PrayerController::class, 'logPrayer']);
    Route::get('/prayer-times/stats', [PrayerController::class, 'getStats']);
    Route::get('/prayer-times/logs', [PrayerController::class, 'getLogs']);
    
    // Late Prayers (Qada)
    Route::get('/late-prayers', [PrayerController::class, 'getLatePrayers']);
    Route::post('/late-prayers', [PrayerController::class, 'createLatePrayer']);
    Route::put('/late-prayers/{id}', [PrayerController::class, 'updateLatePrayer']);
    Route::delete('/late-prayers/{id}', [PrayerController::class, 'deleteLatePrayer']);
    Route::post('/late-prayers/{id}/increment', [PrayerController::class, 'incrementLatePrayer']);
    
    // Challenges
    Route::get('/challenges', [ChallengeController::class, 'index']);
    Route::get('/challenges/{id}', [ChallengeController::class, 'show']);
    Route::post('/challenges/{id}/progress', [ChallengeController::class, 'updateProgress']);
    Route::post('/challenges/{id}/complete', [ChallengeController::class, 'completeDay']);
    Route::get('/challenges/{id}/stats', [ChallengeController::class, 'getStats']);
    
    // Duas
    Route::get('/duas', [DuaController::class, 'index']);
    Route::get('/duas/{id}', [DuaController::class, 'show']);
    Route::post('/duas/{id}/favorite', [DuaController::class, 'toggleFavorite']);
    Route::get('/duas/favorites', [DuaController::class, 'getFavorites']);
    Route::get('/duas/search', [DuaController::class, 'search']);
    
    // Quran
    Route::get('/quran/progress', [QuranController::class, 'getProgress']);
    Route::post('/quran/progress', [QuranController::class, 'updateProgress']);
    Route::get('/quran/saved-pages', [QuranController::class, 'getSavedPages']);
    Route::post('/quran/save-page', [QuranController::class, 'savePage']);
    
    // Khirah (Good Deeds / Self Accountability)
    Route::get('/khirah', [KhirahController::class, 'index']);
    Route::post('/khirah/add', [KhirahController::class, 'store']);
    Route::delete('/khirah/{id}', [KhirahController::class, 'destroy']);
    Route::put('/khirah/{id}', [KhirahController::class, 'update']);
    Route::get('/khirah/stats', [KhirahController::class, 'getStats']);
});
