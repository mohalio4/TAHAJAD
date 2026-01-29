@extends('layouts.app')

@section('title', 'فكر القائد - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/leaderthink.css') }}">
@endpush

@section('body_class', 'leaderthink-page')

@section('content')
    <!-- Main Content -->
    <main class="leaderthink-main">
        <div class="leaderthink-container">
            
            <!-- Page Header -->
            <header class="leaderthink-header fade-in-up">
                <div class="header-content glass-card">
                    <img src="{{ asset('assets/images/leader.avif') }}" alt="فكر القائد" class="header-background-image">
                    <div class="header-overlay"></div>
                    <div class="header-text-content">
                        <div class="header-icon">💭</div>
                        <h1 class="page-title">فكر القائد</h1>
                        <p class="page-subtitle">مكتبة شاملة لأفكار وتكليفات الإمام الخامنئي</p>
                    </div>
                </div>
            </header>
            
            <!-- Search and Filter Section -->
            <section class="search-section fade-in-up delay-1">
                <div class="search-container glass-card">
                    <div class="search-wrapper">
                        <div class="search-icon">🔍</div>
                        <input 
                            type="text" 
                            id="searchInput" 
                            class="search-input" 
                            placeholder="ابحث في الأفكار والتكليفات..."
                            autocomplete="off">
                        <button class="clear-search" id="clearSearch" style="display: none;">✕</button>
                    </div>
                    
                    <div class="filter-wrapper">
                        <label for="sectionFilter" class="filter-label">
                            <span class="filter-icon">📚</span>
                            <span>اختر القسم:</span>
                        </label>
                        <select id="sectionFilter" class="filter-select">
                            <option value="">جميع الأقسام</option>
                        </select>
                    </div>
                    
                    <div class="results-info" id="resultsInfo">
                        <span id="resultsCount">0</span> نتيجة
                    </div>
                </div>
            </section>
            
            <!-- Content Display Area -->
            <section class="content-section" id="contentSection">
                <div class="loading-state" id="loadingState">
                    <div class="loading-spinner"></div>
                    <p>جاري تحميل المحتوى...</p>
                </div>
                
                <div class="empty-state" id="emptyState" style="display: none;">
                    <div class="empty-icon">📖</div>
                    <p>لم يتم العثور على نتائج</p>
                    <p class="empty-hint">جرب البحث بكلمات مختلفة أو اختر قسمًا آخر</p>
                </div>
                
                <div class="ideas-container" id="ideasContainer" style="display: none;"></div>
            </section>
            
        </div>
    </main>
    
    @push('scripts')
        <script src="{{ asset('js/leaderthink.js') }}"></script>
    @endpush
@endsection

