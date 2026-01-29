@extends('layouts.app')

@section('title', 'القرآن الكريم - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/quran.css') }}">
@endpush

@section('body_class', 'quran-page')

@section('content')
    <!-- Main Content -->
    <main class="quran-main">
        <div class="quran-container">
            
            <!-- Page Header -->
            <header class="quran-header fade-in-up">
                <div class="header-content glass-card">
                    <img src="{{ asset('assets/images/quran2.jpg') }}" alt="القرآن الكريم" class="header-background-image">
                    <div class="header-overlay"></div>
                    <div class="header-text-content">
                        <div class="header-icon">📖</div>
                        <h1 class="page-title">القرآن الكريم</h1>
                        <p class="page-subtitle">اقرأ وتدبر في كلام الله تعالى</p>
                    </div>
                </div>
            </header>
            
            <!-- Continue Reading Section -->
            <section class="continue-reading-section fade-in-up delay-1" id="continueReadingSection" style="display: none;">
                <div class="continue-card glass-card">
                    <div class="continue-header">
                        <span class="continue-icon">📌</span>
                        <h2 class="continue-title">تابع القراءة</h2>
                    </div>
                    <div class="continue-content">
                        <p class="continue-text" id="continueText"></p>
                        <button class="btn-continue" id="btnContinue">
                            <span>متابعة القراءة</span>
                            <span>→</span>
                        </button>
                        <button class="btn-remove-continue" id="btnRemoveContinue">
                            <span>إزالة</span>
                        </button>
                    </div>
                </div>
            </section>
            
            <!-- Search Section -->
            <section class="search-section fade-in-up delay-1">
                <div class="search-card glass-card">
                    <div class="search-header">
                        <span class="search-icon-large">🔍</span>
                        <h2 class="search-title">البحث في القرآن</h2>
                    </div>
                    <div class="search-content">
                        <div class="search-input-wrapper">
                            <input 
                                type="text" 
                                id="quranSearchInput" 
                                class="quran-search-input" 
                                placeholder="ابحث عن سورة أو آية..."
                                autocomplete="off">
                            <button class="clear-search-btn" id="clearQuranSearch" style="display: none;">✕</button>
                        </div>
                        <div class="search-results" id="searchResults" style="display: none;">
                            <div class="search-results-header">
                                <span class="results-count" id="resultsCount"></span>
                            </div>
                            <div class="search-results-list" id="searchResultsList">
                                <!-- Search results will be populated by JavaScript -->
                            </div>
                        </div>
                        <div class="search-empty" id="searchEmpty" style="display: none;">
                            <div class="empty-icon">🔍</div>
                            <p>لا توجد نتائج</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- Saved Pages Section -->
            <section class="saved-pages-section fade-in-up delay-1" id="savedPagesSection" style="display: none;">
                <div class="saved-pages-card glass-card">
                    <div class="section-header-row">
                        <h2 class="section-title">
                            <span class="title-icon">💾</span>
                            <span>الصفحات المحفوظة</span>
                        </h2>
                        <button class="btn-clear-saved" id="btnClearSaved">
                            <span>🗑️</span>
                            <span>مسح الكل</span>
                        </button>
                    </div>
                    <div class="saved-pages-list" id="savedPagesList">
                        <!-- Saved pages will be populated by JavaScript -->
                    </div>
                    <div class="empty-saved" id="emptySaved" style="display: none;">
                        <div class="empty-icon">📖</div>
                        <p class="empty-text">لا توجد صفحات محفوظة</p>
                    </div>
                </div>
            </section>
            
            <!-- Surahs List -->
            <section class="surahs-list-section fade-in-up delay-2" id="surahsListSection">
                <div class="surahs-list" id="surahsList">
                    <!-- Surahs will be populated by JavaScript -->
                </div>
                
                <div class="loading-state" id="loadingState">
                    <div class="loading-spinner"></div>
                    <p>جاري تحميل السور...</p>
                </div>
                
                <div class="empty-state" id="emptyState" style="display: none;">
                    <div class="empty-icon">📖</div>
                    <p class="empty-text">لا توجد نتائج</p>
                </div>
            </section>
            
        </div>
    </main>
    
    @push('scripts')
        <script src="{{ asset('js/quran.js') }}"></script>
    @endpush
@endsection

