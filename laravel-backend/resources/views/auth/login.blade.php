@extends('layouts.app')

@section('title', 'تسجيل الدخول - تهجّد')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/auth-pages.css') }}">
<link rel="stylesheet" href="{{ asset('css/animations.css') }}">
@endpush

@section('content')
<!-- Auth Background Pattern -->
<div class="auth-background">
    <div class="pattern-overlay"></div>
</div>

<!-- Back to Home Button -->
<a href="{{ route('home') }}" class="back-home">
    <span class="back-icon">→</span>
    <span>العودة للرئيسية</span>
</a>

<!-- Main Auth Container -->
<div class="auth-container">
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
                <form id="loginForm" class="auth-form" action="{{ route('login') }}" method="POST" novalidate>
                    @csrf
                    
                    <!-- Email Field -->
                    <div class="form-group">
                        <label for="email" class="form-label">
                            <span class="label-icon">📧</span>
                            البريد الإلكتروني
                        </label>
                        <input type="email" id="email" name="email" class="form-input" placeholder="example@email.com" required>
                        @error('email')
                            <span class="error-message">{{ $message }}</span>
                        @enderror
                    </div>
                    
                    <!-- Password Field -->
                    <div class="form-group">
                        <label for="password" class="form-label">
                            <span class="label-icon">🔒</span>
                            كلمة المرور
                        </label>
                        <input type="password" id="password" name="password" class="form-input" placeholder="••••••••" required>
                        @error('password')
                            <span class="error-message">{{ $message }}</span>
                        @enderror
                    </div>
                    
                    <!-- Remember Me & Forgot Password -->
                    <div class="form-options">
                        <label class="checkbox-label">
                            <input type="checkbox" name="remember" id="remember">
                            <span>تذكرني</span>
                        </label>
                        <a href="#" class="forgot-password">نسيت كلمة المرور؟</a>
                    </div>
                    
                    <!-- Submit Button -->
                    <button type="submit" class="btn-auth-primary">
                        <span>تسجيل الدخول</span>
                        <span class="btn-arrow">←</span>
                    </button>
                    
                    <!-- Register Link -->
                    <div class="auth-footer">
                        <p>ليس لديك حساب؟ <a href="{{ route('register') }}">إنشاء حساب جديد</a></p>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection

@push('scripts')
<script src="{{ asset('js/auth.js') }}"></script>
@endpush

