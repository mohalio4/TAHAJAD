@extends('layouts.app')

@section('title', 'قراءة السورة - القرآن الكريم - تهجّد')

@push('styles')
    <link rel="stylesheet" href="{{ asset('css/quran.css') }}">
    <link rel="stylesheet" href="{{ asset('css/quran-surah.css') }}">
@endpush

@section('body_class', 'quran-page')

@section('content')
    <!-- Main Content -->
    <main class="quran-main">
        <div class="quran-container">
            
            <!-- Surah Header -->
            <header class="surah-reader-header fade-in-up">
                <button class="btn-back" onclick="window.location.href='{{ route('quran') }}'">
                    <span>←</span>
                    <span>العودة إلى السور</span>
                </button>
                
                <div class="surah-title-section">
                    <h1 class="surah-title" id="surahTitle">جاري التحميل...</h1>
                    <p class="surah-info" id="surahInfo"></p>
                </div>
            </header>
            
            <!-- Loading State -->
            <div class="loading-state" id="loadingState">
                <div class="loading-spinner"></div>
                <p>جاري تحميل السورة...</p>
            </div>
            
            <!-- Error State -->
            <div class="error-state" id="errorState" style="display: none;"></div>
            
            <!-- Surah Content -->
            <section class="surah-content-section" id="surahContentSection" style="display: none;">
                <div class="verses-container" id="versesContainer">
                    <!-- Verses will be populated by JavaScript -->
                </div>
            </section>
            
            <!-- Navigation Footer -->
            <footer class="surah-navigation" id="surahNavigation" style="display: none;">
                <button class="nav-btn prev-btn" id="btnPrevSurah">
                    <span>←</span>
                    <span>الصفحة السابقة</span>
                </button>
                <div class="page-navigation">
                    <input 
                        type="number" 
                        id="pageInput" 
                        class="page-input" 
                        min="1" 
                        max="604" 
                        placeholder="رقم الصفحة"
                        value="1">
                    <span class="page-total">من 604</span>
                </div>
                <div class="surah-selector">
                    <select id="surahSelector" class="surah-select">
                        <option value="">اختر سورة</option>
                        <!-- Options will be populated by JavaScript -->
                    </select>
                </div>
                <button class="nav-btn next-btn" id="btnNextSurah">
                    <span>الصفحة التالية</span>
                    <span>→</span>
                </button>
            </footer>
            
        </div>
    </main>
    
    @push('scripts')
        <script src="{{ asset('js/quran-surah.js') }}"></script>
    @endpush
@endsection

