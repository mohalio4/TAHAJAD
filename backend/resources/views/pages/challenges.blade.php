@extends('layouts.app')

@section('title', 'التحديات - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/challenges.css') }}'>
@endsection

@section('content')
<!-- Main Content -->
<main class="challenges-main">
    <div class="challenges-container">
        
        <!-- Page Header -->
        <section class="page-header fade-in-up">
            <h1 class="page-title">التحديات اليومية</h1>
            <p class="page-subtitle">تحدَّ نفسك وارفع من مستوى إيمانك</p>
        </section>
        
        <!-- Stats & Achievements Overview -->
        <section class="stats-overview fade-in-up delay-1">
            <div class="stat-card glass-card">
                <div class="stat-icon">🔥</div>
                <div class="stat-content">
                    <span class="stat-value" id="streakDays" data-calculated="true">-</span>
                    <span class="stat-label">أيام متتالية</span>
                </div>
            </div>
            
            <div class="stat-card glass-card">
                <div class="stat-icon">⭐</div>
                <div class="stat-content">
                    <span class="stat-value" id="totalPoints" data-calculated="true">-</span>
                    <span class="stat-label">نقطة</span>
                </div>
            </div>
            
            <div class="stat-card glass-card">
                <div class="stat-icon">🏆</div>
                <div class="stat-content">
                    <span class="stat-value" id="completedChallenges" data-calculated="true">-</span>
                    <span class="stat-label">تحدٍ مكتمل</span>
                </div>
            </div>
        </section>
        
        <!-- Main Layout: Challenges Left, Calendar Right -->
        <div class="main-layout">
            <!-- Left Side: Challenges List -->
            <section class="challenges-sidebar fade-in-up delay-2">
                <!-- Ready Challenges -->
                <div class="ready-challenges-section glass-card">
                    <div class="ready-challenges-header">
                        <h3 class="ready-challenges-title">تحديات جاهزة</h3>
                        <button class="btn-add-challenge" id="addChallengeBtn">
                            <span class="btn-icon">+</span>
                            <span>إضافة تحدٍ</span>
                        </button>
                    </div>
                    <div class="ready-challenges-grid">
                        <div class="ready-challenge-card" data-ready-challenge="quran">
                            <img src="{{ asset('assets/images/quran.jpg') }}" alt="قراءة القرآن" class="ready-challenge-background">
                            <div class="ready-challenge-overlay"></div>
                            <div class="ready-challenge-content">
                                <div class="ready-challenge-icon">📖</div>
                                <h4 class="ready-challenge-title">قراءة القرآن</h4>
                                <p class="ready-challenge-desc">اقرأ صفحة من القرآن يومياً</p>
                                <button class="btn-add-ready" data-ready-challenge="quran">إضافة</button>
                            </div>
                        </div>
                        
                        <div class="ready-challenge-card" data-ready-challenge="prayer">
                            <img src="{{ asset('assets/images/aahd.jpg') }}" alt="عهد الأربعين صباحاً" class="ready-challenge-background">
                            <div class="ready-challenge-overlay"></div>
                            <div class="ready-challenge-content">
                                <div class="ready-challenge-icon">🤲</div>
                                <h4 class="ready-challenge-title">عهد الأربعين صباحاً</h4>
                                <p class="ready-challenge-desc">عن الإمام الصادق (عليه السلام) أنه قال: (مَنْ دَعَا إِلَى اللَّهِ أَرْبَعِينَ صَبَاحاً بِهَذَا الْعَهْدِ كَانَ مِنْ أَنْصَارِ قَائِمِنَا)</p>
                                <button class="btn-add-ready" data-ready-challenge="prayer">إضافة</button>
                            </div>
                        </div>
                        
                        <div class="ready-challenge-card" data-ready-challenge="dhikr">
                            <img src="{{ asset('assets/images/ziyara.jpg') }}" alt="زيارة عاشوراء" class="ready-challenge-background">
                            <div class="ready-challenge-overlay"></div>
                            <div class="ready-challenge-content">
                                <div class="ready-challenge-icon">🕯️</div>
                                <h4 class="ready-challenge-title">زيارة عاشوراء</h4>
                                <p class="ready-challenge-desc">عن الباقر عليه السلام قال: لو يعلم الناس ما في زيارة الحسين عليه السلام من الفضل لماتوا شوقاً</p>
                                <button class="btn-add-ready" data-ready-challenge="dhikr">إضافة</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="challenges-list-container glass-card" id="challengesListContainer">
                    <div class="challenges-list-header">
                        <div class="filter-dropdown-wrapper">
                            <button class="filter-icon-btn" id="filterToggleBtn" title="فلترة التحديات">
                                <span class="filter-icon">🔍</span>
                            </button>
                            <div class="challenges-filter-dropdown" id="challengesFilter">
                                <button class="filter-tab active" data-filter="all">الكل</button>
                                <button class="filter-tab" data-filter="aamal">أعمال</button>
                                <button class="filter-tab" data-filter="tatwir">تطوير الذات</button>
                            </div>
                        </div>
                    </div>
                    <div class="challenges-list" id="challengesList">
                        <div class="empty-state">
                            <div class="empty-icon">📋</div>
                            <p class="empty-text">لا توجد تحديات بعد</p>
                            <p class="empty-subtext">ابدأ بإضافة تحدٍ جديد</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Right Side: Calendar -->
            <section class="calendar-sidebar fade-in-up delay-3">
                <!-- Calendar Navigation -->
                <div class="calendar-nav-compact glass-card">
                    <button class="nav-btn-compact" id="prevMonth">
                        <span class="nav-arrow">→</span>
                    </button>
                    
                    <div class="current-month-compact">
                        <h2 class="month-name-compact" id="currentMonth">يناير</h2>
                        <span class="year-number-compact" id="currentYear">2025</span>
                    </div>
                    
                    <button class="nav-btn-compact" id="nextMonth">
                        <span class="nav-arrow">←</span>
                    </button>
                </div>
                
                <!-- Quick Jump to Today -->
                <div class="quick-jump-compact glass-card">
                    <button class="jump-btn-compact" id="todayBtn">
                        <span class="btn-icon">📅</span>
                        <div class="jump-btn-content">
                            <span class="jump-btn-label">اليوم</span>
                            <span class="jump-btn-date" id="quickJumpDate"></span>
                        </div>
                    </button>
                </div>
                
                <!-- Calendar Grid -->
                <div class="calendar-wrapper-compact glass-card">
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
                
                <!-- Calendar Legend -->
                <div class="calendar-legend glass-card">
                    <h4 class="legend-title">المفتاح</h4>
                    <div class="legend-items">
                        <div class="legend-item">
                            <span class="legend-color completed"></span>
                            <span class="legend-label">مكتمل</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color partial"></span>
                            <span class="legend-label">جزئي</span>
                        </div>
                        <div class="legend-item">
                            <span class="legend-color missed"></span>
                            <span class="legend-label">مفقود</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        
        <!-- Achievements Section -->
        <section class="achievements-section fade-in-up delay-4">
            <h2 class="section-title">الإنجازات والشارات الإسلامية</h2>
            
            <div class="achievements-grid" id="achievementsGrid">
                <!-- Achievements will be populated by JavaScript -->
            </div>
        </section>
        
    </div>
