/* ====================================
   AUTHENTICATION LOGIC
   Login, Registration, and Form Validation
   ==================================== */

class AuthManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        
        if (this.loginForm) {
            this.initLogin();
        }
        
        if (this.registerForm) {
            this.initRegister();
        }
        
        // Initialize password toggles
        this.initPasswordToggles();
    }
    
    // ========== LOGIN INITIALIZATION ==========
    initLogin() {
        this.loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleLogin();
        });
        
        // Real-time validation
        const emailInput = document.getElementById('email');
        const passwordInput = document.getElementById('password');
        
        emailInput?.addEventListener('blur', () => this.validateEmail(emailInput.value, 'emailError'));
        passwordInput?.addEventListener('blur', () => this.validatePassword(passwordInput.value, 'passwordError'));
    }
    
    // ========== REGISTRATION INITIALIZATION ==========
    initRegister() {
        this.registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleRegister();
        });
        
        // Real-time validation
        const fullName = document.getElementById('fullName');
        const regEmail = document.getElementById('regEmail');
        const regPassword = document.getElementById('regPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        fullName?.addEventListener('blur', () => this.validateName(fullName.value));
        regEmail?.addEventListener('blur', () => this.validateEmail(regEmail.value, 'regEmailError'));
        regPassword?.addEventListener('input', () => this.checkPasswordStrength(regPassword.value));
        confirmPassword?.addEventListener('blur', () => this.validatePasswordMatch(regPassword.value, confirmPassword.value));
    }
    
    // ========== LOGIN HANDLER ==========
    async handleLogin() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        // Validate inputs
        if (!this.validateEmail(email, 'emailError') || !this.validatePassword(password, 'passwordError')) {
            return;
        }
        
        // Show loading state
        const loginBtn = document.getElementById('loginBtn');
        this.setButtonLoading(loginBtn, true);
        
        try {
            // Call API
            const response = await window.apiManager.login(email, password, rememberMe);
            
            if (response.success) {
                // Store user data
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userData', JSON.stringify(response.user));
                
                // Show success message
                this.showToast('تم تسجيل الدخول بنجاح! جاري التحويل...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    const dashboardRoute = window.Laravel?.routes?.dashboard || '/dashboard';
                    window.location.href = dashboardRoute;
                }, 1500);
            } else {
                throw new Error(response.message || 'فشل تسجيل الدخول');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
            this.setButtonLoading(loginBtn, false);
        }
    }
    
    // ========== REGISTRATION HANDLER ==========
    async handleRegister() {
        // Get all form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const location = document.getElementById('location').value;
        const prayerNotifications = document.getElementById('prayerNotifications').checked;
        const dailyReminders = document.getElementById('dailyReminders').checked;
        const terms = document.getElementById('terms').checked;
        
        // Validate all fields
        const validations = [
            this.validateName(fullName),
            this.validateEmail(email, 'regEmailError'),
            this.validatePassword(password, 'regPasswordError', true),
            this.validatePasswordMatch(password, confirmPassword),
            this.validateTerms(terms)
        ];
        
        if (!validations.every(v => v)) {
            this.showToast('الرجاء تصحيح الأخطاء في النموذج', 'error');
            return;
        }
        
        // Show loading state
        const registerBtn = document.getElementById('registerBtn');
        this.setButtonLoading(registerBtn, true);
        
        try {
            // Call API
            const response = await window.apiManager.register({
                fullName,
                email,
                phone,
                password,
                location,
                preferences: {
                    prayerNotifications,
                    dailyReminders
                }
            });
            
            if (response.success) {
                // Store user data
                localStorage.setItem('authToken', response.token);
                localStorage.setItem('userData', JSON.stringify(response.user));
                
                // Show success modal
                this.showSuccessModal();
                
                // Redirect to dashboard
                setTimeout(() => {
                    const dashboardRoute = window.Laravel?.routes?.dashboard || '/dashboard';
                    window.location.href = dashboardRoute;
                }, 3000);
            } else {
                throw new Error(response.message || 'فشل إنشاء الحساب');
            }
        } catch (error) {
            this.showToast(error.message, 'error');
            this.setButtonLoading(registerBtn, false);
        }
    }
    
    // ========== VALIDATION METHODS ==========
    
    validateName(name) {
        const nameError = document.getElementById('fullNameError');
        
        if (!name || name.length < 3) {
            this.showError(nameError, 'الاسم يجب أن يكون 3 أحرف على الأقل');
            return false;
        }
        
        if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(name)) {
            this.showError(nameError, 'الاسم يجب أن يحتوي على حروف فقط');
            return false;
        }
        
        this.clearError(nameError);
        return true;
    }
    
    validateEmail(email, errorId) {
        const emailError = document.getElementById(errorId);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            this.showError(emailError, 'البريد الإلكتروني مطلوب');
            return false;
        }
        
        if (!emailRegex.test(email)) {
            this.showError(emailError, 'البريد الإلكتروني غير صحيح');
            return false;
        }
        
        this.clearError(emailError);
        return true;
    }
    
    validatePassword(password, errorId, isRegistration = false) {
        const passwordError = document.getElementById(errorId);
        
        if (!password) {
            this.showError(passwordError, 'كلمة المرور مطلوبة');
            return false;
        }
        
        if (isRegistration && password.length < 8) {
            this.showError(passwordError, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return false;
        }
        
        if (isRegistration && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
            this.showError(passwordError, 'كلمة المرور يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام');
            return false;
        }
        
        this.clearError(passwordError);
        return true;
    }
    
    validatePasswordMatch(password, confirmPassword) {
        const confirmError = document.getElementById('confirmPasswordError');
        
        if (password !== confirmPassword) {
            this.showError(confirmError, 'كلمات المرور غير متطابقة');
            return false;
        }
        
        this.clearError(confirmError);
        return true;
    }
    
    validateTerms(accepted) {
        const termsError = document.getElementById('termsError');
        
        if (!accepted) {
            this.showError(termsError, 'يجب الموافقة على الشروط والأحكام');
            return false;
        }
        
        this.clearError(termsError);
        return true;
    }
    
    // ========== PASSWORD STRENGTH CHECKER ==========
    checkPasswordStrength(password) {
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        if (!strengthFill || !strengthText) return;
        
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        
        // Character variety checks
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z\d]/.test(password)) strength++;
        
        // Calculate strength level
        let level = 'weak';
        let text = 'ضعيفة';
        
        if (strength >= 4) {
            level = 'medium';
            text = 'متوسطة';
        }
        
        if (strength >= 6) {
            level = 'strong';
            text = 'قوية';
        }
        
        // Update UI
        strengthFill.className = `strength-fill ${level}`;
        strengthText.className = `strength-text ${level}`;
        strengthText.textContent = text;
    }
    
    // ========== PASSWORD TOGGLE ==========
    initPasswordToggles() {
        const toggleButtons = document.querySelectorAll('.toggle-password');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const input = button.parentElement.querySelector('input');
                const icon = button.querySelector('.eye-icon');
                
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.textContent = '👁️‍🗨️';
                } else {
                    input.type = 'password';
                    icon.textContent = '👁';
                }
            });
        });
    }
    
    // ========== UI HELPER METHODS ==========
    
    showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.parentElement.querySelector('.form-input')?.classList.add('error');
        }
    }
    
    clearError(errorElement) {
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.parentElement.querySelector('.form-input')?.classList.remove('error');
        }
    }
    
    setButtonLoading(button, loading) {
        if (!button) return;
        
        const btnText = button.querySelector('.btn-text');
        const btnLoader = button.querySelector('.btn-loader');
        
        if (loading) {
            button.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';
        } else {
            button.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        }
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('authToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `auth-toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (!modal) return;
        
        modal.style.display = 'flex';
        
        // Create confetti
        if (window.animationsController) {
            window.animationsController.createConfetti();
        }
    }
}

