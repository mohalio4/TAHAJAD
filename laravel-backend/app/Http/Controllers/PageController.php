<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    /**
     * Display landing page
     */
    public function index()
    {
        return view('pages.index');
    }

    /**
     * Display dashboard
     */
    public function dashboard()
    {
        return view('pages.dashboard');
    }

    /**
     * Display prayer times page
     */
    public function prayerTimes()
    {
        return view('pages.prayer-times');
    }

    /**
     * Display duas page
     */
    public function duas()
    {
        return view('pages.duas');
    }

    /**
     * Display challenges page
     */
    public function challenges()
    {
        return view('pages.challenges');
    }

    /**
     * Display hijri calendar page
     */
    public function hijriCalendar()
    {
        return view('pages.hijri-calendar');
    }

    /**
     * Display self accountability page
     */
    public function selfAccountability()
    {
        return view('pages.self-accountability');
    }

    /**
     * Display istikhara page
     */
    public function istikhara()
    {
        return view('pages.istikhara');
    }

    /**
     * Display posts page
     */
    public function posts()
    {
        return view('pages.posts');
    }

    /**
     * Display post details page
     */
    public function postDetails($id)
    {
        return view('pages.post-details', ['id' => $id]);
    }

    /**
     * Display leaderthink page
     */
    public function leaderthink()
    {
        return view('pages.leaderthink');
    }

    /**
     * Display thaqalayn page
     */
    public function thaqalayn()
    {
        return view('pages.thaqalayn');
    }

    /**
     * Display thaqalayn book page
     */
    public function thaqalaynBook($id)
    {
        return view('pages.thaqalayn-book', ['id' => $id]);
    }

    /**
     * Display quran page
     */
    public function quran()
    {
        return view('pages.quran');
    }

    /**
     * Display quran surah page
     */
    public function quranSurah($surah = null)
    {
        return view('pages.quran-surah', ['surah' => $surah]);
    }

    /**
     * Display hyder AI page
     */
    public function hyderAi()
    {
        return view('pages.hyder-ai');
    }

    /**
     * Display maktaba masmouaa page
     */
    public function maktabaMasmouaa()
    {
        return view('pages.maktaba-masmouaa');
    }

    /**
     * Display settings page
     */
    public function settings()
    {
        return view('pages.settings');
    }
}

