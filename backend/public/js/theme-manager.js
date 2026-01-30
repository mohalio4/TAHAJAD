/* ====================================
   THEME MANAGER
   Handles theme switching and persistence
   ==================================== */

class ThemeManager {
    constructor() {
        this.themeBtn = document.getElementById('themeBtn');
        this.themeDropdown = document.getElementById('themeDropdown');
        this.themeOptions = document.querySelectorAll('.theme-option');
        this.body = document.body;
        
        // Initialize theme from localStorage or default
        this.init();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Check for special Hijri dates
        this.checkHijriDate();
    }
    
    init() {
        // Get saved theme from localStorage or use default
        const savedTheme = localStorage.getItem('selectedTheme') || 'emerald';
        this.applyTheme(savedTheme);
    }
    
    setupEventListeners() {
        // Toggle dropdown
        this.themeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.themeDropdown.contains(e.target) && 
                !this.themeBtn.contains(e.target)) {
                this.closeDropdown();
            }
        });
        
        // Theme option clicks
        this.themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.applyTheme(theme);
                this.closeDropdown();
                
                // Save to localStorage
                localStorage.setItem('selectedTheme', theme);
                
                // Show notification
                this.showThemeNotification(theme);
            });
        });
    }
    
    toggleDropdown() {
        this.themeDropdown.classList.toggle('active');
    }
    
    closeDropdown() {
        this.themeDropdown.classList.remove('active');
    }
    
    applyTheme(themeName) {
        // Remove all theme classes
        this.body.classList.remove('emerald-theme', 'gold-theme', 'ruby-theme', 'night-theme', 'sadness-theme');
        
        // Add selected theme class
        this.body.classList.add(`${themeName}-theme`);
        
        // Add smooth transition
        this.body.style.transition = 'all 0.5s ease';
        
        // Trigger animation on theme change
        this.animateThemeChange();
    }
    
    animateThemeChange() {
        // Create a ripple effect from the theme button
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
            opacity: 0.3;
            pointer-events: none;
            z-index: 9999;
            transform: translate(-50%, -50%);
            animation: themeRipple 0.8s ease-out;
        `;
        
        document.body.appendChild(ripple);
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
        }, 800);
    }
    
    showThemeNotification(themeName) {
        const themeNames = {
            emerald: 'الزمردي',
            gold: 'الذهبي',
            ruby: 'الياقوتي',
            night: 'الليلي',
            sadness: 'الحزن'
        };
        
        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <span class="notification-icon">✨</span>
            <span>تم تفعيل السمة ${themeNames[themeName]}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(var(--blur-strength));
            border: 1px solid var(--glass-border);
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            color: var(--text-primary);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            box-shadow: var(--shadow-glow);
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    async checkHijriDate() {
        try {
            // This would normally call your API to check Hijri date
            // For now, we'll simulate it with a placeholder
            const response = await this.getHijriDate();
            
            if (response && response.isSadDay) {
                // Auto-apply sadness theme
                this.applyTheme('sadness');
                
                // Show special notification
                this.showSadDayNotification(response.dayName);
                
                // Save override
                localStorage.setItem('sadnessThemeActive', 'true');
                localStorage.setItem('sadnessThemeDate', response.date);
            }
        } catch (error) {
            console.log('Hijri date check will be implemented with API');
        }
    }
    
    async getHijriDate() {
        // Placeholder for API call
        // TODO: Implement actual API call to your Laravel backend
        // Example: const response = await fetch('/api/hijri-date/current');
        // return await response.json();
        
        // For demonstration:
        return {
            isSadDay: false,
            dayName: '',
            date: new Date().toISOString()
        };
    }
    
    showSadDayNotification(dayName) {
        const notification = document.createElement('div');
        notification.className = 'sad-day-notification';
        notification.innerHTML = `
            <div class="sad-day-content">
                <span class="sad-day-icon">🕌</span>
                <h3>يوم ${dayName}</h3>
                <p>تم تفعيل سمة الحزن تلقائياً</p>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 2px solid var(--sadness-red);
            padding: 2rem;
            border-radius: var(--radius-lg);
            color: var(--text-primary);
            text-align: center;
            z-index: 10000;
            min-width: 300px;
            animation: scaleIn 0.5s ease;
            box-shadow: 0 0 60px var(--sadness-red);
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => notification.remove(), 500);
        }, 5000);
    }
}

// Add necessary animations via CSS injection
const style = document.createElement('style');
style.textContent = `
    @keyframes themeRipple {
        from {
            width: 0;
            height: 0;
            opacity: 0.3;
        }
        to {
            width: 200vmax;
            height: 200vmax;
            opacity: 0;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-icon {
        font-size: 1.5rem;
        animation: rotate360 0.5s ease;
    }
    
    .sad-day-content h3 {
        margin: 1rem 0 0.5rem;
        color: var(--sadness-red);
        font-size: 1.5rem;
    }
    
    .sad-day-content p {
        color: var(--text-secondary);
        margin: 0;
    }
    
    .sad-day-icon {
        font-size: 3rem;
        display: block;
    }
`;
document.head.appendChild(style);

// Initialize theme manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}