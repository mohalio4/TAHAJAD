/* ====================================
   DUAS LIBRARY FUNCTIONALITY (SHIA EDITION)
   Search, filter, favorites, and audio playback
   ==================================== */

class DuasManager {
    constructor() {
        this.userData = this.getUserData();
        this.allDuas = [];
        this.filteredDuas = [];
        this.favorites = this.loadFavorites();
        this.currentPage = 1;
        this.duasPerPage = 12;
        this.currentFilter = 'all';
        this.currentAudio = null;
        this.currentDuaId = null;
        
        if (!this.userData) {
            window.location.href = 'login.html';
            return;
        }
        
        this.init();
    }
    
    async init() {
        this.setupUserProfile();
        await this.loadDuas();
        this.setupEventListeners();
        this.setupAudioPlayer();
    }
    
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
    
    async loadDuas() {
        try {
            const response = await window.apiManager.getDuas();
            if (response && response.duas) {
                this.allDuas = response.duas;
            } else {
                throw new Error('No duas data');
            }
        } catch (error) {
            this.allDuas = this.getMockDuas();
        }
        
        this.filteredDuas = [...this.allDuas];
        this.renderDuas();
    }
    
    getMockDuas() {
        return [
            // من القرآن الكريم
            {
                id: 1,
                arabic: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                translation: 'ربنا أعطنا في الدنيا خيراً وفي الآخرة خيراً واحفظنا من عذاب النار',
                categories: ['quran'],
                source: 'سورة البقرة، الآية 201',
                benefits: 'من أجمع الأدعية وأشملها، يجمع خيري الدنيا والآخرة',
                audioUrl: '/assets/audio/dua1.mp3'
            },
            
            // من أدعية أمير المؤمنين علي (ع)
            {
                id: 2,
                arabic: 'إِلَهِي كَفَى بِي عِزًّا أَنْ أَكُونَ لَكَ عَبْدًا، وَكَفَى بِي فَخْرًا أَنْ تَكُونَ لِي رَبًّا',
                translation: 'إلهي يكفيني عزاً أن أكون عبداً لك، ويكفيني فخراً أن تكون أنت ربي',
                categories: ['ahlulbayt'],
                source: 'من دعاء أمير المؤمنين علي بن أبي طالب (ع)',
                benefits: 'دعاء يزيد العبد عزة وفخراً بعبوديته لله',
                audioUrl: '/assets/audio/dua2.mp3'
            },
            
            // من الصحيفة السجادية
            {
                id: 3,
                arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ وَاجْعَلْنِي أَخْشَاكَ كَأَنِّي أَرَاكَ',
                translation: 'اللهم صلّ على محمد وآل محمد واجعلني أخشاك كأنني أراك',
                categories: ['sahifa', 'ahlulbayt'],
                source: 'من أدعية الإمام زين العابدين (ع) في الصحيفة السجادية',
                benefits: 'دعاء لتحقيق مقام الإحسان والمراقبة الإلهية',
                audioUrl: '/assets/audio/dua3.mp3'
            },
            
            // دعاء كميل
            {
                id: 4,
                arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ أَنْ تَغْفِرَ لِي',
                translation: 'اللهم إني أسألك برحمتك التي وسعت كل شيء أن تغفر لي',
                categories: ['kumayl', 'ahlulbayt'],
                source: 'من دعاء كميل المروي عن أمير المؤمنين (ع)',
                benefits: 'من أعظم الأدعية، يُستحب قراءته ليلة الجمعة',
                audioUrl: '/assets/audio/dua4.mp3'
            },
            
            // من النبي محمد (ص)
            {
                id: 5,
                arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَآلِ إِبْرَاهِيمَ',
                translation: 'اللهم صلّ على محمد وآل محمد كما صلّيت على إبراهيم وآل إبراهيم',
                categories: ['prophet'],
                source: 'الصلاة الإبراهيمية على النبي وآله',
                benefits: 'الصلاة على النبي وآله من أفضل الأعمال',
                audioUrl: '/assets/audio/dua5.mp3'
            },
            
            // دعاء الفرج
            {
                id: 6,
                arabic: 'اللَّهُمَّ كُنْ لِوَلِيِّكَ الْحُجَّةِ بْنِ الْحَسَنِ صَلَوَاتُكَ عَلَيْهِ وَعَلَى آبَائِهِ',
                translation: 'اللهم كن لوليك الحجة بن الحسن صلواتك عليه وعلى آبائه',
                categories: ['faraj', 'ahlulbayt'],
                source: 'دعاء الفرج للإمام المهدي (عج)',
                benefits: 'يُستحب قراءته بعد كل صلاة لتعجيل فرج الإمام',
                audioUrl: '/assets/audio/dua6.mp3'
            },
            
            // من دعاء عرفة
            {
                id: 7,
                arabic: 'الْحَمْدُ لِلَّهِ الَّذِي لَيْسَ لِقَضَائِهِ دَافِعٌ وَلَا لِعَطَائِهِ مَانِعٌ',
                translation: 'الحمد لله الذي ليس لقضائه دافع ولا لعطائه مانع',
                categories: ['arafah', 'ahlulbayt'],
                source: 'من دعاء الإمام الحسين (ع) يوم عرفة',
                benefits: 'من أعظم الأدعية، يُستحب قراءته يوم عرفة',
                audioUrl: '/assets/audio/dua7.mp3'
            },
            
            // دعاء التوسل
            {
                id: 8,
                arabic: 'يَا نُورَ النُّورِ يَا مُدَبِّرَ الْأُمُورِ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ',
                translation: 'يا نور النور يا مدبر الأمور صلّ على محمد وآل محمد',
                categories: ['tawassul', 'ahlulbayt'],
                source: 'دعاء التوسل بأهل البيت (ع)',
                benefits: 'التوسل بأهل البيت من أسباب قبول الدعاء',
                audioUrl: '/assets/audio/dua8.mp3'
            },
            
            // من الصحيفة السجادية - دعاء مكارم الأخلاق
            {
                id: 9,
                arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَآلِهِ وَبَلِّغْ بِإِيمَانِي أَكْمَلَ الْإِيمَانِ',
                translation: 'اللهم صلّ على محمد وآله وبلّغ بإيماني أكمل الإيمان',
                categories: ['sahifa', 'ahlulbayt'],
                source: 'دعاء مكارم الأخلاق من الصحيفة السجادية',
                benefits: 'دعاء شامل لمكارم الأخلاق والكمالات',
                audioUrl: '/assets/audio/dua9.mp3'
            },
            
            // زيارة عاشوراء
            {
                id: 10,
                arabic: 'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللَّهِ السَّلَامُ عَلَيْكَ يَا بْنَ رَسُولِ اللَّهِ',
                translation: 'السلام عليك يا أبا عبد الله السلام عليك يا بن رسول الله',
                categories: ['ziyarat', 'ahlulbayt'],
                source: 'زيارة عاشوراء للإمام الحسين (ع)',
                benefits: 'من أعظم الزيارات، يُستحب قراءتها يومياً',
                audioUrl: '/assets/audio/dua10.mp3'
            }
        ];
    }
    
