@extends('layouts.auth')

@section('title', 'تسجيل الدخول - تهجّد')

@section('content')
<div class="auth-wrapper">
    
    <!-- Left Side - Illustration -->
    <div class="auth-illustration fade-in-left">
        <div class="illustration-content">
            <div class="mosque-icon">🕌</div>
            <h2 class="illustration-title">مرحباً بعودتك</h2>
            <p class="illustration-text">
                استمر في رحلتك الروحانية معنا
                <br>
                وواصل تحدياتك اليومية
            </p>
            
            <div class="illustration-features">
                <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>تتبع صلواتك اليومية</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>أكمل تحدي الأذكار</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>سجل أعمالك الصالحة</span>
                </div>
            </div>
            
            <div class="illustration-stats glass-card">
                <div class="stat">
                    <span class="stat-value">10K+</span>
                    <span class="stat-label">مستخدم نشط</span>
                </div>
                <div class="stat">
                    <span class="stat-value">1M+</span>
                    <span class="stat-label">صلاة مكتملة</span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Right Side - Login Form -->
    <div class="auth-form-container fade-in-right">
        <div class="auth-form-wrapper glass-card">
            
            <!-- Logo & Title -->
            <div class="auth-header">
                <div class="auth-logo"><a href="{{ route('home') }}"><img src="{{ asset('assets/images/tahajad_logo.png') }}" alt="تهجد" class="logo-image"></a></div>
                <h1 class="auth-title">تسجيل الدخول</h1>
                <p class="auth-subtitle">ادخل إلى حسابك لمتابعة رحلتك</p>
            </div>
            
            <!-- Login Form -->
            <form id="loginForm" class="auth-form" novalidate>
                @csrf
                
                <!-- Email Field -->
                <div class="form-group">
                    <label for="email" class="form-label">
                        <span class="label-icon">📧</span>
                        البريد الإلكتروني
                    </label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email"
                        class="form-input"
                        placeholder="example@email.com"
                        required
                        autocomplete="email"
                    >
                    <span class="form-error" id="emailError"></span>
                </div>
                
                <!-- Password Field -->
                <div class="form-group">
                    <label for="password" class="form-label">
                        <span class="label-icon">🔒</span>
                        كلمة المرور
                    </label>
                    <div class="password-input-wrapper">
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            class="form-input"
                            placeholder="••••••••"
                            required
                            autocomplete="current-password"
                        >
                        <button type="button" class="toggle-password" id="togglePassword">
                            <span class="eye-icon">👁</span>
                        </button>
                    </div>
                    <span class="form-error" id="passwordError"></span>
                </div>
                
                <!-- Remember & Forgot -->
                <div class="form-options">
                    <label class="checkbox-label">
                        <input type="checkbox" id="rememberMe" name="rememberMe">
                        <span class="checkbox-custom"></span>
                        <span>تذكرني</span>
                    </label>
                    
                    <a href="{{ route('password.request') }}" class="forgot-link">
                        نسيت كلمة المرور؟
                    </a>
                </div>
                
                <!-- Submit Button -->
                <button type="submit" class="btn-submit" id="loginBtn">
                    <span class="btn-text">تسجيل الدخول</span>
                    <span class="btn-loader" style="display: none;">
                        <span class="loader-spinner"></span>
                    </span>
                </button>
                
            </form>
            
            <!-- Register Link -->
            <div class="auth-footer">
                <p>ليس لديك حساب؟ 
                    <a href="{{ route('register') }}" class="auth-link">إنشاء حساب جديد</a>
                </p>
            </div>
            
        </div>
    </div>
    
</div>
@endsection

@section('extra-js')
<script>
    // Handle form submission
    const loginUrl = @json(route('api.login'));

    const showToast = (message, type = 'error') => {
        const toast = document.getElementById('authToast');
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('is-success', 'is-error', 'is-visible');
        toast.classList.add(type === 'success' ? 'is-success' : 'is-error', 'is-visible');
        setTimeout(() => {
            toast.classList.remove('is-visible');
        }, 3000);
    };

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn.querySelector('.btn-text');
        const btnLoader = loginBtn.querySelector('.btn-loader');
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        // Validation
        if (!email || !password) {
            showToast('يرجى ملء جميع الحقول', 'error');
            return;
        }
        
        try {
            loginBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            
            const response = await fetch(loginUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    email: email, 
                    password: password 
                })
            });
            
            const data = await response.json();
            
            console.log('Login response:', data);
            
            if (response.ok && data.success) {
                // Save auth data
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                // Initialize session manager
                if (window.sessionManager) {
                    window.sessionManager.startSession(data.user);
                }
                
                showToast('تم تسجيل الدخول بنجاح', 'success');
                console.log('Login successful, redirecting...');
                // Redirect to home
                window.location.href = '/';
            } else if (response.ok && data.token) {
                // Handle case where success is not explicitly set
                localStorage.setItem('authToken', data.token);
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                // Initialize session manager
                if (window.sessionManager) {
                    window.sessionManager.startSession(data.user);
                }
                
                showToast('تم تسجيل الدخول بنجاح', 'success');
                window.location.href = '/';
            } else {
                const errorMsg = data.message || data.error || 'فشل تسجيل الدخول';
                showToast(errorMsg, 'error');
                console.error('Login failed:', data);
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('حدث خطأ في تسجيل الدخول: ' + error.message, 'error');
        } finally {
            loginBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
    
    // Toggle password visibility
    document.getElementById('togglePassword').addEventListener('click', (e) => {
        e.preventDefault();
        const passwordInput = document.getElementById('password');
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
    });
</script>
@endsection
