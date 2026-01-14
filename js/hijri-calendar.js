/* ====================================
   HIJRI CALENDAR FUNCTIONALITY
   Islamic calendar with special Shia dates and events
   ==================================== */

class HijriCalendarManager {
    constructor() {
        this.userData = this.getUserData();
        this.currentHijriMonth = null;
        this.currentHijriYear = null;
        this.currentGregorianDate = new Date();
        this.specialDays = []; // Will be loaded asynchronously
        
        if (!this.userData) {
            window.location.href = 'login_page.html';
            return;
        }
        
        this.init();
    }
    
    async init() {
        this.setupUserProfile();
        this.calculateCurrentHijriDate();
        // Load events asynchronously
        this.specialDays = await this.getShiaSpecialDays();
        this.renderCalendar();
        this.renderEventsList();
        this.setupEventListeners();
        this.currentEventFilter = 'all';
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
    
    // ========== HIJRI DATE CALCULATIONS ==========
    calculateCurrentHijriDate() {
        // Simple Hijri calculation (approximation)
        // In production, use proper Hijri date library
        const hijriDate = this.gregorianToHijri(this.currentGregorianDate);
        this.currentHijriMonth = hijriDate.month;
        this.currentHijriYear = hijriDate.year;
        
        // Update today's date display
        this.updateTodayDisplay(hijriDate);
    }
    
    gregorianToHijri(gregorianDate) {
        // Simplified conversion (use proper library in production)
        const epochDays = Math.floor((gregorianDate.getTime() - new Date(622, 6, 16).getTime()) / (1000 * 60 * 60 * 24));
        const hijriYear = Math.floor((epochDays * 30) / 10631) + 1;
        const remainingDays = epochDays - Math.floor(((hijriYear - 1) * 10631) / 30);
        const hijriMonth = Math.floor(remainingDays / 30) + 1;
        const hijriDay = Math.floor(remainingDays % 30) + 1;
        
        return {
            day: hijriDay,
            month: Math.min(hijriMonth, 12),
            year: hijriYear
        };
    }
    
    hijriToGregorian(hijriDay, hijriMonth, hijriYear) {
        // Simplified conversion
        const epochDays = Math.floor(((hijriYear - 1) * 10631) / 30) + (hijriMonth - 1) * 30 + hijriDay;
        const gregorianDate = new Date(622, 6, 16);
        gregorianDate.setDate(gregorianDate.getDate() + epochDays);
        return gregorianDate;
    }
    
    updateTodayDisplay(hijriDate) {
        // Update quick jump card with today's date
        const quickJumpHijri = document.getElementById('quickJumpHijri');
        const quickJumpGregorian = document.getElementById('quickJumpGregorian');
        
        if (quickJumpHijri) {
            const monthName = this.getHijriMonthName(hijriDate.month);
            quickJumpHijri.textContent = `${hijriDate.day} ${monthName} ${hijriDate.year} هـ`;
        }
        
        if (quickJumpGregorian) {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            quickJumpGregorian.textContent = this.currentGregorianDate.toLocaleDateString('ar-SA', options);
        }
    }
    
    getHijriMonthName(month) {
        const months = [
            'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
            'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
            'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
        ];
        return months[month - 1] || 'محرم';
    }
    
    // ========== SHIA SPECIAL DAYS DATABASE ==========
    async getShiaSpecialDays() {
        try {
            // Load events from JSON file
            const response = await fetch('../events_levant_1447.json');
            if (!response.ok) {
                throw new Error('Failed to load events');
            }
            const data = await response.json();
            
            // Map events from JSON to calendar format
            const events = data.events.map(event => {
                // Map type: "azza" -> "mourning" (red), "farah" -> "joyful" (green)
                let type = 'special'; // default
                if (event.type === 'azza') {
                    type = 'mourning';
                } else if (event.type === 'farah') {
                    type = 'joyful';
                }
                
                // Default actions based on type
                const defaultActions = {
                    'mourning': ['الدعاء', 'قراءة القرآن', 'الزيارة', 'إقامة العزاء'],
                    'joyful': ['الفرح والسرور', 'الصدقة', 'الدعاء', 'الصلاة'],
                    'special': ['الصلاة', 'قراءة القرآن', 'الدعاء']
                };
                
                return {
                    month: event.hijri_month,
                    day: event.hijri_day,
                    year: event.hijri_year,
                    name: event.title_ar,
                    type: type,
                    description: event.title_ar, // Use title as description
                    actions: defaultActions[type] || defaultActions['special']
                };
            });
            
            return events;
        } catch (error) {
            console.error('Error loading events:', error);
            // Return empty array if loading fails
            return [];
        }
    }
    
    getSpecialDayForDate(month, day) {
        return this.specialDays.find(sd => sd.month === month && sd.day === day);
    }
    
    // ========== RENDER CALENDAR ==========
    renderCalendar() {
        const currentMonthEl = document.getElementById('currentMonth');
        const currentYearEl = document.getElementById('currentYear');
        const calendarGrid = document.getElementById('calendarGrid');
        
        if (currentMonthEl) {
            currentMonthEl.textContent = this.getHijriMonthName(this.currentHijriMonth);
        }
        
        if (currentYearEl) {
            currentYearEl.textContent = `${this.currentHijriYear} هـ`;
        }
        
        if (calendarGrid) {
            calendarGrid.innerHTML = '';
            
            // Get days in month (29 or 30 for Hijri)
            const daysInMonth = 30; // Simplified, should calculate properly
            
            // Get first day of month
            const firstDay = this.hijriToGregorian(1, this.currentHijriMonth, this.currentHijriYear);
            const firstDayOfWeek = firstDay.getDay(); // 0 = Saturday in our case
            
            // Add empty cells for days before month starts
            for (let i = 0; i < firstDayOfWeek; i++) {
                const emptyCell = document.createElement('div');
                emptyCell.className = 'day-cell other-month';
                calendarGrid.appendChild(emptyCell);
            }
            
            // Current Hijri date
            const todayHijri = this.gregorianToHijri(new Date());
            
            // Add days of month
            for (let day = 1; day <= daysInMonth; day++) {
                const dayCell = this.createDayCell(day, todayHijri);
                calendarGrid.appendChild(dayCell);
            }
        }
    }
    
    createDayCell(day, todayHijri) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        
        // Check if special day
        const specialDay = this.getSpecialDayForDate(this.currentHijriMonth, day);
        if (specialDay) {
            cell.classList.add(specialDay.type);
        }
        
        // Check if today
        if (day === todayHijri.day && 
            this.currentHijriMonth === todayHijri.month && 
            this.currentHijriYear === todayHijri.year) {
            cell.classList.add('today');
        }
        
        // Hijri day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);
        
        // Gregorian date
        const gregorianDate = this.hijriToGregorian(day, this.currentHijriMonth, this.currentHijriYear);
        const dayGregorian = document.createElement('div');
        dayGregorian.className = 'day-gregorian';
        dayGregorian.textContent = gregorianDate.getDate() + '/' + (gregorianDate.getMonth() + 1);
        cell.appendChild(dayGregorian);
        
        // Event badge
        if (specialDay) {
            const badge = document.createElement('div');
            badge.className = 'event-badge';
            badge.textContent = '⭐';
            cell.appendChild(badge);
        }
        
        // Click event - make all days clickable
        cell.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (specialDay) {
                this.showEventDetails(specialDay, day);
                // Highlight the event in the events list (delayed to not interfere with scroll)
                requestAnimationFrame(() => {
                    this.highlightEventInList(specialDay);
                });
            } else {
                // Show message if no event on this day
                this.showToast('لا توجد مناسبة في هذا اليوم', 'info');
            }
        });
        
        return cell;
    }
    
    // ========== RENDER EVENTS LIST ==========
    renderEventsList(filter = 'all') {
        const eventsList = document.getElementById('eventsList');
        if (!eventsList) return;
        
        eventsList.innerHTML = '';
        
        // Filter events
        let filteredEvents = this.specialDays;
        if (filter === 'joyful') {
            filteredEvents = this.specialDays.filter(e => e.type === 'joyful');
        } else if (filter === 'mourning') {
            filteredEvents = this.specialDays.filter(e => e.type === 'mourning');
        }
        
        // Sort by month and day
        filteredEvents.sort((a, b) => {
            if (a.month !== b.month) return a.month - b.month;
            return a.day - b.day;
        });
        
        // Group by month
        const eventsByMonth = {};
        filteredEvents.forEach(event => {
            const monthName = this.getHijriMonthName(event.month);
            if (!eventsByMonth[monthName]) {
                eventsByMonth[monthName] = [];
            }
            eventsByMonth[monthName].push(event);
        });
        
        // Render events grouped by month
        Object.keys(eventsByMonth).forEach(monthName => {
            const monthSection = document.createElement('div');
            monthSection.className = 'events-month-section';
            
            const monthHeader = document.createElement('div');
            monthHeader.className = 'events-month-header';
            monthHeader.textContent = monthName;
            monthSection.appendChild(monthHeader);
            
            const monthEvents = document.createElement('div');
            monthEvents.className = 'events-month-list';
            
            eventsByMonth[monthName].forEach(event => {
                const eventItem = this.createEventListItem(event);
                monthEvents.appendChild(eventItem);
            });
            
            monthSection.appendChild(monthEvents);
            eventsList.appendChild(monthSection);
        });
    }
    
    createEventListItem(event) {
        const item = document.createElement('div');
        item.className = `event-list-item ${event.type}`;
        item.dataset.eventMonth = event.month;
        item.dataset.eventDay = event.day;
        
        const eventIcon = this.getEventIcon(event.type);
        const monthName = this.getHijriMonthName(event.month);
        
        item.innerHTML = `
            <div class="event-list-icon">${eventIcon}</div>
            <div class="event-list-content">
                <div class="event-list-name">${event.name}</div>
                <div class="event-list-date">${event.day} ${monthName}</div>
            </div>
        `;
        
        item.addEventListener('click', (e) => {
            // Prevent event bubbling to avoid scroll interference
            e.stopPropagation();
            
            // Show event details
            this.showEventDetails(event, event.day);
            
            // Navigate to the month in calendar (delayed to not interfere with scroll)
            requestAnimationFrame(() => {
                this.currentHijriMonth = event.month;
                this.currentHijriYear = event.year || this.currentHijriYear;
                this.renderCalendar();
            });
        });
        
        return item;
    }
    
    highlightEventInList(event) {
        // Remove previous highlights
        document.querySelectorAll('.event-list-item').forEach(item => {
            item.classList.remove('highlighted');
        });
        
        // Highlight the clicked event and scroll the events list to show it
        const eventItem = document.querySelector(
            `[data-event-month="${event.month}"][data-event-day="${event.day}"]`
        );
        if (eventItem) {
            eventItem.classList.add('highlighted');
            
            // Scroll the events list container to show the event
            const eventsListContainer = document.getElementById('eventsListContainer');
            if (eventsListContainer && eventItem) {
                const containerRect = eventsListContainer.getBoundingClientRect();
                const itemRect = eventItem.getBoundingClientRect();
                
                // Calculate scroll position to center the item in the container
                const scrollTop = eventsListContainer.scrollTop;
                const itemOffsetTop = eventItem.offsetTop;
                const containerHeight = eventsListContainer.clientHeight;
                const itemHeight = eventItem.offsetHeight;
                
                // Center the item in the container viewport
                const targetScrollTop = itemOffsetTop - (containerHeight / 2) + (itemHeight / 2);
                
                // Smooth scroll within the container
                eventsListContainer.scrollTo({
                    top: targetScrollTop,
                    behavior: 'smooth'
                });
            }
        }
    }
    
    getUpcomingEvents(count) {
        const today = this.gregorianToHijri(new Date());
        const upcoming = [];
        
        // Search through all special days
        for (const event of this.specialDays) {
            // Calculate if event is upcoming
            let daysUntil;
            
            if (event.month > today.month || 
                (event.month === today.month && event.day > today.day)) {
                // Event is this year
                const eventDate = this.hijriToGregorian(event.day, event.month, today.year);
                const todayDate = new Date();
                daysUntil = Math.ceil((eventDate - todayDate) / (1000 * 60 * 60 * 24));
            } else {
                // Event is next year
                const eventDate = this.hijriToGregorian(event.day, event.month, today.year + 1);
                const todayDate = new Date();
                daysUntil = Math.ceil((eventDate - todayDate) / (1000 * 60 * 60 * 24));
            }
            
            if (daysUntil >= 0) {
                upcoming.push({ ...event, daysUntil });
            }
        }
        
        // Sort by days until event
        upcoming.sort((a, b) => a.daysUntil - b.daysUntil);
        
        return upcoming.slice(0, count);
    }
    
    createEventCard(event) {
        const card = document.createElement('div');
        card.className = `event-card glass-card ${event.type}`;
        
        card.innerHTML = `
            <div class="event-card-header">
                <div class="event-icon">${this.getEventIcon(event.type)}</div>
                <div class="event-info">
                    <div class="event-name">${event.name}</div>
                    <div class="event-date-info">${event.day} ${this.getHijriMonthName(event.month)}</div>
                </div>
            </div>
            <div class="event-description">${event.description}</div>
            <div class="event-countdown">
                <span>⏱️</span>
                <span>بعد ${event.daysUntil} ${event.daysUntil === 1 ? 'يوم' : 'أيام'}</span>
            </div>
        `;
        
        card.addEventListener('click', () => {
            this.showEventDetails(event, event.day);
        });
        
        return card;
    }
    
    getEventIcon(type) {
        const icons = {
            'joyful': '🎉',
            'mourning': '🖤',
            'special': '⭐'
        };
        return icons[type] || '🕌';
    }
    
    // ========== EVENT MODAL ==========
    showEventDetails(event, day) {
        const modal = document.getElementById('eventModal');
        if (!modal) return;
        
        const eventIcon = document.getElementById('eventIcon');
        const eventTitle = document.getElementById('eventTitle');
        const eventDate = document.getElementById('eventDate');
        const eventDescription = document.getElementById('eventDescription');
        const eventActions = document.getElementById('eventActions');
        
        if (eventIcon) eventIcon.textContent = this.getEventIcon(event.type);
        if (eventTitle) eventTitle.textContent = event.name;
        if (eventDate) eventDate.textContent = `${day} ${this.getHijriMonthName(event.month)} ${this.currentHijriYear} هـ`;
        if (eventDescription) eventDescription.textContent = event.description;
        
        if (eventActions) {
            eventActions.innerHTML = '';
            event.actions.forEach(action => {
                const li = document.createElement('li');
                li.textContent = action;
                eventActions.appendChild(li);
            });
        }
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // ========== NAVIGATION ==========
    changeMonth(direction) {
        this.currentHijriMonth += direction;
        
        if (this.currentHijriMonth > 12) {
            this.currentHijriMonth = 1;
            this.currentHijriYear++;
        } else if (this.currentHijriMonth < 1) {
            this.currentHijriMonth = 12;
            this.currentHijriYear--;
        }
        
        this.renderCalendar();
    }
    
    goToToday() {
        const today = this.gregorianToHijri(new Date());
        this.currentHijriMonth = today.month;
        this.currentHijriYear = today.year;
        this.renderCalendar();
        this.showToast('تم الانتقال إلى اليوم الحالي', 'success');
    }
    
    showAllSpecialDays() {
        const modal = document.getElementById('specialDaysModal');
        const list = document.getElementById('specialDaysList');
        
        if (!modal || !list) return;
        
        list.innerHTML = '';
        
        this.specialDays.forEach(day => {
            const item = document.createElement('div');
            item.className = `special-day-item ${day.type}`;
            
            item.innerHTML = `
                <div class="special-day-header">
                    <span class="special-day-name">${day.name}</span>
                    <span class="special-day-date">${day.day} ${this.getHijriMonthName(day.month)}</span>
                </div>
                <div class="special-day-desc">${day.description}</div>
            `;
            
            item.addEventListener('click', () => {
                this.currentHijriMonth = day.month;
                this.renderCalendar();
                closeSpecialDaysModal();
                this.showToast(`تم الانتقال إلى ${this.getHijriMonthName(day.month)}`, 'info');
            });
            
            list.appendChild(item);
        });
        
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        const prevBtn = document.getElementById('prevMonth');
        const nextBtn = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (prevBtn) prevBtn.addEventListener('click', () => this.changeMonth(-1));
        if (nextBtn) nextBtn.addEventListener('click', () => this.changeMonth(1));
        if (todayBtn) todayBtn.addEventListener('click', () => this.goToToday());
        
        // Event filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const filter = tab.dataset.filter;
                this.currentEventFilter = filter;
                this.renderEventsList(filter);
            });
        });
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    window.apiManager.logout();
                }
            });
        }
    }
    
    // ========== HELPERS ==========
    showToast(message, type = 'success') {
        const toast = document.getElementById('calendarToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `calendar-toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ========== GLOBAL FUNCTIONS ==========
function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function closeSpecialDaysModal() {
    const modal = document.getElementById('specialDaysModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function setReminder() {
    // Notification API for reminders
    if ('Notification' in window && Notification.permission === 'granted') {
        window.calendarManager.showToast('تم تفعيل التذكير!', 'success');
    } else if ('Notification' in window && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                window.calendarManager.showToast('تم تفعيل التذكير!', 'success');
            }
        });
    } else {
        window.calendarManager.showToast('سيتم تذكيرك بهذا اليوم', 'info');
    }
    
    closeEventModal();
}

// Close modals on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        const modal = e.target.closest('.modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    }
});

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.calendarManager = new HijriCalendarManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HijriCalendarManager };
}

