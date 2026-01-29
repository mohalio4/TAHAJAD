@extends('layouts.app')

@section('title', 'الإعدادات - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/prayer-times.css') }}">
@endpush

@section('body_class', 'settings-page')

@section('content')
    <!-- Main Content -->
    <main class="settings-main">
        <div class="settings-layout">
            
            <!-- Hijri Date Card -->
            <div class="setting-card glass-card sidebar-card">
                <div class="setting-header">
                    <span class="setting-icon">📅</span>
                    <h3 class="setting-title">التاريخ الهجري</h3>
                </div>
                <div class="setting-options">
                    <div class="hijri-adjustment-container">
                        <div class="hijri-display">
                            <span class="hijri-date-display" id="hijriDateDisplay">20 جمادى الأولى 1447</span>
                        </div>
                        <div class="hijri-adjustment-controls">
                            <button class="hijri-adjust-btn" id="decreaseHijriDayBtn">
                                <span>-1</span>
                                <span>يوم</span>
                            </button>
                            <button class="hijri-reset-btn" id="resetHijriDateBtn">
                                <span>إعادة تعيين</span>
                            </button>
                            <button class="hijri-adjust-btn" id="increaseHijriDayBtn">
                                <span>+1</span>
                                <span>يوم</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main Content Area -->
            <div class="settings-content">
                <!-- Prayer Time Editing Section -->
                <section class="time-editing-section">
                    <div class="time-editing-card glass-card">
                        <div class="time-editing-header">
                            <span class="time-editing-icon">⏰</span>
                            <h2 class="time-editing-title">تعديل الأوقات</h2>
                        </div>
                        <div class="prayer-time-adjustments-large">
                                <!-- Imsak -->
                                <div class="prayer-adjustment-item">
                                    <label class="prayer-adjust-label">الإمساك</label>
                                    <div class="slider-container-compact">
                                        <span class="slider-label-small">-25</span>
                                        <input type="range" id="imsakAdjustmentSlider" min="-25" max="25" value="0" step="1" class="time-slider-compact" data-prayer="imsak">
                                        <span class="slider-label-small">+25</span>
                                    </div>
                                    <span class="adjust-value-small" id="imsakAdjustmentValue">0</span>
                                </div>
                                
                                <!-- Fajr -->
                                <div class="prayer-adjustment-item">
                                    <label class="prayer-adjust-label">الفجر</label>
                                    <div class="slider-container-compact">
                                        <span class="slider-label-small">-25</span>
                                        <input type="range" id="fajrAdjustmentSlider" min="-25" max="25" value="0" step="1" class="time-slider-compact" data-prayer="fajr">
                                        <span class="slider-label-small">+25</span>
                                    </div>
                                    <span class="adjust-value-small" id="fajrAdjustmentValue">0</span>
                                </div>
                                
                                <!-- Dhuhr -->
                                <div class="prayer-adjustment-item">
                                    <label class="prayer-adjust-label">الظهر</label>
                                    <div class="slider-container-compact">
                                        <span class="slider-label-small">-25</span>
                                        <input type="range" id="dhuhrAdjustmentSlider" min="-25" max="25" value="0" step="1" class="time-slider-compact" data-prayer="dhuhr">
                                        <span class="slider-label-small">+25</span>
                                    </div>
                                    <span class="adjust-value-small" id="dhuhrAdjustmentValue">0</span>
                                </div>
                                
                                <!-- Maghrib -->
                                <div class="prayer-adjustment-item">
                                    <label class="prayer-adjust-label">المغرب</label>
                                    <div class="slider-container-compact">
                                        <span class="slider-label-small">-25</span>
                                        <input type="range" id="maghribAdjustmentSlider" min="-25" max="25" value="0" step="1" class="time-slider-compact" data-prayer="maghrib">
                                        <span class="slider-label-small">+25</span>
                                    </div>
                                    <span class="adjust-value-small" id="maghribAdjustmentValue">0</span>
                                </div>
                                
                                <!-- Midnight -->
                                <div class="prayer-adjustment-item">
                                    <label class="prayer-adjust-label">منتصف الليل</label>
                                    <div class="slider-container-compact">
                                        <span class="slider-label-small">-25</span>
                                        <input type="range" id="midnightAdjustmentSlider" min="-25" max="25" value="0" step="1" class="time-slider-compact" data-prayer="midnight">
                                        <span class="slider-label-small">+25</span>
                                    </div>
                                    <span class="adjust-value-small" id="midnightAdjustmentValue">0</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            </div>
            
        </div>
    </main>
    
    <!-- Success Toast -->
    <div id="settingsToast" class="prayer-toast"></div>
    
    @push('scripts')
        <script src="{{ asset('js/settings.js') }}"></script>
    @endpush
@endsection

