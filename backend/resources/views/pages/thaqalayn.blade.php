@extends('layouts.app')

@section('title', 'الثقلين - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/thaqalayn.css') }}'>
@endsection

@section('content')
<!-- Main Content -->
<main class="thaqalayn-main">
    <div class="thaqalayn-container">
        
        <!-- Page Header -->
        <header class="thaqalayn-header fade-in-up">
            <div class="header-content glass-card">
                <img src="{{ asset('assets/images/lib.jpg') }}" alt="الثقلين" class="header-background-image">
                <div class="header-overlay"></div>
                <div class="header-text-content">
                    <div class="header-icon">📚</div>
                    <h1 class="page-title">الثقلين</h1>
                    <p class="page-subtitle">مكتبة شاملة للأحاديث والكتب الإسلامية</p>
                </div>
            </div>
        </header>
        
        <!-- Random Hadith Section -->
        <section class="random-hadith-section fade-in-up delay-1">
            <div class="random-hadith-card glass-card">
                <div class="section-header-row">
                    <h2 class="section-title">
                        <span class="title-icon">🎲</span>
                        <span>حديث عشوائي</span>
                    </h2>
                    <button class="btn-refresh" id="refreshRandomBtn">
                        <span class="refresh-icon">🔄</span>
                        <span>تحديث</span>
                    </button>
                </div>
                
                <div class="loading-state" id="randomLoading" style="display: none;">
                    <div class="loading-spinner"></div>
                    <p>جاري التحميل...</p>
                </div>
                
                <div class="error-state" id="randomError" style="display: none;"></div>
                
                <div class="random-hadith-content" id="randomHadithContent" style="display: none;">
                    <div class="hadith-book-name" id="randomBookName"></div>
                    <div class="hadith-text" id="randomArabicText"></div>
                    <div class="hadith-text-english" id="randomEnglishText"></div>
                    <div class="hadith-meta">
                        <span class="hadith-narrator" id="randomNarrator"></span>
                        <span class="hadith-grade" id="randomGrade"></span>
                    </div>
                    <a href="#" id="randomReference" target="_blank" class="hadith-reference" style="display: none;">المصدر</a>
                </div>
            </div>
        </section>
        
        <!-- Search Section -->
        <section class="search-section fade-in-up delay-2">
            <div class="search-container glass-card">
                <div class="search-wrapper">
                    <div class="search-icon">🔍</div>
                    <input 
                        type="text" 
                        id="searchInput" 
                        class="search-input" 
                        placeholder="ابحث في الأحاديث..."
                        autocomplete="off">
                    <button class="clear-search" id="clearSearch" style="display: none;">✕</button>
                </div>
                
                <div class="filter-wrapper">
                    <label for="bookFilter" class="filter-label">
                        <span class="filter-icon">📖</span>
                        <span>اختر الكتاب:</span>
                    </label>
                    <select id="bookFilter" class="filter-select">
                        <option value="">جميع الكتب</option>
                    </select>
                </div>
                
                <div class="results-info" id="searchResultsInfo" style="display: none;">
                    <span id="searchResultsCount">0</span> نتيجة
                </div>
            </div>
        </section>
        
        <!-- Books Section -->
        <section class="books-section fade-in-up delay-3">
            <div class="section-header-row">
                <h2 class="section-title">
                    <span class="title-icon">📚</span>
                    <span>الكتب</span>
                </h2>
                <button class="btn-refresh" id="refreshBooksBtn">
                    <span class="refresh-icon">🔄</span>
                    <span>تحديث</span>
                </button>
            </div>
            
            <div class="loading-state" id="booksLoading">
                <div class="loading-spinner"></div>
                <p>جاري تحميل الكتب...</p>
            </div>
            
            <div class="error-state" id="booksError" style="display: none;"></div>
            
            <div class="books-grid" id="booksGrid" style="display: none;"></div>
        </section>
        
        <!-- Search Results Section -->
        <section class="search-results-section" id="searchResultsSection" style="display: none;">
            <h2 class="section-title">
                <span class="title-icon">🔍</span>
                <span>نتائج البحث</span>
            </h2>
            
            <div class="loading-state" id="searchLoading" style="display: none;">
                <div class="loading-spinner"></div>
                <p>جاري البحث...</p>
            </div>
            
            <div class="error-state" id="searchError" style="display: none;"></div>
            
            <div class="hadiths-list" id="searchResultsList"></div>
        </section>
        
    </div>
</main>
@endsection

@section('extra-js')
<script src='{{ asset('js/thaqalayn.js') }}'></script>
@endsection
