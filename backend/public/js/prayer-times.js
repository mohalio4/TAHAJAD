/* ====================================
   PRAYER TIMES FUNCTIONALITY
   Prayer schedule using Aladhan API
   ==================================== */

class PrayerTimesManager {
    constructor() {
        this.userData = this.getUserData();
        this.prayerTimes = null;
        this.nextPrayer = null;
        this.countdownInterval = null;
        this.alarms = this.loadAlarms();
        this.prayerAdjustments = this.loadPrayerAdjustments(); // Individual adjustments for each prayer
        this.hijriDateAdjustment = this.loadHijriDateAdjustment(); // Days to adjust from API date
        this.userCoordinates = this.loadUserCoordinates(); // User's actual lat/lng
        this.alarmTimeouts = {}; // Track alarm timeout IDs
        
        // If no coordinates saved, initialize with Beirut default
        if (!this.userCoordinates || !this.userCoordinates.lat) {
            this.userCoordinates = { 
                lat: this.lebanonCities.beirut.lat, 
                lng: this.lebanonCities.beirut.lng 
            };
        }
        
        // Lebanon city coordinates (for display name only)
        this.lebanonCities = {
            beirut: { lat: 33.8938, lng: 35.5018, name: 'بيروت' },
            tripoli: { lat: 34.4333, lng: 35.8333, name: 'طرابلس' },
            sidon: { lat: 33.5631, lng: 35.3689, name: 'صيدا' },
            tyre: { lat: 33.2733, lng: 35.1939, name: 'صور' },
            baalbek: { lat: 34.0058, lng: 36.2181, name: 'بعلبك' },
            zahle: { lat: 33.8497, lng: 35.9042, name: 'زحلة' },
            nabatieh: { lat: 33.3783, lng: 35.4839, name: 'النبطية' }
        };
        
        // Aladhan API method (using MWL - Muslim World League for Lebanon)
        this.method = 3; // MWL method
        
        // Don't redirect if not logged in - just don't initialize
        // This allows the manager to work on all pages
        if (!this.userData) {
            return;
        }
        
        this.init();
    }
    
    async init() {
        // Setup user profile (only if elements exist)
        this.setupUserProfile();
        
        // Ensure coordinates are set first (load from storage or use default)
        if (!this.userCoordinates || !this.userCoordinates.lat) {
            this.userCoordinates = { 
                lat: this.lebanonCities.beirut.lat, 
                lng: this.lebanonCities.beirut.lng 
            };
            this.saveUserCoordinates(this.userCoordinates);
            
            // Set default city name (only if element exists)
            const locationNameEl = document.getElementById('locationName');
            if (locationNameEl) {
                locationNameEl.textContent = this.lebanonCities.beirut.name;
            }
        }
        
        // Load dates (only if elements exist)
        this.loadDates();
        
        // Load prayer times immediately (with default or saved coordinates)
        await this.loadPrayerTimes();
        
        // Request browser location permission in background (non-blocking)
        // This will update coordinates if permission is granted
        this.requestLocationPermission().catch(err => {
            console.log('Location request completed (may have been denied):', err);
        });
        
        // Start countdown (works globally, updates UI only if elements exist)
        this.startCountdown();
        
        // Setup event listeners (only if elements exist)
        this.setupEventListeners();
        
        // Load saved settings (only if elements exist)
        this.loadSettings();
        
        // Update alarm button states and schedule alarms
        this.updateAlarmButtons();
        this.scheduleAlarms();
        
        // Request notification permission
        this.requestNotificationPermission();
    }
    
    loadUserCoordinates() {
        const saved = localStorage.getItem('userCoordinates');
        return saved ? JSON.parse(saved) : null;
    }
    
    saveUserCoordinates(coords) {
        localStorage.setItem('userCoordinates', JSON.stringify(coords));
    }
    
