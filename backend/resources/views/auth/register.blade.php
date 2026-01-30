@extends('layouts.auth')

@section('title', 'إنشاء حساب - تهجّد')

@section('content')
<div class="auth-wrapper">
    
    <!-- Left Side - Illustration -->
    <div class="auth-illustration fade-in-left">
        <div class="illustration-content">
            <div class="mosque-icon">🕌</div>
            <h2 class="illustration-title">انضم إلى مجتمعنا</h2>
            <p class="illustration-text">
                ابدأ رحلتك الروحانية معنا اليوم
                <br>
                وكن جزءاً من عائلة تهجّد
            </p>
            
            <!-- Registration Steps -->
            <div class="registration-steps">
                <div class="step" id="stepIndicator1">
                    <div class="step-number">1</div>
                    <div class="step-text">المعلومات الأساسية</div>
                </div>
                <div class="step" id="stepIndicator2">
                    <div class="step-number">2</div>
                    <div class="step-text">إعدادات الحساب</div>
                </div>
            </div>
            
            <div class="illustration-benefits glass-card">
                <h4>ماذا ستحصل عليه؟</h4>
                <ul class="benefits-list">
                    <li>✨ تتبع صلواتك تلقائياً</li>
                    <li>📿 مكتبة شاملة للأدعية</li>
                    <li>🎯 تحديات يومية محفزة</li>
                    <li>📅 تقويم هجري تفاعلي</li>
                    <li>🏆 شارات وإنجازات</li>
                </ul>
            </div>
        </div>
    </div>
    
    <!-- Right Side - Registration Form -->
    <div class="auth-form-container fade-in-right">
        <div class="auth-form-wrapper glass-card">
            
            <!-- Logo & Title -->
            <div class="auth-header">
                <div class="auth-logo"><a href="{{ route('home') }}"><img src="{{ asset('assets/images/tahajad_logo.png') }}" alt="تهجد" class="logo-image"></a></div>
                <h1 class="auth-title">إنشاء حساب جديد</h1>
                <p class="auth-subtitle">انضم إلينا في دقائق معدودة</p>
            </div>
            
            <!-- Registration Form -->
            <form id="registerForm" class="auth-form" novalidate>
                @csrf
                
                <!-- Full Name -->
                <div class="form-group">
                    <label for="name" class="form-label">
                        <span class="label-icon">👤</span>
                        الاسم الكامل
                    </label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name"
                        class="form-input"
                        placeholder="أدخل اسمك الكامل"
                        required
                        autocomplete="name"
                    >
                    <span class="form-error" id="nameError"></span>
                </div>
                
                <!-- Email -->
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
                
                <!-- Location (Optional) -->
                <div class="form-group">
                    <label for="location" class="form-label">
                        <span class="label-icon">📍</span>
                        المنطقة/الدولة (اختياري)
                    </label>
                    <input 
                        type="text" 
                        id="location" 
                        name="location"
                        class="form-input"
                        placeholder="مثال: السعودية"
                        autocomplete="off"
                    >
                    <span class="form-error" id="locationError"></span>
                </div>
                
                <!-- Password -->
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
                            autocomplete="new-password"
                            minlength="8"
                        >
                        <button type="button" class="toggle-password" id="togglePassword">
                            <span class="eye-icon">👁</span>
                        </button>
                    </div>
                    <span class="form-error" id="passwordError"></span>
                    
                    <!-- Password Strength Indicator -->
                    <div class="password-strength">
                        <div class="strength-bar">
                            <div class="strength-fill" id="strengthFill"></div>
                        </div>
                        <span class="strength-text" id="strengthText">ضعيفة</span>
                    </div>
                </div>
                
                <!-- Confirm Password -->
                <div class="form-group">
                    <label for="password_confirmation" class="form-label">
                        <span class="label-icon">🔐</span>
                        تأكيد كلمة المرور
                    </label>
                    <input 
                        type="password" 
                        id="password_confirmation" 
                        name="password_confirmation"
                        class="form-input"
                        placeholder="••••••••"
                        required
                        autocomplete="new-password"
                    >
                    <span class="form-error" id="confirmError"></span>
                </div>
                
                <!-- Terms & Conditions -->
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="terms" name="terms" required>
                        <span class="checkbox-custom"></span>
                        <span>أوافق على <a href="#" class="terms-link">شروط الاستخدام</a> و<a href="#" class="terms-link">سياسة الخصوصية</a></span>
                    </label>
                    <span class="form-error" id="termsError"></span>
                </div>
                
                <!-- Submit Button -->
                <button type="submit" class="btn-submit" id="registerBtn">
                    <span class="btn-text">إنشاء الحساب</span>
                    <span class="btn-loader" style="display: none;">
                        <span class="loader-spinner"></span>
                    </span>
                </button>
                
            </form>
            
            <!-- Login Link -->
            <div class="auth-footer">
                <p>لديك حساب بالفعل؟ 
                    <a href="{{ route('login') }}" class="auth-link">تسجيل الدخول</a>
                </p>
            </div>
            
        </div>
    </div>
    
</div>
@endsection

@section('extra-js')
<script src="{{ asset('js/auth.js') }}"></script>
<script>
    // Toggle password visibility
    document.getElementById('togglePassword').addEventListener('click', (e) => {
        e.preventDefault();
        const passwordInput = document.getElementById('password');
        const isPassword = passwordInput.type === 'password';
        passwordInput.type = isPassword ? 'text' : 'password';
    });
    
    // Password strength indicator
    document.getElementById('password').addEventListener('input', (e) => {
        const password = e.target.value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        
        const percentages = ['0%', '25%', '50%', '75%', '100%'];
        const texts = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً'];
        const colors = ['#e74c3c', '#e67e22', '#f39c12', '#27ae60', '#2ecc71'];
        
        strengthFill.style.width = percentages[strength];
        strengthFill.style.backgroundColor = colors[strength];
        strengthText.textContent = texts[strength];
    });
    
    // Handle form submission
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('password_confirmation').value;
        const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        
        if (password !== confirmPassword) {
            document.getElementById('confirmError').textContent = 'كلمات المرور غير متطابقة';
            return;
        }
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const location = document.getElementById('location').value.trim() || null;
        const registerBtn = document.getElementById('registerBtn');
        const btnText = registerBtn.querySelector('.btn-text');
        const btnLoader = registerBtn.querySelector('.btn-loader');
        
        // Validation
        if (!name || !email || !password) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }
        
        try {
            registerBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({ 
                    name: name, 
                    email: email, 
                    password: password, 
                    location: location 
                })
            });
            
            const data = await response.json();
            
            console.log('Register response:', data);
            
            if (response.ok && data.success) {
                // Save auth data
                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                }
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                
                console.log('Registration successful, redirecting...');
                // Redirect to home
                window.location.href = '/';
            } else if (response.ok && data.token) {
                // Handle case where success is not explicitly set
                localStorage.setItem('authToken', data.token);
                if (data.user) {
                    localStorage.setItem('userData', JSON.stringify(data.user));
                }
                window.location.href = '/';
            } else {
                const errorMsg = data.message || data.error || 'فشل إنشاء الحساب';
                alert(errorMsg);
                console.error('Registration failed:', data);
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('حدث خطأ في إنشاء الحساب: ' + error.message);
        } finally {
            registerBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
</script>
@endsection