    renderDuas(append = false) {
        const grid = document.getElementById('duasGrid');
        if (!grid) return;
        
        if (!append) {
            const existingCards = grid.querySelectorAll('.dua-card');
            existingCards.forEach((card, index) => {
                if (index >= 3) card.remove();
            });
        }
        
        const start = append ? (this.currentPage - 1) * this.duasPerPage : 0;
        const end = this.currentPage * this.duasPerPage;
        const duasToRender = this.filteredDuas.slice(start, end);
        
        duasToRender.forEach(dua => {
            if (document.querySelector(`[data-dua-id="${dua.id}"]`) && dua.id <= 3) {
                return;
            }
            
            const card = this.createDuaCard(dua);
            grid.appendChild(card);
        });
        
        this.updateLoadMoreButton();
    }
    
    createDuaCard(dua) {
        const card = document.createElement('div');
        card.className = 'dua-card glass-card';
        card.dataset.duaId = dua.id;
        card.dataset.category = dua.categories.join(' ');
        
        const isFavorited = this.favorites.includes(dua.id);
        const categoryLabel = this.getCategoryLabel(dua.categories[0]);
        const categoryClass = dua.categories[0];
        
        card.innerHTML = `
            <div class="dua-header">
                <div class="dua-category-badge ${categoryClass}">${categoryLabel}</div>
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="toggleFavorite(${dua.id})">
                    <span class="favorite-icon">${isFavorited ? '★' : '☆'}</span>
                </button>
            </div>
            
            <div class="dua-content">
                <p class="dua-arabic">${dua.arabic}</p>
                <p class="dua-translation">${dua.translation}</p>
                ${dua.source ? `<p class="dua-source">${dua.source}</p>` : ''}
            </div>
            
            <div class="dua-footer">
                <button class="dua-action-btn" onclick="playAudio(${dua.id})">
                    <span class="btn-icon">▶️</span>
                    <span>استماع</span>
                </button>
                <button class="dua-action-btn" onclick="shareDua(${dua.id})">
                    <span class="btn-icon">📤</span>
                    <span>مشاركة</span>
                </button>
                <button class="dua-action-btn" onclick="viewDetails(${dua.id})">
                    <span class="btn-icon">👁️</span>
                    <span>التفاصيل</span>
                </button>
            </div>
        `;
        
        return card;
    }
    
