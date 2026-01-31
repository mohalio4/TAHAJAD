@extends('layouts.app')

@section('title', 'الأدعية - تهجّد')

@section('extra-css')
<link rel='stylesheet' href='{{ asset('css/duas.css') }}'>
@endsection

@section('content')
<!-- Main Content -->
<main class="duas-main">
    <div class="duas-container">
        
        <!-- Page Header -->
        <section class="page-header fade-in-up">
            <h1 class="page-title">مكتبة الأدعية</h1>
            <p class="page-subtitle">ادْعُونِي أَسْتَجِبْ لَكُمْ</p>
        </section>
        
        <!-- Search & Filter Bar -->
        <section class="search-filter-bar fade-in-up delay-1">
            <div class="search-filter-container">
                <div class="search-box glass-card">
                    <span class="search-icon">🔍</span>
                    <input type="text" 
                           id="duaSearch" 
                           class="search-input" 
                           placeholder="ابحث عن دعاء...">
                    <button class="clear-search" id="clearSearch" style="display: none;">✕</button>
                </div>
                
                <div class="filter-buttons">
                    <button class="filter-btn active" data-category="all">
                        <span class="filter-icon">📿</span>
                        <span>الكل</span>
                    </button>
                    <button class="filter-btn" data-category="favorites">
                        <span class="filter-icon">⭐</span>
                        <span>المفضلة</span>
                    </button>
                </div>
            </div>
        </section>
        
        <!-- Quick Categories -->
        <section class="quick-categories fade-in-up delay-2">
            <h2 class="section-title">التصنيفات السريعة</h2>
            
            <div class="categories-grid">
                <button class="category-card glass-card hover-lift" data-category="ziyarat">
                    <img src="{{ asset('assets/images/ziyara.jpg') }}" alt="الزيارات" class="category-background-image">
                    <div class="category-overlay"></div>
                    <div class="category-content">
                        <div class="category-icon">🕌</div>
                        <h3 class="category-title">الزيارات</h3>
                    </div>
                </button>
                
                <button class="category-card glass-card hover-lift" data-category="dua">
                    <img src="{{ asset('assets/images/daau.jpg') }}" alt="الدعاء" class="category-background-image">
                    <div class="category-overlay"></div>
                    <div class="category-content">
                        <div class="category-icon">📿</div>
                        <h3 class="category-title">الدعاء</h3>
                    </div>
                </button>
                
                <button class="category-card glass-card hover-lift" data-category="taqibat">
                    <img src="{{ asset('assets/images/taakib.jpg') }}" alt="تعقيبات الصلاة" class="category-background-image">
                    <div class="category-overlay"></div>
                    <div class="category-content">
                        <div class="category-icon">🕌</div>
                        <h3 class="category-title">تعقيبات الصلاة</h3>
                    </div>
                </button>
                
                <button class="category-card glass-card hover-lift" data-category="seerah">
                    <img src="{{ asset('assets/images/ahlalbayt.jpg') }}" alt="سيرة أهل البيت" class="category-background-image">
                    <div class="category-overlay"></div>
                    <div class="category-content">
                        <div class="category-icon">📖</div>
                        <h3 class="category-title">سيرة أهل البيت</h3>
                    </div>
                </button>
            </div>
        </section>
        
        <!-- Duas List -->
        <section class="duas-list-section fade-in-up delay-3">
            <div class="section-header">
                <h2 class="section-title">جميع الأدعية</h2>
                <div class="list-controls">
                    <button class="view-toggle active" data-view="grid">
                        <span>⊞</span>
                    </button>
                    <button class="view-toggle" data-view="list">
                        <span>☰</span>
                    </button>
                </div>
            </div>
            
            <div class="duas-grid" id="duasGrid">
                <!-- Duas will be loaded dynamically from ad3iya.json -->
            </div>
            
            <!-- Loading Indicator -->
            <div class="loading-more" id="loadingMore" style="display: none;">
                <div class="loader-spinner"></div>
                <span>جاري التحميل...</span>
            </div>
            
            <!-- Load More Button -->
            <div class="load-more-container">
                <button class="btn-load-more" id="loadMoreBtn">
                    <span>تحميل المزيد</span>
                    <span class="arrow-down">↓</span>
                </button>
            </div>
        </section>
        
    </div>
</main>

<!-- Dua Details Modal -->
<div id="duaDetailsModal" class="modal" style="display: none;">
    <div class="modal-overlay" onclick="closeModal()"></div>
    <div class="modal-content glass-card dua-details">
        <button class="modal-close" onclick="closeModal()">✕</button>
        
        <div class="modal-header">
            <h2 class="modal-title" id="modalDuaTitle">تفاصيل الدعاء</h2>
            <button class="favorite-btn-large" id="modalFavoriteBtn">
                <span class="favorite-icon">☆</span>
            </button>
        </div>
        
        <div class="modal-body">
            <div class="youtube-player-section" id="youtubePlayerSection" style="display: none;">
                <h3 class="section-heading">استماع الدعاء</h3>
                <div class="youtube-player-container">
                    <iframe 
                        id="youtubePlayer" 
                        class="youtube-iframe"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
            
            <div class="dua-text-section">
                <div class="section-heading-with-controls">
                    <h3 class="section-heading">النص العربي</h3>
                    <div class="font-size-controls">
                        <button class="font-size-btn" id="decreaseFontBtn" onclick="adjustDuaFontSize(-1)">
                            <span>−</span>
                        </button>
                        <span class="font-size-display" id="fontSizeDisplay">100%</span>
                        <button class="font-size-btn" id="increaseFontBtn" onclick="adjustDuaFontSize(1)">
                            <span>+</span>
                        </button>
                    </div>
                </div>
                <p class="dua-arabic-large" id="modalDuaArabic"></p>
            </div>
        </div>
        
        <div class="modal-footer">
            <button class="btn-modal-action" onclick="shareDuaFromModal()">
                <span class="btn-icon">📤</span>
                <span>مشاركة</span>
            </button>
            <button class="btn-modal-action" onclick="copyDuaText()">
                <span class="btn-icon">📋</span>
                <span>نسخ النص</span>
            </button>
        </div>
    </div>
</div>

<!-- Audio Player (hidden) -->
<audio id="duaAudio" style="display: none;"></audio>

<!-- Toast Notification -->
<div id="duaToast" class="dua-toast"></div>
@endsection

@section('extra-js')
<script src='{{ asset('js/duas.js') }}'></script>
@endsection
