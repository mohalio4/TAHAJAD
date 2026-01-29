/* ====================================
   CHALLENGES FUNCTIONALITY
   User challenge tracking with calendar
   ==================================== */

class ChallengesManager {
    constructor() {
        try {
        this.userData = this.getUserData();
            this.currentMonth = new Date().getMonth();
            this.currentYear = new Date().getFullYear();
            this.currentFilter = 'all';
            this.challenges = this.loadChallenges();
            this.editingChallengeId = null;
            this.selectedDate = null;
            this.challengeToDelete = null;
            
            // Don't require userData - allow guest access
        this.init();
        } catch (error) {
            console.error('Error initializing ChallengesManager:', error);
            this.showError('حدث خطأ في تحميل الصفحة');
        }
    }
    
    init() {
        try {
        this.setupUserProfile();
            this.renderCalendar();
            this.renderChallengesList();
            this.renderAchievements();
            // Update stats with calculated values - use multiple attempts to ensure DOM is ready
            // All values are calculated, never hardcoded
            this.updateStats();
            setTimeout(() => {
                this.updateStats(); // Recalculate to ensure accuracy
            }, 50);
            setTimeout(() => {
                this.updateStats(); // Final recalculation
            }, 200);
        this.setupEventListeners();
        } catch (error) {
            console.error('Error in init:', error);
            this.showError('حدث خطأ في تهيئة الصفحة');
        }
    }
    
    showError(message) {
        const toast = document.getElementById('challengeToast');
        if (toast) {
            toast.textContent = message;
            toast.className = 'challenge-toast show error';
            setTimeout(() => {
                toast.classList.remove('show');
            }, 5000);
        }
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
    
    // ========== CALENDAR ==========
    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        const currentMonthEl = document.getElementById('currentMonth');
        const currentYearEl = document.getElementById('currentYear');
        const quickJumpDate = document.getElementById('quickJumpDate');
        
        if (!calendarGrid) {
            console.error('Calendar grid not found');
            return;
        }
        
        // Update month/year display
        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                           'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        currentMonthEl.textContent = monthNames[this.currentMonth];
        currentYearEl.textContent = this.currentYear;
        
        // Update today's date
        const todayDate = new Date();
        if (quickJumpDate) {
            quickJumpDate.textContent = `${todayDate.getDate()} ${monthNames[todayDate.getMonth()]} ${todayDate.getFullYear()}`;
        }
        
        // Clear grid
        calendarGrid.innerHTML = '';
        
        // Get first day of month and number of days
        // JavaScript getDay() returns: 0=Sunday, 1=Monday, ..., 6=Saturday
        // Arabic week starts with Saturday (0), so we need to adjust
        const jsFirstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
        // Convert: Sunday(0) -> 1, Monday(1) -> 2, ..., Saturday(6) -> 0
        const firstDay = (jsFirstDay + 1) % 7;
        
        const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
        
        // Add empty cells for days before month starts
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell';
            emptyCell.style.visibility = 'hidden';
            calendarGrid.appendChild(emptyCell);
        }
        
