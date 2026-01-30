@extends('layouts.app')

@section('title', 'تهجّد - تطبيقك الإسلامي الشامل')

@section('extra-css')
<link rel="stylesheet" href="{{ asset('css/landing-page.css') }}">
@endsection

@section('content')
<!-- Hero Section -->
<section class="hero-section">
    <div class="hero-content">
        <div class="hero-text fade-in-up">
            <h1 class="hero-title">
                <span class="title-line">رحلتك الروحانية</span>
                <span class="title-line">تبدأ هنا</span>
            </h1>
            <p class="hero-subtitle">
                تطبيقك الشامل للصلاة، الأذكار، والتحديات اليومية
                <br>
                اجعل كل يوم فرصة للتقرب إلى الله
            </p>
            
            <div class="hero-buttons">
                <a href="{{ route('register') }}" class="btn-hero-primary">
                    <span>ابدأ الآن</span>
                    <span class="btn-arrow">←</span>
                </a>
                <a href="#features" class="btn-hero-secondary">
                    <span>اكتشف المزايا</span>
                </a>
            </div>
            
            <!-- Quick Stats -->
            <div class="hero-stats">
                <div class="stat-item glass-card">
                    <span class="stat-number">10K+</span>
                    <span class="stat-label">مستخدم نشط</span>
                </div>
                <div class="stat-item glass-card">
                    <span class="stat-number">500+</span>
                    <span class="stat-label">دعاء وذكر</span>
                </div>
                <div class="stat-item glass-card">
                    <span class="stat-number">50+</span>
                    <span class="stat-label">تحدي يومي</span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
        <div class="mouse">
            <div class="wheel"></div>
        </div>
        <span>اكتشف المزيد</span>
    </div>
</section>

<!-- Features Section -->
<section class="features-section" id="features">
    <div class="container">
        <div class="section-header fade-in-up">
            <h2 class="section-title">مميزات التطبيق</h2>
            <p class="section-subtitle">كل ما تحتاجه لرحلة روحانية متكاملة</p>
        </div>
        
        <div class="features-grid">
            <!-- Feature 1: Prayer Times -->
            <div class="feature-card glass-card hover-lift">
                <div class="feature-icon">🕌</div>
                <h3 class="feature-title">مواقيت الصلاة</h3>
                <p class="feature-description">
                    مواقيت دقيقة لجميع الصلوات حسب موقعك مع تنبيهات قبل الأذان
                </p>
                <a href="{{ route('prayer-times') }}" class="feature-link">
                    <span>اعرف المزيد</span>
                    <span class="arrow">←</span>
                </a>
            </div>
            
            <!-- Feature 2: Duas Collection -->
            <div class="feature-card glass-card hover-lift">
                <div class="feature-icon">📿</div>
                <h3 class="feature-title">مكتبة الأدعية</h3>
                <p class="feature-description">
                    مجموعة شاملة من الأدعية والأذكار مع إمكانية الاستماع والحفظ
                </p>
                <a href="{{ route('duas') }}" class="feature-link">
                    <span>تصفح الأدعية</span>
                    <span class="arrow">←</span>
                </a>
            </div>
            
            <!-- Feature 3: Challenges -->
            <div class="feature-card glass-card hover-lift">
                <div class="feature-icon">🎯</div>
                <h3 class="feature-title">التحديات اليومية</h3>
                <p class="feature-description">
                    تحديات الصلاة، أذكار الصباح الـ40، وتحديات الأدعية لتحفيزك
                </p>
                <a href="{{ route('challenges') }}" class="feature-link">
                    <span>ابدأ التحدي</span>
                    <span class="arrow">←</span>
                </a>
            </div>
            
            <!-- Feature 4: Hijri Calendar -->
            <div class="feature-card glass-card hover-lift">
                <div class="feature-icon">📅</div>
                <h3 class="feature-title">التقويم الهجري</h3>
                <p class="feature-description">
                    تقويم هجري شامل مع تمييز الأيام المباركة والمناسبات الإسلامية
                </p>
                <a href="{{ route('hijri-calendar') }}" class="feature-link">
                    <span>شاهد التقويم</span>
                    <span class="arrow">←</span>
                </a>
            </div>
            
            <!-- Feature 5: Khirah Tracker -->
            <div class="feature-card glass-card hover-lift">
                <div class="feature-icon">💚</div>
                <h3 class="feature-title">محاسبة النفس</h3>
                <p class="feature-description">
                    حاسب نفسك قبل أن تُحاسب - سجل أعمالك الصالحة والسيئة وطور نفسك يومياً
                </p>
                <a href="{{ route('self-accountability') }}" class="feature-link">
                    <span>ابدأ المحاسبة</span>
                    <span class="arrow">←</span>
                </a>
            </div>
            
            <!-- Feature 6: Istikhara -->
            <div class="feature-card glass-card hover-lift">
                <div class="feature-icon">🤲</div>
                <h3 class="feature-title">الاستخارة بالقرآن</h3>
                <p class="feature-description">
                    استخر لله في أمورك المباحة واطلب الهداية من القرآن الكريم
                </p>
                <a href="{{ route('istikhara') }}" class="feature-link">
                    <span>ابدأ الاستخارة</span>
                    <span class="arrow">←</span>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="cta-section">
    <div class="cta-content glass-card">
        <h2 class="cta-title">ابدأ رحلتك الروحانية اليوم</h2>
        <p class="cta-description">
            انضم إلى آلاف المسلمين الذين يستخدمون تهجّد لتحسين علاقتهم بالله
        </p>
        <a href="{{ route('register') }}" class="btn-cta">
            <span>إنشاء حساب مجاني</span>
            <span class="btn-arrow">←</span>
        </a>
    </div>
</section>
@endsection

@section('extra-js')
<script src="{{ asset('js/logo-loader.js') }}"></script>
<script src="{{ asset('js/prayer-times.js') }}"></script>
@endsection
