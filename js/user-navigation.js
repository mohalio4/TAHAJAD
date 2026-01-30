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
                    <a href="${window.Laravel?.routes?.login || '/login'}" class="btn-glass btn-login">تسجيل الدخول</a>
                    <a href="${window.Laravel?.routes?.register || '/register'}" class="btn-primary">إنشاء حساب</a>
                `;
                
                // Insert before user actions
                navActions.insertBefore(guestDiv, userActions);
                guestActions = guestDiv;
            }
        }
        
        // Setup logout functionality if not already setup
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn && !logoutBtn.hasAttribute('data-setup')) {
            logoutBtn.setAttribute('data-setup', 'true');
            logoutBtn.addEventListener('click', handleLogout);
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
<<<<<<< HEAD

            // Only allow access to index/login/register without authentication
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            const isPublicPage = currentPage === 'index.html' || currentPage.includes('login') || currentPage.includes('register');

            if (!isPublicPage) {
=======
            
            // For pages that require login, redirect to login
            const requiresAuth = document.body.classList.contains('dashboard-page') ||
                                document.body.classList.contains('prayer-times-page') ||
                                document.body.classList.contains('duas-page') ||
                                document.body.classList.contains('challenges-page') ||
                                document.body.classList.contains('hijri-calendar-page') ||
                                document.body.classList.contains('khirah-page') ||
                                currentPage.includes('self-accountability') ||
                                document.body.classList.contains('istikhara-page') ||
                                document.body.classList.contains('posts-page');
            
            // Don't redirect from landing/login/register pages
            const currentPage = window.location.pathname.split('/').pop();
            const isAuthPage = currentPage.includes('login') || currentPage.includes('register') || currentPage === '' || currentPage === '/';
            
            if (requiresAuth && !isAuthPage) {
>>>>>>> 289ced102ea69cc2b37120daeee907c91f76293e
                // Show message and redirect after 1 second
                const message = document.createElement('div');
                message.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.9);color:white;padding:2rem;border-radius:1rem;z-index:10000;text-align:center;';
                message.innerHTML = '<p style="font-size:1.5rem;margin-bottom:1rem;">يجب تسجيل الدخول أولاً</p><p>جاري التحويل...</p>';
                document.body.appendChild(message);

                setTimeout(() => {
                    const loginRoute = window.Laravel?.routes?.login || '/login';
                    window.location.href = loginRoute;
                }, 1000);
            }
        }
    }
    
    function handleLogout() {
        // Close dropdown if open
        const userDropdown = document.getElementById('userDropdown');
        if (userDropdown) userDropdown.classList.remove('show');
        
        // Create custom confirmation modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const card = document.createElement('div');
        card.style.cssText = `
            background: linear-gradient(135deg, rgba(13, 77, 61, 0.95), rgba(26, 58, 46, 0.95));
            border: 1px solid rgba(212, 175, 55, 0.3);
            border-radius: 1.5rem;
            padding: 2.5rem;
            max-width: 400px;
            width: 90%;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
        `;
        
        card.innerHTML = `
            <div style="font-size: 3rem; margin-bottom: 1rem;">🚪</div>
            <h3 style="color: #d4af37; margin-bottom: 1rem; font-size: 1.5rem;">تسجيل الخروج</h3>
            <p style="color: rgba(255, 255, 255, 0.9); margin-bottom: 2rem; line-height: 1.6;">
                هل أنت متأكد من تسجيل الخروج؟
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <button id="confirmLogout" style="
                    flex: 1;
                    padding: 0.875rem 1.5rem;
                    background: linear-gradient(135deg, #d4af37, #c9a961);
                    color: #0d4d3d;
                    border: none;
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    نعم، تسجيل الخروج
                </button>
                <button id="cancelLogout" style="
                    flex: 1;
                    padding: 0.875rem 1.5rem;
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 0.75rem;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    إلغاء
                </button>
            </div>
        `;
        
        modal.appendChild(card);
        document.body.appendChild(modal);
        
        // Add hover effects
        const confirmBtn = card.querySelector('#confirmLogout');
        const cancelBtn = card.querySelector('#cancelLogout');
        
        confirmBtn.addEventListener('mouseenter', () => {
            confirmBtn.style.transform = 'translateY(-2px)';
            confirmBtn.style.boxShadow = '0 10px 20px rgba(212, 175, 55, 0.3)';
        });
        confirmBtn.addEventListener('mouseleave', () => {
            confirmBtn.style.transform = 'translateY(0)';
            confirmBtn.style.boxShadow = 'none';
        });
        
        cancelBtn.addEventListener('mouseenter', () => {
            cancelBtn.style.background = 'rgba(255, 255, 255, 0.15)';
            cancelBtn.style.transform = 'translateY(-2px)';
        });
        cancelBtn.addEventListener('mouseleave', () => {
            cancelBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            cancelBtn.style.transform = 'translateY(0)';
        });
        
        // Handle confirm
        confirmBtn.addEventListener('click', () => {
            // Clear all user data
            localStorage.removeItem('userData');
            localStorage.removeItem('authToken');
            
<<<<<<< HEAD
            // Redirect to public page after logout
            window.location.href = 'index.html';
        });
        
        // Handle cancel
        cancelBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => modal.remove(), 300);
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => modal.remove(), 300);
            }
        });
    }
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
        @keyframes slideUp {
            from { 
                opacity: 0;
                transform: translateY(30px) scale(0.95);
            }
            to { 
                opacity: 1;
                transform: translateY(0) scale(1);
=======
            // If on dashboard or other protected pages, redirect to home
            const currentPage = window.location.pathname.split('/').pop();
            const isProtectedPage = currentPage.includes('dashboard') || 
                                   currentPage.includes('prayer') ||
                                   currentPage.includes('duas') ||
                                   currentPage.includes('challenges') ||
                                   currentPage.includes('hijri') ||
                                   currentPage.includes('khirah') ||
                                   currentPage.includes('self-accountability') ||
                                   currentPage.includes('istikhara') ||
                                   currentPage.includes('post_page');
            
            if (isProtectedPage) {
                const homeRoute = window.Laravel?.routes?.home || '/';
                window.location.href = homeRoute;
            } else {
                // Just reload the page to update nav
                window.location.reload();
>>>>>>> 289ced102ea69cc2b37120daeee907c91f76293e
            }
        }
    `;
    document.head.appendChild(style);
    
})();

