<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'تهجّد - تطبيقك الإسلامي الشامل')</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('assets/images/logo1.png') }}">
    
    <!-- Link CSS Files -->
    <link rel="stylesheet" href="{{ asset('css/root-variables.css') }}">
    <link rel="stylesheet" href="{{ asset('css/global-styles.css') }}">
    @stack('styles')
    
    <!-- Google Fonts - Arabic Support -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
    
    @stack('head_scripts')
    
    <!-- Laravel Routes and Config for JavaScript -->
    <script>
        window.Laravel = {
            baseUrl: '{{ url("/") }}',
            routes: {
                home: '{{ route("home") }}',
                dashboard: '{{ route("dashboard") }}',
                login: '{{ route("login") }}',
                register: '{{ route("register") }}',
                prayerTimes: '{{ route("prayer-times") }}',
                duas: '{{ route("duas") }}',
                challenges: '{{ route("challenges") }}',
                hijriCalendar: '{{ route("hijri-calendar") }}',
                selfAccountability: '{{ route("self-accountability") }}',
                istikhara: '{{ route("istikhara") }}',
                postPage: '{{ route("post-page") }}',
                postDetails: '{{ route("post-details") }}',
                leaderthink: '{{ route("leaderthink") }}',
                thaqalayn: '{{ route("thaqalayn") }}',
                thaqalaynBook: '{{ route("thaqalayn-book") }}',
                quran: '{{ route("quran") }}',
                quranSurah: '{{ route("quran-surah") }}',
                hyderAi: '{{ route("hyder-ai") }}',
                maktabaMasmouaa: '{{ route("maktaba-masmouaa") }}',
                settings: '{{ route("settings") }}'
            },
            jsonPaths: {
                ad3iya: '{{ asset("json/ad3iya.json") }}',
                ziyara: '{{ asset("json/ziyara.json") }}',
                taqibat: '{{ asset("json/taqibat.json") }}',
                seerah: '{{ asset("json/seerah.json") }}',
                leaderthink: '{{ asset("json/leaderthink.json") }}',
                eventsLevant: '{{ asset("json/events_levant_1447.json") }}'
            },
            imagePaths: {
                tahajadLogo: '{{ asset("assets/images/tahajad_logo.png") }}',
                logo1: '{{ asset("assets/images/logo1.png") }}',
                quran: '{{ asset("assets/images/quran.jpg") }}',
                aahd: '{{ asset("assets/images/aahd.jpg") }}',
                ziyara: '{{ asset("assets/images/ziyara.jpg") }}',
                adhan: '{{ asset("assets/audio/adhan.mp3") }}'
            }
        };
    </script>
    <script src="{{ asset('js/config.js') }}"></script>
</head>
<body class="emerald-theme @yield('body_class')">
    
    <!-- Animated Background Particles -->
    <div class="particles-container" id="particles"></div>
    
    <!-- Navigation Bar -->
    <nav class="glass-nav">
        <div class="nav-container">
            <div class="logo"><a href="{{ route('home') }}"><img src="{{ asset('assets/images/tahajad_logo.png') }}" alt="تهجد" class="logo-image"></a></div>
            
            <ul class="nav-links">
                <li><a href="{{ route('home') }}" class="{{ request()->routeIs('home') ? 'active' : '' }}">الرئيسية</a></li>
                <li><a href="{{ route('dashboard') }}" class="{{ request()->routeIs('dashboard') ? 'active' : '' }}">لوحة التحكم</a></li>
                <li><a href="{{ route('prayer-times') }}" class="{{ request()->routeIs('prayer-times') ? 'active' : '' }}">مواقيت الصلاة</a></li>
                <li><a href="{{ route('duas') }}" class="{{ request()->routeIs('duas') ? 'active' : '' }}">الأدعية</a></li>
                <li><a href="{{ route('challenges') }}" class="{{ request()->routeIs('challenges') ? 'active' : '' }}">التحديات</a></li>
                <li><a href="{{ route('hijri-calendar') }}" class="{{ request()->routeIs('hijri-calendar') ? 'active' : '' }}">التقويم الهجري</a></li>
                <li><a href="{{ route('self-accountability') }}" class="{{ request()->routeIs('self-accountability') ? 'active' : '' }}">محاسبة النفس</a></li>
                <li><a href="{{ route('istikhara') }}" class="{{ request()->routeIs('istikhara') ? 'active' : '' }}">الاستخارة</a></li>
                <li><a href="{{ route('post-page') }}" class="{{ request()->routeIs('post-page') ? 'active' : '' }}">المنشورات</a></li>
                <li><a href="{{ route('leaderthink') }}" class="{{ request()->routeIs('leaderthink') ? 'active' : '' }}">فكر القائد</a></li>
                <li><a href="{{ route('thaqalayn') }}" class="{{ request()->routeIs('thaqalayn') ? 'active' : '' }}">الثقلين</a></li>
                <li><a href="{{ route('quran') }}" class="{{ request()->routeIs('quran') ? 'active' : '' }}">القرآن الكريم</a></li>
                <li><a href="{{ route('hyder-ai') }}" class="{{ request()->routeIs('hyder-ai') ? 'active' : '' }}">اسأل hyder.ai</a></li>
                <li><a href="{{ route('maktaba-masmouaa') }}" class="{{ request()->routeIs('maktaba-masmouaa') ? 'active' : '' }}">مكتبة مسموعة</a></li>
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
                
                <!-- Not Logged In: Show Login/Register -->
                <div id="guestActions" style="display: none;">
                    <a href="{{ route('login') }}" class="btn-glass btn-login">تسجيل الدخول</a>
                    <a href="{{ route('register') }}" class="btn-primary">إنشاء حساب</a>
                </div>
                
                <!-- Logged In: Show User Profile -->
                <div class="user-profile-dropdown" id="userActions" style="display: none;">
                    <button class="user-profile-btn" id="userProfileBtn">
                        <div class="user-avatar">
                            <span id="userInitials">م</span>
                        </div>
                        <span class="user-name" id="userName">مستخدم</span>
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    
                    <div class="user-dropdown" id="userDropdown">
                        <a href="{{ route('dashboard') }}" class="dropdown-item">
                            <span class="item-icon">📊</span>
                            <span>لوحة التحكم</span>
                        </a>
                        <a href="#" class="dropdown-item">
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
            
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-btn" id="mobileMenuBtn">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
        
        <!-- Mobile Menu Overlay -->
        <div class="mobile-menu-overlay" id="mobileMenuOverlay"></div>
    </nav>
    
    <!-- Main Content -->
    <main>
        @yield('content')
    </main>
    
    <!-- Scripts -->
    <script src="{{ asset('js/navigation.js') }}"></script>
    <script src="{{ asset('js/theme-manager.js') }}"></script>
    <script src="{{ asset('js/particles.js') }}"></script>
    <script src="{{ asset('js/user-navigation.js') }}"></script>
    @stack('scripts')
</body>
</html>

