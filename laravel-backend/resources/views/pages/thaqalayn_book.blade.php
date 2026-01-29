@extends('layouts.app')

@section('title', 'أحاديث الكتاب - الثقلين - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/thaqalayn.css') }}">
@endpush

@section('body_class', 'thaqalayn-book-page')

@section('content')
    <!-- Main Content -->
    <main class="thaqalayn-main">
        <div class="thaqalayn-container">
            
            <!-- Page Header -->
            <header class="thaqalayn-header fade-in-up">
                <div class="header-content glass-card">
                    <div class="header-icon">📖</div>
                    <h1 class="page-title" id="bookTitle">أحاديث الكتاب</h1>
                    <p class="page-subtitle" id="bookSubtitle">جاري التحميل...</p>
                    <button class="btn-back" onclick="window.location.href='{{ route('thaqalayn') }}'">
                        <span>←</span>
                        <span>العودة إلى الكتب</span>
                    </button>
                </div>
            </header>
            
            <!-- Loading State -->
            <div class="loading-state" id="loadingState">
                <div class="loading-spinner"></div>
                <p>جاري تحميل الأحاديث...</p>
            </div>
            
            <!-- Error State -->
            <div class="error-state" id="errorState" style="display: none;"></div>
            
            <!-- Hadiths List -->
            <section class="book-hadiths-section" id="hadithsSection" style="display: none;">
                <div class="section-header-row">
                    <h2 class="section-title">
                        <span class="title-icon">📚</span>
                        <span id="hadithsCount">الأحاديث</span>
                    </h2>
                    <div class="search-wrapper-inline">
                        <div class="search-icon">🔍</div>
                        <input 
                            type="text" 
                            id="searchInput" 
                            class="search-input" 
                            placeholder="ابحث في الأحاديث..."
                            autocomplete="off">
                        <button class="clear-search" id="clearSearch" style="display: none;">✕</button>
                    </div>
                </div>
                
                <div class="hadiths-list" id="hadithsList"></div>
                
                <div class="empty-state" id="emptyState" style="display: none;">
                    <div class="empty-icon">📖</div>
                    <p class="empty-text">لا توجد أحاديث</p>
                </div>
            </section>
            
        </div>
    </main>
    
    @push('scripts')
        <script src="{{ asset('js/thaqalayn-book.js') }}"></script>
    @endpush
@endsection

