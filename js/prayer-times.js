/* ====================================
   PRAYER TIMES FUNCTIONALITY
   Prayer schedule, Qibla compass, and notifications
   ==================================== */

class PrayerTimesManager {
    constructor() {
        this.userData = this.getUserData();
        this.prayerTimes = null;
        this.nextPrayer = null;
        this.countdownInterval = null;
        this.qiblaDirection = null;
        this.userLocation = null;
        this.alarms = this.loadAlarms();
        
        if (!this.userData) {
            window.location.href = 'login_page.html';
            return;
        }
        
        this.init();
    }
    
    async init() {
        // Setup user profile
        this.setupUserProfile();
        
        // Load dates
        this.loadDates();
        
        // Load prayer times
        await this.loadPrayerTimes();
        
        // Start countdown
        this.startCountdown();
        
        // Initialize Qibla compass
        this.initQiblaCompass();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load saved settings
        this.loadSettings();
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
    
    // ========== DATES ==========
    loadDates() {
        const gregorianDate = document.getElementById('gregorianDate');
        const hijriDate = document.getElementById('hijriDate');
        
        if (gregorianDate) {
            const today = new Date();
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            gregorianDate.textContent = today.toLocaleDateString('ar-SA', options);
        }
        
        if (hijriDate) {
            // Load from API or use mock
            this.loadHijriDate();
        }
    }
    
    async loadHijriDate() {
        try {
            const response = await window.apiManager.getHijriDate();
            if (response && response.hijri_date) {
                document.getElementById('hijriDate').textContent = response.hijri_date;
            }
        } catch (error) {
            // Mock Hijri date
            document.getElementById('hijriDate').textContent = '20 جمادى الأولى 1447';
        }
    }
    
    // ========== PRAYER TIMES ==========
    async loadPrayerTimes() {
        const locationSelect = document.getElementById('locationSelect');
        const location = locationSelect?.value || this.userData.location || 'beirut';
        
        try {
            const response = await window.apiManager.getPrayerTimes(location);
            if (response && response.prayer_times) {
                this.prayerTimes = response.prayer_times;
            } else {
                throw new Error('No prayer times data');
            }
        } catch (error) {
            // Use mock data
            this.prayerTimes = this.getMockPrayerTimes();
        }
        
        // Update UI
        this.updatePrayerTimesUI();
        this.findNextPrayer();
    }
    
    getMockPrayerTimes() {
        return {
            fajr: '05:30',
            sunrise: '06:45',
            dhuhr: '12:15',
            asr: '15:30',
            maghrib: '18:00',
            isha: '19:30'
        };
    }
    
    updatePrayerTimesUI() {
        const prayers = ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'];
        
        prayers.forEach(prayer => {
            const timeElement = document.getElementById(`${prayer}Time`);
            if (timeElement && this.prayerTimes[prayer]) {
                timeElement.textContent = this.prayerTimes[prayer];
            }
        });
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
        
        // Remove active class from all cards
        document.querySelectorAll('.prayer-card').forEach(card => {
            card.classList.remove('active');
        });
        
        for (const prayer of prayers) {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            const prayerTime = hours * 60 + minutes;
            
            if (prayerTime > currentTime) {
                this.nextPrayer = {
                    ...prayer,
                    targetTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes)
                };
                
                // Highlight next prayer card
                const card = document.querySelector(`[data-prayer="${prayer.key}"]`);
                if (card) card.classList.add('active');
                
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
        
        const card = document.querySelector(`[data-prayer="fajr"]`);
        if (card) card.classList.add('active');
    }
    
    // ========== COUNTDOWN ==========
    startCountdown() {
        if (!this.nextPrayer) return;
        
        const prayerNameEl = document.getElementById('currentPrayerName');
        const prayerTimeEl = document.getElementById('currentPrayerTime');
        
        if (prayerNameEl) prayerNameEl.textContent = this.nextPrayer.name;
        if (prayerTimeEl) prayerTimeEl.textContent = this.nextPrayer.time;
        
        this.updateCountdown();
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }
    
    updateCountdown() {
        if (!this.nextPrayer) return;
        
        const now = new Date();
        const diff = this.nextPrayer.targetTime - now;
        
        if (diff <= 0) {
            // Prayer time reached
            this.handlePrayerTimeReached();
            return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const hoursEl = document.getElementById('hoursValue');
        const minutesEl = document.getElementById('minutesValue');
        const secondsEl = document.getElementById('secondsValue');
        
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
        
        // Update progress ring
        this.updateProgressRing(diff);
        
        // Check for pre-alarm (10 minutes before)
        if (diff <= 10 * 60 * 1000 && diff > 9 * 60 * 1000) {
            const preAlarmEnabled = document.getElementById('preAlarmToggle')?.checked;
            if (preAlarmEnabled) {
                this.showPreAlarmNotification();
            }
        }
    }
    
    updateProgressRing(diff) {
        const ring = document.getElementById('progressRing');
        if (!ring) return;
        
        // Calculate progress (24 hours = 100%)
        const totalMinutes = 24 * 60;
        const remainingMinutes = Math.floor(diff / (1000 * 60));
        const progress = (remainingMinutes / totalMinutes) * 100;
        
        const circumference = 2 * Math.PI * 85;
        const offset = circumference - (progress / 100) * circumference;
        
        ring.style.strokeDasharray = circumference;
        ring.style.strokeDashoffset = offset;
    }
    
    handlePrayerTimeReached() {
        // Show adhan notification
        const adhanEnabled = document.getElementById('adhanSoundToggle')?.checked;
        if (adhanEnabled) {
            this.playAdhan();
        }
        
        this.showPrayerNotification();
        
        // Reload prayer times for next prayer
        this.loadPrayerTimes();
    }
    
    showPreAlarmNotification() {
        if (Notification.permission === 'granted') {
            new Notification('تنبيه الصلاة', {
                body: `حان وقت ${this.nextPrayer.name} بعد 10 دقائق`,
                icon: '/assets/icons/mosque.png'
            });
        }
        
        this.showToast(`حان وقت ${this.nextPrayer.name} بعد 10 دقائق`, 'info');
    }
    
    showPrayerNotification() {
        if (Notification.permission === 'granted') {
            new Notification('حان وقت الصلاة', {
                body: `حان وقت ${this.nextPrayer.name}`,
                icon: '/assets/icons/mosque.png'
            });
        }
        
        this.showToast(`حان وقت ${this.nextPrayer.name}!`, 'success');
    }
    
    playAdhan() {
        // Play adhan audio
        const audio = new Audio('/assets/audio/adhan.mp3');
        audio.play().catch(e => console.log('Could not play adhan:', e));
    }
    
    // ========== QIBLA COMPASS ==========
    initQiblaCompass() {
        if ('geolocation' in navigator) {
            this.requestLocationPermission();
        }
        
        // Mock Qibla direction for demo
        this.qiblaDirection = 135; // degrees
        this.updateQiblaUI();
        
        // Check for device orientation support
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', (e) => this.handleOrientation(e));
        }
    }
    
    requestLocationPermission() {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                this.calculateQiblaDirection();
            },
            (error) => {
                console.log('Location permission denied:', error);
            }
        );
    }
    
