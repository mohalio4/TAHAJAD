/* ====================================
   UNIVERSAL USER NAVIGATION HANDLER
   Shows guest/user actions dynamically
   ==================================== */

(function() {
    'use strict';
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUserNavigation);
    } else {
        initUserNavigation();
    }
    
    function initUserNavigation() {
        // Check if user is logged in
        const userData = localStorage.getItem('userData');
        const navActions = document.querySelector('.nav-actions');
        
        if (!navActions) return;
        
        // Check if we already have the dual structure
        let guestActions = document.getElementById('guestActions');
        let userActions = document.getElementById('userActions');
        
        // If not, check if we have the old structure and update it
        if (!guestActions && !userActions) {
            const userProfileDropdown = navActions.querySelector('.user-profile-dropdown');
            
            if (userProfileDropdown && !userProfileDropdown.id) {
                // Old structure - wrap it and add guest actions
                userProfileDropdown.id = 'userActions';
                userActions = userProfileDropdown;
                
                // Create guest actions
                const guestDiv = document.createElement('div');
                guestDiv.id = 'guestActions';
                guestDiv.style.display = 'none';
                guestDiv.innerHTML = `
                    <a href="login_page.html" class="btn-glass btn-login">تسجيل الدخول</a>
                    <a href="register_page.html" class="btn-primary">إنشاء حساب</a>
                `;
                
                // Insert before user actions
                navActions.insertBefore(guestDiv, userActions);
                guestActions = guestDiv;
            }
        }
        
        if (userData) {
            // User is logged in - show profile
            if (userActions) userActions.style.display = 'flex';
            if (guestActions) guestActions.style.display = 'none';
            
            // Set user info
            try {
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
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
            
            // Setup logout functionality if not already setup
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn && !logoutBtn.hasAttribute('data-setup')) {
                logoutBtn.setAttribute('data-setup', 'true');
                logoutBtn.addEventListener('click', handleLogout);
            }
            
            // Setup profile dropdown toggle
            const userProfileBtn = document.getElementById('userProfileBtn');
            const userDropdown = document.getElementById('userDropdown');
            
            if (userProfileBtn && userDropdown && !userProfileBtn.hasAttribute('data-setup')) {
                userProfileBtn.setAttribute('data-setup', 'true');
                userProfileBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    userDropdown.classList.toggle('show');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!userProfileBtn.contains(e.target)) {
                        userDropdown.classList.remove('show');
                    }
                });
            }
            
        } else {
            // User is NOT logged in - show login/register
            if (guestActions) guestActions.style.display = 'flex';
            if (userActions) userActions.style.display = 'none';
            
            // For pages that require login, redirect to login
            const requiresAuth = document.body.classList.contains('dashboard-page') ||
                                document.body.classList.contains('prayer-times-page') ||
                                document.body.classList.contains('duas-page') ||
                                document.body.classList.contains('challenges-page') ||
                                document.body.classList.contains('hijri-calendar-page') ||
                                document.body.classList.contains('khirah-page') ||
                                document.body.classList.contains('istikhara-page') ||
                                document.body.classList.contains('posts-page');
            
            // Don't redirect from landing/login/register pages
            const currentPage = window.location.pathname.split('/').pop();
            const isAuthPage = currentPage.includes('login') || currentPage.includes('register') || currentPage === '' || currentPage === 'index.html';
            
            if (requiresAuth && !isAuthPage) {
                // Show message and redirect after 1 second
                const message = document.createElement('div');
                message.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:white;padding:2rem;border-radius:1rem;z-index:10000;text-align:center;';
                message.innerHTML = '<p style="font-size:1.5rem;margin-bottom:1rem;">يجب تسجيل الدخول أولاً</p><p>جاري التحويل...</p>';
                document.body.appendChild(message);
                
                setTimeout(() => {
                    window.location.href = 'login_page.html';
                }, 1000);
            }
        }
    }
    
    function handleLogout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            // Clear all user data
            localStorage.removeItem('userData');
            localStorage.removeItem('authToken');
            
            // If on dashboard or other protected pages, redirect to home
            const currentPage = window.location.pathname.split('/').pop();
            const isProtectedPage = currentPage.includes('dashboard') || 
                                   currentPage.includes('prayer') ||
                                   currentPage.includes('duas') ||
                                   currentPage.includes('challenges') ||
                                   currentPage.includes('hijri') ||
                                   currentPage.includes('khirah') ||
                                   currentPage.includes('istikhara') ||
                                   currentPage.includes('post_page');
            
            if (isProtectedPage) {
                window.location.href = 'index.html';
            } else {
                // Just reload the page to update nav
                window.location.reload();
            }
        }
    }
    
})();

