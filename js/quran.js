/**
 * Quran Page - Display all surahs with save/continue functionality
 */

class QuranManager {
    constructor() {
        // All 114 surahs data
        this.surahs = [
            { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', ayahs: 7, type: 'makki', revelationOrder: 5 },
            { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', ayahs: 286, type: 'madani', revelationOrder: 87 },
            { number: 3, name: 'آل عمران', englishName: 'Ali Imran', ayahs: 200, type: 'madani', revelationOrder: 89 },
            { number: 4, name: 'النساء', englishName: 'An-Nisa', ayahs: 176, type: 'madani', revelationOrder: 92 },
            { number: 5, name: 'المائدة', englishName: 'Al-Maidah', ayahs: 120, type: 'madani', revelationOrder: 112 },
            { number: 6, name: 'الأنعام', englishName: 'Al-Anam', ayahs: 165, type: 'makki', revelationOrder: 55 },
            { number: 7, name: 'الأعراف', englishName: 'Al-Araf', ayahs: 206, type: 'makki', revelationOrder: 39 },
            { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', ayahs: 75, type: 'madani', revelationOrder: 88 },
            { number: 9, name: 'التوبة', englishName: 'At-Tawbah', ayahs: 129, type: 'madani', revelationOrder: 113 },
            { number: 10, name: 'يونس', englishName: 'Yunus', ayahs: 109, type: 'makki', revelationOrder: 51 },
            { number: 11, name: 'هود', englishName: 'Hud', ayahs: 123, type: 'makki', revelationOrder: 52 },
            { number: 12, name: 'يوسف', englishName: 'Yusuf', ayahs: 111, type: 'makki', revelationOrder: 53 },
            { number: 13, name: 'الرعد', englishName: 'Ar-Rad', ayahs: 43, type: 'madani', revelationOrder: 96 },
            { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', ayahs: 52, type: 'makki', revelationOrder: 72 },
            { number: 15, name: 'الحجر', englishName: 'Al-Hijr', ayahs: 99, type: 'makki', revelationOrder: 54 },
            { number: 16, name: 'النحل', englishName: 'An-Nahl', ayahs: 128, type: 'makki', revelationOrder: 70 },
            { number: 17, name: 'الإسراء', englishName: 'Al-Isra', ayahs: 111, type: 'makki', revelationOrder: 50 },
            { number: 18, name: 'الكهف', englishName: 'Al-Kahf', ayahs: 110, type: 'makki', revelationOrder: 69 },
            { number: 19, name: 'مريم', englishName: 'Maryam', ayahs: 98, type: 'makki', revelationOrder: 44 },
            { number: 20, name: 'طه', englishName: 'Ta-Ha', ayahs: 135, type: 'makki', revelationOrder: 45 },
            { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', ayahs: 112, type: 'makki', revelationOrder: 73 },
            { number: 22, name: 'الحج', englishName: 'Al-Hajj', ayahs: 78, type: 'madani', revelationOrder: 103 },
            { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun', ayahs: 118, type: 'makki', revelationOrder: 74 },
            { number: 24, name: 'النور', englishName: 'An-Nur', ayahs: 64, type: 'madani', revelationOrder: 102 },
            { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', ayahs: 77, type: 'makki', revelationOrder: 42 },
            { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara', ayahs: 227, type: 'makki', revelationOrder: 47 },
            { number: 27, name: 'النمل', englishName: 'An-Naml', ayahs: 93, type: 'makki', revelationOrder: 48 },
            { number: 28, name: 'القصص', englishName: 'Al-Qasas', ayahs: 88, type: 'makki', revelationOrder: 49 },
            { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', ayahs: 69, type: 'makki', revelationOrder: 85 },
            { number: 30, name: 'الروم', englishName: 'Ar-Rum', ayahs: 60, type: 'makki', revelationOrder: 84 },
            { number: 31, name: 'لقمان', englishName: 'Luqman', ayahs: 34, type: 'makki', revelationOrder: 57 },
            { number: 32, name: 'السجدة', englishName: 'As-Sajdah', ayahs: 30, type: 'makki', revelationOrder: 75 },
            { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', ayahs: 73, type: 'madani', revelationOrder: 90 },
            { number: 34, name: 'سبأ', englishName: 'Saba', ayahs: 54, type: 'makki', revelationOrder: 58 },
            { number: 35, name: 'فاطر', englishName: 'Fatir', ayahs: 45, type: 'makki', revelationOrder: 43 },
            { number: 36, name: 'يس', englishName: 'Ya-Sin', ayahs: 83, type: 'makki', revelationOrder: 41 },
            { number: 37, name: 'الصافات', englishName: 'As-Saffat', ayahs: 182, type: 'makki', revelationOrder: 56 },
            { number: 38, name: 'ص', englishName: 'Sad', ayahs: 88, type: 'makki', revelationOrder: 38 },
            { number: 39, name: 'الزمر', englishName: 'Az-Zumar', ayahs: 75, type: 'makki', revelationOrder: 59 },
            { number: 40, name: 'غافر', englishName: 'Ghafir', ayahs: 85, type: 'makki', revelationOrder: 60 },
            { number: 41, name: 'فصلت', englishName: 'Fussilat', ayahs: 54, type: 'makki', revelationOrder: 61 },
            { number: 42, name: 'الشورى', englishName: 'Ash-Shura', ayahs: 53, type: 'makki', revelationOrder: 62 },
            { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', ayahs: 89, type: 'makki', revelationOrder: 63 },
            { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', ayahs: 59, type: 'makki', revelationOrder: 64 },
            { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', ayahs: 37, type: 'makki', revelationOrder: 65 },
            { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', ayahs: 35, type: 'makki', revelationOrder: 66 },
            { number: 47, name: 'محمد', englishName: 'Muhammad', ayahs: 38, type: 'madani', revelationOrder: 95 },
            { number: 48, name: 'الفتح', englishName: 'Al-Fath', ayahs: 29, type: 'madani', revelationOrder: 111 },
            { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', ayahs: 18, type: 'madani', revelationOrder: 106 },
            { number: 50, name: 'ق', englishName: 'Qaf', ayahs: 45, type: 'makki', revelationOrder: 34 },
            { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', ayahs: 60, type: 'makki', revelationOrder: 67 },
            { number: 52, name: 'الطور', englishName: 'At-Tur', ayahs: 49, type: 'makki', revelationOrder: 76 },
            { number: 53, name: 'النجم', englishName: 'An-Najm', ayahs: 62, type: 'makki', revelationOrder: 23 },
            { number: 54, name: 'القمر', englishName: 'Al-Qamar', ayahs: 55, type: 'makki', revelationOrder: 37 },
            { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', ayahs: 78, type: 'madani', revelationOrder: 97 },
            { number: 56, name: 'الواقعة', englishName: 'Al-Waqiah', ayahs: 96, type: 'makki', revelationOrder: 46 },
            { number: 57, name: 'الحديد', englishName: 'Al-Hadid', ayahs: 29, type: 'madani', revelationOrder: 94 },
            { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', ayahs: 22, type: 'madani', revelationOrder: 105 },
            { number: 59, name: 'الحشر', englishName: 'Al-Hashr', ayahs: 24, type: 'madani', revelationOrder: 101 },
            { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', ayahs: 13, type: 'madani', revelationOrder: 91 },
            { number: 61, name: 'الصف', englishName: 'As-Saff', ayahs: 14, type: 'madani', revelationOrder: 109 },
            { number: 62, name: 'الجمعة', englishName: 'Al-Jumuah', ayahs: 11, type: 'madani', revelationOrder: 110 },
            { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', ayahs: 11, type: 'madani', revelationOrder: 104 },
            { number: 64, name: 'التغابن', englishName: 'At-Taghabun', ayahs: 18, type: 'madani', revelationOrder: 108 },
            { number: 65, name: 'الطلاق', englishName: 'At-Talaq', ayahs: 12, type: 'madani', revelationOrder: 99 },
            { number: 66, name: 'التحريم', englishName: 'At-Tahrim', ayahs: 12, type: 'madani', revelationOrder: 107 },
            { number: 67, name: 'الملك', englishName: 'Al-Mulk', ayahs: 30, type: 'makki', revelationOrder: 77 },
            { number: 68, name: 'القلم', englishName: 'Al-Qalam', ayahs: 52, type: 'makki', revelationOrder: 2 },
            { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', ayahs: 52, type: 'makki', revelationOrder: 78 },
            { number: 70, name: 'المعارج', englishName: 'Al-Maarij', ayahs: 44, type: 'makki', revelationOrder: 79 },
            { number: 71, name: 'نوح', englishName: 'Nuh', ayahs: 28, type: 'makki', revelationOrder: 71 },
            { number: 72, name: 'الجن', englishName: 'Al-Jinn', ayahs: 28, type: 'makki', revelationOrder: 40 },
            { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', ayahs: 20, type: 'makki', revelationOrder: 3 },
            { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', ayahs: 56, type: 'makki', revelationOrder: 4 },
            { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', ayahs: 40, type: 'makki', revelationOrder: 31 },
            { number: 76, name: 'الإنسان', englishName: 'Al-Insan', ayahs: 31, type: 'madani', revelationOrder: 98 },
            { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', ayahs: 50, type: 'makki', revelationOrder: 33 },
            { number: 78, name: 'النبأ', englishName: 'An-Naba', ayahs: 40, type: 'makki', revelationOrder: 80 },
            { number: 79, name: 'النازعات', englishName: 'An-Naziat', ayahs: 46, type: 'makki', revelationOrder: 81 },
            { number: 80, name: 'عبس', englishName: 'Abasa', ayahs: 42, type: 'makki', revelationOrder: 24 },
            { number: 81, name: 'التكوير', englishName: 'At-Takwir', ayahs: 29, type: 'makki', revelationOrder: 7 },
            { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', ayahs: 19, type: 'makki', revelationOrder: 82 },
            { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', ayahs: 36, type: 'makki', revelationOrder: 86 },
            { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', ayahs: 25, type: 'makki', revelationOrder: 83 },
            { number: 85, name: 'البروج', englishName: 'Al-Buruj', ayahs: 22, type: 'makki', revelationOrder: 27 },
            { number: 86, name: 'الطارق', englishName: 'At-Tariq', ayahs: 17, type: 'makki', revelationOrder: 36 },
            { number: 87, name: 'الأعلى', englishName: 'Al-Ala', ayahs: 19, type: 'makki', revelationOrder: 8 },
            { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', ayahs: 26, type: 'makki', revelationOrder: 68 },
            { number: 89, name: 'الفجر', englishName: 'Al-Fajr', ayahs: 30, type: 'makki', revelationOrder: 10 },
            { number: 90, name: 'البلد', englishName: 'Al-Balad', ayahs: 20, type: 'makki', revelationOrder: 35 },
            { number: 91, name: 'الشمس', englishName: 'Ash-Shams', ayahs: 15, type: 'makki', revelationOrder: 26 },
            { number: 92, name: 'الليل', englishName: 'Al-Layl', ayahs: 21, type: 'makki', revelationOrder: 9 },
            { number: 93, name: 'الضحى', englishName: 'Ad-Duha', ayahs: 11, type: 'makki', revelationOrder: 11 },
            { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', ayahs: 8, type: 'makki', revelationOrder: 12 },
            { number: 95, name: 'التين', englishName: 'At-Tin', ayahs: 8, type: 'makki', revelationOrder: 28 },
            { number: 96, name: 'العلق', englishName: 'Al-Alaq', ayahs: 19, type: 'makki', revelationOrder: 1 },
            { number: 97, name: 'القدر', englishName: 'Al-Qadr', ayahs: 5, type: 'makki', revelationOrder: 25 },
            { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', ayahs: 8, type: 'madani', revelationOrder: 100 },
            { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', ayahs: 8, type: 'madani', revelationOrder: 93 },
            { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', ayahs: 11, type: 'makki', revelationOrder: 14 },
            { number: 101, name: 'القارعة', englishName: 'Al-Qariah', ayahs: 11, type: 'makki', revelationOrder: 30 },
            { number: 102, name: 'التكاثر', englishName: 'At-Takathur', ayahs: 8, type: 'makki', revelationOrder: 16 },
            { number: 103, name: 'العصر', englishName: 'Al-Asr', ayahs: 3, type: 'makki', revelationOrder: 13 },
            { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', ayahs: 9, type: 'makki', revelationOrder: 32 },
            { number: 105, name: 'الفيل', englishName: 'Al-Fil', ayahs: 5, type: 'makki', revelationOrder: 19 },
            { number: 106, name: 'قريش', englishName: 'Quraysh', ayahs: 4, type: 'makki', revelationOrder: 29 },
            { number: 107, name: 'الماعون', englishName: 'Al-Maun', ayahs: 7, type: 'makki', revelationOrder: 17 },
            { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', ayahs: 3, type: 'makki', revelationOrder: 15 },
            { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', ayahs: 6, type: 'makki', revelationOrder: 18 },
            { number: 110, name: 'النصر', englishName: 'An-Nasr', ayahs: 3, type: 'madani', revelationOrder: 114 },
            { number: 111, name: 'المسد', englishName: 'Al-Masad', ayahs: 5, type: 'makki', revelationOrder: 6 },
            { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', ayahs: 4, type: 'makki', revelationOrder: 22 },
            { number: 113, name: 'الفلق', englishName: 'Al-Falaq', ayahs: 5, type: 'makki', revelationOrder: 20 },
            { number: 114, name: 'الناس', englishName: 'An-Nas', ayahs: 6, type: 'makki', revelationOrder: 21 }
        ];
        
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.savedProgress = this.loadSavedProgress();
        
        this.init();
    }
    
    init() {
        this.renderSurahs();
        this.setupEventListeners();
        this.updateContinueReading();
        this.renderSavedPages();
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        const filterButtons = document.querySelectorAll('.filter-btn');
        const btnContinue = document.getElementById('btnContinue');
        const btnRemoveContinue = document.getElementById('btnRemoveContinue');
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                this.searchQuery = e.target.value.trim();
                
                if (this.searchQuery) {
                    if (clearSearch) clearSearch.style.display = 'flex';
                    searchTimeout = setTimeout(() => {
                        this.renderSurahs();
                    }, 300);
                } else {
                    if (clearSearch) clearSearch.style.display = 'none';
                    this.renderSurahs();
                }
            });
        }
        
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    this.searchQuery = '';
                    clearSearch.style.display = 'none';
                    this.renderSurahs();
                }
            });
        }
        
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.filter;
                this.renderSurahs();
            });
        });
        
        if (btnContinue) {
            btnContinue.addEventListener('click', () => {
                if (this.savedProgress) {
                    this.openSurah(this.savedProgress.surahNumber, this.savedProgress.page || 1);
                }
            });
        }
        
        if (btnRemoveContinue) {
            btnRemoveContinue.addEventListener('click', () => {
                this.removeSavedProgress();
            });
        }
        
        const btnClearSaved = document.getElementById('btnClearSaved');
        if (btnClearSaved) {
            btnClearSaved.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من حذف جميع الصفحات المحفوظة؟')) {
                    this.clearSavedPages();
                }
            });
        }
    }
    
    renderSurahs() {
        const grid = document.getElementById('surahsGrid');
        const loading = document.getElementById('loadingState');
        const empty = document.getElementById('emptyState');
        
        if (!grid) return;
        
        if (loading) loading.style.display = 'none';
        
        // Filter surahs
        let filtered = this.surahs.filter(surah => {
            // Filter by type
            if (this.currentFilter !== 'all' && surah.type !== this.currentFilter) {
                return false;
            }
            
            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                return surah.name.includes(this.searchQuery) ||
                       surah.englishName.toLowerCase().includes(query) ||
                       surah.number.toString().includes(query);
            }
            
            return true;
        });
        
        if (filtered.length === 0) {
            grid.style.display = 'none';
            if (empty) empty.style.display = 'block';
            return;
        }
        
        if (empty) empty.style.display = 'none';
        grid.style.display = 'grid';
        grid.innerHTML = '';
        
        filtered.forEach(surah => {
            const card = this.createSurahCard(surah);
            grid.appendChild(card);
        });
    }
    
    createSurahCard(surah) {
        const card = document.createElement('div');
        card.className = 'surah-card glass-card';
        
        const isSaved = this.savedProgress && this.savedProgress.surahNumber === surah.number;
        
        card.innerHTML = `
            <div class="surah-header">
                <div class="surah-number">${surah.number}</div>
                <div class="surah-info">
                    <h3 class="surah-name">${surah.name}</h3>
                    <p class="surah-english-name">${surah.englishName}</p>
                </div>
                ${isSaved ? '<div class="saved-badge" title="محفوظ للمتابعة">📌</div>' : ''}
            </div>
            <div class="surah-details">
                <span class="surah-type ${surah.type}">${surah.type === 'makki' ? 'مكية' : 'مدنية'}</span>
                <span class="surah-ayahs">${surah.ayahs} آية</span>
            </div>
            <button class="btn-read-surah" data-surah="${surah.number}">
                <span>قراءة السورة</span>
                <span>→</span>
            </button>
        `;
        
        const readBtn = card.querySelector('.btn-read-surah');
        if (readBtn) {
            readBtn.addEventListener('click', () => {
                this.openSurah(surah.number);
            });
        }
        
        return card;
    }
    
    openSurah(surahNumber, page = 1) {
        // Save progress
        this.saveProgress(surahNumber, page);
        
        // Navigate to local surah reader page
        window.location.href = `quran-surah.html?surah=${surahNumber}&page=${page}`;
    }
    
    saveProgress(surahNumber, page = 1) {
        const progress = {
            surahNumber: surahNumber,
            page: page,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('quranProgress', JSON.stringify(progress));
        this.savedProgress = progress;
        this.updateContinueReading();
    }
    
    loadSavedProgress() {
        const saved = localStorage.getItem('quranProgress');
        return saved ? JSON.parse(saved) : null;
    }
    
    removeSavedProgress() {
        localStorage.removeItem('quranProgress');
        this.savedProgress = null;
        this.updateContinueReading();
    }
    
    updateContinueReading() {
        const section = document.getElementById('continueReadingSection');
        const continueText = document.getElementById('continueText');
        
        if (!section || !continueText) return;
        
        if (this.savedProgress) {
            const surah = this.surahs.find(s => s.number === this.savedProgress.surahNumber);
            if (surah) {
                continueText.textContent = `سورة ${surah.name} - الصفحة ${this.savedProgress.page}`;
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        } else {
            section.style.display = 'none';
        }
    }
    
    renderSavedPages() {
        const section = document.getElementById('savedPagesSection');
        const list = document.getElementById('savedPagesList');
        const empty = document.getElementById('emptySaved');
        
        if (!section || !list) return;
        
        const savedPages = JSON.parse(localStorage.getItem('quranSavedPages') || '[]');
        
        if (savedPages.length === 0) {
            section.style.display = 'none';
            return;
        }
        
        section.style.display = 'block';
        list.innerHTML = '';
        
        if (empty) empty.style.display = 'none';
        
        savedPages.forEach((saved, index) => {
            const surah = this.surahs.find(s => s.number === saved.surahNumber);
            if (!surah) return;
            
            const savedItem = document.createElement('div');
            savedItem.className = 'saved-page-item';
            
            const date = new Date(saved.timestamp);
            const dateStr = date.toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            savedItem.innerHTML = `
                <div class="saved-page-info">
                    <h3 class="saved-surah-name">${surah.name}</h3>
                    <p class="saved-page-details">الصفحة ${saved.page} • ${dateStr}</p>
                </div>
                <div class="saved-page-actions">
                    <button class="btn-open-saved" data-surah="${saved.surahNumber}" data-page="${saved.page}">
                        <span>فتح</span>
                        <span>→</span>
                    </button>
                    <button class="btn-remove-saved" data-index="${index}">
                        <span>🗑️</span>
                    </button>
                </div>
            `;
            
            const openBtn = savedItem.querySelector('.btn-open-saved');
            const removeBtn = savedItem.querySelector('.btn-remove-saved');
            
            if (openBtn) {
                openBtn.addEventListener('click', () => {
                    this.openSurah(saved.surahNumber, saved.page);
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', () => {
                    this.removeSavedPage(index);
                });
            }
            
            list.appendChild(savedItem);
        });
    }
    
    removeSavedPage(index) {
        let savedPages = JSON.parse(localStorage.getItem('quranSavedPages') || '[]');
        savedPages.splice(index, 1);
        localStorage.setItem('quranSavedPages', JSON.stringify(savedPages));
        this.renderSavedPages();
    }
    
    clearSavedPages() {
        localStorage.removeItem('quranSavedPages');
        this.renderSavedPages();
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quranManager = new QuranManager();
});

