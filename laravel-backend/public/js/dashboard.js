/* ====================================
   DASHBOARD FUNCTIONALITY
   User dashboard logic and interactions
   ==================================== */

class DashboardManager {
    constructor() {
        this.userData = this.getUserData();
        this.prayerTimes = null;
        this.nextPrayer = null;
        this.countdownInterval = null;
        
        if (!this.userData) {
            // Redirect to login if not authenticated
            const loginRoute = window.Laravel?.routes?.login || '/login';
            window.location.href = loginRoute;
            return;
        }
        
        this.init();
    }
    
    async init() {
        // Initialize dashboard components
        this.setupUserProfile();
        this.loadHijriDate();
        await this.loadPrayerTimes();
        this.startPrayerCountdown();
        await this.loadDashboardData();
        this.setupEventListeners();
        this.updatePrayerProgress();
    }
    
    // ========== USER DATA ==========
    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
    
    setupUserProfile() {
        // Update user name in welcome section
        const userNameDisplay = document.getElementById('userNameDisplay');
        const userName = document.getElementById('userName');
        const userInitials = document.getElementById('userInitials');
        
        if (this.userData) {
            const name = this.userData.name || 'مستخدم';
            const initials = this.getInitials(name);
            
            if (userNameDisplay) userNameDisplay.textContent = name;
            if (userName) userName.textContent = name;
            if (userInitials) userInitials.textContent = initials;
        }
        
        // Set greeting based on time
        this.setGreeting();
    }
    