</main>

<!-- Add/Edit Challenge Modal -->
<div id="challengeModal" class="modal" style="display: none;">
    <div class="modal-overlay" onclick="closeChallengeModal()"></div>
    <div class="modal-content glass-card challenge-modal">
        <button class="modal-close" onclick="closeChallengeModal()">✕</button>
        
        <div class="modal-header">
            <h2 class="modal-title" id="modalTitle">إضافة تحدٍ جديد</h2>
        </div>
        
        <div class="modal-body">
            <form id="challengeForm">
                <div class="form-group">
                    <label class="form-label">عنوان التحدي</label>
                    <input type="text" 
                           id="challengeTitle" 
                           class="form-input" 
                           placeholder="مثال: قراءة القرآن يومياً"
                           required>
                </div>
                
                <div class="form-group">
                    <label class="form-label">الوصف</label>
                    <textarea id="challengeDescription" 
                              class="form-textarea" 
                              rows="3"
                              placeholder="وصف مختصر للتحدي..."></textarea>
                </div>
                
                <div class="form-group">
                    <label class="form-label">التصنيف</label>
                    <div class="category-buttons">
                        <button type="button" class="category-btn active" data-category="aamal">
                            <span class="category-icon">🕌</span>
                            <span>أعمال</span>
                        </button>
                        <button type="button" class="category-btn" data-category="tatwir">
                            <span class="category-icon">📖</span>
                            <span>تطوير الذات</span>
                        </button>
                    </div>
                    <input type="hidden" id="challengeCategory" value="aamal">
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">عدد الأيام</label>
                        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; padding: 0.5rem; border-radius: 8px; transition: background 0.3s;">
                                <input type="checkbox" id="unlimitedDays" style="width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-weight: 600; color: var(--secondary);">غير محدود (Unlimited)</span>
                            </label>
                            <input type="number" 
                                   id="challengeDays" 
                                   class="form-input" 
                                   min="1"
                                   value="30"
                                   placeholder="30">
                            <span class="form-hint">لمدة كم يوم</span>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">نوع التحدي</label>
                        <select id="challengeType" class="form-select">
                            <option value="daily">يومي</option>
                            <option value="specific">أيام محددة</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group" id="daysOfWeekGroup" style="display: none;">
                    <label class="form-label">أيام الأسبوع</label>
                    <div class="days-checkboxes">
                        <label class="day-checkbox">
                            <input type="checkbox" value="0">
                            <span>سبت</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" value="1">
                            <span>أحد</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" value="2">
                            <span>إثنين</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" value="3">
                            <span>ثلاثاء</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" value="4">
                            <span>أربعاء</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" value="5">
                            <span>خميس</span>
                        </label>
                        <label class="day-checkbox">
                            <input type="checkbox" value="6">
                            <span>جمعة</span>
                        </label>
                    </div>
                </div>
            </form>
        </div>
        
        <div class="modal-footer">
            <button class="btn-glass" onclick="closeChallengeModal()">إلغاء</button>
            <button class="btn-primary" id="saveChallengeBtn" onclick="saveChallenge()">
                <span class="btn-icon">✓</span>
                <span>حفظ</span>
            </button>
        </div>
    </div>
