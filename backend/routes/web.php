<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PageController;

// Home & Public Routes
Route::get('/', [PageController::class, 'home'])->name('home');
Route::get('/login', [PageController::class, 'login'])->name('login');
Route::get('/register', [PageController::class, 'register'])->name('register');
Route::get('/password-reset', [PageController::class, 'passwordReset'])->name('password.request');

// Protected Routes (Require Authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Profile & Settings
    Route::get('/profile', [PageController::class, 'profile'])->name('profile');
    Route::get('/settings', [PageController::class, 'settings'])->name('settings');
    
    // Feature Pages
    Route::get('/prayer-times', [PageController::class, 'prayerTimes'])->name('prayer-times');
    Route::get('/duas', [PageController::class, 'duas'])->name('duas');
    Route::get('/challenges', [PageController::class, 'challenges'])->name('challenges');
    Route::get('/hijri-calendar', [PageController::class, 'hijriCalendar'])->name('hijri-calendar');
    Route::get('/self-accountability', [PageController::class, 'selfAccountability'])->name('self-accountability');
    Route::get('/istikhara', [PageController::class, 'istikhara'])->name('istikhara');
    Route::get('/posts', [PageController::class, 'posts'])->name('posts');
    Route::get('/post-details/{id}', [PageController::class, 'postDetails'])->name('post-details');
    Route::get('/leaderthink', [PageController::class, 'leaderthink'])->name('leaderthink');
    Route::get('/thaqalayn', [PageController::class, 'thaqalayn'])->name('thaqalayn');
    Route::get('/thaqalayn-book/{id}', [PageController::class, 'thaqalaynBook'])->name('thaqalayn-book');
    Route::get('/quran', [PageController::class, 'quran'])->name('quran');
    Route::get('/quran-surah/{id}', [PageController::class, 'quranSurah'])->name('quran-surah');
    Route::get('/hyder-ai', [PageController::class, 'hyderAi'])->name('hyder-ai');
});
