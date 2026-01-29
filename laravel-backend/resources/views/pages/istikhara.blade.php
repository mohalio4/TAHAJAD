@extends('layouts.app')

@section('title', 'الاستخارة بالقرآن - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/istikhara.css') }}">
@endpush

@section('body_class', 'istikhara-page')

@section('content')
    <!-- Main Content -->
    <main class="istikhara-main">
        <div class="istikhara-container">
            
            <!-- Page Header -->
            <section class="istikhara-header fade-in-up">
                <div class="header-content glass-card">
                    <img src="{{ asset('assets/images/quran.jpg') }}" alt="الاستخارة بالقرآن الكريم" class="header-background-image">
                    <div class="header-overlay"></div>
                    <div class="header-text-content">
                        <div class="header-icon">🤲</div>
                        <h1 class="page-title">الاستخارة بالقرآن الكريم</h1>
                        <p class="page-subtitle">اطلب الخير من الله في أمورك المباحة</p>
                        <p class="quran-verse">"وَمَا تَشَاءُونَ إِلَّا أَن يَشَاءَ اللَّهُ" - الإنسان:30</p>
                    </div>
                </div>
            </section>
            
            <!-- Instructions Section -->
            <section class="instructions-section fade-in-up delay-1">
                <div class="instructions-card glass-card">
                    <h2 class="section-title">
                        <span class="title-icon">📋</span>
                        <span>كيفية الاستخارة بالقرآن</span>
                    </h2>
                    
                    <div class="instructions-list">
                        <div class="instruction-item">
                            <div class="instruction-number">1</div>
                            <div class="instruction-content">
                                <h3 class="instruction-title">سورة التوحيد 3 مرات</h3>
                            </div>
                        </div>
                        
                        <div class="instruction-item">
                            <div class="instruction-number">2</div>
                            <div class="instruction-content">
                                <h3 class="instruction-title">اللهم صلّ على محمد وعلى آل محمد 3 مرات</h3>
                               
                            </div>
                        </div>
                        
                        <div class="instruction-item">
                            <div class="instruction-number">3</div>
                            <div class="instruction-content">
                                <h3 class="instruction-title">استغفر الله 3 مرات</h3>
                            
                            </div>
                        </div>
                        
                        <div class="instruction-item">
                            <div class="instruction-number">4</div>
                            <div class="instruction-content">
                                <h3 class="instruction-title">دعاء الاستخارة</h3>
                                <p class="instruction-text">االهم إني أستخيرك وأستشيرك لعلمك بعاقبة الأمور , اللهم إن كان لي بها خير فيسّرها لي, وإن كان لي بها شر فجنّبنيها, برحمتك يا أرحم الراحمين</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Istikhara Form -->
            <section class="istikhara-form-section fade-in-up delay-2">
                <div class="form-card glass-card">
                    <img src="{{ asset('assets/images/quran2.jpg') }}" alt="نموذج الاستخارة" class="form-card-background">
                    <div class="form-card-overlay"></div>
                    <div class="form-card-content">
                        <h2 class="section-title">
                            <span class="title-icon">📖</span>
                            <span>أدخل رقم الصفحة</span>
                        </h2>
                        
                        <form id="istikharaForm" class="istikhara-form">
                        <div class="form-group">
                        
                            <input 
                                type="number" 
                                id="pageNumber" 
                                class="form-input page-input" 
                                placeholder="مثال: 1, 3, 5, 7..."
                                min="1"
                                step="2"
                                required>
                            <p class="input-hint">الرقم يجب أن يكون فردياً (1، 3، 5، 7... إلخ)</p>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">
                                <span class="label-icon">✍️</span>
                                <span>سبب الاستخارة (اختياري)</span>
                            </label>
                            <textarea 
                                id="istikharaReason" 
                                class="form-input" 
                                rows="3" 
                                placeholder="اكتب السبب أو الأمر الذي تستخير لأجله..."></textarea>
                        </div>
                        
                        <button type="submit" class="btn-submit" id="submitBtn">
                            <span class="btn-icon">🤲</span>
                            <span>استخر لي الله</span>
                        </button>
                    </form>
                    </div>
                </div>
            </section>
            
            <!-- Loading State -->
            <section id="loadingSection" class="loading-section" style="display: none;">
                <div class="loading-card glass-card">
                    <div class="loading-spinner"></div>
                    <p class="loading-text">جاري الحصول على نتيجة الاستخارة...</p>
                </div>
            </section>
            
            <!-- Result Section -->
            <section id="resultSection" class="result-section fade-in-up" style="display: none;">
                <div class="result-card glass-card">
                    <div class="result-header">
                        <h2 class="result-title">
                            <span class="title-icon">✨</span>
                            <span>نتيجة الاستخارة</span>
                        </h2>
                        <div class="result-indicator" id="resultIndicator">
                            <span class="indicator-icon" id="indicatorIcon">✅</span>
                            <span class="indicator-text" id="indicatorText">خير</span>
                        </div>
                    </div>
                    
                    <div class="result-content">
                        <div class="result-info">
                            <div class="info-item">
                                <span class="info-label">رقم الصفحة:</span>
                                <span class="info-value" id="resultPage">-</span>
                            </div>
                            <div class="info-item" id="reasonInfo" style="display: none;">
                                <span class="info-label">سبب الاستخارة:</span>
                                <span class="info-value" id="resultReason">-</span>
                            </div>
                        </div>
                        
                        <div class="result-details">
                            <div class="detail-section">
                                <h3 class="detail-title">📖 النص القرآني</h3>
                                <div class="detail-content quran-text" id="quranText">
                                    جاري التحميل...
                                </div>
                            </div>
                            
                            <div class="detail-section">
                                <h3 class="detail-title">💡 التفسير والإرشاد</h3>
                                <div class="detail-content interpretation-text" id="interpretationText">
                                    جاري التحميل...
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="result-actions">
                        <button class="btn-secondary" onclick="saveIstikhara()">
                            <span>💾</span>
                            <span>حفظ النتيجة</span>
                        </button>
                        <button class="btn-secondary" onclick="shareResult()">
                            <span>📤</span>
                            <span>مشاركة</span>
                        </button>
                        <button class="btn-primary" onclick="resetForm()">
                            <span>🔄</span>
                            <span>استخارة جديدة</span>
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- History Section -->
            <section class="history-section fade-in-up delay-3">
                <div class="history-header">
                    <h2 class="section-title">
                        <span class="title-icon">📚</span>
                        <span>سجل الاستخارات السابقة</span>
                    </h2>
                    <button class="btn-small" onclick="clearHistory()">
                        <span>🗑️</span>
                        <span>مسح الكل</span>
                    </button>
                </div>
                
                <div class="history-grid" id="historyGrid">
                    <!-- History items will be populated by JavaScript -->
                </div>
                
                <div class="empty-history" id="emptyHistory" style="display: none;">
                    <div class="empty-icon">📖</div>
                    <p>لم تقم بأي استخارة بعد</p>
                </div>
            </section>
            
        </div>
    </main>
    
    <!-- Toast Notification -->
    <div id="istikharaToast" class="istikhara-toast"></div>
    
    @push('scripts')
        <script src="{{ asset('js/istikhara.js') }}"></script>
    @endpush
@endsection

