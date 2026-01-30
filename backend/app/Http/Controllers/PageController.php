<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    // Public Pages
    public function home()
    {
        return view('index');
    }
    
    public function login()
    {
        return view('auth.login');
    }
    
    public function register()
    {
        return view('auth.register');
    }
    
    public function passwordReset()
    {
        return view('auth.password-reset');
    }
    
    // Protected Pages
    public function profile(Request $request)
    {
        return view('pages.profile', ['user' => $request->user()]);
    }
    
    public function settings(Request $request)
    {
        return view('pages.settings', ['user' => $request->user()]);
    }
    
    // Feature Pages
    public function prayerTimes()
    {
        return view('pages.prayer-times');
    }
    
    public function duas()
    {
        return view('pages.duas');
    }
    
    public function challenges()
    {
        return view('pages.challenges');
    }
    
    public function hijriCalendar()
    {
        return view('pages.hijri_calendar');
    }
    
    public function selfAccountability()
    {
        return view('pages.self_accountability');
    }
    
    public function istikhara()
    {
        return view('pages.istikhara');
    }
    
    public function posts()
    {
        return view('pages.posts');
    }
    
    public function postDetails($id)
    {
        return view('pages.post_details', ['postId' => $id]);
    }
    
    public function leaderthink()
    {
        return view('pages.leaderthink');
    }
    
    public function thaqalayn()
    {
        return view('pages.thaqalayn');
    }
    
    public function thaqalaynBook($id)
    {
        return view('pages.thaqalayn_book', ['bookId' => $id]);
    }
    
    public function quran()
    {
        return view('pages.quran');
    }
    
    public function quranSurah($id)
    {
        return view('pages.quran_surah', ['surahId' => $id]);
    }
    
    public function hyderAi()
    {
        return view('pages.hyder_ai');
    }
}
