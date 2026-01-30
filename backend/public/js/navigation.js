/* ====================================
   NAVIGATION CONTROLLER
   Handles navigation, mobile menu, and sticky header
   ==================================== */

class NavigationController {
    constructor() {
        this.nav = document.querySelector('.glass-nav');
        this.navLinks = document.querySelector('.nav-links');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.navLinkItems = document.querySelectorAll('.nav-links a');
        
        this.init();
    }
    
    init() {
        // Mobile menu toggle
        this.setupMobileMenu();
        
        // Sticky navigation on scroll
        this.setupStickyNav();
        
        // Active link highlighting
        this.setupActiveLinks();
        
        // Close mobile menu when clicking links
        this.setupLinkClicks();
        
        // Close mobile menu when clicking outside
        this.setupOutsideClick();
    }
    
    // ========== MOBILE MENU ==========
    setupMobileMenu() {
        if (!this.mobileMenuBtn) return;
        
        this.mobileMenuBtn.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
    }
    
    toggleMobileMenu() {
        const isActive = this.navLinks.classList.contains('active');
        
        this.navLinks.classList.toggle('active');
        this.mobileMenuBtn.classList.toggle('active');
        this.nav.classList.toggle('menu-open');
        
        // Animate hamburger icon
        const spans = this.mobileMenuBtn.querySelectorAll('span');
        if (!isActive) {
            spans[0].style.transform = 'translateY(8px) rotate(45deg)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'translateY(-8px) rotate(-45deg)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = !isActive ? 'hidden' : '';
    }
    
    closeMobileMenu() {
        this.navLinks.classList.remove('active');
        this.mobileMenuBtn.classList.remove('active');
        this.nav.classList.remove('menu-open');
        
        const spans = this.mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
        
        document.body.style.overflow = '';
    }
    
    // ========== STICKY NAVIGATION ==========
    setupStickyNav() {
        let lastScroll = 0;
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            // Add shadow when scrolled
            if (currentScroll > 50) {
                this.nav.style.boxShadow = 'var(--shadow-lg)';
                this.nav.style.background = 'rgba(10, 31, 26, 0.95)';
            } else {
                this.nav.style.boxShadow = 'none';
                this.nav.style.background = 'var(--glass-bg)';
            }
            
            // Hide/show nav on scroll
            if (currentScroll > lastScroll && currentScroll > 100) {
                // Scrolling down
                this.nav.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up
                this.nav.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
        
        // Smooth transition for nav
        this.nav.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease';
    }
    
    // ========== ACTIVE LINK HIGHLIGHTING ==========
    setupActiveLinks() {
        // Get current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinkItems.forEach(link => {
            const linkPage = link.getAttribute('href');
            
            if (linkPage === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Highlight on click
        this.navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                this.navLinkItems.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });
    }
    
    // ========== CLOSE MENU ON LINK CLICK ==========
    setupLinkClicks() {
        this.navLinkItems.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 1024 && this.navLinks.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            });
        });
    }
    
    // ========== CLOSE MENU ON OUTSIDE CLICK ==========
    setupOutsideClick() {
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                // Close menu if clicking outside nav or on overlay
                const clickedNav = this.nav.contains(e.target);
                const clickedMenuBtn = this.mobileMenuBtn && this.mobileMenuBtn.contains(e.target);
                
                if (!clickedNav && !clickedMenuBtn && this.navLinks.classList.contains('active')) {
                    this.closeMobileMenu();
                }
            }
        });
        
        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navLinks.classList.contains('active')) {
                this.closeMobileMenu();
            }
        });
    }
    
    // ========== PUBLIC METHODS ==========
    
    // Navigate to page with transition
    navigateTo(url, transition = true) {
        if (transition) {
            // Add page transition
            document.body.style.animation = 'fadeOut 0.3s ease';
            
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        } else {
            window.location.href = url;
        }
    }
    
    // Show navigation notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `nav-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(var(--blur-strength));
            border: 1px solid var(--glass-border);
            border-right: 4px solid ${type === 'success' ? 'var(--secondary)' : 'var(--primary)'};
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            color: var(--text-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            box-shadow: var(--shadow-md);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Update navigation based on user state
    updateNavForUser(userData) {
        const loginBtn = document.querySelector('.btn-login');
        const registerBtn = document.querySelector('.btn-primary');
        
        if (userData) {
            // User is logged in
            loginBtn.textContent = userData.name;
            loginBtn.href = 'index.html';
            registerBtn.style.display = 'none';
            
            // Add logout button
            const logoutBtn = document.createElement('a');
            logoutBtn.href = '#';
            logoutBtn.className = 'btn-glass';
            logoutBtn.textContent = 'تسجيل الخروج';
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.handleLogout();
            };
            registerBtn.parentNode.insertBefore(logoutBtn, registerBtn);
        }
    }
    
    // Handle logout
    handleLogout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            // Clear user data
            localStorage.removeItem('userData');
            localStorage.removeItem('authToken');
            
            this.showNotification('تم تسجيل الخروج بنجاح');
            
            // Redirect to login page
            setTimeout(() => {
                this.navigateTo('login_page.html');
            }, 1000);
        }
    }
}

// ========== BREADCRUMB NAVIGATION ==========
class BreadcrumbController {
    constructor() {
        this.createBreadcrumb();
    }
    
    createBreadcrumb() {
        const path = window.location.pathname;
        const pages = {
            'index.html': 'الرئيسية',
            'prayer_times_page.html': 'مواقيت الصلاة',
            'duas_page.html': 'الأدعية',
            'challenges_page.html': 'التحديات',
            'hijri-calendar.html': 'التقويم الهجري',
            'self-accountability.html': 'محاسبة النفس',
            'login_page.html': 'تسجيل الدخول',
            'register_page.html': 'إنشاء حساب'
        };
        
        const currentPage = path.split('/').pop() || 'index.html';
        const pageName = pages[currentPage];
        
        if (currentPage !== 'index.html' && pageName) {
            const breadcrumb = document.createElement('div');
            breadcrumb.className = 'breadcrumb';
            breadcrumb.innerHTML = `
                <a href="index.html">الرئيسية</a>
                <span class="separator">←</span>
                <span class="current">${pageName}</span>
            `;
            breadcrumb.style.cssText = `
                position: fixed;
                top: 80px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--glass-bg);
                backdrop-filter: blur(var(--blur-strength));
                border: 1px solid var(--glass-border);
                padding: 0.75rem 1.5rem;
                border-radius: var(--radius-md);
                display: flex;
                align-items: center;
                gap: 0.5rem;
                z-index: 99;
                animation: fadeInDown 0.5s ease;
            `;
            
            const style = document.createElement('style');
            style.textContent = `
                .breadcrumb a {
                    color: var(--secondary);
                    transition: all var(--transition-normal);
                }
                .breadcrumb a:hover {
                    color: var(--secondary-light);
                }
                .breadcrumb .separator {
                    color: var(--text-muted);
                }
                .breadcrumb .current {
                    color: var(--text-primary);
                    font-weight: 600;
                }
            `;
            document.head.appendChild(style);
            document.body.appendChild(breadcrumb);
        }
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.navigationController = new NavigationController();
    window.breadcrumbController = new BreadcrumbController();
    
    // Check for logged in user
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            window.navigationController.updateNavForUser(user);
        } catch (e) {
            console.error('Error parsing user data');
        }
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NavigationController, BreadcrumbController };
}