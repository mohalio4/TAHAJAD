/* ====================================
   CHALLENGES FUNCTIONALITY
   Prayer challenges, Adhkar tracking, and progress management
   ==================================== */

class ChallengesManager {
    constructor() {
        this.userData = this.getUserData();
        this.challenges = [];
        this.activeChallenges = [];
        this.completedChallenges = [];
        
        if (!this.userData) {
            window.location.href = 'login_page.html';
            return;
        }
        
        this.init();
    }
    
    async init() {
        this.setupUserProfile();
        await this.loadChallenges();
        this.setupEventListeners();
        this.loadUserProgress();
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
    
    // ========== LOAD CHALLENGES ==========
    async loadChallenges() {
        try {
            const response = await window.apiManager.getChallenges();
            if (response && response.challenges) {
                this.challenges = response.challenges;
            } else {
                throw new Error('No challenges data');
            }
        } catch (error) {
            // Use mock challenges
            this.challenges = this.getMockChallenges();
        }
        
        this.categorizeChallen();
        this.renderChallenges();
    }
    
    getMockChallenges() {
        return [
            {
                id: 1,
                title: 'تحدي الصلاة في وقتها',
                description: '30 يوماً من الصلاة في المسجد',
                category: 'prayer',
                duration: 30,
                icon: '🕌',
                points: 500,
                color: 'emerald',
                requirements: [
                    'صلاة الفجر في المسجد',
                    'صلاة الظهر في المسجد',
                    'صلاة العصر في المسجد',
                    'صلاة المغرب في المسجد',
                    'صلاة العشاء في المسجد'
                ],
                benefits: 'تقوية العلاقة مع الله وزيادة الأجر',
                progress: 7,
                startDate: '2024-12-01',
                active: true
            },
            {
                id: 2,
                title: 'الأذكار الـ40 الصباحية',
                description: 'أكمل أذكار الصباح يومياً لمدة 40 يوم',
                category: 'adhkar',
                duration: 40,
                icon: '📿',
                points: 400,
                color: 'gold',
                requirements: [
                    'أذكار الاستيقاظ',
                    'آية الكرسي',
                    'المعوذات',
                    'تسبيح الزهراء',
                    'أذكار الصباح الكاملة'
                ],
                benefits: 'الحفظ من الشرور وزيادة البركة في اليوم',
                progress: 32,
                startDate: '2024-11-01',
                active: true
            },
            {
                id: 3,
                title: 'ختمة القرآن الشهرية',
                description: 'اقرأ جزء من القرآن يومياً',
                category: 'quran',
                duration: 30,
                icon: '📖',
                points: 600,
                color: 'emerald',
                requirements: [
                    'قراءة جزء كامل يومياً',
                    'التدبر في الآيات',
                    'تسجيل الفوائد المستفادة'
                ],
                benefits: 'زيادة الحسنات وتقوية العلاقة مع كتاب الله',
                progress: 12,
                startDate: '2024-12-01',
                active: true
            },
            {
                id: 4,
                title: 'دعاء كميل الأسبوعي',
                description: 'قراءة دعاء كميل كل ليلة جمعة',
                category: 'dua',
                duration: 12,
                icon: '🤲',
                points: 300,
                color: 'ruby',
                requirements: [
                    'قراءة الدعاء كاملاً',
                    'الخشوع والتدبر',
                    'الدعاء بعد الدعاء'
                ],
                benefits: 'استجابة الدعاء ورفع البلاء',
                progress: 0,
                startDate: null,
                active: false
            },
            {
                id: 5,
                title: 'صدقة الأسبوع',
                description: 'تصدق كل أسبوع لمدة 12 أسبوع',
                category: 'charity',
                duration: 12,
                icon: '💰',
                points: 350,
                color: 'gold',
                requirements: [
                    'التصدق بأي مبلغ',
                    'التصدق سراً',
                    'التصدق بنية خالصة'
                ],
                benefits: 'زيادة الرزق ودفع البلاء',
                progress: 0,
                startDate: null,
                active: false
            },
            {
                id: 6,
                title: 'زيارة عاشوراء اليومية',
                description: 'قراءة زيارة عاشوراء كل يوم لمدة 40 يوم',
                category: 'ziyarat',
                duration: 40,
                icon: '🏴',
                points: 700,
                color: 'ruby',
                requirements: [
                    'قراءة الزيارة كاملة',
                    'اللعن 100 مرة',
                    'السلام 100 مرة',
                    'الصلاة ركعتين بعد الزيارة'
                ],
                benefits: 'قضاء الحوائج وتفريج الكرب',
                progress: 0,
                startDate: null,
                active: false
            }
        ];
    }
    
    categorizeChallen() {
        this.activeChallenges = this.challenges.filter(c => c.active);
        this.completedChallenges = this.challenges.filter(c => c.progress >= c.duration);
    }
    
    // ========== RENDER CHALLENGES ==========
    renderChallenges() {
        this.renderActiveChallenges();
        this.renderAvailableChallenges();
        this.updateStats();
    }
    
    renderActiveChallenges() {
        const container = document.getElementById('activeChallengesList');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.activeChallenges.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🎯</span>
                    <p>لا توجد تحديات نشطة</p>
                    <p class="empty-subtitle">ابدأ تحدياً جديداً من القائمة أدناه</p>
                </div>
            `;
            return;
        }
        
        this.activeChallenges.forEach(challenge => {
            const card = this.createChallengeCard(challenge, true);
            container.appendChild(card);
        });
    }
    
    renderAvailableChallenges() {
        const container = document.getElementById('availableChallengesList');
        if (!container) return;
        
        container.innerHTML = '';
        
        const available = this.challenges.filter(c => !c.active && c.progress < c.duration);
        
        available.forEach(challenge => {
            const card = this.createChallengeCard(challenge, false);
            container.appendChild(card);
        });
    }
    
    createChallengeCard(challenge, isActive) {
        const card = document.createElement('div');
        card.className = `challenge-card glass-card ${challenge.color}`;
        
        const percentage = Math.round((challenge.progress / challenge.duration) * 100);
        
        card.innerHTML = `
            <div class="challenge-header">
                <div class="challenge-icon">${challenge.icon}</div>
                <div class="challenge-info">
                    <h3 class="challenge-title">${challenge.title}</h3>
                    <p class="challenge-desc">${challenge.description}</p>
                    <div class="challenge-meta">
                        <span class="challenge-duration">⏱️ ${challenge.duration} يوم</span>
                        <span class="challenge-points">⭐ ${challenge.points} نقطة</span>
                    </div>
                </div>
            </div>
            
            ${isActive ? `
                <div class="challenge-progress">
                    <div class="progress-header">
                        <span class="progress-label">التقدم</span>
                        <span class="progress-value">${challenge.progress}/${challenge.duration} يوم</span>
                    </div>
                    <div class="progress-bar-wrapper">
                        <div class="progress-bar-fill ${challenge.color}" style="width: ${percentage}%"></div>
                    </div>
                    <span class="progress-percentage">${percentage}% مكتمل</span>
                </div>
                
                <div class="challenge-actions">
                    <button class="btn-action btn-primary" onclick="window.challengesManager.completeDay(${challenge.id})">
                        ✓ أكملت اليوم
                    </button>
                    <button class="btn-action btn-secondary" onclick="window.challengesManager.viewDetails(${challenge.id})">
                        عرض التفاصيل
                    </button>
                </div>
            ` : `
                <div class="challenge-requirements">
                    <h4>المتطلبات:</h4>
                    <ul>
                        ${challenge.requirements.map(req => `<li>${req}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="challenge-actions">
                    <button class="btn-action btn-primary" onclick="window.challengesManager.startChallenge(${challenge.id})">
                        🚀 ابدأ التحدي
                    </button>
                    <button class="btn-action btn-secondary" onclick="window.challengesManager.viewDetails(${challenge.id})">
                        عرض التفاصيل
                    </button>
                </div>
            `}
        `;
        
        return card;
    }
    
    // ========== CHALLENGE ACTIONS ==========
    async startChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        if (confirm(`هل تريد بدء تحدي "${challenge.title}"؟`)) {
            challenge.active = true;
            challenge.startDate = new Date().toISOString();
            challenge.progress = 0;
            
            try {
                // Save to backend
                await window.apiManager.updateChallengeProgress(challengeId, {
                    active: true,
                    startDate: challenge.startDate
                });
            } catch (error) {
                console.error('Error starting challenge:', error);
            }
            
            // Save locally
            this.saveChallenges();
            
            // Refresh UI
            this.categorizeChallen();
            this.renderChallenges();
            
            this.showToast(`بدأ تحدي "${challenge.title}"! بارك الله فيك`, 'success');
            
            // Show celebration
            if (window.animationsController) {
                window.animationsController.celebrateSuccess('تحدي جديد! 🎯');
            }
        }
    }
    
    async completeDay(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        // Check if already completed today
        const lastCompleted = localStorage.getItem(`challenge_${challengeId}_lastCompleted`);
        const today = new Date().toDateString();
        
        if (lastCompleted === today) {
            this.showToast('لقد أكملت هذا التحدي اليوم بالفعل!', 'info');
            return;
        }
        
        challenge.progress++;
        localStorage.setItem(`challenge_${challengeId}_lastCompleted`, today);
        
        try {
            await window.apiManager.completeChallengeDay(challengeId, challenge.progress);
        } catch (error) {
            console.error('Error completing day:', error);
        }
        
        // Save locally
        this.saveChallenges();
        
        // Check if challenge completed
        if (challenge.progress >= challenge.duration) {
            this.handleChallengeCompleted(challenge);
        } else {
            this.showToast(`ممتاز! ${challenge.progress}/${challenge.duration} يوم مكتمل`, 'success');
        }
        
        // Refresh UI
        this.renderChallenges();
        
        // Show celebration
        if (window.animationsController) {
            window.animationsController.celebrateSuccess('أحسنت! 🎉');
        }
    }
    
    handleChallengeCompleted(challenge) {
        challenge.active = false;
        
        // Award points
        const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
        const newPoints = currentPoints + challenge.points;
        localStorage.setItem('userPoints', newPoints.toString());
        
        // Show completion modal
        this.showCompletionModal(challenge);
        
        this.showToast(`تهانينا! أكملت تحدي "${challenge.title}"! 🏆`, 'success');
    }
    
    showCompletionModal(challenge) {
        const modal = document.createElement('div');
        modal.className = 'modal challenge-completion-modal';
        modal.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content glass-card">
                <div class="completion-header">
                    <div class="completion-icon">🏆</div>
                    <h2 class="completion-title">تهانينا!</h2>
                    <p class="completion-message">لقد أكملت تحدي "${challenge.title}"</p>
                </div>
                
                <div class="completion-rewards">
                    <div class="reward-item">
                        <span class="reward-icon">⭐</span>
                        <span class="reward-label">النقاط المكتسبة</span>
                        <span class="reward-value">+${challenge.points}</span>
                    </div>
                    <div class="reward-item">
                        <span class="reward-icon">🔥</span>
                        <span class="reward-label">أيام متتالية</span>
                        <span class="reward-value">${challenge.duration}</span>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button class="btn-primary" onclick="this.closest('.modal').remove()">
                        رائع!
                    </button>
                    <button class="btn-secondary" onclick="window.challengesManager.shareAchievement(${challenge.id}); this.closest('.modal').remove();">
                        مشاركة الإنجاز
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
        
        // Create confetti
        if (window.animationsController) {
            window.animationsController.createConfetti();
        }
    }
    
    viewDetails(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal challenge-details-modal';
        modal.innerHTML = `
            <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
            <div class="modal-content glass-card">
                <button class="modal-close" onclick="this.closest('.modal').remove()">✕</button>
                
                <div class="details-header">
                    <div class="details-icon">${challenge.icon}</div>
                    <h2 class="details-title">${challenge.title}</h2>
                    <p class="details-desc">${challenge.description}</p>
                </div>
                
                <div class="details-section">
                    <h3>المتطلبات:</h3>
                    <ul class="requirements-list">
                        ${challenge.requirements.map(req => `<li>✓ ${req}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="details-section">
                    <h3>الفوائد:</h3>
                    <p class="benefits-text">${challenge.benefits}</p>
                </div>
                
                <div class="details-meta">
                    <div class="meta-item">
                        <span class="meta-label">المدة</span>
                        <span class="meta-value">${challenge.duration} يوم</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">النقاط</span>
                        <span class="meta-value">${challenge.points} ⭐</span>
                    </div>
                    <div class="meta-item">
                        <span class="meta-label">الفئة</span>
                        <span class="meta-value">${this.getCategoryName(challenge.category)}</span>
                    </div>
                </div>
                
                ${!challenge.active ? `
                    <button class="btn-primary" onclick="window.challengesManager.startChallenge(${challenge.id}); this.closest('.modal').remove();">
                        🚀 ابدأ التحدي
                    </button>
                ` : ''}
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'flex';
    }
    
    getCategoryName(category) {
        const names = {
            'prayer': 'صلاة',
            'adhkar': 'أذكار',
            'quran': 'قرآن',
            'dua': 'دعاء',
            'charity': 'صدقة',
            'ziyarat': 'زيارة'
        };
        return names[category] || category;
    }
    
    shareAchievement(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (!challenge) return;
        
        const text = `أكملت تحدي "${challenge.title}" في تطبيق تهجّد! 🏆\nحصلت على ${challenge.points} نقطة\n\nمن تطبيق تهجّد - تطبيقك الإسلامي الشامل`;
        
        if (navigator.share) {
            navigator.share({
                title: 'إنجاز جديد في تهجّد',
                text: text
            }).catch(console.error);
        } else {
            navigator.clipboard.writeText(text);
            this.showToast('تم نسخ الإنجاز! الصقه في أي مكان', 'success');
        }
    }
    
    // ========== STATS ==========
    updateStats() {
        const totalChallenges = document.getElementById('totalChallenges');
        const activeChallengesCount = document.getElementById('activeChallengesCount');
        const completedChallengesCount = document.getElementById('completedChallengesCount');
        const totalPoints = document.getElementById('challengePoints');
        
        if (totalChallenges) totalChallenges.textContent = this.challenges.length;
        if (activeChallengesCount) activeChallengesCount.textContent = this.activeChallenges.length;
        if (completedChallengesCount) completedChallengesCount.textContent = this.completedChallenges.length;
        
        const points = this.completedChallenges.reduce((sum, c) => sum + c.points, 0);
        if (totalPoints) totalPoints.textContent = points;
    }
    
    // ========== STORAGE ==========
    loadUserProgress() {
        const saved = localStorage.getItem('userChallenges');
        if (saved) {
            try {
                const savedChallenges = JSON.parse(saved);
                // Merge saved progress with challenges
                savedChallenges.forEach(saved => {
                    const challenge = this.challenges.find(c => c.id === saved.id);
                    if (challenge) {
                        challenge.progress = saved.progress || 0;
                        challenge.active = saved.active || false;
                        challenge.startDate = saved.startDate || null;
                    }
                });
                
                this.categorizeChallen();
                this.renderChallenges();
            } catch (e) {
                console.error('Error loading saved challenges:', e);
            }
        }
    }
    
    saveChallenges() {
        const toSave = this.challenges.map(c => ({
            id: c.id,
            progress: c.progress,
            active: c.active,
            startDate: c.startDate
        }));
        
        localStorage.setItem('userChallenges', JSON.stringify(toSave));
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    window.apiManager.logout();
                }
            });
        }
        
        // Filter buttons (if any)
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.dataset.filter;
                this.filterChallenges(filter);
            });
        });
    }
    
    filterChallenges(category) {
        // Filter challenges by category
        // Implementation depends on UI
    }
    
    // ========== UI HELPERS ==========
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
        } else if (type === 'info') {
            toast.style.borderRight = '4px solid var(--secondary)';
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

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.challengesManager = new ChallengesManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ChallengesManager };
}