    getCategoryLabel(category) {
        const labels = {
            quran: 'من القرآن',
            prophet: 'عن النبي (ص)',
            ahlulbayt: 'أهل البيت (ع)',
            sahifa: 'الصحيفة السجادية',
            kumayl: 'دعاء كميل',
            arafah: 'دعاء عرفة',
            tawassul: 'التوسل',
            faraj: 'الفرج',
            ziyarat: 'الزيارات'
        };
        return labels[category] || 'متنوعة';
    }
    
    updateLoadMoreButton() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (!loadMoreBtn) return;
        
        const totalLoaded = this.currentPage * this.duasPerPage;
        if (totalLoaded >= this.filteredDuas.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('duaSearch');
        const clearSearch = document.getElementById('clearSearch');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const categoryCards = document.querySelectorAll('.category-card');
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        const viewToggles = document.querySelectorAll('.view-toggle');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
                clearSearch.style.display = e.target.value ? 'flex' : 'none';
            });
        }
        
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                clearSearch.style.display = 'none';
                this.handleSearch('');
            });
        }
        
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.handleFilter(btn.dataset.category);
            });
        });
        
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const category = card.dataset.category;
                filterBtns.forEach(b => b.classList.remove('active'));
                const filterBtn = document.querySelector(`[data-category="${category}"]`);
                if (filterBtn) filterBtn.classList.add('active');
                this.handleFilter(category);
            });
        });
        
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.currentPage++;
                this.renderDuas(true);
            });
        }
        
        viewToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                viewToggles.forEach(t => t.classList.remove('active'));
                toggle.classList.add('active');
                const view = toggle.dataset.view;
                const grid = document.getElementById('duasGrid');
                if (view === 'list') {
                    grid.classList.add('list-view');
                } else {
                    grid.classList.remove('list-view');
                }
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
    
    handleSearch(query) {
        query = query.toLowerCase();
        this.filteredDuas = this.allDuas.filter(dua => {
            return dua.arabic.includes(query) || 
                   dua.translation.toLowerCase().includes(query);
        });
        
        if (this.currentFilter !== 'all') {
            this.applyFilter(this.currentFilter);
        }
        
        this.currentPage = 1;
        this.renderDuas();
    }
    
    handleFilter(category) {
        this.currentFilter = category;
        this.filteredDuas = [...this.allDuas];
        
        if (category === 'favorites') {
            this.filteredDuas = this.allDuas.filter(dua => 
                this.favorites.includes(dua.id)
            );
        } else if (category !== 'all') {
            this.filteredDuas = this.allDuas.filter(dua =>
                dua.categories.includes(category)
            );
        }
        
        const searchInput = document.getElementById('duaSearch');
        if (searchInput && searchInput.value) {
            this.handleSearch(searchInput.value);
        }
        
        this.currentPage = 1;
        this.renderDuas();
    }
    
    applyFilter(category) {
        if (category === 'favorites') {
            this.filteredDuas = this.filteredDuas.filter(dua =>
                this.favorites.includes(dua.id)
            );
        } else if (category !== 'all') {
            this.filteredDuas = this.filteredDuas.filter(dua =>
                dua.categories.includes(category)
            );
        }
    }
    
    loadFavorites() {
        const saved = localStorage.getItem('favoriteDuas');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveFavorites() {
        localStorage.setItem('favoriteDuas', JSON.stringify(this.favorites));
    }
    
    setupAudioPlayer() {
        this.audio = document.getElementById('duaAudio');
        if (!this.audio) return;
        
        this.audio.addEventListener('timeupdate', () => {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            const progressFill = document.getElementById('audioProgress');
            const currentTime = document.getElementById('currentTime');
            
            if (progressFill) progressFill.style.width = progress + '%';
            if (currentTime) currentTime.textContent = this.formatTime(this.audio.currentTime);
        });
        
        this.audio.addEventListener('loadedmetadata', () => {
            const duration = document.getElementById('duration');
            if (duration) duration.textContent = this.formatTime(this.audio.duration);
        });
        
        this.audio.addEventListener('ended', () => {
            const playPauseBtn = document.getElementById('playPauseBtn');
            if (playPauseBtn) {
                playPauseBtn.querySelector('.play-icon').textContent = '▶️';
            }
        });
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('duaToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `dua-toast ${type} show`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Global functions
function toggleFavorite(duaId) {
    const manager = window.duasManager;
    const index = manager.favorites.indexOf(duaId);
    
    if (index > -1) {
        manager.favorites.splice(index, 1);
        manager.showToast('تمت الإزالة من المفضلة', 'success');
    } else {
        manager.favorites.push(duaId);
        manager.showToast('تمت الإضافة للمفضلة', 'success');
    }
    
    manager.saveFavorites();
    
    const btns = document.querySelectorAll(`[onclick="toggleFavorite(${duaId})"]`);
    btns.forEach(btn => {
        const isFavorited = manager.favorites.includes(duaId);
        btn.classList.toggle('favorited', isFavorited);
        btn.querySelector('.favorite-icon').textContent = isFavorited ? '★' : '☆';
    });
}

function playAudio(duaId) {
    const manager = window.duasManager;
    const dua = manager.allDuas.find(d => d.id === duaId);
    
    if (!dua || !dua.audioUrl) {
        manager.showToast('الملف الصوتي غير متوفر', 'error');
        return;
    }
    
    if (manager.audio) {
        manager.audio.src = dua.audioUrl;
        manager.audio.play().catch(e => {
            manager.showToast('حدث خطأ في تشغيل الصوت', 'error');
        });
    }
}

function shareDua(duaId) {
    const manager = window.duasManager;
    const dua = manager.allDuas.find(d => d.id === duaId);
    
    if (!dua) return;
    
    const text = `${dua.arabic}\n\n${dua.translation}\n\nمن تطبيق تهجّد`;
    
    if (navigator.share) {
        navigator.share({
            title: 'دعاء من تهجّد',
            text: text
        }).catch(e => console.log('Error sharing'));
    } else {
        navigator.clipboard.writeText(text);
        manager.showToast('تم نسخ النص', 'success');
    }
}

function viewDetails(duaId) {
    const manager = window.duasManager;
    const dua = manager.allDuas.find(d => d.id === duaId);
    
    if (!dua) return;
    
    const modal = document.getElementById('duaDetailsModal');
    if (!modal) return;
    
    document.getElementById('modalDuaArabic').textContent = dua.arabic;
    document.getElementById('modalDuaTranslation').textContent = dua.translation;
    document.getElementById('modalDuaSource').textContent = dua.source || 'المصدر غير متوفر';
    document.getElementById('modalDuaBenefits').textContent = dua.benefits || 'لا توجد فوائد مسجلة';
    
    const favoriteBtn = document.getElementById('modalFavoriteBtn');
    const isFavorited = manager.favorites.includes(duaId);
    favoriteBtn.classList.toggle('favorited', isFavorited);
    favoriteBtn.querySelector('.favorite-icon').textContent = isFavorited ? '★' : '☆';
    favoriteBtn.onclick = () => toggleFavorite(duaId);
    
    manager.currentDuaId = duaId;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('duaDetailsModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        
        const manager = window.duasManager;
        if (manager.audio) {
            manager.audio.pause();
        }
    }
}

function shareDuaFromModal() {
    const manager = window.duasManager;
    if (manager.currentDuaId) {
        shareDua(manager.currentDuaId);
    }
}

function copyDuaText() {
    const arabic = document.getElementById('modalDuaArabic').textContent;
    const translation = document.getElementById('modalDuaTranslation').textContent;
    const text = `${arabic}\n\n${translation}`;
    
    navigator.clipboard.writeText(text);
    window.duasManager.showToast('تم نسخ النص', 'success');
}

document.addEventListener('DOMContentLoaded', () => {
    window.duasManager = new DuasManager();
    
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            const audio = window.duasManager.audio;
            if (audio.paused) {
                audio.play();
                playPauseBtn.querySelector('.play-icon').textContent = '⏸️';
            } else {
                audio.pause();
                playPauseBtn.querySelector('.play-icon').textContent = '▶️';
            }
        });
    }
});

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DuasManager };
}