</div>

<!-- Day Challenges Modal -->
<div id="dayChallengesModal" class="modal" style="display: none;">
    <div class="modal-overlay" onclick="closeDayChallengesModal()"></div>
    <div class="modal-content glass-card day-challenges-modal">
        <button class="modal-close" onclick="closeDayChallengesModal()">✕</button>
        
        <div class="modal-header">
            <h2 class="modal-title" id="dayModalTitle">تحديات اليوم</h2>
            <span class="modal-date" id="dayModalDate"></span>
        </div>
        
        <div class="modal-body">
            <div class="day-challenges-list" id="dayChallengesList">
                <!-- Challenges for selected day will be populated here -->
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="deleteConfirmModal" class="modal" style="display: none;">
    <div class="modal-overlay" onclick="closeDeleteConfirmModal()"></div>
    <div class="modal-content glass-card" style="max-width: 400px;">
        <button class="modal-close" onclick="closeDeleteConfirmModal()">✕</button>
        
        <div class="modal-header">
            <h2 class="modal-title">تأكيد الحذف</h2>
        </div>
        
        <div class="modal-body" style="text-align: center; padding: 2rem;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⚠️</div>
            <p style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.5rem;">هل أنت متأكد من حذف هذا التحدي؟</p>
            <p style="font-size: 0.9rem; color: var(--text-muted);">لا يمكن التراجع عن هذا الإجراء</p>
        </div>
        
        <div class="modal-footer" style="display: flex; gap: 1rem; justify-content: center;">
            <button class="btn-glass" onclick="closeDeleteConfirmModal()" style="flex: 1;">إلغاء</button>
            <button class="btn-primary" id="confirmDeleteBtn" style="flex: 1; background: linear-gradient(135deg, #dc3545, #c82333);">حذف</button>
        </div>
    </div>
</div>

<!-- Toast Notification -->
<div id="challengeToast" class="challenge-toast"></div>
@endsection

@section('extra-js')
<script src='{{ asset('js/challenges.js') }}'></script>
@endsection