    calculateQiblaDirection() {
        if (!this.userLocation) return;
        
        // Kaaba coordinates
        const kaaba = { lat: 21.4225, lng: 39.8262 };
        
        // Calculate bearing
        const lat1 = this.userLocation.lat * Math.PI / 180;
        const lat2 = kaaba.lat * Math.PI / 180;
        const dLng = (kaaba.lng - this.userLocation.lng) * Math.PI / 180;
        
        const y = Math.sin(dLng) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) -
                  Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
        
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        bearing = (bearing + 360) % 360;
        
        this.qiblaDirection = bearing;
        this.updateQiblaUI();
        
        // Calculate distance
        this.calculateDistanceToMecca();
    }
    
    calculateDistanceToMecca() {
        if (!this.userLocation) return;
        
        const kaaba = { lat: 21.4225, lng: 39.8262 };
        
        const R = 6371; // Earth's radius in km
        const dLat = (kaaba.lat - this.userLocation.lat) * Math.PI / 180;
        const dLng = (kaaba.lng - this.userLocation.lng) * Math.PI / 180;
        
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.userLocation.lat * Math.PI / 180) * 
                  Math.cos(kaaba.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        const distanceEl = document.getElementById('distanceToMecca');
        if (distanceEl) {
            distanceEl.textContent = Math.round(distance).toLocaleString('ar-SA') + ' كم';
        }
    }
    
    updateQiblaUI() {
        const degreeEl = document.getElementById('qiblaDegree');
        const indicator = document.getElementById('qiblaIndicator');
        
        if (degreeEl) {
            degreeEl.textContent = Math.round(this.qiblaDirection) + '°';
        }
        
        if (indicator) {
            // Rotation removed - indicator will not rotate
            indicator.style.transform = `translateY(0)`;
        }
    }
    
    handleOrientation(event) {
        if (!event.alpha) return;
        
        const compass = document.getElementById('compassInner');
        if (compass) {
            // Rotation removed - compass will not rotate
            compass.style.transform = `translateY(0)`;
        }
    }
    
    // ========== ALARMS ==========
    loadAlarms() {
        const saved = localStorage.getItem('prayerAlarms');
        return saved ? JSON.parse(saved) : {
            fajr: true,
            dhuhr: true,
            asr: true,
            maghrib: true,
            isha: true
        };
    }
    
    saveAlarms() {
        localStorage.setItem('prayerAlarms', JSON.stringify(this.alarms));
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Location selector
        const locationSelect = document.getElementById('locationSelect');
        if (locationSelect) {
            locationSelect.addEventListener('change', () => {
                this.loadPrayerTimes();
            });
        }
        
        // Detect location button
        const detectBtn = document.getElementById('detectLocationBtn');
        if (detectBtn) {
            detectBtn.addEventListener('click', () => {
                this.requestLocationPermission();
            });
        }
        
        // Calibrate compass button
        const calibrateBtn = document.getElementById('calibrateBtn');
        if (calibrateBtn) {
            calibrateBtn.addEventListener('click', () => {
                this.calibrateCompass();
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
        
        // Calculation method
        const methodSelect = document.getElementById('calculationMethod');
        if (methodSelect) {
            methodSelect.addEventListener('change', () => {
                this.saveSettings();
                this.loadPrayerTimes();
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
    
    calibrateCompass() {
        this.showToast('جاري معايرة البوصلة...', 'info');
        
        // Request device orientation permission (iOS 13+)
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission()
                .then(response => {
                    if (response === 'granted') {
                        this.showToast('تم معايرة البوصلة بنجاح', 'success');
                    }
                })
                .catch(console.error);
        } else {
            this.showToast('البوصلة جاهزة للاستخدام', 'success');
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
    
    // ========== SETTINGS ==========
    loadSettings() {
        const saved = localStorage.getItem('prayerSettings');
        if (saved) {
            const settings = JSON.parse(saved);
            
            const preAlarmToggle = document.getElementById('preAlarmToggle');
            const adhanToggle = document.getElementById('adhanSoundToggle');
            const methodSelect = document.getElementById('calculationMethod');
            
            if (preAlarmToggle) preAlarmToggle.checked = settings.preAlarm !== false;
            if (adhanToggle) adhanToggle.checked = settings.adhanSound !== false;
            if (methodSelect && settings.method) methodSelect.value = settings.method;
        }
    }
    
    saveSettings() {
        const settings = {
            preAlarm: document.getElementById('preAlarmToggle')?.checked,
            adhanSound: document.getElementById('adhanSoundToggle')?.checked,
            method: document.getElementById('calculationMethod')?.value
        };
        
        localStorage.setItem('prayerSettings', JSON.stringify(settings));
    }
    
    // ========== UI HELPERS ==========
    showToast(message, type = 'success') {
        const toast = document.getElementById('prayerToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `prayer-toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ========== GLOBAL FUNCTIONS ==========
async function logPrayer(prayerName) {
    try {
        await window.apiManager.logPrayer(prayerName);
        
        // Update UI
        const statusBadge = document.getElementById(`${prayerName}Status`);
        if (statusBadge) {
            statusBadge.className = 'prayer-status-badge completed';
            statusBadge.querySelector('.status-text').textContent = '✓ صليت';
        }
        
        // Show success message
        window.prayerTimesManager.showToast('تم تسجيل الصلاة بنجاح!', 'success');
        
        // Show celebration
        if (window.animationsController) {
            window.animationsController.celebrateSuccess('بارك الله فيك!');
        }
    } catch (error) {
        window.prayerTimesManager.showToast('حدث خطأ في التسجيل', 'error');
    }
}

function toggleAlarm(prayerName) {
    const alarmBtn = event.target.closest('.alarm-btn');
    if (!alarmBtn) return;
    
    alarmBtn.classList.toggle('active');
    
    const manager = window.prayerTimesManager;
    manager.alarms[prayerName] = alarmBtn.classList.contains('active');
    manager.saveAlarms();
    
    const status = manager.alarms[prayerName] ? 'مفعّل' : 'معطّل';
    manager.showToast(`التنبيه ${status}`, 'info');
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.prayerTimesManager = new PrayerTimesManager();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.prayerTimesManager && window.prayerTimesManager.countdownInterval) {
        clearInterval(window.prayerTimesManager.countdownInterval);
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PrayerTimesManager };
}