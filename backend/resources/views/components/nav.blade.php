<!-- Navigation Bar -->
<nav class="glass-nav">
    <div class="nav-container">
        <div class="logo">
            <a href="{{ route('home') }}">
                <img src="{{ asset('assets/images/tahajad_logo.png') }}" alt="تهجد" class="logo-image">
            </a>
        </div>
        
        <ul class="nav-links">
            <li><a href="{{ route('home') }}" class="@if(Route::currentRouteName() === 'home') active @endif">الرئيسية</a></li>
            <li><a href="{{ route('prayer-times') }}" class="@if(Route::currentRouteName() === 'prayer-times') active @endif">مواقيت الصلاة</a></li>
            <li><a href="{{ route('duas') }}" class="@if(Route::currentRouteName() === 'duas') active @endif">الأدعية</a></li>
            <li><a href="{{ route('challenges') }}" class="@if(Route::currentRouteName() === 'challenges') active @endif">التحديات</a></li>
            <li><a href="{{ route('hijri-calendar') }}" class="@if(Route::currentRouteName() === 'hijri-calendar') active @endif">التقويم الهجري</a></li>
            <li><a href="{{ route('self-accountability') }}" class="@if(Route::currentRouteName() === 'self-accountability') active @endif">محاسبة النفس</a></li>
            <li><a href="{{ route('istikhara') }}" class="@if(Route::currentRouteName() === 'istikhara') active @endif">الاستخارة</a></li>
            <li><a href="{{ route('posts') }}" class="@if(Route::currentRouteName() === 'posts') active @endif">المنشورات</a></li>
            <li><a href="{{ route('leaderthink') }}" class="@if(Route::currentRouteName() === 'leaderthink') active @endif">فكر القائد</a></li>
            <li><a href="{{ route('thaqalayn') }}" class="@if(Route::currentRouteName() === 'thaqalayn') active @endif">الثقلين</a></li>
            <li><a href="{{ route('quran') }}" class="@if(Route::currentRouteName() === 'quran') active @endif">القرآن الكريم</a></li>
            <li><a href="{{ route('hyder-ai') }}" class="@if(Route::currentRouteName() === 'hyder-ai') active @endif">اسأل hyder.ai</a></li>
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
            <div id="guestActions">
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
            
            <!-- Mobile Menu Toggle -->
            <button class="mobile-menu-toggle" id="mobileMenuToggle">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </div>
</nav>
