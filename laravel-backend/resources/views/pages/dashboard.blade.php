@extends('layouts.app')

@section('title', 'لوحة التحكم - تهجّد')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/dashboard.css') }}">
<link rel="stylesheet" href="{{ asset('css/animations.css') }}">
@endpush

@section('content')
<!-- Main Dashboard Content -->
<main class="dashboard-main">
    <div class="dashboard-container">
        
        <!-- Welcome Section -->
        <section class="welcome-section fade-in-up">
            <div class="welcome-card glass-card">
                <div class="welcome-content">
                    <div class="welcome-text">
                        <h1 class="welcome-title">
                            <span class="greeting" id="greeting">مرحباً</span>
                            <span class="user-name-display" id="userNameDisplay">أحمد</span>
                        </h1>
                        <p class="welcome-subtitle" id="hijriDate">
                            الأحد، 15 جمادى الأولى 1446 هـ
                        </p>
                    </div>
                    
                    <div class="welcome-stats">
                        <div class="stat-badge">
                            <span class="badge-icon">🔥</span>
                            <div class="badge-content">
                                <span class="badge-value" id="streakDays">7</span>
                                <span class="badge-label">أيام متتالية</span>
                            </div>
                        </div>
                        <div class="stat-badge">
                            <span class="badge-icon">⭐</span>
                            <div class="badge-content">
                                <span class="badge-value" id="totalPoints">850</span>
                                <span class="badge-label">نقطة</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="welcome-illustration">
                    <div class="time-indicator">
                        <div class="next-prayer">
                            <span class="next-prayer-label">الصلاة القادمة</span>
                            <span class="next-prayer-name" id="nextPrayerName">العصر</span>
                            <div class="countdown" id="prayerCountdown">
                                <span class="countdown-hours">02</span>:
                                <span class="countdown-minutes">34</span>:
                                <span class="countdown-seconds">18</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <!-- Quick Actions -->
        <section class="quick-actions fade-in-up delay-1">
            <div class="section-header-inline">
                <h2 class="section-title">إجراءات سريعة</h2>
            </div>
            
            <div class="actions-grid">
                <button class="action-card glass-card hover-lift" onclick="logPrayer()">
                    <div class="action-icon">🕌</div>
                    <span class="action-label">تسجيل صلاة</span>
                </button>
                
                <a href="{{ route('duas') }}" class="action-card glass-card hover-lift">
                    <div class="action-icon">📿</div>
                    <span class="action-label">تصفح الأدعية</span>
                </a>
                
                <button class="action-card glass-card hover-lift" onclick="addGoodDeed()">
                    <div class="action-icon">💚</div>
                    <span class="action-label">إضافة عمل صالح</span>
                </button>
                
                <a href="{{ route('hijri-calendar') }}" class="action-card glass-card hover-lift">
                    <div class="action-icon">📅</div>
                    <span class="action-label">التقويم</span>
                </a>
            </div>
        </section>
        
        <!-- Rest of dashboard content will be added from original HTML -->
        <!-- This is a template - copy the rest from dashboard_page.html -->
        
    </div>
</main>
@endsection

@push('scripts')
<script src="{{ asset('js/dashboard.js') }}"></script>
<script src="{{ asset('js/prayer-times.js') }}"></script>
@endpush

