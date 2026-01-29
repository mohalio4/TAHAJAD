<?php

use App\Http\Controllers\PageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
| All frontend pages routes
*/

$controller = PageController::class;

// Landing page
Route::get('/', [$controller, 'index'])->name('home');

// Dashboard
Route::get('/dashboard', [$controller, 'dashboard'])->name('dashboard');

// Prayer Times
Route::get('/prayer-times', [$controller, 'prayerTimes'])->name('prayer-times');

// Duas
Route::get('/duas', [$controller, 'duas'])->name('duas');

// Challenges
Route::get('/challenges', [$controller, 'challenges'])->name('challenges');

// Hijri Calendar
Route::get('/hijri-calendar', [$controller, 'hijriCalendar'])->name('hijri-calendar');

// Self Accountability
Route::get('/self-accountability', [$controller, 'selfAccountability'])->name('self-accountability');

// Istikhara
Route::get('/istikhara', [$controller, 'istikhara'])->name('istikhara');

// Posts
Route::get('/post-page', [$controller, 'postPage'])->name('post-page');
Route::get('/post-details', [$controller, 'postDetails'])->name('post-details');

// Leaderthink
Route::get('/leaderthink', [$controller, 'leaderthink'])->name('leaderthink');

// Thaqalayn
Route::get('/thaqalayn', [$controller, 'thaqalayn'])->name('thaqalayn');
Route::get('/thaqalayn/book/{id}', [$controller, 'thaqalaynBook'])->name('thaqalayn-book');

// Quran
Route::get('/quran', [$controller, 'quran'])->name('quran');
Route::get('/quran/surah/{surah?}', [$controller, 'quranSurah'])->name('quran-surah');

// Hyder AI
Route::get('/hyder-ai', [$controller, 'hyderAi'])->name('hyder-ai');

// Maktaba Masmouaa
Route::get('/maktaba-masmouaa', [$controller, 'maktabaMasmouaa'])->name('maktaba-masmouaa');

// Auth pages
Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/register', function () {
    return view('auth.register');
})->name('register');

// Settings
Route::get('/settings', [$controller, 'settings'])->name('settings');
