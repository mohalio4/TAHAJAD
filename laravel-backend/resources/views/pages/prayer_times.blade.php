@extends('layouts.app')

@section('title', 'مواقيت الصلاة - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/prayer-times.css') }}">
@endpush

@section('body_class', 'prayer-times-page')

@section('content')
    <!-- Main Content -->
    <main class="prayer-times-main">
        <div class="prayer-times-container">
            
            <!-- Page Header -->
            <section class="page-header fade-in-up">
                <div class="page-header-card glass-card">
                    <img src="{{ asset('assets/images/pray.jpg') }}" alt="مواقيت الصلاة" class="header-background-image">
                    <div class="header-overlay"></div>
                    <div class="header-text-content">
                        <h1 class="page-title">مواقيت الصلاة</h1>
                        <p class="page-subtitle">الصلاة في أول الوقت وصية الشهداء</p>
                    </div>
                </div>
            </section>
            
            <!-- Location & Upcoming Prayer Bar -->
            <section class="location-prayer-bar fade-in-up delay-1">
                <div class="location-section">
                    <div class="location-display glass-card">
                        <span class="selector-icon">📍</span>
                        <div class="location-text">
                            <span class="location-label">المدينة:</span>
                            <span class="location-name" id="locationName">بيروت</span>
                        </div>
                        <button class="detect-location-btn" id="detectLocationBtn" title="تحديد موقعي تلقائياً">
                            <img src="{{ asset('assets/images/location.png') }}" alt="تحديد الموقع" class="location-icon-img">
                        </button>
                    </div>
                    
                    <div class="hijri-date-display glass-card">
                        <span class="date-icon">📅</span>
                        <a href="{{ route('hijri-calendar') }}" class="hijri-date-link">
                            <span class="hijri-date" id="hijriDate">20 جمادى الأولى 1447</span>
                        </a>
                    </div>
                </div>
                
                <!-- Current Prayer Highlight -->
                <div class="current-prayer-card glass-card">
                    <div class="current-prayer-content">
                        <div class="prayer-status">
                            <span class="status-label" id="statusLabel">الصلاة القادمة</span>
                            <h2 class="current-prayer-name" id="currentPrayerName">العصر</h2>
                        </div>
                        
                        <div class="countdown-display">
                            <div class="countdown-box">
                                <span class="countdown-value" id="hoursValue">02</span>
                                <span class="countdown-label">ساعة</span>
                            </div>
                            <span class="countdown-separator">:</span>
                            <div class="countdown-box">
                                <span class="countdown-value" id="minutesValue">34</span>
                                <span class="countdown-label">دقيقة</span>
                            </div>
                            <span class="countdown-separator">:</span>
                            <div class="countdown-box">
                                <span class="countdown-value" id="secondsValue">18</span>
                                <span class="countdown-label">ثانية</span>
                            </div>
                        </div>
                        
                        <div class="prayer-time-display">
                            <span class="time-label">الوقت المحدد:</span>
                            <span class="time-value" id="currentPrayerTime">15:30</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Prayer Times Grid -->
            <section class="prayer-times-grid fade-in-up delay-3">
                <h2 class="section-title">جميع الأوقات</h2>
                
                <div class="prayers-grid">
                    <!-- Imsak -->
                    <div class="prayer-card glass-card info-only">
                        <img src="{{ asset('assets/images/pray.jpg') }}" alt="الإمساك" class="prayer-card-background">
                        <div class="prayer-card-overlay"></div>
                        <div class="prayer-card-content">
                            <div class="prayer-card-header">
                            <div class="prayer-icon">🌙</div>
                            <div class="prayer-info">
                                <h3 class="prayer-name">الإمساك</h3>
                                <span class="prayer-time" id="imsakTime">05:20</span>
                            </div>
                            </div>
                            <div class="prayer-note">
                                <span class="note-text">وقت بدء الصيام</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Fajr -->
                    <div class="prayer-card glass-card" data-prayer="fajr">
                        <img src="{{ asset('assets/images/pray.jpg') }}" alt="الفجر" class="prayer-card-background">
                        <div class="prayer-card-overlay"></div>
                        <div class="prayer-card-content">
                            <div class="prayer-card-header">
                                <div class="prayer-icon">🌅</div>
                                <div class="prayer-info">
                                    <h3 class="prayer-name">الفجر</h3>
                                    <span class="prayer-time" id="fajrTime">05:30</span>
                                </div>
                            </div>
                            <div class="prayer-actions">
                                <button class="log-prayer-btn" onclick="logPrayer('fajr')">
                                    <span>✓</span>
                                    <span>تسجيل</span>
                                </button>
                                <button class="alarm-btn" onclick="toggleAlarm('fajr')">
                                    <span class="alarm-icon">🔔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sunrise -->
                    <div class="prayer-card glass-card info-only">
                        <img src="{{ asset('assets/images/pray.jpg') }}" alt="الشروق" class="prayer-card-background">
                        <div class="prayer-card-overlay"></div>
                        <div class="prayer-card-content">
                            <div class="prayer-card-header">
                                <div class="prayer-icon">☀️</div>
                                <div class="prayer-info">
                                    <h3 class="prayer-name">الشروق</h3>
                                    <span class="prayer-time" id="sunriseTime">06:45</span>
                                </div>
                            </div>
                            <div class="prayer-note">
                                <span class="note-text">وقت النهي عن الصلاة</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Dhuhr -->
                    <div class="prayer-card glass-card" data-prayer="dhuhr">
                        <img src="{{ asset('assets/images/pray.jpg') }}" alt="الظهر" class="prayer-card-background">
                        <div class="prayer-card-overlay"></div>
                        <div class="prayer-card-content">
                            <div class="prayer-card-header">
                                <div class="prayer-icon">☀️</div>
                                <div class="prayer-info">
                                    <h3 class="prayer-name">الظهر</h3>
                                    <span class="prayer-time" id="dhuhrTime">12:15</span>
                                </div>
                            </div>
                            <div class="prayer-actions">
                                <button class="log-prayer-btn" onclick="logPrayer('dhuhr')">
                                    <span>✓</span>
                                    <span>تسجيل</span>
                                </button>
                                <button class="alarm-btn" onclick="toggleAlarm('dhuhr')">
                                    <span class="alarm-icon">🔔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Maghrib -->
                    <div class="prayer-card glass-card" data-prayer="maghrib">
                        <img src="{{ asset('assets/images/pray.jpg') }}" alt="المغرب" class="prayer-card-background">
                        <div class="prayer-card-overlay"></div>
                        <div class="prayer-card-content">
                            <div class="prayer-card-header">
                                <div class="prayer-icon">🌅</div>
                                <div class="prayer-info">
                                    <h3 class="prayer-name">المغرب</h3>
                                    <span class="prayer-time" id="maghribTime">18:00</span>
                                </div>
                            </div>
                            <div class="prayer-actions">
                                <button class="log-prayer-btn" onclick="logPrayer('maghrib')">
                                    <span>✓</span>
                                    <span>تسجيل</span>
                                </button>
                                <button class="alarm-btn" onclick="toggleAlarm('maghrib')">
                                    <span class="alarm-icon">🔔</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Midnight -->
                    <div class="prayer-card glass-card info-only">
                        <img src="{{ asset('assets/images/pray.jpg') }}" alt="منتصف الليل" class="prayer-card-background">
                        <div class="prayer-card-overlay"></div>
                        <div class="prayer-card-content">
                            <div class="prayer-card-header">
                                <div class="prayer-icon">🌌</div>
                                <div class="prayer-info">
                                    <h3 class="prayer-name">منتصف الليل</h3>
                                    <span class="prayer-time" id="midnightTime">00:15</span>
                                </div>
                            </div>
                            <div class="prayer-note">
                                <span class="note-text">منتصف الليل الشرعي</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
        </div>
    </main>
    
    <!-- Success Toast -->
    <div id="prayerToast" class="prayer-toast"></div>
    
    @push('scripts')
        <script src="{{ asset('js/prayer-times.js') }}"></script>
    @endpush
@endsection