        // Add day cells
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = this.createDayCell(day, todayDate);
            calendarGrid.appendChild(dayCell);
        }
    }
    
    createDayCell(day, today) {
        const cell = document.createElement('div');
        cell.className = 'day-cell';
        
        const date = new Date(this.currentYear, this.currentMonth, day);
        const dateStr = this.formatDate(date);
        
        // Check if today
        if (date.toDateString() === today.toDateString()) {
            cell.classList.add('today');
        }
        
        // Check completion status for this day
        const dayStatus = this.getDayStatus(dateStr);
        if (dayStatus === 'completed') {
            cell.classList.add('completed');
        } else if (dayStatus === 'partial') {
            cell.classList.add('partial');
        } else if (dayStatus === 'missed') {
            cell.classList.add('missed');
        }
        
        // Day number
        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        cell.appendChild(dayNumber);
        
        // Event badge if has challenges
        const dayChallenges = this.getChallengesForDate(dateStr);
        if (dayChallenges.length > 0) {
            const badge = document.createElement('div');
            badge.className = 'event-badge';
            cell.appendChild(badge);
        }
        
        // Click event
        cell.addEventListener('click', () => {
            // Toggle date selection: if clicking the same date, clear selection
            if (this.selectedDate === dateStr) {
                this.clearDateSelection();
            } else {
                this.selectedDate = dateStr;
                this.renderChallengesList(); // Update challenges list to show only this day's challenges
                // Popup removed - challenges now show only in the main table
            }
        });
        
        return cell;
    }
    
    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
    
    getDayStatus(dateStr) {
        const dayChallenges = this.getChallengesForDate(dateStr);
        if (dayChallenges.length === 0) return null;
        
        const completed = dayChallenges.filter(c => this.isChallengeCompletedForDate(c.id, dateStr)).length;
        const total = dayChallenges.length;
        
        if (completed === total) return 'completed';
        if (completed > 0) return 'partial';
        if (this.isDatePassed(dateStr)) return 'missed';
        return null;
    }
    
    isDatePassed(dateStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        return date < today;
    }
    
    getChallengesForDate(dateStr) {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        
        // JavaScript getDay(): 0=Sunday, 1=Monday, ..., 6=Saturday
        // Arabic week: 0=Saturday, 1=Sunday, 2=Monday, ..., 6=Friday
        const jsDayOfWeek = date.getDay();
        // Convert to Arabic week: Sunday(0) -> 1, Monday(1) -> 2, ..., Saturday(6) -> 0
        const arabicDayOfWeek = String((jsDayOfWeek + 1) % 7);
        
        return this.challenges.filter(challenge => {
            // Check if challenge has started (date >= startDate)
            // For backward compatibility: if no startDate, assume challenge has started
            if (challenge.startDate) {
                const startDate = new Date(challenge.startDate);
                startDate.setHours(0, 0, 0, 0);
                if (date < startDate) {
                    return false; // Challenge hasn't started yet
                }
            }
            
            // Check if challenge has ended
            // When marking a challenge, we mark days from startDate to startDate + days - 1
            // So the last valid day is startDate + days - 1, and we should exclude dates >= startDate + days
            const days = challenge.days || challenge.repetition || 30; // Support old format
            const isUnlimited = days === -1 || days === 'unlimited' || days === null;
            
            // Unlimited challenges never end - skip the end date check
            if (!isUnlimited && challenge.startDate) {
                const startDate = new Date(challenge.startDate);
                startDate.setHours(0, 0, 0, 0);
                const endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + days); // This is the first day AFTER the challenge period
                if (date >= endDate) {
                    return false; // Challenge has ended (date is on or after the day after the last marked day)
                }
            }
            
            // Check if challenge applies to this day
            if (challenge.type === 'daily') {
                return true;
            } else if (challenge.type === 'specific') {
                // Check if this day is in the challenge's daysOfWeek array
                return challenge.daysOfWeek && challenge.daysOfWeek.includes(arabicDayOfWeek);
            }
            return false;
        });
    }
    
    // ========== CHALLENGES MANAGEMENT ==========
    loadChallenges() {
        const stored = localStorage.getItem('userChallenges');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveChallenges(skipRender = false) {
        localStorage.setItem('userChallenges', JSON.stringify(this.challenges));
        if (!skipRender) {
            this.updateStats(); // Update stats first
            this.renderChallengesList();
            this.renderCalendar();
            this.renderAchievements();
            this.updateStats(); // Update again after rendering
        }
    }
    
    renderChallengesList() {
        console.log('[Render] renderChallengesList() called');
        const challengesList = document.getElementById('challengesList');
        if (!challengesList) {
            console.error('Challenges list container not found');
            return;
        }
        
        // Filter challenges by category
        let filtered = this.challenges;
        if (this.currentFilter === 'aamal') {
            filtered = this.challenges.filter(c => c.category === 'aamal');
        } else if (this.currentFilter === 'tatwir') {
            filtered = this.challenges.filter(c => c.category === 'tatwir');
        }
        
        // If a date is selected, filter to show only challenges that apply to that date
        if (this.selectedDate) {
            filtered = filtered.filter(challenge => {
                const dayChallenges = this.getChallengesForDate(this.selectedDate);
                return dayChallenges.some(c => c.id === challenge.id);
            });
        }
        
        if (filtered.length === 0) {
            let emptyMessage = 'لا توجد تحديات بعد';
            let emptySubtext = 'ابدأ بإضافة تحدٍ جديد';
            
            if (this.selectedDate) {
                emptyMessage = 'لا توجد تحديات لهذا اليوم';
                emptySubtext = 'اختر يوماً آخر أو أضف تحديات جديدة';
            }
            
            challengesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📋</div>
                    <p class="empty-text">${emptyMessage}</p>
                    <p class="empty-subtext">${emptySubtext}</p>
                    ${this.selectedDate ? `<button class="btn-clear-date" onclick="challengesManager.clearDateSelection()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: var(--glass-bg); border: 1px solid var(--glass-border); border-radius: 8px; color: var(--text-primary); cursor: pointer;">عرض جميع التحديات</button>` : ''}
                </div>
            `;
            return;
        }
        
        // Clear existing content first to force DOM update
        challengesList.innerHTML = '';
        
        // Force a reflow to ensure DOM is cleared
        void challengesList.offsetHeight;
        
        // Now set the new content
        // Generate fresh HTML for each challenge - this ensures progress is recalculated
        const challengesHTML = filtered.map(challenge => {
            // Get fresh challenge data from array to ensure we have latest data
            const currentChallenge = this.challenges.find(c => c.id === challenge.id) || challenge;
            return this.createChallengeItemHTML(currentChallenge);
        }).join('');
        
        // Now set the new content
        challengesList.innerHTML = challengesHTML;
        
        // Attach event listeners
        filtered.forEach(challenge => {
            this.attachChallengeListeners(challenge);
        });
    }
    
    createChallengeItemHTML(challenge) {
        const categoryNames = {
            'aamal': 'أعمال',
            'tatwir': 'تطوير الذات'
        };
        
        const today = this.formatDate(new Date());
        // Use selected date if available, otherwise use today
        const checkDate = this.selectedDate || today;
        
        // Check if challenge has started (for backward compatibility, if no startDate, assume it started)
        const hasStarted = !challenge.startDate || this.isDateOnOrAfter(checkDate, challenge.startDate);
        const isCompletedForDate = hasStarted && this.isChallengeCompletedForDate(challenge.id, checkDate);
        
        // Escape HTML to prevent XSS
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        // Check if this is a Quran reading challenge, Ahad challenge, or Ziyarat challenge
        const isQuranChallenge = challenge.title === 'قراءة القرآن';
        const isAhadChallenge = challenge.title === 'عهد الأربعين صباحاً';
        const isZiyaratChallenge = challenge.title === 'زيارة عاشوراء';
        
        return `
            <div class="challenge-item" data-challenge-id="${challenge.id}">
                ${isQuranChallenge ? `<img src="${window.Laravel?.imagePaths?.quran || '/assets/images/quran.jpg'}" alt="قراءة القرآن" class="challenge-item-background">` : ''}
                ${isAhadChallenge ? `<img src="${window.Laravel?.imagePaths?.aahd || '/assets/images/aahd.jpg'}" alt="عهد الأربعين صباحاً" class="challenge-item-background">` : ''}
                ${isZiyaratChallenge ? `<img src="${window.Laravel?.imagePaths?.ziyara || '/assets/images/ziyara.jpg'}" alt="زيارة عاشوراء" class="challenge-item-background">` : ''}
                ${(isQuranChallenge || isAhadChallenge || isZiyaratChallenge) ? `<div class="challenge-item-overlay"></div>` : ''}
                <div class="challenge-item-wrapper">
                    <div class="challenge-item-header">
                        <label class="challenge-item-checkbox" ${!hasStarted ? 'style="opacity: 0.5; cursor: not-allowed;"' : ''}>
                            <input type="checkbox" 
                                   ${isCompletedForDate ? 'checked' : ''} 
                                   ${!hasStarted ? 'disabled' : ''}
                                   data-challenge-id="${challenge.id}"
                                   data-check-date="${checkDate}">
                            <span class="checkbox-custom"></span>
                        </label>
                        <div class="challenge-item-content">
                            <h3 class="challenge-item-title">${escapeHtml(challenge.title)}</h3>
                            ${challenge.description ? `<p class="challenge-item-description">${escapeHtml(challenge.description)}</p>` : ''}
                            <div class="challenge-item-meta">
                                <span class="challenge-item-category">${categoryNames[challenge.category] || challenge.category}</span>
                                <span>•</span>
                                <span>${(challenge.days === -1 || challenge.days === 'unlimited' || challenge.days === null) ? 'غير محدود' : (challenge.days || challenge.repetition || 30)} ${(challenge.days === -1 || challenge.days === 'unlimited' || challenge.days === null) ? '' : 'يوم'}</span>
                                ${!hasStarted && challenge.startDate ? `<span>•</span><span style="color: var(--text-muted); font-size: 0.7rem;">يبدأ من ${challenge.startDate}</span>` : ''}
                            </div>
                            ${hasStarted ? this.createProgressHTML(challenge) : ''}
                        </div>
                    </div>
                    <div class="challenge-item-actions">
                        <button class="challenge-item-btn edit" data-challenge-id="${challenge.id}" title="تعديل">
                            ✏️
                        </button>
                        <button class="challenge-item-btn delete" data-challenge-id="${challenge.id}" title="حذف">
                            🗑️
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    createProgressHTML(challenge) {
        // Always get fresh progress calculation - force recalculation every time
        // Get the current challenge from the array to ensure we have the latest data
        const currentChallenge = this.challenges.find(c => c.id === challenge.id) || challenge;
        const progress = this.getChallengeProgress(currentChallenge);
        
        const completed = progress.completed;
        const total = progress.total;
        const isUnlimited = progress.isUnlimited;
        
        // Escape HTML to prevent XSS
        const escapeHtml = (text) => {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        };
        
        // Generate unique ID to force DOM update
        const progressId = `progress-${currentChallenge.id}-${Date.now()}`;
        
        // For unlimited challenges, show different UI
        if (isUnlimited) {
            return `
                <div class="challenge-progress" id="${progressId}" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--glass-border);">
                    <div class="progress-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                        <span style="font-size: 0.875rem; color: var(--text-secondary);">التقدم</span>
                        <span class="progress-count" style="font-size: 0.875rem; font-weight: 600; color: var(--secondary);">
                            ${escapeHtml(String(completed))} يوم مكتمل
                        </span>
                    </div>
                    <div style="text-align: left; margin-top: 0.25rem; font-size: 0.75rem; color: var(--text-muted);">
                        <span style="color: var(--secondary); font-weight: 600; font-size: 1rem;">∞</span> غير محدود
                    </div>
                </div>
            `;
        }
        
        // For limited challenges, show progress bar and percentage
        const percentage = Math.max(0, Math.min(100, progress.percentage));
        
        return `
            <div class="challenge-progress" id="${progressId}" style="margin-top: 0.75rem; padding-top: 0.75rem; border-top: 1px solid var(--glass-border);">
                <div class="progress-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.875rem; color: var(--text-secondary);">التقدم</span>
                    <span class="progress-count" style="font-size: 0.875rem; font-weight: 600; color: var(--secondary);">
                        ${escapeHtml(String(completed))} / ${escapeHtml(String(total))} يوم
                    </span>
                </div>
                <div class="progress-bar-container" style="width: 100%; height: 8px; background: var(--glass-bg); border-radius: 4px; overflow: hidden; border: 1px solid var(--glass-border); position: relative;">
                    <div class="progress-bar-fill" data-progress="${percentage}" style="height: 100%; background: linear-gradient(90deg, var(--secondary), var(--primary)); border-radius: 4px; transition: width 0.3s ease; width: ${percentage}%; min-width: ${percentage > 0 ? '2px' : '0'}; display: block;"></div>
                </div>
                <div class="progress-percentage" style="text-align: left; margin-top: 0.25rem; font-size: 0.75rem; color: var(--text-muted);">
                    ${escapeHtml(String(percentage))}% مكتمل
                </div>
            </div>
        `;
    }
    
    isDateOnOrAfter(dateStr1, dateStr2) {
        const date1 = new Date(dateStr1);
        const date2 = new Date(dateStr2);
        date1.setHours(0, 0, 0, 0);
        date2.setHours(0, 0, 0, 0);
        return date1 >= date2;
    }
    
    attachChallengeListeners(challenge) {
        const challengeItem = document.querySelector(`[data-challenge-id="${challenge.id}"]`);
        if (!challengeItem) {
            console.warn('Challenge item not found for:', challenge.id);
            return;
        }
        
        // Checkbox listener - remove old one first, then add new
        const checkbox = challengeItem.querySelector('input[type="checkbox"]');
        if (checkbox) {
            // Clone to remove all event listeners
            const label = checkbox.parentElement;
            const newCheckbox = checkbox.cloneNode(true);
            const newLabel = label.cloneNode(false);
            newLabel.appendChild(newCheckbox);
            newLabel.appendChild(label.querySelector('.checkbox-custom').cloneNode(true));
            label.parentNode.replaceChild(newLabel, label);
            
            // Add fresh event listener
            newCheckbox.addEventListener('change', (e) => {
                e.preventDefault();
                e.stopPropagation();
                // Get the date to check from the checkbox data attribute or use selected date or today
                const checkDate = e.target.dataset.checkDate || this.selectedDate || this.formatDate(new Date());
                if (e.target.checked === (localStorage.getItem(`challenge_${challenge.id}_${checkDate}`) === 'true')) {
                    return; // Already in correct state, ignore
                }
                const isChecked = e.target.checked;
                console.log('Checkbox changed for challenge:', challenge.id, 'checked:', isChecked, 'date:', checkDate);
                this.toggleChallengeComplete(challenge.id, isChecked, checkDate);
            });
        } else {
            console.warn('Checkbox not found for challenge:', challenge.id);
        }
        
        // Edit button
        const editBtn = challengeItem.querySelector('.edit');
        if (editBtn) {
            editBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.editChallenge(challenge.id);
            });
        }
        
        // Delete button
        const deleteBtn = challengeItem.querySelector('.delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.deleteChallenge(challenge.id);
            });
        }
    }
    
    toggleChallengeComplete(challengeId, isChecked = null, targetDateStr = null) {
        try {
            // Use target date if provided (from selected date), otherwise use today
            const baseDate = targetDateStr ? new Date(targetDateStr) : new Date();
            baseDate.setHours(0, 0, 0, 0);
            const baseDateStr = this.formatDate(baseDate);
            
            // Check if challenge has started
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                console.error('Challenge not found:', challengeId);
                return;
            }
            
            if (challenge.startDate) {
                if (!this.isDateOnOrAfter(baseDateStr, challenge.startDate)) {
                    this.showToast('هذا التحدي لم يبدأ بعد', 'error');
                    return;
                }
            }
            
            // Determine if we should mark or unmark based on checkbox state or localStorage
            let shouldMark;
            if (isChecked !== null) {
                // Use checkbox state directly (passed from event)
                shouldMark = isChecked;
            } else {
                // Fallback: check localStorage
                const baseKey = `challenge_${challengeId}_${baseDateStr}`;
                const isBaseDateCompleted = localStorage.getItem(baseKey) === 'true';
                shouldMark = !isBaseDateCompleted;
            }
            
            // Mark only the single day (the selected date or today)
            const completionKey = `challenge_${challengeId}_${baseDateStr}`;
            
            console.log(`[Daily Challenge] ${shouldMark ? 'Marking' : 'Unmarking'} single day: ${baseDateStr}`);
            
            if (shouldMark) {
                // Mark only this single day
                localStorage.setItem(completionKey, 'true');
                console.log(`[Mark] Stored completion for ${completionKey}`);
                
                // Update challenge data - add completion date if not already tracked
                if (!challenge.completedDates) {
                    challenge.completedDates = [];
                }
                if (!challenge.completedDates.includes(baseDateStr)) {
                    challenge.completedDates.push(baseDateStr);
                    challenge.lastCompleted = baseDateStr;
                    challenge.totalCompleted = (challenge.totalCompleted || 0) + 1;
                    this.saveChallenges(true); // Save updated challenge data without rendering (will render after)
                }
                
                this.showToast('تم إكمال التحدي لهذا اليوم! 🎉', 'success');
                this.checkAchievements();
            } else {
                // Unmark only this single day
                localStorage.removeItem(completionKey);
                console.log(`[Unmark] Removed completion for ${completionKey}`);
                
                // Update challenge data - remove completion date
                if (challenge.completedDates) {
                    const hadDate = challenge.completedDates.includes(baseDateStr);
                    challenge.completedDates = challenge.completedDates.filter(date => date !== baseDateStr);
                    // Update lastCompleted to the most recent date if any remain
                    if (challenge.completedDates.length > 0) {
                        challenge.lastCompleted = challenge.completedDates.sort().reverse()[0];
                    } else {
                        challenge.lastCompleted = null;
                    }
                    if (hadDate && challenge.totalCompleted > 0) {
                        challenge.totalCompleted = Math.max(0, (challenge.totalCompleted || 0) - 1);
                    }
                    this.saveChallenges(true); // Save updated challenge data without rendering (will render after)
                }
                
                this.showToast('تم إلغاء إكمال التحدي لهذا اليوم', 'info');
            }
            
            console.log('[Mark/Unmark] Calling renderChallengesList() to update progress...');
            // Update stats immediately (synchronously) to ensure values are updated
            this.updateStats();
            // Then update DOM in next frame
            requestAnimationFrame(() => {
                this.renderChallengesList();
                this.renderCalendar();
                this.updateStats(); // Update again to ensure consistency
                });
            } catch (error) {
            console.error('Error in toggleChallengeComplete:', error);
            this.showToast('حدث خطأ في إكمال التحدي', 'error');
        }
    }
    
    isChallengeCompletedForDate(challengeId, dateStr) {
        const completionKey = `challenge_${challengeId}_${dateStr}`;
        return localStorage.getItem(completionKey) === 'true';
    }
    
    getChallengeProgress(challenge) {
        // Always get fresh challenge data from the challenges array
        const currentChallenge = this.challenges.find(c => c.id === challenge.id) || challenge;
        
        if (!currentChallenge.startDate) {
            // If no start date, can't calculate progress
            const challengeDays = currentChallenge.days || currentChallenge.repetition || 30;
            const isUnlimited = challengeDays === -1 || challengeDays === 'unlimited' || challengeDays === null;
            return { completed: 0, total: isUnlimited ? -1 : challengeDays, percentage: 0, isUnlimited };
        }
        
        const challengeDays = currentChallenge.days || currentChallenge.repetition || 30;
        const isUnlimited = challengeDays === -1 || challengeDays === 'unlimited' || challengeDays === null;
        const totalDays = isUnlimited ? -1 : challengeDays;
        const startDate = new Date(currentChallenge.startDate);
        startDate.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        // For unlimited challenges, check from startDate to today (no end date)
        // For limited challenges, calculate end date (startDate + totalDays - 1)
        let endDate;
        let checkUntil;
        if (isUnlimited) {
            // Unlimited: check from startDate to today (no end date)
            checkUntil = today;
            endDate = null;
        } else {
            // Limited: calculate end date
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + totalDays - 1);
            checkUntil = today < endDate ? today : endDate;
        }
        
        // Count completed days from startDate to checkUntil
        let completed = 0;
        
        // Count all completed days by checking localStorage directly
        // Use a proper date iteration to avoid mutation issues
        const startTime = startDate.getTime();
        const endTime = checkUntil.getTime();
        const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
        const maxIterations = 1000; // Safety limit
        let iterations = 0;
        
        // Always read fresh from localStorage - don't cache anything
        // Debug: Log what we're checking
        const checkedDates = [];
        for (let time = startTime; time <= endTime && iterations < maxIterations; time += oneDay) {
            const checkDate = new Date(time);
            const dateStr = this.formatDate(checkDate);
            const completionKey = `challenge_${currentChallenge.id}_${dateStr}`;
            
            // Direct localStorage access - always fresh
            const isCompleted = localStorage.getItem(completionKey) === 'true';
            
            checkedDates.push({ date: dateStr, completed: isCompleted, key: completionKey });
            
            if (isCompleted) {
                completed++;
            }
            
            iterations++;
        }
        
        // Also check if we can find any completion keys in localStorage for this challenge
        // This helps debug if dates are stored with different formats
        // AND count ALL completed days, even if they're outside the expected range
        let foundKeys = [];
        let allCompletedCount = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`challenge_${currentChallenge.id}_`)) {
                const dateFromKey = key.replace(`challenge_${currentChallenge.id}_`, '');
                const value = localStorage.getItem(key);
                foundKeys.push({ key, date: dateFromKey, value });
                if (value === 'true') {
                    allCompletedCount++;
                }
            }
        }
        
        // If we found more completed days in localStorage than in our date range check,
        // use the localStorage count (it's more accurate)
        if (allCompletedCount > completed) {
            console.log(`[Progress] Found ${allCompletedCount} completed days in localStorage, but only ${completed} in date range. Using localStorage count.`);
            completed = allCompletedCount;
        }
        
        // Debug: Log all checked dates and their status
        console.log(`[Progress] Challenge "${currentChallenge.title}" (${currentChallenge.id}):`);
        console.log(`  Checking ${checkedDates.length} days from ${this.formatDate(startDate)} to ${this.formatDate(checkUntil)}${isUnlimited ? ' (Unlimited)' : ''}`);
        console.log(`  Total days in challenge: ${isUnlimited ? '∞ (Unlimited)' : totalDays}`);
        console.log(`  Found ${foundKeys.length} completion keys in localStorage:`, foundKeys.map(k => `${k.date}(${k.value})`));
        console.log(`  Completed in range: ${completed}/${totalDays}`);
        
        // Show first 10 and last 10 for brevity
        const showCount = Math.min(10, checkedDates.length);
        console.log(`  First ${showCount} days:`);
        checkedDates.slice(0, showCount).forEach((item, idx) => {
            console.log(`    ${item.completed ? '✓' : '✗'} Day ${idx + 1}: ${item.date}`);
        });
        if (checkedDates.length > 20) {
            console.log(`  ... (${checkedDates.length - 20} more days) ...`);
            console.log(`  Last ${showCount} days:`);
            checkedDates.slice(-showCount).forEach((item, idx) => {
                const dayNum = checkedDates.length - showCount + idx + 1;
                console.log(`    ${item.completed ? '✓' : '✗'} Day ${dayNum}: ${item.date}`);
            });
        } else if (checkedDates.length > showCount) {
            checkedDates.slice(showCount).forEach((item, idx) => {
                console.log(`    ${item.completed ? '✓' : '✗'} Day ${showCount + idx + 1}: ${item.date}`);
            });
        }
        
        // For unlimited challenges, show days completed without percentage
        // For limited challenges, calculate percentage
        let percentage;
        if (isUnlimited) {
            percentage = -1; // -1 means unlimited (no percentage)
        } else {
            percentage = totalDays > 0 ? Math.round((completed / totalDays) * 100) : 0;
        }
        
        console.log(`  Final: ${completed}/${isUnlimited ? '∞' : totalDays} = ${isUnlimited ? 'Unlimited' : percentage + '%'}`);
        
        return { completed, total: totalDays, percentage, isUnlimited };
    }
    
    // ========== MODAL MANAGEMENT ==========
    openAddChallengeModal() {
        try {
            this.editingChallengeId = null;
            const modalTitle = document.getElementById('modalTitle');
            const challengeForm = document.getElementById('challengeForm');
            const challengeCategory = document.getElementById('challengeCategory');
            const challengeType = document.getElementById('challengeType');
            const daysOfWeekGroup = document.getElementById('daysOfWeekGroup');
            const challengeModal = document.getElementById('challengeModal');
            
            if (!modalTitle || !challengeForm || !challengeCategory || !challengeType || !challengeModal) {
                console.error('Modal elements not found');
                this.showToast('خطأ في تحميل النموذج', 'error');
                return;
            }
            
            modalTitle.textContent = 'إضافة تحدٍ جديد';
            challengeForm.reset();
            challengeCategory.value = 'aamal';
            challengeType.value = 'daily';
            
            // Reset unlimited checkbox
            const unlimitedCheckbox = document.getElementById('unlimitedDays');
            const daysInput = document.getElementById('challengeDays');
            if (unlimitedCheckbox) {
                unlimitedCheckbox.checked = false;
            }
            if (daysInput) {
                daysInput.disabled = false;
                daysInput.value = '30';
            }
            
            // Reset category buttons
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.category === 'aamal') {
                    btn.classList.add('active');
                }
            });
            
            if (daysOfWeekGroup) {
                daysOfWeekGroup.style.display = 'none';
            }
            
            challengeModal.style.display = 'flex';
        } catch (error) {
            console.error('Error opening add challenge modal:', error);
            this.showToast('حدث خطأ في فتح النموذج', 'error');
        }
    }
    
    closeChallengeModal() {
        const modal = document.getElementById('challengeModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.editingChallengeId = null;
    }
    
    editChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        this.editingChallengeId = challengeId;
        document.getElementById('modalTitle').textContent = 'تعديل التحدي';
        document.getElementById('challengeTitle').value = challenge.title;
        document.getElementById('challengeDescription').value = challenge.description || '';
        document.getElementById('challengeCategory').value = challenge.category;
        // Support both old (repetition) and new (days) format
        const daysInput = document.getElementById('challengeDays');
        const unlimitedCheckbox = document.getElementById('unlimitedDays');
        if (daysInput) {
            const challengeDays = challenge.days || challenge.repetition || 30;
            if (challengeDays === -1 || challengeDays === 'unlimited' || challengeDays === null) {
                // Challenge is unlimited
                if (unlimitedCheckbox) {
                    unlimitedCheckbox.checked = true;
                }
                daysInput.value = '';
                daysInput.disabled = true;
        } else {
                if (unlimitedCheckbox) {
                    unlimitedCheckbox.checked = false;
                }
                daysInput.value = challengeDays;
                daysInput.disabled = false;
            }
        }
        document.getElementById('challengeType').value = challenge.type;
        
        // Update category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === challenge.category) {
                btn.classList.add('active');
            }
        });
        
        // Update type and days
        if (challenge.type === 'specific') {
            document.getElementById('daysOfWeekGroup').style.display = 'block';
            document.querySelectorAll('.day-checkbox input').forEach(checkbox => {
                checkbox.checked = challenge.daysOfWeek && challenge.daysOfWeek.includes(checkbox.value);
            });
        } else {
            document.getElementById('daysOfWeekGroup').style.display = 'none';
        }
        
        document.getElementById('challengeModal').style.display = 'flex';
    }
    
    saveChallenge() {
        const titleInput = document.getElementById('challengeTitle');
        const descriptionInput = document.getElementById('challengeDescription');
        const categoryInput = document.getElementById('challengeCategory');
        const daysInput = document.getElementById('challengeDays');
        const typeInput = document.getElementById('challengeType');
        
        if (!titleInput || !categoryInput || !daysInput || !typeInput) {
            this.showToast('خطأ في تحميل النموذج', 'error');
            return;
        }
        
        const title = titleInput.value.trim();
        const description = descriptionInput ? descriptionInput.value.trim() : '';
        const category = categoryInput.value;
        const unlimitedCheckbox = document.getElementById('unlimitedDays');
        const isUnlimited = unlimitedCheckbox && unlimitedCheckbox.checked;
        const days = isUnlimited ? -1 : (parseInt(daysInput.value) || 30);
        const type = typeInput.value;
        
        if (!title) {
            this.showToast('يرجى إدخال عنوان التحدي', 'error');
            titleInput.focus();
            return;
        }
        
        if (!isUnlimited && days < 1) {
            this.showToast('عدد الأيام يجب أن يكون أكبر من صفر', 'error');
            daysInput.focus();
            return;
        }
        
        let daysOfWeek = null;
        if (type === 'specific') {
            const checkedDays = document.querySelectorAll('.day-checkbox input:checked');
            daysOfWeek = Array.from(checkedDays).map(cb => cb.value);
            if (daysOfWeek.length === 0) {
                this.showToast('يرجى اختيار أيام الأسبوع', 'error');
                return;
            }
        }
        
        if (this.editingChallengeId) {
            // Update existing challenge - preserve startDate
            const index = this.challenges.findIndex(c => c.id === this.editingChallengeId);
            if (index !== -1) {
                const existingChallenge = this.challenges[index];
                this.challenges[index] = {
                    ...existingChallenge,
                    title,
                    description,
                    category,
                    days, // Changed from repetition to days
                    type,
                    daysOfWeek
                    // startDate is preserved from existingChallenge
                };
                this.showToast('تم تحديث التحدي بنجاح', 'success');
        } else {
                this.showToast('لم يتم العثور على التحدي', 'error');
                return;
            }
        } else {
            // Add new challenge - start from today
            const today = this.formatDate(new Date());
            const newChallenge = {
                id: Date.now().toString(),
                title,
                description,
                category,
                days, // Number of days for the challenge
                type,
                daysOfWeek,
                startDate: today, // Challenge starts from today, not past dates
                createdAt: new Date().toISOString()
            };
            this.challenges.push(newChallenge);
            this.showToast('تم إضافة التحدي بنجاح', 'success');
        }
        
        this.saveChallenges();
        this.closeChallengeModal();
    }
    
    addReadyChallenge(type) {
        const readyChallenges = {
            quran: {
                title: 'قراءة القرآن',
                description: 'اقرأ صفحة من القرآن الكريم يومياً',
                category: 'aamal',
                days: -1, // Unlimited
                type: 'daily'
            },
            prayer: {
                title: 'عهد الأربعين صباحاً',
                description: 'عن الإمام الصادق (عليه السلام) أنه قال: (مَنْ دَعَا إِلَى اللَّهِ أَرْبَعِينَ صَبَاحاً بِهَذَا الْعَهْدِ كَانَ مِنْ أَنْصَارِ قَائِمِنَا)',
                category: 'aamal',
                days: 40, // 40 days
                type: 'daily'
            },
            dhikr: {
                title: 'زيارة عاشوراء',
                description: 'عن الباقر عليه السلام قال: لو يعلم الناس ما في زيارة الحسين عليه السلام من الفضل لماتوا شوقاً',
                category: 'aamal',
                days: -1, // Unlimited
                type: 'daily'
            }
        };
        
        const challengeData = readyChallenges[type];
        if (!challengeData) {
            this.showToast('نوع التحدي غير معروف', 'error');
            return;
        }
        
        // Check if challenge already exists
        const exists = this.challenges.some(c => 
            c.title === challengeData.title && 
            c.category === challengeData.category
        );
        
        if (exists) {
            this.showToast('هذا التحدي موجود بالفعل', 'info');
            return;
        }
        
        // Add the challenge
        const today = this.formatDate(new Date());
        const newChallenge = {
            id: Date.now().toString(),
            ...challengeData,
            startDate: today,
            createdAt: new Date().toISOString()
        };
        
        this.challenges.push(newChallenge);
        this.saveChallenges();
        this.showToast(`تم إضافة "${challengeData.title}" بنجاح`, 'success');
    }
    
    deleteChallenge(challengeId) {
        // Store the challenge ID to delete
        this.challengeToDelete = challengeId;
        
        // Get challenge title for display
        const challenge = this.challenges.find(c => c.id === challengeId);
        const challengeTitle = challenge ? challenge.title : 'هذا التحدي';
        
        // Update modal message
        const modalBody = document.querySelector('#deleteConfirmModal .modal-body p');
        if (modalBody) {
            modalBody.textContent = `هل أنت متأكد من حذف "${challengeTitle}"؟`;
        }
        
        // Show confirmation modal
        const modal = document.getElementById('deleteConfirmModal');
        if (modal) {
        modal.style.display = 'flex';
        }
    }
    
    confirmDelete() {
        if (!this.challengeToDelete) return;
        
        const challengeId = this.challengeToDelete;
        this.challengeToDelete = null;
        
        // Remove all completion data for this challenge from localStorage
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(`challenge_${challengeId}_`)) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`[DeleteChallenge] Removed ${keysToRemove.length} completion entries for challenge ${challengeId}`);
        
        this.challenges = this.challenges.filter(c => c.id !== challengeId);
        this.saveChallenges();
        this.showToast('تم حذف التحدي بنجاح', 'success');
        this.closeDeleteConfirmModal();
    }
    
    closeDeleteConfirmModal() {
        const modal = document.getElementById('deleteConfirmModal');
        if (modal) {
            modal.style.display = 'none';
        }
        this.challengeToDelete = null;
    }
    
    // ========== DAY CHALLENGES MODAL ==========
    showDayChallenges(date, dateStr) {
        const modal = document.getElementById('dayChallengesModal');
        const title = document.getElementById('dayModalTitle');
        const dateEl = document.getElementById('dayModalDate');
        const list = document.getElementById('dayChallengesList');
        
        if (!modal || !dateEl || !list) return;
        
        const monthNames = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 
                           'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        dateEl.textContent = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        
        const dayChallenges = this.getChallengesForDate(dateStr);
        
        if (dayChallenges.length === 0) {
            list.innerHTML = '<p style="text-align: center; color: var(--text-muted); padding: 2rem;">لا توجد تحديات لهذا اليوم</p>';
        } else {
            // Escape HTML to prevent XSS
            const escapeHtml = (text) => {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            };
            
            list.innerHTML = dayChallenges.map(challenge => {
                const isCompleted = this.isChallengeCompletedForDate(challenge.id, dateStr);
                const categoryName = challenge.category === 'aamal' ? 'أعمال' : 'تطوير الذات';
                return `
                    <div class="day-challenge-item" data-challenge-id="${challenge.id}">
                        <label class="day-challenge-checkbox">
                            <input type="checkbox" ${isCompleted ? 'checked' : ''} 
                                   data-challenge-id="${challenge.id}" 
                                   data-date-str="${dateStr}">
                            <span class="checkbox-custom"></span>
                        </label>
                        <div class="day-challenge-content">
                            <div class="day-challenge-title">${escapeHtml(challenge.title)}</div>
                            <div class="day-challenge-category">${categoryName}</div>
                </div>
            </div>
        `;
            }).join('');
            
            // Attach event listeners to checkboxes
            list.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    const challengeId = checkbox.dataset.challengeId;
                    const dateStr = checkbox.dataset.dateStr;
                    this.toggleDayChallengeComplete(challengeId, dateStr);
                });
            });
        }
        
        modal.style.display = 'flex';
    }
    
    closeDayChallengesModal() {
        const modal = document.getElementById('dayChallengesModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }
    
    clearDateSelection() {
        this.selectedDate = null;
        this.renderChallengesList();
        this.renderCalendar(); // Refresh calendar to remove any selection highlight
    }
    
    toggleDayChallengeComplete(challengeId, dateStr) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        const selectedDate = new Date(dateStr);
        selectedDate.setHours(0, 0, 0, 0);
        
        // Check if selected date is already completed
        const completionKey = `challenge_${challengeId}_${dateStr}`;
        const isSelectedCompleted = localStorage.getItem(completionKey) === 'true';
        
        console.log(`[Daily Challenge - Calendar] ${isSelectedCompleted ? 'Unmarking' : 'Marking'} single day: ${dateStr}`);
        
        if (isSelectedCompleted) {
            // Unmark only this single day
            localStorage.removeItem(completionKey);
            console.log(`[Unmark] Removed completion for ${completionKey}`);
            
            // Update challenge data - remove completion date (same as toggleChallengeComplete)
            if (challenge.completedDates) {
                const hadDate = challenge.completedDates.includes(dateStr);
                challenge.completedDates = challenge.completedDates.filter(date => date !== dateStr);
                // Update lastCompleted to the most recent date if any remain
                if (challenge.completedDates.length > 0) {
                    challenge.lastCompleted = challenge.completedDates.sort().reverse()[0];
        } else {
                    challenge.lastCompleted = null;
                }
                if (hadDate && challenge.totalCompleted > 0) {
                    challenge.totalCompleted = Math.max(0, (challenge.totalCompleted || 0) - 1);
                }
                this.saveChallenges(true); // Save updated challenge data without rendering (will render after)
            }
            
            this.showToast('تم إلغاء إكمال التحدي لهذا اليوم', 'info');
        } else {
            // Mark only this single day
            localStorage.setItem(completionKey, 'true');
            console.log(`[Mark] Stored completion for ${completionKey}`);
            
            // Update challenge data - add completion date if not already tracked (same as toggleChallengeComplete)
            if (!challenge.completedDates) {
                challenge.completedDates = [];
            }
            if (!challenge.completedDates.includes(dateStr)) {
                challenge.completedDates.push(dateStr);
                challenge.lastCompleted = dateStr;
                challenge.totalCompleted = (challenge.totalCompleted || 0) + 1;
                this.saveChallenges(true); // Save updated challenge data without rendering (will render after)
            }
            
            this.showToast('تم إكمال التحدي لهذا اليوم! 🎉', 'success');
            this.checkAchievements();
        }
        
        // Update stats immediately first
        this.updateStats();
        // Then refresh the challenges list and calendar
        requestAnimationFrame(() => {
            this.renderChallengesList();
            this.renderCalendar();
            this.updateStats(); // Update again to ensure consistency
        });
    }
    
    // ========== STATS & ACHIEVEMENTS ==========
    updateStats() {
        try {
            // Reload challenges to ensure we have the latest data (always fresh, never cached)
            this.challenges = this.loadChallenges();
            
            // Calculate all stats from scratch (never use hardcoded values)
            const today = this.formatDate(new Date());
            const streakDays = this.calculateStreak(); // Calculated from localStorage
            const totalPoints = this.calculateTotalPoints(); // Calculated from localStorage
            const completedChallenges = this.getCompletedChallengesCount(); // Calculated from current challenges
            
            console.log(`[Stats Update] Calculated Values - Streak: ${streakDays} days, Points: ${totalPoints}, Fully Completed Challenges: ${completedChallenges}/${this.challenges.length}`);
            
            // Get DOM elements (achievements card removed)
            const streakEl = document.getElementById('streakDays');
            const pointsEl = document.getElementById('totalPoints');
            const completedEl = document.getElementById('completedChallenges');
            
            // Check if elements exist - if not, wait and try again
            if (!streakEl || !pointsEl || !completedEl) {
                console.warn('[Stats] Some elements not found, will retry...');
                if (!streakEl) console.warn('  - streakDays element missing');
                if (!pointsEl) console.warn('  - totalPoints element missing');
                if (!completedEl) console.warn('  - completedChallenges element missing');
                
                // Retry after a short delay if elements aren't ready
                setTimeout(() => this.updateStats(), 100);
                return;
            }
            
            // Update immediately with calculated values (synchronous update)
            // These are ALWAYS calculated from actual data, never hardcoded
            // Force update to ensure values are always set (don't rely on data-calculated attribute)
            if (streakEl) {
                streakEl.textContent = streakDays;
                console.log(`[UpdateStats] Setting streakDays element to: ${streakDays} (was: ${streakEl.textContent})`);
            }
            if (pointsEl) {
                pointsEl.textContent = totalPoints;
                console.log(`[UpdateStats] Setting totalPoints element to: ${totalPoints}`);
            }
            if (completedEl) {
                completedEl.textContent = completedChallenges;
                console.log(`[UpdateStats] Setting completedChallenges element to: ${completedChallenges}`);
            }
            
            // Then animate if values changed (optional visual enhancement)
            this.animateNumber(streakEl, streakDays);
            this.animateNumber(pointsEl, totalPoints);
            this.animateNumber(completedEl, completedChallenges);
        } catch (error) {
            console.error('Error updating stats:', error);
            console.error('Stack trace:', error.stack);
            // Retry on error
            setTimeout(() => this.updateStats(), 500);
        }
    }
    
    animateNumber(element, targetValue) {
        if (!element) return;
        
        const target = parseInt(targetValue) || 0;
        const currentValue = parseInt(element.textContent) || 0;
        
        // If values are the same, just ensure it's set correctly
        if (currentValue === target) {
            element.textContent = target;
            return;
        }
        
        // Store the start value before any changes
        const startValue = currentValue;
        
        // Animate the number change
        const duration = 500; // milliseconds
        const startTime = Date.now();
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(startValue + (target - startValue) * easeOut);
            
            element.textContent = current;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                element.textContent = target;
            }
        };
        
        animate();
    }
    
    calculateStreak() {
        try {
            let streak = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            console.log(`[CalculateStreak] Starting calculation from today: ${this.formatDate(today)}`);
            console.log(`[CalculateStreak] Total challenges: ${this.challenges.length}`);
            
            // Count consecutive days backwards from today where ALL challenges for that day are completed
            for (let i = 0; i < 365; i++) {
                const checkDate = new Date(today);
                checkDate.setDate(checkDate.getDate() - i);
                const dateStr = this.formatDate(checkDate);
                
                // Get all challenges that apply to this specific date
                const dayChallenges = this.getChallengesForDate(dateStr);
                
                console.log(`[CalculateStreak] Day ${i} (${dateStr}): ${dayChallenges.length} challenges`);
                
                // If no challenges for this day, skip it (doesn't break streak)
                if (dayChallenges.length === 0) {
                    // For streak, we might want to continue if there are no challenges
                    // But if it's today and there are challenges, we should check
                    if (i === 0) {
                        // Today has no challenges, so no streak
                        console.log(`[CalculateStreak] Today has no challenges, streak is 0`);
                        break;
                    }
                    console.log(`[CalculateStreak] Day ${i} has no challenges, continuing...`);
                    continue;
                }
                
                // Check if ALL challenges for this day are completed
                const allCompleted = dayChallenges.every(c => {
                    const isCompleted = this.isChallengeCompletedForDate(c.id, dateStr);
                    console.log(`[CalculateStreak] Challenge ${c.id} (${c.title}) for ${dateStr}: ${isCompleted ? 'COMPLETED' : 'NOT COMPLETED'}`);
                    return isCompleted;
                });
                
                if (allCompleted) {
                    streak++;
                    console.log(`[CalculateStreak] Day ${i} (${dateStr}): ALL challenges completed! Streak: ${streak}`);
                } else {
                    // If today (i=0) is not completed, streak is 0
                    // If a past day is not completed, break the streak
                    const incompleteChallenges = dayChallenges.filter(c => !this.isChallengeCompletedForDate(c.id, dateStr));
                    console.log(`[CalculateStreak] Day ${i} (${dateStr}): NOT all completed. Incomplete: ${incompleteChallenges.map(c => c.title).join(', ')}. Breaking streak at ${streak} days.`);
                    break;
                }
            }
            
            console.log(`[CalculateStreak] Final Result: ${streak} days`);
            return streak;
        } catch (error) {
            console.error('Error calculating streak:', error);
            console.error('Stack trace:', error.stack);
            return 0;
        }
    }
    
    calculateTotalPoints() {
        try {
            let points = 0;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            // Count points for all completed challenge days
            // Use a Set to track which challenge-day combinations we've already counted
            const countedDays = new Set();
            
            // Check all challenges and their completed dates
            this.challenges.forEach(challenge => {
                if (!challenge.startDate) {
                    // If no start date, skip this challenge (can't calculate points)
                    return;
                }
                
                const startDate = new Date(challenge.startDate);
                startDate.setHours(0, 0, 0, 0);
                
                // For unlimited challenges, check from startDate to today
                // For limited challenges, check from startDate to endDate
                const challengeDays = challenge.days || challenge.repetition || 30;
                const isUnlimited = challengeDays === -1 || challengeDays === 'unlimited' || challengeDays === null;
                
                let endDate;
                if (isUnlimited) {
                    endDate = today; // For unlimited, only count up to today
                } else {
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + challengeDays - 1);
                    // Only count up to today (can't count future completions)
                    if (endDate > today) {
                        endDate = today;
                    }
                }
                
                // Iterate through all days in the challenge period (up to today)
                const startTime = startDate.getTime();
                const endTime = endDate.getTime();
                const oneDay = 24 * 60 * 60 * 1000;
                
                for (let time = startTime; time <= endTime; time += oneDay) {
                    const checkDate = new Date(time);
                    const dateStr = this.formatDate(checkDate);
                    const uniqueKey = `${challenge.id}_${dateStr}`;
                    
                    // Only count each challenge-day combination once
                    if (!countedDays.has(uniqueKey)) {
                        // Use the helper function to check completion
                        if (this.isChallengeCompletedForDate(challenge.id, dateStr)) {
                            // Points per day completed (2 points per day per challenge)
                            points += 2;
                            countedDays.add(uniqueKey);
                        }
                    }
                }
            });
            
            console.log(`[CalculateTotalPoints] Result: ${points} points from ${this.challenges.length} challenges`);
            return points;
        } catch (error) {
            console.error('Error calculating total points:', error);
            return 0;
        }
    }
    
    getCompletedChallengesCount() {
        try {
            // Count challenges that are FULLY completed (all their days are done)
            let fullyCompletedCount = 0;
            
            this.challenges.forEach(challenge => {
                // Get progress for this challenge
                const progress = this.getChallengeProgress(challenge);
                
                // For unlimited challenges, they can never be "fully completed"
                // So we skip them
                if (progress.isUnlimited) {
                    return; // Skip unlimited challenges
                }
                
                // Check if challenge has started
                if (!challenge.startDate) {
                    return; // Can't determine if completed without start date
                }
                
                // Check if all days are completed (percentage is 100%)
                if (progress.percentage === 100) {
                    fullyCompletedCount++;
                    console.log(`[GetCompletedChallengesCount] Challenge "${challenge.title}" is fully completed: ${progress.completed}/${progress.total} days (100%)`);
                }
            });
            
            console.log(`[GetCompletedChallengesCount] Fully completed challenges: ${fullyCompletedCount} out of ${this.challenges.length} total challenges`);
            return fullyCompletedCount;
        } catch (error) {
            console.error('Error getting completed challenges count:', error);
            return 0;
        }
    }
    
    getAchievementsCount() {
        try {
            const unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
            return unlocked.length;
        } catch (error) {
            console.error('Error getting achievements count:', error);
            return 0;
        }
    }
    
    renderAchievements() {
        const grid = document.getElementById('achievementsGrid');
        if (!grid) return;
        
        const achievements = this.loadAchievements();
        
        grid.innerHTML = achievements.map(achievement => `
            <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="badge-icon-large">${achievement.icon}</div>
                <h3 class="badge-title">${achievement.title}</h3>
                <p class="badge-desc">${achievement.description}</p>
            </div>
        `).join('');
    }
    
    loadAchievements() {
        const achievements = [
            {
                id: 'streak_7',
                icon: '🔥',
                title: 'المثابر',
                description: '7 أيام متتالية',
                condition: () => this.calculateStreak() >= 7
            },
            {
                id: 'streak_30',
                icon: '⭐',
                title: 'المخلص',
                description: '30 يوماً متتالياً',
                condition: () => this.calculateStreak() >= 30
            },
            {
                id: 'points_1000',
                icon: '🏆',
                title: 'المجتهد',
                description: '1000 نقطة',
                condition: () => this.calculateTotalPoints() >= 1000
            },
            {
                id: 'challenges_5',
                icon: '📿',
                title: 'المنظم',
                description: '5 تحديات نشطة',
                condition: () => this.challenges.length >= 5
            }
        ];
        
        // Load unlocked achievements
        const unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        
        return achievements.map(a => ({
            ...a,
            unlocked: unlocked.includes(a.id) || a.condition()
        }));
    }
    
    checkAchievements() {
        const achievements = this.loadAchievements();
        const unlocked = JSON.parse(localStorage.getItem('unlockedAchievements') || '[]');
        let newAchievements = [];
        
        achievements.forEach(achievement => {
            if (!unlocked.includes(achievement.id) && achievement.condition()) {
                unlocked.push(achievement.id);
                newAchievements.push(achievement);
            }
        });
        
        if (newAchievements.length > 0) {
            localStorage.setItem('unlockedAchievements', JSON.stringify(unlocked));
            newAchievements.forEach(achievement => {
                this.showToast(`🎉 إنجاز جديد: ${achievement.title}!`, 'success');
            });
            this.renderAchievements();
            this.updateStats(); // Update stats to reflect new achievement count
        }
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Calendar navigation
        const prevMonth = document.getElementById('prevMonth');
        const nextMonth = document.getElementById('nextMonth');
        const todayBtn = document.getElementById('todayBtn');
        
        if (prevMonth) {
            prevMonth.addEventListener('click', () => {
                this.currentMonth--;
                if (this.currentMonth < 0) {
                    this.currentMonth = 11;
                    this.currentYear--;
                }
                this.renderCalendar();
            });
        }
        
        if (nextMonth) {
            nextMonth.addEventListener('click', () => {
                this.currentMonth++;
                if (this.currentMonth > 11) {
                    this.currentMonth = 0;
                    this.currentYear++;
                }
                this.renderCalendar();
            });
        }
        
        if (todayBtn) {
            todayBtn.addEventListener('click', () => {
                const today = new Date();
                this.currentMonth = today.getMonth();
                this.currentYear = today.getFullYear();
                this.renderCalendar();
            });
        }
        
        // Filter tabs
        // Filter toggle button (dropdown)
        const filterToggleBtn = document.getElementById('filterToggleBtn');
        const challengesFilter = document.getElementById('challengesFilter');
        
        if (filterToggleBtn && challengesFilter) {
            filterToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                challengesFilter.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!filterToggleBtn.contains(e.target) && !challengesFilter.contains(e.target)) {
                    challengesFilter.classList.remove('show');
                }
            });
        }
        
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentFilter = tab.dataset.filter;
                this.renderChallengesList();
                // Close dropdown after selection
                if (challengesFilter) {
                    challengesFilter.classList.remove('show');
                }
            });
        });
        
        // Unlimited days checkbox
        const unlimitedCheckbox = document.getElementById('unlimitedDays');
        const daysInput = document.getElementById('challengeDays');
        if (unlimitedCheckbox && daysInput) {
            unlimitedCheckbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    daysInput.disabled = true;
                    daysInput.value = '';
                } else {
                    daysInput.disabled = false;
                    if (!daysInput.value) {
                        daysInput.value = '30';
                    }
                }
            });
        }
        
        // Category buttons
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.getElementById('challengeCategory').value = btn.dataset.category;
            });
        });
        
        // Challenge type change
        const challengeType = document.getElementById('challengeType');
        if (challengeType) {
            challengeType.addEventListener('change', (e) => {
                const daysGroup = document.getElementById('daysOfWeekGroup');
                if (daysGroup) {
                    if (e.target.value === 'specific') {
                        daysGroup.style.display = 'block';
        } else {
                        daysGroup.style.display = 'none';
                        // Uncheck all day checkboxes when switching to daily
                        document.querySelectorAll('.day-checkbox input').forEach(cb => {
                            cb.checked = false;
                        });
                    }
                }
            });
        }
        
        // Prevent form submission
        const challengeForm = document.getElementById('challengeForm');
        if (challengeForm) {
            challengeForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveChallenge();
            });
        }
        
        // Add challenge button
        const addBtn = document.getElementById('addChallengeBtn');
        if (addBtn) {
            addBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.openAddChallengeModal();
            });
        } else {
            console.warn('Add challenge button not found');
        }
        
        // Ready challenge buttons
        document.querySelectorAll('.btn-add-ready').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const challengeType = btn.dataset.readyChallenge;
                this.addReadyChallenge(challengeType);
            });
        });
        
        // Make sure modals can be closed by clicking overlay
        const challengeModalOverlay = document.querySelector('#challengeModal .modal-overlay');
        if (challengeModalOverlay) {
            challengeModalOverlay.addEventListener('click', () => this.closeChallengeModal());
        }
        
        const dayModalOverlay = document.querySelector('#dayChallengesModal .modal-overlay');
        if (dayModalOverlay) {
            dayModalOverlay.addEventListener('click', () => this.closeDayChallengesModal());
        }
        
        // Delete confirmation modal
        const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', () => {
                this.confirmDelete();
            });
        }
        
        const deleteModalOverlay = document.querySelector('#deleteConfirmModal .modal-overlay');
        if (deleteModalOverlay) {
            deleteModalOverlay.addEventListener('click', () => this.closeDeleteConfirmModal());
        }
    }
    
    // ========== TOAST ==========
    showToast(message, type = 'info') {
        const toast = document.getElementById('challengeToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `challenge-toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Global functions for onclick handlers
function closeChallengeModal() {
    if (window.challengesManager) {
        window.challengesManager.closeChallengeModal();
    } else if (challengesManager) {
        challengesManager.closeChallengeModal();
    } else {
        const modal = document.getElementById('challengeModal');
        if (modal) modal.style.display = 'none';
    }
}

function closeDayChallengesModal() {
    if (window.challengesManager) {
        window.challengesManager.closeDayChallengesModal();
    } else if (challengesManager) {
        challengesManager.closeDayChallengesModal();
    } else {
        const modal = document.getElementById('dayChallengesModal');
        if (modal) modal.style.display = 'none';
    }
}

function closeDeleteConfirmModal() {
    if (window.challengesManager) {
        window.challengesManager.closeDeleteConfirmModal();
    } else if (challengesManager) {
        challengesManager.closeDeleteConfirmModal();
    } else {
        const modal = document.getElementById('deleteConfirmModal');
        if (modal) modal.style.display = 'none';
    }
}

function saveChallenge() {
    if (window.challengesManager) {
        window.challengesManager.saveChallenge();
    } else if (challengesManager) {
        challengesManager.saveChallenge();
    } else {
        console.error('ChallengesManager not initialized');
        alert('يرجى تحديث الصفحة');
    }
}

// Initialize on page load
let challengesManager;

// Make sure DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeChallenges);
} else {
    // DOM is already ready
    initializeChallenges();
}

function initializeChallenges() {
    try {
        challengesManager = new ChallengesManager();
        // Make it globally available for onclick handlers
        window.challengesManager = challengesManager;
        console.log('ChallengesManager initialized successfully');
    } catch (error) {
        console.error('Failed to initialize ChallengesManager:', error);
        alert('حدث خطأ في تحميل صفحة التحديات. يرجى تحديث الصفحة.');
    }
}