    async requestLocationPermission() {
        const locationNameEl = document.getElementById('locationName');
        
        if (!('geolocation' in navigator)) {
            // Geolocation not available - use Beirut
            if (locationNameEl) {
                locationNameEl.textContent = this.lebanonCities.beirut.name;
            }
            this.userCoordinates = { lat: this.lebanonCities.beirut.lat, lng: this.lebanonCities.beirut.lng };
            this.saveUserCoordinates(this.userCoordinates);
            return;
        }
        
        // Check if we already have user's actual coordinates (not default Beirut)
        const savedCoords = this.loadUserCoordinates();
        if (savedCoords && savedCoords.lat && savedCoords.lng) {
            // Check if it's not the default Beirut coordinates
            const isBeirutDefault = Math.abs(savedCoords.lat - this.lebanonCities.beirut.lat) < 0.001 &&
                                   Math.abs(savedCoords.lng - this.lebanonCities.beirut.lng) < 0.001;
            
            if (!isBeirutDefault) {
                // We have real user coordinates, just update display
                this.userCoordinates = savedCoords;
                const closestCity = this.findClosestCity(savedCoords.lat, savedCoords.lng);
                if (locationNameEl && closestCity) {
                    locationNameEl.textContent = closestCity.name;
                }
                return;
            }
        }
        
        // Request browser geolocation permission (native browser prompt)
        // This will trigger the browser's permission dialog
        try {
            console.log('Requesting location permission...');
            
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve, 
                    reject, 
                    {
                        timeout: 20000,
                        enableHighAccuracy: false, // Set to false for faster response
                        maximumAge: 60000 // Accept cached location up to 1 minute old
                    }
                );
            });
            
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            console.log('Location obtained:', lat, lng);
            
            // Save user's actual coordinates
            this.userCoordinates = { lat, lng };
            this.saveUserCoordinates(this.userCoordinates);
            
            // Find closest city for display
            const closestCity = this.findClosestCity(lat, lng);
            if (locationNameEl && closestCity) {
                locationNameEl.textContent = closestCity.name;
            }
            
            // Reload prayer times with new coordinates
            await this.loadPrayerTimes();
            
            this.showToast(`تم تحديد موقعك: ${closestCity ? closestCity.name : 'موقعك الحالي'}`, 'success');
            
        } catch (error) {
            console.log('Location permission denied or error:', error);
            // Use Beirut as default (already set in init)
            if (locationNameEl) {
                locationNameEl.textContent = this.lebanonCities.beirut.name;
            }
            // Coordinates already set to Beirut in init(), so no need to change
        }
    }
    
    findClosestCity(lat, lng) {
        let closestCity = null;
        let minDistance = Infinity;
        
        for (const [key, city] of Object.entries(this.lebanonCities)) {
            const distance = Math.sqrt(
                Math.pow(city.lat - lat, 2) + Math.pow(city.lng - lng, 2)
            );
            if (distance < minDistance) {
                minDistance = distance;
                closestCity = { ...city, key };
            }
        }
        
        return closestCity;
    }
    
    getCurrentCoordinates() {
        // Return user's actual coordinates or default to Beirut
        if (this.userCoordinates && this.userCoordinates.lat && this.userCoordinates.lng) {
            return this.userCoordinates;
        }
        return { lat: this.lebanonCities.beirut.lat, lng: this.lebanonCities.beirut.lng };
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
            this.loadHijriDate();
        }
    }
    
    async loadHijriDate() {
        const hijriDateEl = document.getElementById('hijriDate');
        if (!hijriDateEl) return;
        
        // Load from Aladhan API with adjustment
        try {
            const coords = this.getCurrentCoordinates();
            
            const today = new Date();
            // Apply date adjustment
            const adjustedDate = new Date(today);
            adjustedDate.setDate(adjustedDate.getDate() + this.hijriDateAdjustment);
            const day = adjustedDate.getDate();
            const month = adjustedDate.getMonth() + 1;
            const year = adjustedDate.getFullYear();
            
            const response = await fetch(
                `https://api.aladhan.com/v1/gToH?date=${day}-${month}-${year}&latitude=${coords.lat}&longitude=${coords.lng}`
            );
            
            if (!response.ok) {
                throw new Error('Failed to fetch Hijri date');
            }
            
            const data = await response.json();
            if (data.code === 200 && data.data) {
                const hijri = data.data.hijri;
                const monthName = this.getHijriMonthName(parseInt(hijri.month.number));
                hijriDateEl.textContent = `${hijri.day} ${monthName} ${hijri.year} هـ`;
                
                // Store for linking with calendar
                const hijriDateObj = {
                    day: parseInt(hijri.day),
                    month: parseInt(hijri.month.number),
                    year: parseInt(hijri.year)
                };
                hijriDateEl.setAttribute('data-hijri-date', JSON.stringify(hijriDateObj));
                
                // Update hijri-calendar page if it exists
                this.updateHijriCalendarLink(hijriDateObj);
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            console.error('Error loading Hijri date:', error);
            // Fallback to mock
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
    
    updateHijriCalendarLink(hijriDate) {
        // Store in localStorage for hijri-calendar page to access
        localStorage.setItem('currentHijriDate', JSON.stringify(hijriDate));
    }
    
    // ========== PRAYER TIMES ==========
    async loadPrayerTimes() {
        const coords = this.getCurrentCoordinates();
        
        console.log('Loading prayer times with coordinates:', coords);
        
        try {
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            const year = today.getFullYear();
            
            // Fetch from Aladhan API using user's actual coordinates
            const apiUrl = `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${coords.lat}&longitude=${coords.lng}&method=${this.method}`;
            console.log('Calling API:', apiUrl);
            
            const response = await fetch(apiUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch prayer times');
            }
            
            const data = await response.json();
            
            console.log('API Response:', data);
            
            if (data.code === 200 && data.data && data.data.timings) {
                const timings = data.data.timings;
                
                console.log('Prayer times from API:', timings);
                
                // Extract prayer times and apply individual adjustments
                this.prayerTimes = {
                    imsak: this.adjustTime(timings.Imsak || timings.Fajr, 'imsak'), // Imsak or use Fajr if not available
                    fajr: this.adjustTime(timings.Fajr, 'fajr'),
                    sunrise: timings.Sunrise,
                    dhuhr: this.adjustTime(timings.Dhuhr, 'dhuhr'),
                    maghrib: this.adjustTime(timings.Maghrib, 'maghrib')
                };
                
                // Calculate Midnight (midpoint between Maghrib and Fajr of next day)
                // Use adjusted times for accurate calculation
                this.prayerTimes.midnight = this.calculateMidnight(this.prayerTimes.maghrib, this.prayerTimes.fajr);
                
                console.log('Final prayer times:', this.prayerTimes);
                
                // Also load Hijri date from the same API response (will be adjusted in loadHijriDate)
                // We don't update it here to avoid conflicts with the adjustment system
            } else {
                throw new Error('Invalid response: ' + JSON.stringify(data));
            }
        } catch (error) {
            console.error('Error loading prayer times:', error);
            console.error('Error details:', error.message);
            // Use mock data as fallback
            this.prayerTimes = this.getMockPrayerTimes();
            console.log('Using mock prayer times as fallback');
        }
        
        // Update UI
        this.updatePrayerTimesUI();
        this.findNextPrayer();
        
        // Reschedule alarms with new times
        this.scheduleAlarms();
    }
    
    adjustTime(timeString, prayerName) {
        const adjustment = this.getPrayerAdjustment(prayerName);
        if (!adjustment || adjustment === 0) {
            return timeString;
        }
        
        // Parse time (format: "HH:MM")
        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes + adjustment, 0);
        
        // Format back to HH:MM
        const adjustedHours = String(date.getHours()).padStart(2, '0');
        const adjustedMinutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${adjustedHours}:${adjustedMinutes}`;
    }
    
    calculateMidnight(maghribTime, fajrTime) {
        // Parse times
        const [maghribHours, maghribMinutes] = maghribTime.split(':').map(Number);
        const [fajrHours, fajrMinutes] = fajrTime.split(':').map(Number);
        
        // Convert to minutes since midnight
        let maghribTotalMinutes = maghribHours * 60 + maghribMinutes;
        let fajrTotalMinutes = fajrHours * 60 + fajrMinutes;
        
        // If Fajr is earlier than Maghrib, it's next day
        if (fajrTotalMinutes < maghribTotalMinutes) {
            fajrTotalMinutes += 24 * 60; // Add 24 hours
        }
        
        // Calculate midpoint
        const midnightTotalMinutes = Math.floor((maghribTotalMinutes + fajrTotalMinutes) / 2);
        
        // Handle midnight adjustment
        const adjustment = this.getPrayerAdjustment('midnight');
        const adjustedMinutes = midnightTotalMinutes + adjustment;
        
        // Convert back to hours and minutes (handle overflow)
        let finalMinutes = adjustedMinutes % (24 * 60);
        if (finalMinutes < 0) finalMinutes += 24 * 60;
        
        const hours = Math.floor(finalMinutes / 60);
        const minutes = finalMinutes % 60;
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    getMockPrayerTimes() {
        return {
            imsak: '05:20',
            fajr: '05:30',
            sunrise: '06:45',
            dhuhr: '12:15',
            maghrib: '18:00',
            midnight: '00:15'
        };
    }
    
    updatePrayerTimesUI() {
        const prayers = ['imsak', 'fajr', 'sunrise', 'dhuhr', 'maghrib', 'midnight'];
        
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
            { name: 'المغرب', key: 'maghrib', time: this.prayerTimes.maghrib }
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
        // Clear any existing interval
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
        }
        
        if (!this.nextPrayer) {
            this.findNextPrayer();
        }
        
        if (!this.nextPrayer) return;
        
        // Update display immediately
        this.updateCurrentPrayerDisplay();
        
        // Update countdown immediately
        this.updateCountdown();
        
        // Start interval
        this.countdownInterval = setInterval(() => this.updateCountdown(), 1000);
    }
    
    updateCountdown() {
        if (!this.nextPrayer) {
            // If no next prayer, try to find it
            this.findNextPrayer();
            if (!this.nextPrayer) return;
            this.updateCurrentPrayerDisplay();
        }
        
        const now = new Date();
        const diff = this.nextPrayer.targetTime - now;
        
        if (diff <= 0) {
            // Prayer time reached - update immediately
            this.handlePrayerTimeReached();
            return;
        }
        
        // Check if we've passed the current prayer time (in case time changed)
        const currentTime = now.getHours() * 60 + now.getMinutes();
        const [prayerHours, prayerMinutes] = this.nextPrayer.time.split(':').map(Number);
        const prayerTime = prayerHours * 60 + prayerMinutes;
        
        // If current time has passed the prayer time, find next prayer and restart countdown
        if (prayerTime <= currentTime) {
            const oldPrayerName = this.nextPrayer ? this.nextPrayer.name : null;
            this.findNextPrayer();
            
            // If prayer changed, restart countdown immediately
            if (this.nextPrayer && this.nextPrayer.name !== oldPrayerName) {
                this.updateCurrentPrayerDisplay();
                // Restart countdown with new prayer
                this.startCountdown();
            }
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
    }
    
    async handlePrayerTimeReached() {
        // Clear the countdown interval first
        if (this.countdownInterval) {
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
        }
        
        // Play adhan sound
        this.playAdhan();
        
        this.showPrayerNotification();
        
        // Reload prayer times for next prayer
        await this.loadPrayerTimes();
        
        // Find the new next prayer
        this.findNextPrayer();
        
        // Update the current prayer display immediately
        this.updateCurrentPrayerDisplay();
        
        // Restart countdown with new prayer immediately
        this.startCountdown();
    }
    
    updateCurrentPrayerDisplay() {
        if (!this.nextPrayer) {
            // If no next prayer, find it
            this.findNextPrayer();
        }
        
        const prayerNameEl = document.getElementById('currentPrayerName');
        const prayerTimeEl = document.getElementById('currentPrayerTime');
        const statusLabelEl = document.getElementById('statusLabel');
        
        if (prayerNameEl && this.nextPrayer) {
            prayerNameEl.textContent = this.nextPrayer.name;
        }
        
        if (prayerTimeEl && this.nextPrayer) {
            prayerTimeEl.textContent = this.nextPrayer.time;
        }
        
        if (statusLabelEl) {
            statusLabelEl.textContent = 'الصلاة القادمة';
        }
    }
    
    showPrayerNotification() {
        // Show browser notification (works even when page is in background)
        if (Notification.permission === 'granted') {
            new Notification('حان وقت الصلاة', {
                body: `حان وقت ${this.nextPrayer.name}`,
                icon: '/assets/images/tahajad_logo.png',
                badge: '/assets/images/tahajad_logo.png',
                tag: 'prayer-time', // Replace previous notifications with same tag
                requireInteraction: false,
                silent: false // Ensure sound plays
            });
        } else if (Notification.permission === 'default') {
            // Request permission if not yet asked
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('حان وقت الصلاة', {
                        body: `حان وقت ${this.nextPrayer.name}`,
                        icon: '/assets/images/tahajad_logo.png',
                        tag: 'prayer-time'
            });
        }
            });
        }
        
        // Show toast only if element exists (on prayer times page)
        this.showToast(`حان وقت ${this.nextPrayer.name}!`, 'success');
    }
    
    playAdhan() {
        // Play adhan audio - works on all pages
        // Try multiple paths to ensure it works regardless of page location
        const audioPaths = [
            '/assets/audio/adhan.mp3',
            'assets/audio/adhan.mp3',
            '/assets/audio/adhan.mp3'
        ];
        
        let audioPlayed = false;
        for (const path of audioPaths) {
            const audio = new Audio(path);
            audio.play().then(() => {
                audioPlayed = true;
            }).catch(e => {
                // Try next path
                if (!audioPlayed && audioPaths.indexOf(path) === audioPaths.length - 1) {
                    console.log('Could not play adhan from any path:', e);
        }
            });
            if (audioPlayed) break;
        }
    }
    
    // ========== ALARMS ==========
    loadAlarms() {
        const saved = localStorage.getItem('prayerAlarms');
        return saved ? JSON.parse(saved) : {
            fajr: true,
            dhuhr: true,
            maghrib: true
        };
    }
    
    saveAlarms() {
        localStorage.setItem('prayerAlarms', JSON.stringify(this.alarms));
        // Reschedule alarms when saved
        this.scheduleAlarms();
    }
    
    updateAlarmButtons() {
        // Update alarm button states based on saved preferences
        Object.keys(this.alarms).forEach(prayerName => {
            const alarmBtn = document.querySelector(`[data-prayer="${prayerName}"] .alarm-btn`);
            if (alarmBtn) {
                if (this.alarms[prayerName]) {
                    alarmBtn.classList.add('active');
                } else {
                    alarmBtn.classList.remove('active');
                }
            }
        });
    }
    
    scheduleAlarms() {
        if (!this.prayerTimes) return;
        
        // Clear existing alarms
        this.clearAlarms();
        
        // Schedule alarms for enabled prayers
        const prayers = ['fajr', 'dhuhr', 'maghrib'];
        
        prayers.forEach(prayerName => {
            if (this.alarms[prayerName] && this.prayerTimes[prayerName]) {
                this.schedulePrayerAlarm(prayerName);
            }
        });
    }
    
    schedulePrayerAlarm(prayerName) {
        if (!this.prayerTimes || !this.prayerTimes[prayerName]) return;
        
        const [hours, minutes] = this.prayerTimes[prayerName].split(':').map(Number);
        const now = new Date();
        const alarmTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
        
        // If alarm time has passed today, schedule for tomorrow
        if (alarmTime <= now) {
            alarmTime.setDate(alarmTime.getDate() + 1);
        }
        
        const timeUntilAlarm = alarmTime.getTime() - now.getTime();
        
        // Only schedule if time is in the future and less than 24 hours
        if (timeUntilAlarm > 0 && timeUntilAlarm < 24 * 60 * 60 * 1000) {
            const prayerNames = {
                fajr: 'الفجر',
                dhuhr: 'الظهر',
                maghrib: 'المغرب'
            };
            
            // Clear existing timeout for this prayer
            if (this.alarmTimeouts[prayerName]) {
                clearTimeout(this.alarmTimeouts[prayerName]);
            }
            
            // Schedule new alarm
            this.alarmTimeouts[prayerName] = setTimeout(() => {
                this.triggerAlarm(prayerName, prayerNames[prayerName]);
                // Reschedule for next day
                delete this.alarmTimeouts[prayerName];
                this.schedulePrayerAlarm(prayerName);
            }, timeUntilAlarm);
        }
    }
    
    clearAlarms() {
        // Clear all existing alarm timeouts
        Object.values(this.alarmTimeouts).forEach(timeoutId => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        });
        this.alarmTimeouts = {};
    }
    
    triggerAlarm(prayerName, prayerNameArabic) {
        // Check if alarm is still enabled
        if (!this.alarms[prayerName]) return;
        
        // Show browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification('موعد الصلاة', {
                body: `حان وقت صلاة ${prayerNameArabic}`,
                icon: '/assets/images/logo1.png',
                badge: '/assets/images/logo1.png',
                tag: `prayer-${prayerName}`,
                requireInteraction: true
            });
            
            // Close notification after 10 seconds
            setTimeout(() => {
                notification.close();
            }, 10000);
            
            // Play sound if available
            this.playAlarmSound();
        }
        
        // Show toast notification
        this.showToast(`حان وقت صلاة ${prayerNameArabic}`, 'info');
    }
    
    playAlarmSound() {
        // Try to play a notification sound
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjGH0fPTgjMGHm7A7+OZURE=');
            audio.volume = 0.5;
            audio.play().catch(() => {
                // Ignore errors if audio can't play
            });
        } catch (e) {
            // Ignore errors
        }
    }
    
    requestNotificationPermission() {
        if ('Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        this.showToast('تم تفعيل الإشعارات', 'success');
                    } else if (permission === 'denied') {
                        this.showToast('تم رفض الإشعارات', 'info');
                    }
                });
            }
        }
    }
    
    // ========== PRAYER TIME ADJUSTMENTS ==========
    loadPrayerAdjustments() {
        const saved = localStorage.getItem('prayerTimeAdjustments');
        return saved ? JSON.parse(saved) : {
            imsak: 0,
            fajr: 0,
            dhuhr: 0,
            maghrib: 0,
            midnight: 0
        };
    }
    
    savePrayerAdjustments() {
        localStorage.setItem('prayerTimeAdjustments', JSON.stringify(this.prayerAdjustments));
    }
    
    getPrayerAdjustment(prayerName) {
        return this.prayerAdjustments[prayerName] || 0;
    }
    
    // ========== HIJRI DATE ADJUSTMENT ==========
    loadHijriDateAdjustment() {
        const saved = localStorage.getItem('hijriDateAdjustment');
        return saved ? parseInt(saved) : 0; // Days to adjust from API date
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Detect location button
        const detectBtn = document.getElementById('detectLocationBtn');
        if (detectBtn) {
            detectBtn.addEventListener('click', () => {
                this.detectLocation();
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
    
    async detectLocation() {
        if ('geolocation' in navigator) {
            this.showToast('جاري تحديد موقعك...', 'info');
            try {
                const position = await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, {
                        timeout: 15000,
                        enableHighAccuracy: true,
                        maximumAge: 0
                    });
                });
                
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                
                // Save user's actual coordinates
                this.userCoordinates = { lat, lng };
                this.saveUserCoordinates(this.userCoordinates);
                
                // Find closest city for display
                const closestCity = this.findClosestCity(lat, lng);
                const locationNameEl = document.getElementById('locationName');
                if (locationNameEl && closestCity) {
                    locationNameEl.textContent = closestCity.name;
                }
                
                // Reload prayer times with new coordinates
                await this.loadPrayerTimes();
                this.showToast(`تم تحديد موقعك: ${closestCity ? closestCity.name : 'موقعك الحالي'}`, 'success');
            } catch (error) {
                this.showToast('فشل تحديد الموقع', 'error');
            }
        } else {
            this.showToast('المتصفح لا يدعم تحديد الموقع', 'error');
        }
    }
    
    
    
    // ========== SETTINGS ==========
    loadSettings() {
        // Settings loading removed - no longer needed
    }
    
    saveSettings() {
        // Settings saving removed - no longer needed
    }
    
    // ========== UI HELPERS ==========
    showToast(message, type = 'success') {
        // Get or create toast element
        let toast = document.getElementById('prayerToast');
        
        if (!toast) {
            // Create toast element dynamically if it doesn't exist
            toast = document.createElement('div');
            toast.id = 'prayerToast';
            toast.className = 'prayer-toast';
            document.body.appendChild(toast);
            
            // Ensure CSS is loaded (add styles if needed)
            if (!document.getElementById('prayerToastStyles')) {
                const style = document.createElement('style');
                style.id = 'prayerToastStyles';
                style.textContent = `
                    .prayer-toast {
                        position: fixed;
                        top: 100px;
                        right: 20px;
                        padding: 1rem 1.5rem;
                        background: rgba(255, 255, 255, 0.1);
                        backdrop-filter: blur(20px) saturate(180%);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        border-radius: 12px;
                        color: var(--text-primary, #ffffff);
                        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                        z-index: 10001;
                        transform: translateX(400px);
                        transition: transform 0.3s ease;
                        font-size: 1rem;
                        font-weight: 500;
                        max-width: 350px;
                        word-wrap: break-word;
                    }
                    .prayer-toast.show {
                        transform: translateX(0);
                    }
                    .prayer-toast.success {
                        border-right: 4px solid #10b981;
                    }
                    .prayer-toast.error {
                        border-right: 4px solid #ef4444;
                    }
                    .prayer-toast.info {
                        border-right: 4px solid #3b82f6;
                    }
                `;
                document.head.appendChild(style);
            }
        }
        
        toast.textContent = message;
        toast.className = `prayer-toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
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
    
    const manager = window.prayerTimesManager;
    if (!manager) return;
    
    // Toggle alarm state
    alarmBtn.classList.toggle('active');
    manager.alarms[prayerName] = alarmBtn.classList.contains('active');
    manager.saveAlarms();
    
    // Request notification permission if enabling alarm
    if (manager.alarms[prayerName]) {
        manager.requestNotificationPermission();
    }
    
    const status = manager.alarms[prayerName] ? 'مفعّل' : 'معطّل';
    manager.showToast(`التنبيه ${status}`, 'info');
}

// ========== INITIALIZATION ==========
// Initialize globally on all pages
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize if not already initialized (prevent duplicates)
    if (!window.prayerTimesManager) {
    window.prayerTimesManager = new PrayerTimesManager();
    }
});

// Also initialize immediately if DOM is already loaded (for dynamic page loads)
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded, initialize immediately
    if (!window.prayerTimesManager) {
        window.prayerTimesManager = new PrayerTimesManager();
    }
}

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