// ========== STEP VALIDATION FOR REGISTRATION ==========
function validateStep(step) {
    const authManager = window.authManager;
    
    switch(step) {
        case 1:
            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            return authManager.validateName(fullName) && 
                   authManager.validateEmail(email, 'regEmailError');
        
        case 2:
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            return authManager.validatePassword(password, 'regPasswordError', true) &&
                   authManager.validatePasswordMatch(password, confirmPassword);
        
        case 3:
            return true; // Preferences are optional
        
        default:
            return true;
    }
}

// ========== AUTO-FILL DETECTION ==========
class AutoFillDetector {
    constructor() {
        this.inputs = document.querySelectorAll('.form-input');
        this.detectAutoFill();
    }
    
    detectAutoFill() {
        this.inputs.forEach(input => {
            // Check periodically for autofill
            const checkAutoFill = () => {
                if (input.matches(':-webkit-autofill')) {
                    input.classList.add('autofilled');
                }
            };
            
            // Check on load and after a short delay
            setTimeout(checkAutoFill, 100);
            setTimeout(checkAutoFill, 500);
            
            // Also check on animation (some browsers trigger this)
            input.addEventListener('animationstart', (e) => {
                if (e.animationName === 'onAutoFillStart') {
                    input.classList.add('autofilled');
                }
            });
        });
    }
}