    getInitials(name) {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return names[0].charAt(0) + names[1].charAt(0);
        }
        return name.charAt(0);
    }
    
    setGreeting() {
        const greetingEl = document.getElementById('greeting');
        if (!greetingEl) return;
        
        const hour = new Date().getHours();
        let greeting;
        
        if (hour < 12) {
            greeting = 'صباح الخير';
        } else if (hour < 18) {
            greeting = 'مساء الخير';
        } else {
            greeting = 'مساء الخير';
        }
        
        greetingEl.textContent = greeting;
    }
    
    // ========== HIJRI DATE ==========
    async loadHijriDate() {
        const hijriDateEl = document.getElementById('hijriDate');
        if (!hijriDateEl) return;
        
        try {
            const response = await window.apiManager.getHijriDate();
            if (response && response.hijri_date) {
                hijriDateEl.textContent = response.hijri_date;
            }
        } catch (error) {
            // Fallback to mock date
            hijriDateEl.textContent = this.getMockHijriDate();
        }
    }
    
    getMockHijriDate() {
        const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
        const months = ['محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الآخرة', 
                       'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'];
        
        const today = new Date();
        const dayName = days[today.getDay()];
        const day = Math.floor(Math.random() * 28) + 1;
        const month = months[Math.floor(Math.random() * 12)];
        const year = 1446;
        
        return `${dayName}، ${day} ${month} ${year} هـ`;
    }
    
    // ========== PRAYER TIMES ==========
    async loadPrayerTimes() {
        try {
            const location = this.userData.location || 'beirut';
            const response = await window.apiManager.getPrayerTimes(location);
            
            if (response && response.prayer_times) {
                this.prayerTimes = response.prayer_times;
                this.findNextPrayer();
            }
        } catch (error) {
            // Use mock data
            this.prayerTimes = this.getMockPrayerTimes();
            this.findNextPrayer();
        }
    }
    
    getMockPrayerTimes() {
        return {
            fajr: '05:30',
            dhuhr: '12:15',
            asr: '15:30',
            maghrib: '18:00',
            isha: '19:30'
        };
    }
    
    findNextPrayer() {
        const now = new Date();
        const currentTime = now.getHours() * 60 + now.getMinutes();
        
        const prayers = [
            { name: 'الفجر', key: 'fajr', time: this.prayerTimes.fajr },
            { name: 'الظهر', key: 'dhuhr', time: this.prayerTimes.dhuhr },
            { name: 'العصر', key: 'asr', time: this.prayerTimes.asr },
            { name: 'المغرب', key: 'maghrib', time: this.prayerTimes.maghrib },
            { name: 'العشاء', key: 'isha', time: this.prayerTimes.isha }
        ];
        
        for (const prayer of prayers) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerTime = hours * 60 + minutes;
            
            if (prayerTime > currentTime) {
                this.nextPrayer = {
                    ...prayer,
                    targetTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
                };
                return;
            }
        }
        
        // If no prayer found today, next is Fajr tomorrow
        const [hours, minutes] = prayers[0].time.split(':').map(Number);
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(hours, minutes, 0);
        
        this.nextPrayer = {
            ...prayers[0],
            targetTime: tomorrow
        };
    }
    
    startPrayerCountdown() {
        if (!this.nextPrayer) return;
        
        const nextPrayerNameEl = document.getElementById('nextPrayerName');
        if (nextPrayerNameEl) {
            nextPrayerNameEl.textContent = this.nextPrayer.name;
        }
        
        this.updateCountdown();
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }
    
    updateCountdown() {
        if (!this.nextPrayer) return;
        
        const now = new Date();
        const diff = this.nextPrayer.targetTime - now;
        
        if (diff <= 0) {
            // Prayer time reached, reload
            this.loadPrayerTimes();
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const hoursEl = document.querySelector('.countdown-hours');
        const minutesEl = document.querySelector('.countdown-minutes');
        const secondsEl = document.querySelector('.countdown-seconds');
        
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    // ========== DASHBOARD DATA ==========
    async loadDashboardData() {
        try {
            // Load streak data
            await this.loadStreakData();
            
            // Load prayer stats
            await this.loadPrayerStats();
            
            // Load challenges
            await this.loadChallenges();
            
            // Load recent activity
            await this.loadRecentActivity();
            
            // Load achievements
            await this.loadAchievements();
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        }
    }
    
    async loadStreakData() {
        const streakDaysEl = document.getElementById('streakDays');
        const totalPointsEl = document.getElementById('totalPoints');
        
        // Mock data for now
        if (streakDaysEl) streakDaysEl.textContent = '7';
        if (totalPointsEl) totalPointsEl.textContent = '850';
    }
    
    async loadPrayerStats() {
        const period = document.getElementById('prayerStatsPeriod')?.value || 'week';
        
        try {
            const stats = await window.apiManager.getPrayerStats(period);
            this.updatePrayerStatsUI(stats);
        } catch (error) {
            // Use mock data
            this.updatePrayerStatsUI(this.getMockPrayerStats());
        }
    }
    
    getMockPrayerStats() {
        return {
            overall_percentage: 86,
            prayers: {
                fajr: { completed: 6, total: 7, percentage: 86 },
                dhuhr: { completed: 7, total: 7, percentage: 100 },
                asr: { completed: 6, total: 7, percentage: 86 },
                maghrib: { completed: 7, total: 7, percentage: 100 },
                isha: { completed: 6, total: 7, percentage: 86 }
            }
        };
    }
    
    updatePrayerStatsUI(stats) {
        // Update percentage
        const percentageEl = document.getElementById('prayerPercentage');
        if (percentageEl) {
            percentageEl.textContent = stats.overall_percentage + '%';
        }
    }
    
    updatePrayerProgress() {
        const circle = document.getElementById('prayerProgressCircle');
        if (!circle) return;
        
        const percentage = 86; // From stats
        const circumference = 2 * Math.PI * 85;
        const offset = circumference - (percentage / 100) * circumference;
        
        circle.style.strokeDasharray = circumference;
        circle.style.strokeDashoffset = offset;
    }
    
    async loadChallenges() {
        // Challenges are already in HTML for now
        // In production, load from API
    }
    
    async loadRecentActivity() {
        // Activity is already in HTML for now
        // In production, load from API
    }
    
    async loadAchievements() {
        // Achievements are already in HTML for now
        // In production, load from API
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // User profile dropdown
        this.setupUserDropdown();
        
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
        
        // Prayer stats period selector
        const periodSelector = document.getElementById('prayerStatsPeriod');
        if (periodSelector) {
            periodSelector.addEventListener('change', () => this.loadPrayerStats());
        }
        
        // Prayer log form
        this.setupPrayerLogForm();
        
        // Good deed form
        this.setupGoodDeedForm();
    }
    
    setupUserDropdown() {
        const userProfileBtn = document.getElementById('userProfileBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (!userProfileBtn || !userDropdown) return;
        
        userProfileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('active');
            userProfileBtn.classList.toggle('active');
        });
        
        document.addEventListener('click', (e) => {
            if (!userProfileBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('active');
                userProfileBtn.classList.remove('active');
            }
        });
    }
    
    setupPrayerLogForm() {
        const form = document.getElementById('logPrayerForm');
        if (!form) return;
        
        const options = form.querySelectorAll('.prayer-option');
        let selectedPrayer = null;
        
        options.forEach(option => {
            option.addEventListener('click', () => {
                options.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                selectedPrayer = option.dataset.prayer;
            });
        });
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!selectedPrayer) {
                this.showToast('الرجاء اختيار الصلاة', 'error');
                return;
            }
            
            try {
                await window.apiManager.logPrayer(selectedPrayer);
                this.showToast('تم تسجيل الصلاة بنجاح!', 'success');
                closeModal('logPrayerModal');
                
                // Refresh dashboard
                await this.loadDashboardData();
                
                // Show celebration
                if (window.animationsController) {
                    window.animationsController.celebrateSuccess('بارك الله فيك!');
                }
            } catch (error) {
                this.showToast(error.message, 'error');
            }
        });
    }
    
    setupGoodDeedForm() {
        const form = document.getElementById('addGoodDeedForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const type = document.getElementById('deedType').value;
            const description = document.getElementById('deedDescription').value;
            
            if (!type || !description) {
                this.showToast('الرجاء ملء جميع الحقول', 'error');
                return;
            }
            
            try {
                await window.apiManager.addKhirahEntry({
                    type,
                    description,
                    date: new Date().toISOString()
                });
                
                this.showToast('تم إضافة العمل الصالح!', 'success');
                closeModal('addGoodDeedModal');
                
                // Clear form
                form.reset();
                
                // Refresh activity
                await this.loadRecentActivity();
            } catch (error) {
                this.showToast(error.message, 'error');
            }
        });
    }
    
    handleLogout() {
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            window.apiManager.logout();
        }
    }
    
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `auth-toast ${type} show`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: var(--glass-bg);
            backdrop-filter: blur(var(--blur-strength));
            border: 1px solid var(--glass-border);
            border-radius: var(--radius-md);
            color: var(--text-primary);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            box-shadow: var(--shadow-lg);
        `;
        
        if (type === 'success') {
            toast.style.borderRight = '4px solid #6bcf7f';
        } else {
            toast.style.borderRight = '4px solid #ff6b6b';
        }
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ========== MODAL FUNCTIONS ==========
function logPrayer() {
    showModal('logPrayerModal');
}

function addGoodDeed() {
    showModal('addGoodDeedModal');
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        // Clear forms
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            
            // Clear selected prayer options
            const options = modal.querySelectorAll('.prayer-option');
            options.forEach(opt => opt.classList.remove('selected'));
        }
    }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
});

// ========== AUTO REFRESH ==========
class DashboardRefresher {
    constructor() {
        this.refreshInterval = null;
        this.startAutoRefresh();
    }
    
    startAutoRefresh() {
        // Refresh prayer countdown every second is already handled
        
        // Refresh dashboard data every 5 minutes
        this.refreshInterval = setInterval(() => {
            if (window.dashboardManager) {
                window.dashboardManager.loadDashboardData();
            }
        }, 5 * 60 * 1000);
    }
    
    stop() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
    window.dashboardRefresher = new DashboardRefresher();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.dashboardManager && window.dashboardManager.countdownInterval) {
        clearInterval(window.dashboardManager.countdownInterval);
    }
    
    if (window.dashboardRefresher) {
        window.dashboardRefresher.stop();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DashboardManager, DashboardRefresher };
}