<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'تهجّد - تطبيقك الإسلامي الشامل')</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('assets/images/logo1.png') }}">
    
    <!-- Link CSS Files -->
    <link rel="stylesheet" href="{{ asset('css/root-variables.css') }}">
    <link rel="stylesheet" href="{{ asset('css/global-styles.css') }}">
    <link rel="stylesheet" href="{{ asset('css/animations.css') }}">
    @yield('extra-css')
    
    <!-- Google Fonts - Arabic Support -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body class="emerald-theme">
    
    <!-- Animated Background Particles -->
    <div class="particles-container" id="particles"></div>
    
    <!-- Navigation Bar -->
    <nav class="glass-nav">
        <div class="nav-container">
            <div class="logo"><a href="{{ route('home') }}"><img src="{{ asset('assets/images/tahajad_logo.png') }}" alt="تهجد" class="logo-image"></a></div>
            
            <ul class="nav-links">
                <li><a href="{{ route('home') }}" class="active">الرئيسية</a></li>
                <li><a href="{{ route('prayer-times') }}">مواقيت الصلاة</a></li>
                <li><a href="{{ route('duas') }}">الأدعية</a></li>
                <li><a href="{{ route('challenges') }}">التحديات</a></li>
                <li><a href="{{ route('hijri-calendar') }}">التقويم الهجري</a></li>
                <li><a href="{{ route('self-accountability') }}">محاسبة النفس</a></li>
                <li><a href="{{ route('istikhara') }}">الاستخارة</a></li>
                <li><a href="{{ route('posts') }}">المنشورات</a></li>
                <li><a href="{{ route('leaderthink') }}">فكر القائد</a></li>
                <li><a href="{{ route('thaqalayn') }}">الثقلين</a></li>
                <li><a href="{{ route('quran') }}">القرآن الكريم</a></li>
                <li><a href="{{ route('hyder-ai') }}">اسأل hyder.ai</a></li>
            </ul>
            
            <div class="nav-actions">
                <!-- Theme Switcher -->
                <div class="theme-switcher">
                    <button class="theme-btn" id="themeBtn">
                        <span class="theme-icon">🎨</span>
                    </button>
                    <div class="theme-dropdown" id="themeDropdown">
                        <button class="theme-option" data-theme="emerald">
                            <span class="theme-color" style="background: linear-gradient(135deg, #0d4d3d, #d4af37)"></span>
                            <span>الزمردي</span>
                        </button>
                        <button class="theme-option" data-theme="gold">
                            <span class="theme-color" style="background: linear-gradient(135deg, #c9a961, #1a3a2e)"></span>
                            <span>الذهبي</span>
                        </button>
                        <button class="theme-option" data-theme="ruby">
                            <span class="theme-color" style="background: linear-gradient(135deg, #8b0000, #d4af37)"></span>
                            <span>الياقوتي</span>
                        </button>
                        <button class="theme-option" data-theme="night">
                            <span class="theme-color" style="background: linear-gradient(135deg, #1a1f2e, #2d5f5d)"></span>
                            <span>الليلي</span>
                        </button>
                    </div>
                </div>
                
                <!-- Guest Actions -->
                <div id="guestActions" style="display: none;">
                    <a href="{{ route('login') }}" class="btn-glass btn-login">تسجيل الدخول</a>
                    <a href="{{ route('register') }}" class="btn-primary">إنشاء حساب</a>
                </div>
                
                <!-- User Profile Dropdown -->
                <div class="user-profile-dropdown" id="userActions" style="display: none;">
                    <button class="user-profile-btn" id="userProfileBtn">
                        <div class="user-avatar">
                            <span id="userInitials">م</span>
                        </div>
                        <span class="user-name" id="userName">مستخدم</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    
                    <div class="user-dropdown" id="userDropdown">
                        <a href="{{ route('profile') }}" class="dropdown-item">
                            <span class="item-icon">👤</span>
                            <span>الملف الشخصي</span>
                        </a>
                        <a href="{{ route('settings') }}" class="dropdown-item">
                            <span class="item-icon">⚙️</span>
                            <span>الإعدادات</span>
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item logout-btn" id="logoutBtn">
                            <span class="item-icon">🚪</span>
                            <span>تسجيل الخروج</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    
    <!-- Main Content -->
    <main class="main-content">
        @yield('content')
    </main>
    
    <!-- Logout Confirmation Modal -->
    <div class="logout-modal-overlay" id="logoutModal" style="display: none;">
        <div class="logout-modal">
            <h3>تأكيد تسجيل الخروج</h3>
            <p>هل أنت متأكد من رغبتك في تسجيل الخروج؟</p>
            <div class="logout-modal-actions">
                <button class="btn-primary" id="confirmLogout">نعم، تسجيل الخروج</button>
                <button class="btn-glass" id="cancelLogout">إلغاء</button>
            </div>
        </div>
    </div>
    
    <!-- Scripts -->
    <script src="{{ asset('js/particles.js') }}"></script>
    <script src="{{ asset('js/theme-manager.js') }}"></script>
    <script src="{{ asset('js/mouse-light-tracker.js') }}"></script>
    <script src="{{ asset('js/animations.js') }}"></script>
    <script src="{{ asset('js/api.js') }}"></script>
    <script src="{{ asset('js/navigation.js') }}"></script>
    <script src="{{ asset('js/user-navigation.js') }}"></script>
    <script src="{{ asset('js/auth.js') }}"></script>
    @yield('extra-js')
</body>
</html>
