@extends('layouts.app')

@section('title', 'التقويم الهجري - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/hijri-calendar.css') }}">
@endpush

@section('body_class', 'calendar-page')

@section('content')
    <!-- Main Content -->
    <main class="calendar-main">
        <div class="calendar-container">
            
            <!-- Main Layout: Events Left, Calendar Right -->
            <div class="main-layout">
                <!-- Left Side: Events List -->
                <section class="events-sidebar fade-in-up delay-1">
                    <div class="events-sidebar-header glass-card">
                        <h2 class="events-sidebar-title">المناسبات</h2>
                        <div class="events-filter">
                            <button class="filter-tab active" data-filter="all">الكل</button>
                            <button class="filter-tab" data-filter="joyful">فرح</button>
                            <button class="filter-tab" data-filter="mourning">حزن</button>
                        </div>
                    </div>
                    
                    <div class="events-list-container glass-card" id="eventsListContainer">
                        <img src="{{ asset('assets/images/hijriback.jpg') }}" alt="المناسبات" class="events-list-background">
                        <div class="events-list-overlay"></div>
                        <div class="events-list-content">
                            <div class="events-list" id="eventsList">
                                <!-- Events will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- Right Side: Calendar -->
                <section class="calendar-sidebar fade-in-up delay-2">
                    <!-- Calendar Navigation -->
                    <div class="calendar-nav-compact glass-card">
                        <button class="nav-btn-compact" id="prevMonth">
                            <span class="nav-arrow">→</span>
                        </button>
                        
                        <div class="current-month-compact">
                            <h2 class="month-name-compact" id="currentMonth">محرم</h2>
                            <span class="year-number-compact" id="currentYear">1446 هـ</span>
                        </div>
                        
                        <button class="nav-btn-compact" id="nextMonth">
                            <span class="nav-arrow">←</span>
                        </button>
                    </div>
                    
                    <!-- Quick Jump -->
                    <div class="quick-jump-compact glass-card">
                        <button class="jump-btn-compact" id="todayBtn">
                            <span class="btn-icon">📅</span>
                            <div class="jump-btn-content">
                                <span class="jump-btn-label">اليوم</span>
                                <span class="jump-btn-date-hijri" id="quickJumpHijri">15 جمادى الأولى 1446</span>
                                <span class="jump-btn-date-gregorian" id="quickJumpGregorian">17 نوفمبر 2024</span>
                            </div>
                        </button>
                    </div>
                    
                    <!-- Calendar Grid -->
                    <div class="calendar-wrapper-compact glass-card">
                        <img src="{{ asset('assets/images/calender.jpg') }}" alt="التقويم الهجري" class="calendar-wrapper-background">
                        <div class="calendar-wrapper-overlay"></div>
                        <div class="calendar-wrapper-content">
                            <!-- Days of Week Header -->
                            <div class="weekdays-compact">
                            <div class="weekday-compact">سبت</div>
                            <div class="weekday-compact">أحد</div>
                            <div class="weekday-compact">إثن</div>
                            <div class="weekday-compact">ثل</div>
                            <div class="weekday-compact">أرب</div>
                            <div class="weekday-compact">خم</div>
                            <div class="weekday-compact">جم</div>
                        </div>
                        
                            <!-- Calendar Days Grid -->
                            <div class="calendar-grid-compact" id="calendarGrid">
                                <!-- Days will be populated by JavaScript -->
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            
        </div>
    </main>
    
    <!-- Event Details Modal -->
    <div id="eventModal" class="modal" style="display: none;">
        <div class="modal-overlay" onclick="closeEventModal()"></div>
        <div class="modal-content glass-card">
            <button class="modal-close" onclick="closeEventModal()">✕</button>
            
            <div class="event-details">
                <div class="event-icon-large" id="eventIcon">🕌</div>
                <h2 class="event-title" id="eventTitle">مناسبة إسلامية</h2>
                <div class="event-date" id="eventDate">1 محرم 1446 هـ</div>
                
                <div class="event-info">
                    <div class="info-section">
                        <h4 class="info-title">عن المناسبة:</h4>
                        <p class="info-text" id="eventDescription">وصف المناسبة</p>
                    </div>
                    
                    <div class="info-section">
                        <h4 class="info-title">الأعمال المستحبة:</h4>
                        <ul class="info-list" id="eventActions">
                            <li>الصلاة والدعاء</li>
                        </ul>
                    </div>
                </div>
                
                <button class="btn-primary" onclick="setReminder()">
                    <span class="btn-icon">🔔</span>
                    <span>تذكيرني بهذا اليوم</span>
                </button>
            </div>
        </div>
    </div>
    
    <!-- Special Days List Modal -->
    <div id="specialDaysModal" class="modal" style="display: none;">
        <div class="modal-overlay" onclick="closeSpecialDaysModal()"></div>
        <div class="modal-content glass-card special-days-modal">
            <button class="modal-close" onclick="closeSpecialDaysModal()">✕</button>
            
            <h2 class="modal-title">الأيام المباركة في السنة الهجرية</h2>
            
            <div class="special-days-list" id="specialDaysList">
                <!-- Special days will be populated by JavaScript -->
            </div>
        </div>
    </div>
    
    <!-- Toast Notification -->
    <div id="calendarToast" class="calendar-toast"></div>
    
    @push('scripts')
        <script src="{{ asset('js/hijri-calendar.js') }}"></script>
    @endpush
@endsection

