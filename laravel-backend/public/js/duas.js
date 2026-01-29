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
            const loginRoute = window.Laravel?.routes?.login || '/login';
            window.location.href = loginRoute;
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
            // Load duas from ad3iya.json
            const duasPath = window.Laravel?.jsonPaths?.ad3iya || '/json/ad3iya.json';
            const duasResponse = await fetch(duasPath);
            if (!duasResponse.ok) {
                throw new Error('Failed to load duas');
            }
            const duasData = await duasResponse.json();
            
            // Load ziyarat from ziyara.json
            const ziyaraPath = window.Laravel?.jsonPaths?.ziyara || '/json/ziyara.json';
            const ziyaratResponse = await fetch(ziyaraPath);
            if (!ziyaratResponse.ok) {
                throw new Error('Failed to load ziyarat');
            }
            const ziyaratData = await ziyaratResponse.json();
            
            // Load taqibat from taqibat.json
            const taqibatPath = window.Laravel?.jsonPaths?.taqibat || '/json/taqibat.json';
            const taqibatResponse = await fetch(taqibatPath);
            if (!taqibatResponse.ok) {
                throw new Error('Failed to load taqibat');
            }
            const taqibatData = await taqibatResponse.json();
            
            // Load seerah from seerah.json
            const seerahPath = window.Laravel?.jsonPaths?.seerah || '/json/seerah.json';
            const seerahResponse = await fetch(seerahPath);
            if (!seerahResponse.ok) {
                throw new Error('Failed to load seerah');
            }
            const seerahData = await seerahResponse.json();
            
            // Map duas from ad3iya.json
            const duas = duasData.map((item, index) => {
                // Extract first line or first sentence from body as preview
                const bodyLines = item.body.split('\n').filter(line => line.trim());
                const preview = bodyLines.length > 0 ? bodyLines[0].substring(0, 150) : item.body.substring(0, 150);
                
                // Determine categories from major and tags
                const categories = ['dua']; // Always include 'dua' category
                if (item.major === 'الدعاء' || item.major === 'الأدعية') {
                    categories.push('prophet');
                }
                if (item.tags && item.tags.includes('رمضان')) {
                    categories.push('ramadan');
                }
                if (item.tags && item.tags.includes('السحر')) {
                    categories.push('sahifa');
                }
                if (item.tags && item.tags.includes('الصحيفة')) {
                    categories.push('sahifa');
                }
                if (categories.length === 1) {
                    categories.push('ahlulbayt');
                }
                
                return {
                    id: index + 1,
                    arabic: preview + (item.body.length > 150 ? '...' : ''),
                    fullArabic: item.body,
                    translation: '', // JSON doesn't have translation
                    categories: categories,
                    source: item.title,
                    benefits: item.major || '',
                    title: item.title,
                    tags: item.tags || '',
                    type: 'dua',
                    youtubeUrl: item.youtubeUrl || '' // Get YouTube URL from JSON
                };
            });
            
            // Map ziyarat from ziyara.json
            const ziyarat = ziyaratData.map((item, index) => {
                // Extract first line or first sentence from body as preview
                const bodyLines = item.body.split('\n').filter(line => line.trim());
                const preview = bodyLines.length > 0 ? bodyLines[0].substring(0, 150) : item.body.substring(0, 150);
                
                return {
                    id: duas.length + index + 1, // Continue ID numbering from duas
                    arabic: preview + (item.body.length > 150 ? '...' : ''),
                    fullArabic: item.body,
                    translation: '', // JSON doesn't have translation
                    categories: ['ziyarat'], // Always include 'ziyarat' category
                    source: item.title,
                    benefits: item.major || '',
                    title: item.title,
                    tags: item.tags || '',
                    type: 'ziyarat'
                };
            });
            
            // Map taqibat from taqibat.json
            const taqibat = taqibatData.map((item, index) => {
                // Extract first line or first sentence from body as preview
                const bodyLines = item.body.split('\n').filter(line => line.trim());
                const preview = bodyLines.length > 0 ? bodyLines[0].substring(0, 150) : item.body.substring(0, 150);
                
                return {
                    id: duas.length + ziyarat.length + index + 1, // Continue ID numbering
                    arabic: preview + (item.body.length > 150 ? '...' : ''),
                    fullArabic: item.body,
                    translation: '', // JSON doesn't have translation
                    categories: ['taqibat'], // Always include 'taqibat' category
                    source: item.title,
                    benefits: item.major || '',
                    title: item.title,
                    tags: item.tags || '',
                    type: 'taqibat',
                    youtubeUrl: item.youtubeUrl || '' // Get YouTube URL from JSON
                };
            });
            
            // Map seerah from seerah.json
            const seerah = seerahData.map((item, index) => {
                // Extract first line or first sentence from body as preview
                const bodyLines = item.body.split('\n').filter(line => line.trim());
                const preview = bodyLines.length > 0 ? bodyLines[0].substring(0, 150) : item.body.substring(0, 150);
                
                return {
                    id: duas.length + ziyarat.length + taqibat.length + index + 1, // Continue ID numbering
                    arabic: preview + (item.body.length > 150 ? '...' : ''),
                    fullArabic: item.body,
                    translation: '', // JSON doesn't have translation
                    categories: ['seerah'], // Always include 'seerah' category
                    source: item.title,
                    benefits: item.major || '',
                    title: item.title,
                    tags: item.tags || '',
                    type: 'seerah',
                    youtubeUrl: item.youtubeUrl || '' // Get YouTube URL from JSON
                };
            });
            
            // Combine all arrays
            this.allDuas = [...duas, ...ziyarat, ...taqibat, ...seerah];
        } catch (error) {
            console.error('Error loading duas:', error);
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
            grid.innerHTML = '';
        }
        
        const start = append ? (this.currentPage - 1) * this.duasPerPage : 0;
        const end = this.currentPage * this.duasPerPage;
        const duasToRender = this.filteredDuas.slice(start, end);
        
        duasToRender.forEach(dua => {
            const card = this.createDuaCard(dua);
            grid.appendChild(card);
        });
        
        this.updateLoadMoreButton();
    }
    
    createDuaCard(dua) {
        const card = document.createElement('div');
        card.className = 'dua-card glass-card';
        card.dataset.duaId = dua.id;
        // Include type in categories for filtering
        const allCategories = dua.type ? [dua.type, ...dua.categories] : dua.categories;
        card.dataset.category = allCategories.join(' ');
        
        // Make card clickable to open details
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't trigger if clicking on favorite button
            if (!e.target.closest('.favorite-btn')) {
                viewDetails(dua.id);
            }
        });
        
        const isFavorited = this.favorites.includes(dua.id);
        // Use type if available, otherwise use first category
        const primaryCategory = dua.type || dua.categories[0];
        const categoryLabel = this.getCategoryLabel(primaryCategory);
        const categoryClass = primaryCategory;
        
        card.innerHTML = `
            <div class="dua-header">
                <div class="dua-category-badge ${categoryClass}">${categoryLabel}</div>
                <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" onclick="event.stopPropagation(); toggleFavorite(${dua.id})">
                    <span class="favorite-icon">${isFavorited ? '★' : '☆'}</span>
                </button>
            </div>
            
            <div class="dua-content">
                ${dua.title ? `<h3 class="dua-title">${dua.title}</h3>` : ''}
                <p class="dua-arabic">${dua.arabic}</p>
                ${dua.translation ? `<p class="dua-translation">${dua.translation}</p>` : ''}
                ${dua.source && dua.source !== dua.title ? `<p class="dua-source">${dua.source}</p>` : ''}
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
            ziyarat: 'الزيارات',
            dua: 'الدعاء',
            taqibat: 'تعقيبات الصلاة',
            seerah: 'سيرة أهل البيت',
            ramadan: 'رمضان'
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
        // Make search case insensitive and normalize Arabic text
        const normalizedQuery = query.toLowerCase().trim();
        if (!normalizedQuery) {
            this.filteredDuas = [...this.allDuas];
        } else {
        this.filteredDuas = this.allDuas.filter(dua => {
                // Search in title (case insensitive)
                const titleMatch = dua.title ? dua.title.toLowerCase().includes(normalizedQuery) : false;
                
                // Search in arabic preview (case insensitive)
                const arabicMatch = dua.arabic ? dua.arabic.toLowerCase().includes(normalizedQuery) : false;
                
                // Search in full arabic content (case insensitive)
                const fullArabicMatch = dua.fullArabic ? dua.fullArabic.toLowerCase().includes(normalizedQuery) : false;
                
                // Search in translation (case insensitive)
                const translationMatch = dua.translation ? dua.translation.toLowerCase().includes(normalizedQuery) : false;
                
                // Search in tags (case insensitive)
                const tagsMatch = dua.tags ? dua.tags.toLowerCase().includes(normalizedQuery) : false;
                
                // Search in source (case insensitive)
                const sourceMatch = dua.source ? dua.source.toLowerCase().includes(normalizedQuery) : false;
                
                return titleMatch || arabicMatch || fullArabicMatch || translationMatch || tagsMatch || sourceMatch;
        });
        }
        
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
        } else if (category === 'taqibat') {
            this.filteredDuas = this.allDuas.filter(dua => dua.type === 'taqibat');
        } else if (category === 'seerah') {
            this.filteredDuas = this.allDuas.filter(dua => dua.type === 'seerah');
        } else if (category !== 'all') {
            this.filteredDuas = this.allDuas.filter(dua =>
                dua.categories.includes(category) || dua.type === category
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
        } else if (category === 'taqibat') {
            this.filteredDuas = this.filteredDuas.filter(dua => dua.type === 'taqibat');
        } else if (category === 'seerah') {
            this.filteredDuas = this.filteredDuas.filter(dua => dua.type === 'seerah');
        } else if (category !== 'all') {
            this.filteredDuas = this.filteredDuas.filter(dua =>
                dua.categories.includes(category) || dua.type === category
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
    
    // Get all favorite buttons for this dua (card and modal)
    const btns = document.querySelectorAll(`[onclick*="toggleFavorite(${duaId})"], #modalFavoriteBtn`);
    const isCurrentlyFavorited = index > -1;
    const willBeFavorited = !isCurrentlyFavorited;
    
    // Update state immediately
    if (isCurrentlyFavorited) {
        manager.favorites.splice(index, 1);
        manager.showToast('تمت الإزالة من المفضلة', 'success');
    } else {
        manager.favorites.push(duaId);
        manager.showToast('تمت الإضافة للمفضلة', 'success');
    }
    
    manager.saveFavorites();
    
    // Update all buttons immediately with visual feedback
    btns.forEach(btn => {
        // Add glow effect class
        btn.classList.add('favorite-glow');
        
        // Update state immediately
        btn.classList.toggle('favorited', willBeFavorited);
        const icon = btn.querySelector('.favorite-icon');
        if (icon) {
            icon.textContent = willBeFavorited ? '★' : '☆';
        }
        
        // Remove glow effect after animation
        setTimeout(() => {
            btn.classList.remove('favorite-glow');
        }, 600);
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
    
    // Update modal title
    const modalTitle = document.getElementById('modalDuaTitle');
    if (modalTitle) {
        modalTitle.textContent = dua.title || dua.source || 'تفاصيل الدعاء';
    }
    
    // Use fullArabic if available, otherwise use arabic
    const fullText = dua.fullArabic || dua.arabic;
    document.getElementById('modalDuaArabic').textContent = fullText;
    
    // Load YouTube player if URL exists
    const youtubePlayerSection = document.getElementById('youtubePlayerSection');
    const youtubePlayer = document.getElementById('youtubePlayer');
    if (dua.youtubeUrl) {
        // Extract YouTube video ID from URL
        const videoId = extractYouTubeId(dua.youtubeUrl);
        if (videoId) {
            youtubePlayer.src = `https://www.youtube.com/embed/${videoId}`;
            youtubePlayerSection.style.display = 'block';
        } else {
            youtubePlayerSection.style.display = 'none';
        }
    } else {
        youtubePlayerSection.style.display = 'none';
        youtubePlayer.src = ''; // Clear previous video
    }
    
    const favoriteBtn = document.getElementById('modalFavoriteBtn');
    const isFavorited = manager.favorites.includes(duaId);
    favoriteBtn.classList.toggle('favorited', isFavorited);
    favoriteBtn.querySelector('.favorite-icon').textContent = isFavorited ? '★' : '☆';
    favoriteBtn.onclick = () => toggleFavorite(duaId);
    
    // Load and apply saved font size
    const savedFontSize = localStorage.getItem('duaFontSize') || 100;
    applyDuaFontSize(parseInt(savedFontSize));
    
    manager.currentDuaId = duaId;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function adjustDuaFontSize(change) {
    const arabicElement = document.getElementById('modalDuaArabic');
    if (!arabicElement) return;
    
    // Get current font size from style or default
    const currentSize = parseInt(arabicElement.style.fontSize) || 32; // 2rem = 32px default
    const baseSize = 32; // 2rem base size
    const currentPercentage = Math.round((currentSize / baseSize) * 100);
    
    // Calculate new percentage (min 50%, max 200%)
    const newPercentage = Math.max(50, Math.min(200, currentPercentage + (change * 5)));
    
    // Apply new font size
    applyDuaFontSize(newPercentage);
    
    // Save to localStorage
    localStorage.setItem('duaFontSize', newPercentage.toString());
}

function applyDuaFontSize(percentage) {
    const arabicElement = document.getElementById('modalDuaArabic');
    const fontSizeDisplay = document.getElementById('fontSizeDisplay');
    
    if (!arabicElement) return;
    
    const baseSize = 32; // 2rem = 32px
    const newSize = (baseSize * percentage) / 100;
    arabicElement.style.fontSize = `${newSize}px`;
    
    // Update display
    if (fontSizeDisplay) {
        fontSizeDisplay.textContent = `${percentage}%`;
    }
}

function extractYouTubeId(url) {
    if (!url) return null;
    
    // Handle various YouTube URL formats
    const patterns = [
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
        /youtube\.com\/watch\?.*v=([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    // If URL is just the video ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
        return url;
    }
    
    return null;
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
        
        // Stop YouTube video
        const youtubePlayer = document.getElementById('youtubePlayer');
        if (youtubePlayer) {
            youtubePlayer.src = ''; // Clear video to stop playback
        }
    }
}

function shareDuaFromModal() {
    const manager = window.duasManager;
    if (!manager.currentDuaId) return;
    
    const dua = manager.allDuas.find(d => d.id === manager.currentDuaId);
    if (!dua) return;
    
    const title = dua.title || dua.source || 'دعاء';
    const arabic = document.getElementById('modalDuaArabic').textContent;
    const websiteLink = 'https://tahajad.com'; // TODO: Update with actual website link
    const text = `${title}\n\n${arabic}\n\n${websiteLink}`;
    
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text
        }).catch(e => {
            // Fallback to copy if share fails
            navigator.clipboard.writeText(text).then(() => {
                manager.showToast('تم نسخ النص', 'success');
            }).catch(err => {
                manager.showToast('حدث خطأ في المشاركة', 'error');
            });
        });
    } else {
        // Fallback to copy if share API not available
        navigator.clipboard.writeText(text).then(() => {
            manager.showToast('تم نسخ النص', 'success');
        }).catch(err => {
            manager.showToast('حدث خطأ في النسخ', 'error');
        });
    }
}

function copyDuaText() {
    const manager = window.duasManager;
    if (!manager.currentDuaId) return;
    
    const dua = manager.allDuas.find(d => d.id === manager.currentDuaId);
    if (!dua) return;
    
    const title = dua.title || dua.source || 'دعاء';
    const arabic = document.getElementById('modalDuaArabic').textContent;
    const websiteLink = 'https://tahajad.com'; // TODO: Update with actual website link
    const text = `${title}\n\n${arabic}\n\n${websiteLink}`;
    
    navigator.clipboard.writeText(text).then(() => {
        manager.showToast('تم نسخ النص', 'success');
    }).catch(err => {
        manager.showToast('حدث خطأ في النسخ', 'error');
    });
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