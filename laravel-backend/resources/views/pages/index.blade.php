@extends('layouts.app')

@section('title', 'تهجّد - تطبيقك الإسلامي الشامل')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/landing-page.css') }}">
<link rel="stylesheet" href="{{ asset('css/animations.css') }}">
@endpush

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
            
            <!-- Feature 7: Achievements -->
            <div class="feature-card glass-card hover-lift">
                <div class="feature-icon">🏆</div>
                <h3 class="feature-title">الإنجازات والشارات</h3>
                <p class="feature-description">
                    اكسب شارات وإنجازات مع كل تحدي تكمله وعمل صالح تقوم به
                </p>
                <a href="{{ route('dashboard') }}" class="feature-link">
                    <span>شاهد إنجازاتك</span>
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

<!-- Footer -->
<footer class="footer">
    <div class="footer-content">
        <div class="footer-section">
            <h3 class="footer-title">تهجّد</h3>
            <p class="footer-text">تطبيقك الإسلامي الشامل للصلاة والأذكار</p>
        </div>
        
        <div class="footer-section">
            <h4 class="footer-heading">روابط سريعة</h4>
            <ul class="footer-links">
                <li><a href="#">من نحن</a></li>
                <li><a href="#">تواصل معنا</a></li>
                <li><a href="#">سياسة الخصوصية</a></li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h4 class="footer-heading">المميزات</h4>
            <ul class="footer-links">
                <li><a href="{{ route('prayer-times') }}">مواقيت الصلاة</a></li>
                <li><a href="{{ route('duas') }}">الأدعية</a></li>
                <li><a href="{{ route('challenges') }}">التحديات</a></li>
                <li><a href="{{ route('hijri-calendar') }}">التقويم الهجري</a></li>
            </ul>
        </div>
        
        <div class="footer-section">
            <h4 class="footer-heading">تابعنا</h4>
            <div class="social-links">
                <a href="#" class="social-link">📘</a>
                <a href="#" class="social-link">📷</a>
                <a href="#" class="social-link">🐦</a>
            </div>
        </div>
    </div>
    
    <div class="footer-bottom">
        <p>&copy; 2024 تهجّد. جميع الحقوق محفوظة.</p>
    </div>
</footer>
@endsection

@push('scripts')
<script src="{{ asset('js/logo-loader.js') }}"></script>
<script src="{{ asset('js/animations.js') }}"></script>
<script src="{{ asset('js/mouse-light-tracker.js') }}"></script>
<script>
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    const guestActions = document.getElementById('guestActions');
    const userActions = document.getElementById('userActions');
    
    if (userData) {
        if (userActions) userActions.style.display = 'flex';
        if (guestActions) guestActions.style.display = 'none';
        
        const user = JSON.parse(userData);
        const userName = document.getElementById('userName');
        const userInitials = document.getElementById('userInitials');
        
        if (userName) userName.textContent = user.name || 'مستخدم';
        if (userInitials) {
            const names = (user.name || 'م').trim().split(' ');
            if (names.length >= 2) {
                userInitials.textContent = names[0].charAt(0) + names[1].charAt(0);
            } else {
                userInitials.textContent = (user.name || 'م').charAt(0);
            }
        }
        
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    localStorage.removeItem('userData');
                    localStorage.removeItem('authToken');
                    window.location.href = '{{ route("home") }}';
                }
            });
        }
    } else {
        if (guestActions) guestActions.style.display = 'flex';
        if (userActions) userActions.style.display = 'none';
    }
</script>
@endpush

