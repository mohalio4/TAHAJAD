/* ====================================
   MUHASABAH AL-NAFS (SELF-ACCOUNTING) FUNCTIONALITY
   Track good deeds, bad deeds, journal, improvement goals
   ==================================== */

class MuhasabahManager {
    constructor() {
        this.userData = this.getUserData();
        this.deeds = this.loadDeeds();
        this.journals = this.loadJournals();
        this.goals = this.loadGoals();
        this.latePrayers = this.loadLatePrayers();
        this.currentView = 'all';
        this.currentFilter = {
            time: 'all',
            search: ''
        };
        
        if (!this.userData) {
            window.location.href = 'login_page.html';
            return;
        }
        
        this.init();
    }
    
    async init() {
        this.setupUserProfile();
        this.updateStatistics();
        this.updateBalance();
        this.renderGoals();
        this.renderTimeline();
        await this.syncLatePrayersWithApi();
        this.setupEventListeners();
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
    
    // ========== LOAD/SAVE DATA ==========
    loadDeeds() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            return window.sessionManager.loadUserData('muhasabahDeeds', []);
        }
        const saved = localStorage.getItem('muhasabahDeeds');
        return saved ? JSON.parse(saved) : [];
    }
    
    loadJournals() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            return window.sessionManager.loadUserData('muhasabahJournals', []);
        }
        const saved = localStorage.getItem('muhasabahJournals');
        return saved ? JSON.parse(saved) : [];
    }
    
    loadGoals() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            return window.sessionManager.loadUserData('muhasabahGoals', []);
        }
        const saved = localStorage.getItem('muhasabahGoals');
        return saved ? JSON.parse(saved) : [];
    }
    
    loadLatePrayers() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            return window.sessionManager.loadUserData('muhasabahLatePrayers', []);
        }
        const saved = localStorage.getItem('muhasabahLatePrayers');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveDeeds() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            window.sessionManager.saveUserData('muhasabahDeeds', this.deeds);
        } else {
            localStorage.setItem('muhasabahDeeds', JSON.stringify(this.deeds));
        }
        this.updateStatistics();
        this.updateBalance();
        this.renderTimeline();
    }
    
    saveJournals() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            window.sessionManager.saveUserData('muhasabahJournals', this.journals);
        } else {
            localStorage.setItem('muhasabahJournals', JSON.stringify(this.journals));
        }
        this.updateStatistics();
        this.renderTimeline();
    }
    
    saveGoals() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            window.sessionManager.saveUserData('muhasabahGoals', this.goals);
        } else {
            localStorage.setItem('muhasabahGoals', JSON.stringify(this.goals));
        }
        this.renderGoals();
    }
    
    saveLatePrayers() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            window.sessionManager.saveUserData('muhasabahLatePrayers', this.latePrayers);
        } else {
            localStorage.setItem('muhasabahLatePrayers', JSON.stringify(this.latePrayers));
        }
        this.renderLatePrayers();
    }
    
    async syncLatePrayersWithApi() {
        if (!window.apiManager || !window.apiManager.getLatePrayers) return;
        
        try {
            const response = await window.apiManager.getLatePrayers();
            if (response && Array.isArray(response.late_prayers)) {
                this.latePrayers = response.late_prayers;
            } else if (Array.isArray(response)) {
                this.latePrayers = response;
            }
            this.saveLatePrayers();
        } catch (error) {
            console.warn('تعذر جلب صلوات القضاء من الخادم، سيتم الاعتماد على البيانات المحلية فقط.', error);
        }
    }
    
    // ========== CATEGORIES ==========
    getGoodCategories() {
        return {
            'sadaqah': {name: 'صدقة', icon: '💰', needsAmount: true},
            'quran': {name: 'قراءة قرآن', icon: '📖', needsPages: true},
            'prayer': {name: 'صلاة نافلة', icon: '🕌'},
            'fasting': {name: 'صيام', icon: '🌙'},
            'dhikr': {name: 'ذكر', icon: '📿'},
            'dua': {name: 'دعاء', icon: '🤲'},
            'help': {name: 'مساعدة الآخرين', icon: '🤝'},
            'khums': {name: 'خمس', icon: '💎', needsAmount: true},
            'zakat': {name: 'زكاة', icon: '💵', needsAmount: true},
            'other-good': {name: 'أخرى', icon: '✨'}
        };
    }
    
    getBadCategories() {
        return {
            'sin': {name: 'ذنب', icon: '⛔'},
            'neglect': {name: 'إهمال عبادة', icon: '😔'},
            'delay': {name: 'تأخير الصلاة', icon: '⏰'},
            'anger': {name: 'غضب', icon: '😠'},
            'backbiting': {name: 'غيبة', icon: '🗣️'},
            'lying': {name: 'كذب', icon: '🤥'},
            'waste-time': {name: 'إضاعة وقت', icon: '⌛'},
            'other-bad': {name: 'أخرى', icon: '⚠️'}
        };
    }
    
    // ========== ADD DEED ==========
    addDeed(deedData) {
        const deed = {
            id: Date.now(),
            type: deedData.type, // 'good' or 'bad'
            category: deedData.category,
            description: deedData.description,
            improvementPlan: deedData.improvementPlan || null,
            amount: deedData.amount || null,
            pages: deedData.pages || null,
            date: deedData.date,
            tags: deedData.tags || [],
            createdAt: new Date().toISOString()
        };
        
        this.deeds.unshift(deed);
        this.saveDeeds();
        
        if (deed.type === 'good') {
            this.showToast('تم تسجيل العمل الصالح! بارك الله فيك 🌟', 'success');
            if (window.animationsController) {
                window.animationsController.celebrateSuccess('حسنة جديدة! ✅');
            }
        } else {
            this.showToast('تم تسجيل التقصير. تذكر التوبة والاستغفار 🤲', 'info');
        }
        
        return deed;
    }
    
    // ========== ADD JOURNAL ==========
    addJournal(journalData) {
        const journal = {
            id: Date.now(),
            date: journalData.date,
            mood: journalData.mood,
            goodPoints: journalData.goodPoints,
            badPoints: journalData.badPoints,
            tomorrowPlan: journalData.tomorrowPlan,
            reflection: journalData.reflection,
            createdAt: new Date().toISOString()
        };
        
        this.journals.unshift(journal);
        this.saveJournals();
        
        this.showToast('تم حفظ المذكرة اليومية! 📝', 'success');
        return journal;
    }
    
    // ========== ADD GOAL ==========
    addGoal(goalData) {
        const goal = {
            id: Date.now(),
            title: goalData.title,
            description: goalData.description,
            duration: goalData.duration,
            steps: goalData.steps,
            startDate: new Date().toISOString(),
            progress: 0,
            completed: false,
            createdAt: new Date().toISOString()
        };
        
        this.goals.unshift(goal);
        this.saveGoals();
        
        this.showToast('تم إنشاء الهدف! بالتوفيق في تحقيقه 🎯', 'success');
        return goal;
    }
    
    // ========== UPDATE GOAL PROGRESS ==========
    updateGoalProgress(id, progress) {
        const goal = this.goals.find(g => g.id === id);
        if (goal) {
            goal.progress = Math.min(100, Math.max(0, progress));
            if (goal.progress >= 100) {
                goal.completed = true;
                this.showToast('مبروك! أكملت الهدف! 🎉', 'success');
                if (window.animationsController) {
                    window.animationsController.celebrateSuccess('هدف مكتمل! 🎯');
                }
            }
            this.saveGoals();
        }
    }
    
    // ========== DELETE GOAL ==========
    deleteGoal(id) {
        if (confirm('هل أنت متأكد من حذف هذا الهدف؟')) {
            this.goals = this.goals.filter(g => g.id !== id);
            this.saveGoals();
            this.showToast('تم حذف الهدف', 'info');
        }
    }
    
    // ========== STATISTICS ==========
    updateStatistics() {
        // Good deeds count
        const goodDeeds = this.deeds.filter(d => d.type === 'good');
        const totalGoodEl = document.getElementById('totalGoodDeeds');
        if (totalGoodEl) totalGoodEl.textContent = goodDeeds.length;
        
        // Bad deeds count
        const badDeeds = this.deeds.filter(d => d.type === 'bad');
        const totalBadEl = document.getElementById('totalBadDeeds');
        if (totalBadEl) totalBadEl.textContent = badDeeds.length;
        
        // Journal days
        const journalDaysEl = document.getElementById('journalDays');
        if (journalDaysEl) journalDaysEl.textContent = this.journals.length;
        
        // Streak (consecutive days with any activity)
        const streakEl = document.getElementById('currentStreak');
        if (streakEl) streakEl.textContent = this.calculateStreak();
    }
    
    updateBalance() {
        const goodCount = this.deeds.filter(d => d.type === 'good').length;
        const badCount = this.deeds.filter(d => d.type === 'bad').length;
        const total = goodCount + badCount;
        
        const goodCountEl = document.getElementById('goodCount');
        const badCountEl = document.getElementById('badCount');
        const scaleGoodEl = document.getElementById('scaleGood');
        const scaleBadEl = document.getElementById('scaleBad');
        const balanceRatioEl = document.getElementById('balanceRatio');
        
        if (goodCountEl) goodCountEl.textContent = goodCount;
        if (badCountEl) badCountEl.textContent = badCount;
        
        if (total > 0) {
            const goodPercent = (goodCount / total) * 100;
            const badPercent = (badCount / total) * 100;
            
            if (scaleGoodEl) scaleGoodEl.style.width = goodPercent + '%';
            if (scaleBadEl) scaleBadEl.style.width = badPercent + '%';
            
            // Calculate ratio
            if (badCount === 0) {
                if (balanceRatioEl) balanceRatioEl.textContent = goodCount + ':0';
            } else {
                const gcd = this.gcd(goodCount, badCount);
                if (balanceRatioEl) {
                    balanceRatioEl.textContent = (goodCount/gcd) + ':' + (badCount/gcd);
                }
            }
        } else {
            if (scaleGoodEl) scaleGoodEl.style.width = '50%';
            if (scaleBadEl) scaleBadEl.style.width = '50%';
            if (balanceRatioEl) balanceRatioEl.textContent = '0:0';
        }
    }
    
    gcd(a, b) {
        return b === 0 ? a : this.gcd(b, a % b);
    }
    
    calculateStreak() {
        const allDates = [
            ...this.deeds.map(d => d.date),
            ...this.journals.map(j => j.date)
        ];
        
        if (allDates.length === 0) return 0;
        
        const uniqueDates = [...new Set(allDates)].sort((a, b) => new Date(b) - new Date(a));
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (const dateStr of uniqueDates) {
            const date = new Date(dateStr);
            date.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((currentDate - date) / (1000 * 60 * 60 * 24));
            
            if (diffDays === streak) {
                streak++;
                currentDate = new Date(date);
                currentDate.setDate(currentDate.getDate() - 1);
            } else if (diffDays > streak) {
                break;
            }
        }
        
        return streak;
    }
    
    // ========== RENDER GOALS ==========
    renderGoals() {
        const container = document.getElementById('goalsContainer');
        const emptyGoals = document.getElementById('emptyGoals');
        
        if (!container) return;
        
        if (this.goals.length === 0) {
            container.style.display = 'none';
            if (emptyGoals) emptyGoals.style.display = 'block';
            return;
        }
        
        container.style.display = 'grid';
        if (emptyGoals) emptyGoals.style.display = 'none';
        
        container.innerHTML = '';
        
        this.goals.forEach(goal => {
            const card = this.createGoalCard(goal);
            container.appendChild(card);
        });
    }
    
    createGoalCard(goal) {
        const card = document.createElement('div');
        card.className = 'goal-card glass-card';
        
        const daysElapsed = Math.floor((Date.now() - new Date(goal.startDate)) / (1000 * 60 * 60 * 24));
        const progressPercent = Math.min(100, (daysElapsed / goal.duration) * 100);
        
        card.innerHTML = `
            <div class="goal-header">
                <div>
                    <div class="goal-title">🎯 ${goal.title}</div>
                    ${goal.description ? `<div class="goal-description">${goal.description}</div>` : ''}
                </div>
            </div>
            
            <div class="goal-progress">
                <div class="goal-progress-bar">
                    <div class="goal-progress-fill" style="width: ${goal.progress}%"></div>
                </div>
                <div class="goal-progress-text">
                    ${daysElapsed} من ${goal.duration} يوم (${Math.round(progressPercent)}%)
                </div>
            </div>
            
            ${goal.steps ? `<div class="goal-steps">${goal.steps}</div>` : ''}
            
            <div class="goal-actions">
                <button class="goal-action-btn" onclick="window.muhasabahManager.updateGoalProgress(${goal.id}, ${goal.progress + 10})">
                    ✓ تقدم
                </button>
                <button class="goal-action-btn" onclick="window.muhasabahManager.deleteGoal(${goal.id})">
                    🗑️ حذف
                </button>
            </div>
        `;
        
        return card;
    }
    
    // ========== LATE PRAYERS (QADA) ==========
    addLatePrayerTask(data) {
        const task = {
            id: Date.now(),
            prayerType: data.prayerType,       // fajr, dhuhr, asr, maghrib, isha
            count: data.count,
            completedCount: 0,
            startDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            completedAt: null
        };
        
        this.latePrayers.unshift(task);
        this.saveLatePrayers();
        this.showToast('تمت إضافة صلوات متأخرة إلى قائمة القضاء 🕌', 'info');
        
        // Also send to backend if متوفر
        if (window.apiManager && typeof window.apiManager.createLatePrayer === 'function') {
            window.apiManager.createLatePrayer(task).catch(err => {
                console.warn('تعذر حفظ صلوات القضاء في الخادم، سيتم الاحتفاظ بها محلياً فقط.', err);
            });
        }
        
        return task;
    }
    
    renderLatePrayers() {
        const listEl = document.getElementById('latePrayersList');
        const emptyEl = document.getElementById('latePrayersEmpty');
        const historyListEl = document.getElementById('latePrayersHistoryList');
        
        if (!listEl || !historyListEl) return;
        
        const activeTasks = this.latePrayers.filter(t => t.completedAt === null);
        const completedTasks = this.latePrayers.filter(t => t.completedAt !== null);
        
        // Active
        listEl.innerHTML = '';
        if (activeTasks.length === 0) {
            if (emptyEl) emptyEl.style.display = 'block';
        } else {
            if (emptyEl) emptyEl.style.display = 'none';
            
            activeTasks.forEach(task => {
                const item = this.createLatePrayerItem(task);
                listEl.appendChild(item);
            });
        }
        
        // History
        historyListEl.innerHTML = '';
        if (completedTasks.length > 0) {
            completedTasks
                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                .forEach(task => {
                    const histItem = this.createLatePrayerHistoryItem(task);
                    historyListEl.appendChild(histItem);
                });
        }
        
        this.updateLatePrayersScrollIndicator();
    }
    
    createLatePrayerItem(task) {
        const item = document.createElement('div');
        const isDone = task.completedCount >= task.count;
        item.className = 'late-prayer-item' + (isDone ? ' late-prayer-done' : '');
        
        const labels = {
            fajr: 'الفجر',
            dhuhr: 'الظهر',
            asr: 'العصر',
            maghrib: 'المغرب',
            isha: 'العشاء'
        };
        
        const remaining = Math.max(0, task.count - task.completedCount);
        
        item.innerHTML = `
            <div class="late-prayer-info">
                <div class="late-prayer-title">قضاء ${task.count} صلاة ${labels[task.prayerType] || ''}</div>
                <div class="late-prayer-meta">
                    من تاريخ: ${this.formatDate(task.startDate)}
                </div>
                <div class="late-prayer-progress">
                    المتبقي: ${remaining} / ${task.count}
                </div>
            </div>
            <div class="late-prayer-actions">
                <span class="late-prayer-hint">
                    ${isDone ? 'اكتمل القضاء' : 'اضغط لتسجيل صلاة مقضية'}
                </span>
                <div class="late-prayer-action-buttons">
                    ${task.completedCount > 0 ? `
                        <button type="button" class="late-prayer-btn late-prayer-undo">تراجع</button>
                    ` : ''}
                    <button type="button" class="late-prayer-btn late-prayer-delete">حذف</button>
                </div>
            </div>
        `;
        
        // Clicking anywhere on the item increments (while not done)
        if (!isDone) {
            item.addEventListener('click', () => {
                this.incrementLatePrayer(task.id);
            });
        }
        
        // Undo button (decrease one if pressed by mistake)
        const undoBtn = item.querySelector('.late-prayer-undo');
        if (undoBtn) {
            undoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.decrementLatePrayer(task.id);
            });
        }
        
        // Delete button (remove whole task)
        const deleteBtn = item.querySelector('.late-prayer-delete');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteLatePrayer(task.id);
            });
        }
        
        return item;
    }
    
    createLatePrayerHistoryItem(task) {
        const labels = {
            fajr: 'الفجر',
            dhuhr: 'الظهر',
            asr: 'العصر',
            maghrib: 'المغرب',
            isha: 'العشاء'
        };
        
        const item = document.createElement('div');
        item.className = 'late-prayer-history-item';
        item.innerHTML = `
            <span class="late-prayer-history-label">
                ✅ قضاء ${task.count} صلاة ${labels[task.prayerType] || ''}
            </span>
            <span class="late-prayer-history-date">
                ${this.formatDate(task.completedAt || task.startDate)}
            </span>
        `;
        return item;
    }
    
    incrementLatePrayer(id) {
        const task = this.latePrayers.find(t => t.id === id);
        if (!task) return;
        
        if (task.completedCount < task.count) {
            task.completedCount += 1;
            
            // If completed all, mark as done and set completedAt
            if (task.completedCount >= task.count) {
                task.completedCount = task.count;
                task.completedAt = new Date().toISOString();
                this.showToast('اكتمل قضاء هذه الصلوات، تقبل الله منك 🤲', 'success');
            } else {
                this.showToast('تم تسجيل صلاة مقضية واحدة ✅', 'info');
            }
            
            this.saveLatePrayers();
            
            // Sync increment with backend if متوفر
            if (window.apiManager && typeof window.apiManager.incrementLatePrayer === 'function') {
                window.apiManager.incrementLatePrayer(id).catch(err => {
                    console.warn('تعذر تحديث صلوات القضاء في الخادم، سيتم تحديثها محلياً فقط.', err);
                });
            }
        }
    }
    
    decrementLatePrayer(id) {
        const task = this.latePrayers.find(t => t.id === id);
        if (!task || task.completedCount <= 0) return;
        
        task.completedCount -= 1;
        
        // إذا كانت المهمة مكتملة ثم رجعنا خطوة، نلغي وقت الإكمال
        if (task.completedCount < task.count) {
            task.completedAt = null;
        }
        
        this.saveLatePrayers();
        this.showToast('تم التراجع عن تسجيل صلاة مقضية واحدة', 'info');
        
        // Sync with backend using update إذا متوفر
        if (window.apiManager && typeof window.apiManager.updateLatePrayer === 'function') {
            window.apiManager.updateLatePrayer(id, task).catch(err => {
                console.warn('تعذر تعديل صلوات القضاء في الخادم، سيتم تعديلها محلياً فقط.', err);
            });
        }
    }
    
    deleteLatePrayer(id) {
        const task = this.latePrayers.find(t => t.id === id);
        if (!task) return;
        
        if (!confirm('هل تريد حذف هذه المهمة من قضاء الصلوات؟')) return;
        
        this.latePrayers = this.latePrayers.filter(t => t.id !== id);
        this.saveLatePrayers();
        this.showToast('تم حذف مهمة قضاء الصلوات', 'info');
        
        if (window.apiManager && typeof window.apiManager.deleteLatePrayer === 'function') {
            window.apiManager.deleteLatePrayer(id).catch(err => {
                console.warn('تعذر حذف صلوات القضاء من الخادم، تم حذفها محلياً فقط.', err);
            });
        }
    }
    
    updateLatePrayersScrollIndicator() {
        const historyContainer = document.getElementById('latePrayersHistory');
        const listEl = document.getElementById('latePrayersHistoryList');
        if (!historyContainer || !listEl) return;
        
        let indicator = document.getElementById('latePrayersScrollIndicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'latePrayersScrollIndicator';
            indicator.className = 'late-prayer-scroll-indicator';
            historyContainer.appendChild(indicator);
        }
        
        const update = () => {
            const scrollRange = listEl.scrollHeight - listEl.clientHeight;
            
            if (scrollRange <= 0) {
                indicator.style.opacity = '0';
                return;
            }
            
            const ratio = listEl.scrollTop / scrollRange;
            const visibleRatio = listEl.clientHeight / listEl.scrollHeight;
            const minHeight = 24;
            const height = Math.max(minHeight, listEl.clientHeight * visibleRatio);
            const maxOffset = listEl.clientHeight - height;
            
            indicator.style.height = `${height}px`;
            indicator.style.transform = `translateY(${ratio * maxOffset}px)`;
            indicator.style.opacity = '1';
        };
        
        // أول تحديث مباشر
        update();
        
        // ربط الحدث مرة واحدة فقط
        if (!listEl.dataset.scrollIndicatorBound) {
            listEl.addEventListener('scroll', update);
            window.addEventListener('resize', () => {
                // إعادة حساب المؤشر عند تغيير حجم النافذة
                this.updateLatePrayersScrollIndicator();
            });
            listEl.dataset.scrollIndicatorBound = 'true';
        }
    }
    
    // ========== RENDER TIMELINE ==========
    renderTimeline() {
        const container = document.getElementById('timelineContainer');
        const emptyState = document.getElementById('emptyState');
        
        if (!container) return;
        
        const items = this.getFilteredItems();
        
        if (items.length === 0) {
            container.style.display = 'none';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }
        
        container.style.display = 'block';
        if (emptyState) emptyState.style.display = 'none';
        
        container.innerHTML = '';
        
        items.forEach(item => {
            const timelineItem = this.createTimelineItem(item);
            container.appendChild(timelineItem);
        });
    }
    
    getFilteredItems() {
        let items = [];
        
        // Add deeds
        if (this.currentView === 'all' || this.currentView === 'good' || this.currentView === 'bad') {
            const filteredDeeds = this.deeds.filter(d => {
                if (this.currentView === 'good' && d.type !== 'good') return false;
                if (this.currentView === 'bad' && d.type !== 'bad') return false;
                return true;
            });
            items.push(...filteredDeeds.map(d => ({...d, itemType: 'deed'})));
        }
        
        // Add journals
        if (this.currentView === 'all' || this.currentView === 'journal') {
            items.push(...this.journals.map(j => ({...j, itemType: 'journal'})));
        }
        
        // Time filter
        if (this.currentFilter.time !== 'all') {
            const now = new Date();
            items = items.filter(item => {
                const itemDate = new Date(item.date);
                switch (this.currentFilter.time) {
                    case 'today':
                        return itemDate.toDateString() === now.toDateString();
                    case 'week':
                        const weekAgo = new Date(now);
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return itemDate >= weekAgo;
                    case 'month':
                        const monthAgo = new Date(now);
                        monthAgo.setMonth(monthAgo.getMonth() - 1);
                        return itemDate >= monthAgo;
                    case 'year':
                        const yearAgo = new Date(now);
                        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
                        return itemDate >= yearAgo;
                    default:
                        return true;
                }
            });
        }
        
        // Search filter
        if (this.currentFilter.search) {
            const search = this.currentFilter.search.toLowerCase();
            items = items.filter(item => {
                if (item.itemType === 'deed') {
                    return item.description.toLowerCase().includes(search) ||
                           (item.tags && item.tags.some(tag => tag.toLowerCase().includes(search)));
                } else {
                    return (item.goodPoints && item.goodPoints.toLowerCase().includes(search)) ||
                           (item.badPoints && item.badPoints.toLowerCase().includes(search)) ||
                           (item.reflection && item.reflection.toLowerCase().includes(search));
                }
            });
        }
        
        // Sort by date
        items.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        return items;
    }
    
    createTimelineItem(item) {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item fade-in-up';
        
        if (item.itemType === 'deed') {
            const card = this.createDeedCard(item);
            timelineItem.appendChild(card);
        } else {
            const card = this.createJournalCard(item);
            timelineItem.appendChild(card);
        }
        
        return timelineItem;
    }
    
    createDeedCard(deed) {
        const card = document.createElement('div');
        card.className = `deed-card glass-card ${deed.type} ${deed.category}`;
        
        const categories = deed.type === 'good' ? this.getGoodCategories() : this.getBadCategories();
        const category = categories[deed.category] || {name: 'أخرى', icon: '✨'};
        
        const typeLabel = deed.type === 'good' ? 'حسنة' : 'تقصير';
        const typeColor = deed.type === 'good' ? '#10b981' : '#ef4444';
        
        card.innerHTML = `
            <div class="deed-header">
                <div class="deed-title-section">
                    <div class="deed-category">
                        <span>${category.icon}</span>
                        <span>${category.name}</span>
                    </div>
                    <div class="deed-title">${deed.description}</div>
                    <div class="deed-date">${this.formatDate(deed.date)}</div>
                </div>
            </div>
            
            <div class="deed-meta">
                <span style="background: ${typeColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.75rem;">
                    ${deed.type === 'good' ? '✅' : '⚠️'} ${typeLabel}
                </span>
                
                ${deed.amount ? `
                    <div class="deed-amount">
                        <span>💰</span>
                        <span>${parseFloat(deed.amount).toFixed(2)} ريال</span>
                    </div>
                ` : ''}
                
                ${deed.pages ? `
                    <div class="deed-pages">
                        <span>📖</span>
                        <span>${deed.pages} صفحة</span>
                    </div>
                ` : ''}
                
                ${deed.tags && deed.tags.length > 0 ? `
                    <div class="deed-tags">
                        ${deed.tags.map(tag => `<span class="deed-tag">${tag}</span>`).join('')}
                    </div>
                ` : ''}
            </div>
            
            ${deed.improvementPlan ? `
                <div class="improvement-plan">
                    <div class="improvement-label">
                        <span>💡</span>
                        <span>خطة التحسين:</span>
                    </div>
                    <div class="improvement-text">${deed.improvementPlan}</div>
                </div>
            ` : ''}
        `;
        
        return card;
    }
    
    createJournalCard(journal) {
        const card = document.createElement('div');
        card.className = 'deed-card glass-card journal';
        
        const moodEmojis = {
            'excellent': '😇',
            'good': '😊',
            'neutral': '😐',
            'sad': '😔',
            'bad': '😢'
        };
        
        card.innerHTML = `
            <div class="deed-header">
                <div class="deed-title-section">
                    <div class="deed-category">
                        <span>📝</span>
                        <span>مذكرة يومية</span>
                    </div>
                    <div class="deed-date">${this.formatDate(journal.date)}</div>
                    ${journal.mood ? `<div class="journal-mood">${moodEmojis[journal.mood] || '😊'}</div>` : ''}
                </div>
            </div>
            
            ${journal.goodPoints ? `
                <div class="journal-section">
                    <div class="journal-section-title">✅ النقاط الإيجابية:</div>
                    <div class="journal-section-content">${journal.goodPoints}</div>
                </div>
            ` : ''}
            
            ${journal.badPoints ? `
                <div class="journal-section">
                    <div class="journal-section-title">⚠️ التقصيرات:</div>
                    <div class="journal-section-content">${journal.badPoints}</div>
                </div>
            ` : ''}
            
            ${journal.tomorrowPlan ? `
                <div class="journal-section">
                    <div class="journal-section-title">🎯 خطة الغد:</div>
                    <div class="journal-section-content">${journal.tomorrowPlan}</div>
                </div>
            ` : ''}
            
            ${journal.reflection ? `
                <div class="journal-section">
                    <div class="journal-section-title">💭 تأملات:</div>
                    <div class="journal-section-content">${journal.reflection}</div>
                </div>
            ` : ''}
        `;
        
        return card;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return date.toLocaleDateString('ar-SA', options);
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Deed form
        const deedForm = document.getElementById('addDeedForm');
        if (deedForm) {
            deedForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddDeed();
            });
        }
        
        // Journal form
        const journalForm = document.getElementById('journalForm');
        if (journalForm) {
            journalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddJournal();
            });
        }
        
        // Goal form
        const goalForm = document.getElementById('goalForm');
        if (goalForm) {
            goalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddGoal();
            });
        }
        
        // Late prayers form
        const latePrayerForm = document.getElementById('latePrayerForm');
        if (latePrayerForm) {
            latePrayerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleAddLatePrayer();
            });
        }
        
        // Category change
        const categorySelect = document.getElementById('deedCategory');
        if (categorySelect) {
            categorySelect.addEventListener('change', (e) => {
                this.handleCategoryChange(e.target.value);
            });
        }
        
        // Filters
        const timeFilter = document.getElementById('timeFilter');
        if (timeFilter) {
            timeFilter.addEventListener('change', (e) => {
                this.currentFilter.time = e.target.value;
                this.renderTimeline();
            });
        }
        
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilter.search = e.target.value;
                this.renderTimeline();
            });
        }
        
        
        // Set default dates
        const deedDate = document.getElementById('deedDate');
        const journalDate = document.getElementById('journalDate');
        const today = new Date().toISOString().split('T')[0];
        if (deedDate) deedDate.value = today;
        if (journalDate) journalDate.value = today;
        
        // Initial render for late prayers
        this.renderLatePrayers();
    }
    
    handleCategoryChange(category) {
        const goodCategories = this.getGoodCategories();
        const deedType = document.getElementById('deedType').value;
        
        const amountGroup = document.getElementById('amountGroup');
        const pagesGroup = document.getElementById('pagesGroup');
        const improvementGroup = document.getElementById('improvementGroup');
        
        // Show/hide amount field
        if (deedType === 'good' && goodCategories[category] && goodCategories[category].needsAmount) {
            amountGroup.style.display = 'block';
        } else {
            amountGroup.style.display = 'none';
        }
        
        // Show/hide pages field
        if (category === 'quran') {
            pagesGroup.style.display = 'block';
        } else {
            pagesGroup.style.display = 'none';
        }
        
        // Show improvement plan for bad deeds
        if (deedType === 'bad') {
            improvementGroup.style.display = 'block';
        } else {
            improvementGroup.style.display = 'none';
        }
    }
    
    handleAddDeed() {
        const type = document.getElementById('deedType').value;
        const category = document.getElementById('deedCategory').value;
        const description = document.getElementById('deedDescription').value.trim();
        const improvementPlan = document.getElementById('improvementPlan').value.trim();
        const amount = document.getElementById('deedAmount').value;
        const pages = document.getElementById('quranPages').value;
        const date = document.getElementById('deedDate').value;
        const tagsInput = document.getElementById('deedTags').value.trim();
        
        const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
        
        const deedData = {
            type,
            category,
            description,
            improvementPlan: improvementPlan || null,
            amount: amount ? parseFloat(amount) : null,
            pages: pages ? parseInt(pages) : null,
            date,
            tags
        };
        
        this.addDeed(deedData);
        closeAddModal();
        
        // Reset form
        document.getElementById('addDeedForm').reset();
        document.getElementById('deedDate').value = new Date().toISOString().split('T')[0];
    }
    
    handleAddJournal() {
        const date = document.getElementById('journalDate').value;
        const mood = document.getElementById('journalMood').value;
        const goodPoints = document.getElementById('journalGoodPoints').value.trim();
        const badPoints = document.getElementById('journalBadPoints').value.trim();
        const tomorrowPlan = document.getElementById('journalTomorrowPlan').value.trim();
        const reflection = document.getElementById('journalReflection').value.trim();
        
        const journalData = {
            date,
            mood,
            goodPoints,
            badPoints,
            tomorrowPlan,
            reflection
        };
        
        this.addJournal(journalData);
        closeJournalModal();
        
        // Reset form
        document.getElementById('journalForm').reset();
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('journalDate').value = new Date().toISOString().split('T')[0];
    }
    
    handleAddGoal() {
        const title = document.getElementById('goalTitle').value.trim();
        const description = document.getElementById('goalDescription').value.trim();
        const duration = parseInt(document.getElementById('goalDuration').value);
        const steps = document.getElementById('goalSteps').value.trim();
        
        const goalData = {
            title,
            description,
            duration,
            steps
        };
        
        this.addGoal(goalData);
        closeGoalModal();
        
        // Reset form
        document.getElementById('goalForm').reset();
    }
    
    handleAddLatePrayer() {
        const typeEl = document.getElementById('latePrayerType');
        const countEl = document.getElementById('latePrayerCount');
        
        const prayerType = typeEl.value;
        const count = parseInt(countEl.value, 10) || 0;
        
        if (!prayerType || count <= 0) {
            this.showToast('يرجى إدخال نوع الصلاة والعدد بشكل صحيح', 'error');
            return;
        }
        
        this.addLatePrayerTask({ prayerType, count });
        
        // Reset minimal fields (keep type for convenience)
        countEl.value = 1;
    }
    
    // ========== EXPORT ==========
    exportToJSON() {
        const data = {
            deeds: this.deeds,
            journals: this.journals,
            goals: this.goals,
            exportDate: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const exportFileName = `muhasabah-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();
        
        this.showToast('تم تصدير البيانات بنجاح', 'success');
    }
    
    // ========== HELPERS ==========
    showToast(message, type = 'success') {
        const toast = document.getElementById('khirahToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `khirah-toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ========== GLOBAL FUNCTIONS ==========
function openAddModal(type) {
    const modal = document.getElementById('addDeedModal');
    const title = document.getElementById('deedModalTitle');
    const typeInput = document.getElementById('deedType');
    const categorySelect = document.getElementById('deedCategory');
    const improvementGroup = document.getElementById('improvementGroup');
    
    if (!modal) return;
    
    typeInput.value = type;
    
    // Update title
    if (title) {
        title.textContent = type === 'good' ? 'إضافة عمل صالح ✅' : 'تسجيل تقصير ⚠️';
    }
    
    // Populate categories
    const manager = window.muhasabahManager;
    const categories = type === 'good' ? manager.getGoodCategories() : manager.getBadCategories();
    
    categorySelect.innerHTML = '<option value="">اختر الفئة</option>';
    Object.entries(categories).forEach(([key, cat]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${cat.icon} ${cat.name}`;
        categorySelect.appendChild(option);
    });
    
    // Show/hide improvement plan
    improvementGroup.style.display = type === 'bad' ? 'block' : 'none';
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeAddModal() {
    const modal = document.getElementById('addDeedModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function openJournalModal() {
    const modal = document.getElementById('journalModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeJournalModal() {
    const modal = document.getElementById('journalModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function openGoalModal() {
    const modal = document.getElementById('goalModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeGoalModal() {
    const modal = document.getElementById('goalModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function selectMood(mood) {
    document.getElementById('journalMood').value = mood;
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.getAttribute('data-mood') === mood) {
            btn.classList.add('selected');
        }
    });
}

function changeView(view) {
    if (window.muhasabahManager) {
        window.muhasabahManager.currentView = view;
        window.muhasabahManager.renderTimeline();
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-view') === view) {
                btn.classList.add('active');
            }
        });
    }
}

function exportData() {
    if (window.muhasabahManager) {
        window.muhasabahManager.exportToJSON();
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.muhasabahManager = new MuhasabahManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MuhasabahManager };
}
