/**
 * Laravel Asset Paths Configuration
 * This file provides Laravel asset paths for JavaScript files
 */

// Get base URL from Laravel (set in layout)
window.Laravel = window.Laravel || {};

// Asset paths helper
window.asset = function(path) {
    const baseUrl = window.Laravel.baseUrl || '';
    return baseUrl + '/' + path.replace(/^\//, '');
};

// JSON file paths
window.jsonPaths = {
    ad3iya: '/json/ad3iya.json',
    ziyara: '/json/ziyara.json',
    taqibat: '/json/taqibat.json',
    seerah: '/json/seerah.json',
    leaderthink: '/json/leaderthink.json',
    eventsLevant: '/json/events_levant_1447.json'
};

// Image paths
window.imagePaths = {
    tahajadLogo: '/assets/images/tahajad_logo.png',
    logo1: '/assets/images/logo1.png',
    quran: '/assets/images/quran.jpg',
    aahd: '/assets/images/aahd.jpg',
    ziyara: '/assets/images/ziyara.jpg',
    adhan: '/assets/audio/adhan.mp3'
};

// Route paths (will be set by Laravel)
window.routes = window.routes || {
    home: '/',
    dashboard: '/dashboard',
    login: '/login',
    register: '/register',
    prayerTimes: '/prayer-times',
    duas: '/duas',
    challenges: '/challenges',
    hijriCalendar: '/hijri-calendar',
    selfAccountability: '/self-accountability',
    istikhara: '/istikhara',
    postPage: '/post-page',
    postDetails: '/post-details',
    leaderthink: '/leaderthink',
    thaqalayn: '/thaqalayn',
    thaqalaynBook: '/thaqalayn-book',
    quran: '/quran',
    quranSurah: '/quran-surah',
    hyderAi: '/hyder-ai',
    maktabaMasmouaa: '/maktaba-masmouaa',
    settings: '/settings'
};

