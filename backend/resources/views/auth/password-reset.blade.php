@extends('layouts.auth')

@section('title', 'استعادة كلمة المرور - تهجّد')

@section('content')
<div class="auth-wrapper">
    
    <!-- Left Side - Illustration -->
    <div class="auth-illustration fade-in-left">
        <div class="illustration-content">
            <div class="mosque-icon">🔑</div>
            <h2 class="illustration-title">استعادة حسابك</h2>
            <p class="illustration-text">
                لا تقلق! سنساعدك على استعادة الوصول
                <br>
                إلى حسابك في تهجّد
            </p>
            
            <div class="illustration-features">
                <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>إرسال رابط إعادة تعيين</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>تأكيد هويتك بسهولة</span>
                </div>
                <div class="feature-item">
                    <span class="feature-icon">✓</span>
                    <span>تعيين كلمة مرور جديدة</span>
                </div>
            </div>
            
            <div class="illustration-stats glass-card">
                <div class="stat">
                    <span class="stat-value">2 دقيقة</span>
                    <span class="stat-label">الوقت المتوقع</span>
                </div>
                <div class="stat">
                    <span class="stat-value">100%</span>
                    <span class="stat-label">آمن</span>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Right Side - Password Reset Form -->
    <div class="auth-form-container fade-in-right">
        <div class="auth-form-wrapper glass-card">
            
            <!-- Logo & Title -->
            <div class="auth-header">
                <div class="auth-logo"><a href="{{ route('home') }}"><img src="{{ asset('assets/images/tahajad_logo.png') }}" alt="تهجد" class="logo-image"></a></div>
                <h1 class="auth-title">استعادة كلمة المرور</h1>
                <p class="auth-subtitle">أدخل بريدك الإلكتروني لإرسال رابط الإعادة</p>
            </div>
            
            <!-- Password Reset Form -->
            <form id="passwordResetForm" class="auth-form" action="{{ route('api.password.reset') }}" method="POST" novalidate>
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
                
                <!-- Submit Button -->
                <button type="submit" class="btn-submit" id="resetBtn">
                    <span class="btn-text">إرسال رابط الإعادة</span>
                    <span class="btn-loader" style="display: none;">
                        <span class="loader-spinner"></span>
                    </span>
                </button>
                
            </form>
            
            <!-- Back to Login -->
            <div class="auth-footer">
                <p>تذكرت كلمة المرور؟ 
                    <a href="{{ route('login') }}" class="auth-link">العودة للدخول</a>
                </p>
            </div>
            
        </div>
    </div>
    
</div>
@endsection

@section('extra-js')
<script>
    // Handle form submission
    document.getElementById('passwordResetForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const resetBtn = document.getElementById('resetBtn');
        const btnText = resetBtn.querySelector('.btn-text');
        const btnLoader = resetBtn.querySelector('.btn-loader');
        
        try {
            resetBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-block';
            
            const response = await fetch('{{ route("api.password.reset") }}', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
                setTimeout(() => {
                    window.location.href = '{{ route("login") }}';
                }, 1000);
            } else {
                alert(data.message || 'حدث خطأ في إرسال الرابط');
            }
        } catch (error) {
            alert('حدث خطأ في معالجة طلبك');
            console.error(error);
        } finally {
            resetBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    });
</script>
@endsection