// ========== FORGOT PASSWORD ==========
class ForgotPasswordManager {
    constructor() {
        this.initForgotPassword();
    }
    
    initForgotPassword() {
        const forgotLinks = document.querySelectorAll('.forgot-link');
        
        forgotLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.showForgotPasswordModal();
            });
        });
    }
    
    showForgotPasswordModal() {
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content glass-card">
                <h2 class="modal-title">استعادة كلمة المرور</h2>
                <p class="modal-text">أدخل بريدك الإلكتروني وسنرسل لك رابط استعادة كلمة المرور</p>
                
                <form id="forgotPasswordForm" class="auth-form">
                    <div class="form-group">
                        <input 
                            type="email" 
                            id="resetEmail"
                            class="form-input"
                            placeholder="example@email.com"
                            required
                        >
                        <span class="form-error" id="resetEmailError"></span>
                    </div>
                    
                    <button type="submit" class="btn-submit">
                        <span class="btn-text">إرسال رابط الاستعادة</span>
                        <span class="btn-loader" style="display: none;">
                            <span class="loader-spinner"></span>
                        </span>
                    </button>
                </form>
                
                <button class="btn-back" onclick="this.closest('.modal').remove()" style="width: 100%; margin-top: 1rem;">
                    إلغاء
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        const form = modal.querySelector('#forgotPasswordForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleForgotPassword(form);
        });
    }
    
    async handleForgotPassword(form) {
        const email = form.querySelector('#resetEmail').value.trim();
        const submitBtn = form.querySelector('.btn-submit');
        
        // Validate email
        if (!window.authManager.validateEmail(email, 'resetEmailError')) {
            return;
        }
        
        window.authManager.setButtonLoading(submitBtn, true);
        
        try {
            const response = await window.apiManager.resetPassword(email);
            
            if (response.success) {
                window.authManager.showToast('تم إرسال رابط الاستعادة إلى بريدك الإلكتروني', 'success');
                setTimeout(() => {
                    form.closest('.modal').remove();
                }, 2000);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            window.authManager.showToast(error.message, 'error');
            window.authManager.setButtonLoading(submitBtn, false);
        }
    }
}

// ========== SOCIAL LOGIN ==========
class SocialAuthManager {
    constructor() {
        this.initSocialButtons();
    }
    
    initSocialButtons() {
        const googleBtn = document.querySelector('.google-btn');
        const facebookBtn = document.querySelector('.facebook-btn');
        
        googleBtn?.addEventListener('click', () => this.handleGoogleLogin());
        facebookBtn?.addEventListener('click', () => this.handleFacebookLogin());
    }
    
    async handleGoogleLogin() {
        window.authManager.showToast('جاري الاتصال بجوجل...', 'success');
        // TODO: Implement Google OAuth
        // window.location.href = '/api/auth/google';
    }
    
    async handleFacebookLogin() {
        window.authManager.showToast('جاري الاتصال بفيسبوك...', 'success');
        // TODO: Implement Facebook OAuth
        // window.location.href = '/api/auth/facebook';
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
    window.autoFillDetector = new AutoFillDetector();
    window.forgotPasswordManager = new ForgotPasswordManager();
    window.socialAuthManager = new SocialAuthManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, AutoFillDetector, ForgotPasswordManager, SocialAuthManager };
}