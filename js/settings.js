/* ====================================
   SETTINGS PAGE FUNCTIONALITY
   Prayer times and Hijri date settings
   ==================================== */

class SettingsManager {
    constructor() {
        this.userData = this.getUserData();
        this.prayerAdjustments = this.loadPrayerAdjustments();
        this.hijriDateAdjustment = this.loadHijriDateAdjustment(); // Days to adjust from API date
        
        if (!this.userData) {
            window.location.href = 'login_page.html';
            return;
        }
        
        this.init();
    }
    
    init() {
        this.setupUserProfile();
        this.loadSettings();
        this.setupEventListeners();
        this.loadHijriDate();
    }
    
    // ========== USER DATA ==========
    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
    
    setupUserProfile() {
        const userName = document.getElementById('userName');
        const userInitials = document.getElementById('userInitials');
        
        if (this.userData && userName && userInitials) {
            userName.textContent = this.userData.name || 'مستخدم';
            userInitials.textContent = this.getInitials(this.userData.name || 'م');
        }
    }
    
    getInitials(name) {
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return names[0].charAt(0) + names[1].charAt(0);
        }
        return name.charAt(0);
    }
    
    // ========== PRAYER TIME ADJUSTMENTS ==========
    loadPrayerAdjustments() {
        const saved = localStorage.getItem('prayerTimeAdjustments');
        return saved ? JSON.parse(saved) : {
            imsak: 0,
            fajr: 0,
            dhuhr: 0,
            asr: 0,
            maghrib: 0,
            isha: 0,
            midnight: 0
        };
    }
    
    savePrayerAdjustments() {
        localStorage.setItem('prayerTimeAdjustments', JSON.stringify(this.prayerAdjustments));
    }
    
    // ========== HIJRI DATE ADJUSTMENT ==========
    loadHijriDateAdjustment() {
        const saved = localStorage.getItem('hijriDateAdjustment');
        return saved ? parseInt(saved) : 0; // Days to adjust from API date
    }
    
    saveHijriDateAdjustment() {
        localStorage.setItem('hijriDateAdjustment', this.hijriDateAdjustment.toString());
    }
    
    async loadHijriDate() {
        const hijriDateEl = document.getElementById('hijriDateDisplay');
        if (!hijriDateEl) return;
        
        // Get base date from API
        try {
            // Get user coordinates from localStorage
            const savedCoords = localStorage.getItem('userCoordinates');
            const coords = savedCoords ? JSON.parse(savedCoords) : { lat: 33.8938, lng: 35.5018 }; // Default to Beirut
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            
            // Calculate date with adjustment
            const adjustedDate = new Date(today);
            adjustedDate.setDate(adjustedDate.getDate() + this.hijriDateAdjustment);
            const adjDay = adjustedDate.getDate();
            const adjMonth = adjustedDate.getMonth() + 1;
            const adjYear = adjustedDate.getFullYear();
            
            const response = await fetch(
                `https://api.aladhan.com/v1/gToH?date=${adjDay}-${adjMonth}-${adjYear}&latitude=${coords.lat}&longitude=${coords.lng}`
            );
            
            if (response.ok) {
                const data = await response.json();
                if (data.code === 200 && data.data) {
                    const hijri = data.data.hijri;
                    const monthName = this.getHijriMonthName(parseInt(hijri.month.number));
                    hijriDateEl.textContent = `${hijri.day} ${monthName} ${hijri.year} هـ`;
                    
                    // Store for use in other pages
                    const hijriDateObj = {
                        day: parseInt(hijri.day),
                        month: parseInt(hijri.month.number),
                        year: parseInt(hijri.year)
                    };
                    localStorage.setItem('currentHijriDate', JSON.stringify(hijriDateObj));
                }
            }
        } catch (error) {
            console.error('Error loading Hijri date:', error);
            hijriDateEl.textContent = '20 جمادى الأولى 1447';
        }
    }
    
    getHijriMonthName(month) {
        const months = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني', 'جمادى الأولى', 'جمادى الثانية',
            'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
        return months[month - 1] || '';
    }
    
    // ========== SETTINGS ==========
    loadSettings() {
        const saved = localStorage.getItem('prayerSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            const preAlarmToggle = document.getElementById('preAlarmToggle');
            const adhanToggle = document.getElementById('adhanSoundToggle');
            
            if (preAlarmToggle) preAlarmToggle.checked = settings.preAlarm !== false;
            if (adhanToggle) adhanToggle.checked = settings.adhanSound !== false;
        }
        
        // Load prayer adjustment sliders
        const prayers = ['imsak', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'midnight'];
        prayers.forEach(prayer => {
            const slider = document.getElementById(`${prayer}AdjustmentSlider`);
            const valueEl = document.getElementById(`${prayer}AdjustmentValue`);
            if (slider) {
                slider.value = this.prayerAdjustments[prayer] || 0;
                if (valueEl) {
                    const value = this.prayerAdjustments[prayer] || 0;
                    valueEl.textContent = value > 0 ? `+${value}` : value.toString();
                }
            }
        });
    }
    
    saveSettings() {
        const settings = {
            preAlarm: document.getElementById('preAlarmToggle')?.checked,
            adhanSound: document.getElementById('adhanSoundToggle')?.checked
        };
        
        localStorage.setItem('prayerSettings', JSON.stringify(settings));
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Prayer time adjustment sliders
        const prayers = ['imsak', 'fajr', 'dhuhr', 'asr', 'maghrib', 'isha', 'midnight'];
        prayers.forEach(prayer => {
            const slider = document.getElementById(`${prayer}AdjustmentSlider`);
            if (slider) {
                slider.addEventListener('input', (e) => {
                    const value = parseInt(e.target.value);
                    this.prayerAdjustments[prayer] = value;
                    this.updatePrayerAdjustmentDisplay(prayer, value);
                    this.savePrayerAdjustments();
                });
            }
        });
        
        // Hijri date adjustment buttons
        const decreaseBtn = document.getElementById('decreaseHijriDayBtn');
        const increaseBtn = document.getElementById('increaseHijriDayBtn');
        const resetBtn = document.getElementById('resetHijriDateBtn');
        
        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                this.adjustHijriDate(-1);
            });
        }
        
        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                this.adjustHijriDate(1);
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetHijriDate();
            });
        }
        
        // Settings toggles
        const preAlarmToggle = document.getElementById('preAlarmToggle');
        const adhanToggle = document.getElementById('adhanSoundToggle');
        
        if (preAlarmToggle) {
            preAlarmToggle.addEventListener('change', (e) => {
                this.saveSettings();
                if (e.target.checked) {
                    this.requestNotificationPermission();
                }
            });
        }
        
        if (adhanToggle) {
            adhanToggle.addEventListener('change', () => {
                this.saveSettings();
            });
        }
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    window.apiManager.logout();
                }
            });
        }
    }
    
    updatePrayerAdjustmentDisplay(prayerName, value) {
        const valueEl = document.getElementById(`${prayerName}AdjustmentValue`);
        if (valueEl) {
            valueEl.textContent = value > 0 ? `+${value}` : value.toString();
        }
    }
    
    adjustHijriDate(days) {
        this.hijriDateAdjustment += days;
        this.saveHijriDateAdjustment();
        this.loadHijriDate();
        this.showToast(`تم تعديل التاريخ ${days > 0 ? '+' : ''}${days} يوم`, 'success');
    }
    
    resetHijriDate() {
        this.hijriDateAdjustment = 0;
        this.saveHijriDateAdjustment();
        this.loadHijriDate();
        this.showToast('تم إعادة تعيين التاريخ الهجري', 'success');
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    // ========== UI HELPERS ==========
    showToast(message, type = 'success') {
        const toast = document.getElementById('settingsToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `prayer-toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.settingsManager = new SettingsManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SettingsManager };
}

