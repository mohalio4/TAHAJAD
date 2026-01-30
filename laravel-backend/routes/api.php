<?php

use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ResearchController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::get('/researches', [ResearchController::class, 'index']);
Route::get('/researches/{id}', [ResearchController::class, 'show']);
Route::post('/researches/{id}/increment-views', [ResearchController::class, 'incrementViews']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {
    // Profile routes
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    
    // Research management routes (publisher/admin only)
    Route::post('/researches', [ResearchController::class, 'store']);
    Route::put('/researches/{id}', [ResearchController::class, 'update']);
    Route::delete('/researches/{id}', [ResearchController::class, 'destroy']);
    
    // Admin only routes
    Route::middleware(function ($request, $next) {
        $user = $request->user();
        $profile = \App\Models\Profile::find($user->id);
        
        if (!$profile || !$profile->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        
        return $next($request);
    })->group(function () {
        Route::get('/profiles', [ProfileController::class, 'index']);
    });
});

