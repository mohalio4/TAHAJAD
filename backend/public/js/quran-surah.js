/**
 * Quran Surah Reader - Display full surah with verses
 */

class QuranSurahReader {
    constructor() {
        // Try multiple API endpoints for reliability
        this.apiEndpoints = [
            'https://api.alquran.cloud/v1',
            'https://quranapi.pages.dev/api/v1'
        ];
        this.currentApiIndex = 0;
        this.corsProxy = 'https://corsproxy.io/?';
        this.currentSurahNumber = null;
        this.currentSurah = null;
        this.currentPage = 1;
        this.totalPages = 604; // Standard Quran has 604 pages
        this.verses = [];
        
        // All 114 surahs data (same as quran.js)
        this.surahs = [
            { number: 1, name: 'الفاتحة', englishName: 'Al-Fatiha', ayahs: 7, type: 'makki' },
            { number: 2, name: 'البقرة', englishName: 'Al-Baqarah', ayahs: 286, type: 'madani' },
            { number: 3, name: 'آل عمران', englishName: 'Ali Imran', ayahs: 200, type: 'madani' },
            { number: 4, name: 'النساء', englishName: 'An-Nisa', ayahs: 176, type: 'madani' },
            { number: 5, name: 'المائدة', englishName: 'Al-Maidah', ayahs: 120, type: 'madani' },
            { number: 6, name: 'الأنعام', englishName: 'Al-Anam', ayahs: 165, type: 'makki' },
            { number: 7, name: 'الأعراف', englishName: 'Al-Araf', ayahs: 206, type: 'makki' },
            { number: 8, name: 'الأنفال', englishName: 'Al-Anfal', ayahs: 75, type: 'madani' },
            { number: 9, name: 'التوبة', englishName: 'At-Tawbah', ayahs: 129, type: 'madani' },
            { number: 10, name: 'يونس', englishName: 'Yunus', ayahs: 109, type: 'makki' },
            { number: 11, name: 'هود', englishName: 'Hud', ayahs: 123, type: 'makki' },
            { number: 12, name: 'يوسف', englishName: 'Yusuf', ayahs: 111, type: 'makki' },
            { number: 13, name: 'الرعد', englishName: 'Ar-Rad', ayahs: 43, type: 'madani' },
            { number: 14, name: 'إبراهيم', englishName: 'Ibrahim', ayahs: 52, type: 'makki' },
            { number: 15, name: 'الحجر', englishName: 'Al-Hijr', ayahs: 99, type: 'makki' },
            { number: 16, name: 'النحل', englishName: 'An-Nahl', ayahs: 128, type: 'makki' },
            { number: 17, name: 'الإسراء', englishName: 'Al-Isra', ayahs: 111, type: 'makki' },
            { number: 18, name: 'الكهف', englishName: 'Al-Kahf', ayahs: 110, type: 'makki' },
            { number: 19, name: 'مريم', englishName: 'Maryam', ayahs: 98, type: 'makki' },
            { number: 20, name: 'طه', englishName: 'Ta-Ha', ayahs: 135, type: 'makki' },
            { number: 21, name: 'الأنبياء', englishName: 'Al-Anbiya', ayahs: 112, type: 'makki' },
            { number: 22, name: 'الحج', englishName: 'Al-Hajj', ayahs: 78, type: 'madani' },
            { number: 23, name: 'المؤمنون', englishName: 'Al-Muminun', ayahs: 118, type: 'makki' },
            { number: 24, name: 'النور', englishName: 'An-Nur', ayahs: 64, type: 'madani' },
            { number: 25, name: 'الفرقان', englishName: 'Al-Furqan', ayahs: 77, type: 'makki' },
            { number: 26, name: 'الشعراء', englishName: 'Ash-Shuara', ayahs: 227, type: 'makki' },
            { number: 27, name: 'النمل', englishName: 'An-Naml', ayahs: 93, type: 'makki' },
            { number: 28, name: 'القصص', englishName: 'Al-Qasas', ayahs: 88, type: 'makki' },
            { number: 29, name: 'العنكبوت', englishName: 'Al-Ankabut', ayahs: 69, type: 'makki' },
            { number: 30, name: 'الروم', englishName: 'Ar-Rum', ayahs: 60, type: 'makki' },
            { number: 31, name: 'لقمان', englishName: 'Luqman', ayahs: 34, type: 'makki' },
            { number: 32, name: 'السجدة', englishName: 'As-Sajdah', ayahs: 30, type: 'makki' },
            { number: 33, name: 'الأحزاب', englishName: 'Al-Ahzab', ayahs: 73, type: 'madani' },
            { number: 34, name: 'سبأ', englishName: 'Saba', ayahs: 54, type: 'makki' },
            { number: 35, name: 'فاطر', englishName: 'Fatir', ayahs: 45, type: 'makki' },
            { number: 36, name: 'يس', englishName: 'Ya-Sin', ayahs: 83, type: 'makki' },
            { number: 37, name: 'الصافات', englishName: 'As-Saffat', ayahs: 182, type: 'makki' },
            { number: 38, name: 'ص', englishName: 'Sad', ayahs: 88, type: 'makki' },
            { number: 39, name: 'الزمر', englishName: 'Az-Zumar', ayahs: 75, type: 'makki' },
            { number: 40, name: 'غافر', englishName: 'Ghafir', ayahs: 85, type: 'makki' },
            { number: 41, name: 'فصلت', englishName: 'Fussilat', ayahs: 54, type: 'makki' },
            { number: 42, name: 'الشورى', englishName: 'Ash-Shura', ayahs: 53, type: 'makki' },
            { number: 43, name: 'الزخرف', englishName: 'Az-Zukhruf', ayahs: 89, type: 'makki' },
            { number: 44, name: 'الدخان', englishName: 'Ad-Dukhan', ayahs: 59, type: 'makki' },
            { number: 45, name: 'الجاثية', englishName: 'Al-Jathiyah', ayahs: 37, type: 'makki' },
            { number: 46, name: 'الأحقاف', englishName: 'Al-Ahqaf', ayahs: 35, type: 'makki' },
            { number: 47, name: 'محمد', englishName: 'Muhammad', ayahs: 38, type: 'madani' },
            { number: 48, name: 'الفتح', englishName: 'Al-Fath', ayahs: 29, type: 'madani' },
            { number: 49, name: 'الحجرات', englishName: 'Al-Hujurat', ayahs: 18, type: 'madani' },
            { number: 50, name: 'ق', englishName: 'Qaf', ayahs: 45, type: 'makki' },
            { number: 51, name: 'الذاريات', englishName: 'Adh-Dhariyat', ayahs: 60, type: 'makki' },
            { number: 52, name: 'الطور', englishName: 'At-Tur', ayahs: 49, type: 'makki' },
            { number: 53, name: 'النجم', englishName: 'An-Najm', ayahs: 62, type: 'makki' },
            { number: 54, name: 'القمر', englishName: 'Al-Qamar', ayahs: 55, type: 'makki' },
            { number: 55, name: 'الرحمن', englishName: 'Ar-Rahman', ayahs: 78, type: 'madani' },
            { number: 56, name: 'الواقعة', englishName: 'Al-Waqiah', ayahs: 96, type: 'makki' },
            { number: 57, name: 'الحديد', englishName: 'Al-Hadid', ayahs: 29, type: 'madani' },
            { number: 58, name: 'المجادلة', englishName: 'Al-Mujadila', ayahs: 22, type: 'madani' },
            { number: 59, name: 'الحشر', englishName: 'Al-Hashr', ayahs: 24, type: 'madani' },
            { number: 60, name: 'الممتحنة', englishName: 'Al-Mumtahanah', ayahs: 13, type: 'madani' },
            { number: 61, name: 'الصف', englishName: 'As-Saff', ayahs: 14, type: 'madani' },
            { number: 62, name: 'الجمعة', englishName: 'Al-Jumuah', ayahs: 11, type: 'madani' },
            { number: 63, name: 'المنافقون', englishName: 'Al-Munafiqun', ayahs: 11, type: 'madani' },
            { number: 64, name: 'التغابن', englishName: 'At-Taghabun', ayahs: 18, type: 'madani' },
            { number: 65, name: 'الطلاق', englishName: 'At-Talaq', ayahs: 12, type: 'madani' },
            { number: 66, name: 'التحريم', englishName: 'At-Tahrim', ayahs: 12, type: 'madani' },
            { number: 67, name: 'الملك', englishName: 'Al-Mulk', ayahs: 30, type: 'makki' },
            { number: 68, name: 'القلم', englishName: 'Al-Qalam', ayahs: 52, type: 'makki' },
            { number: 69, name: 'الحاقة', englishName: 'Al-Haqqah', ayahs: 52, type: 'makki' },
            { number: 70, name: 'المعارج', englishName: 'Al-Maarij', ayahs: 44, type: 'makki' },
            { number: 71, name: 'نوح', englishName: 'Nuh', ayahs: 28, type: 'makki' },
            { number: 72, name: 'الجن', englishName: 'Al-Jinn', ayahs: 28, type: 'makki' },
            { number: 73, name: 'المزمل', englishName: 'Al-Muzzammil', ayahs: 20, type: 'makki' },
            { number: 74, name: 'المدثر', englishName: 'Al-Muddaththir', ayahs: 56, type: 'makki' },
            { number: 75, name: 'القيامة', englishName: 'Al-Qiyamah', ayahs: 40, type: 'makki' },
            { number: 76, name: 'الإنسان', englishName: 'Al-Insan', ayahs: 31, type: 'madani' },
            { number: 77, name: 'المرسلات', englishName: 'Al-Mursalat', ayahs: 50, type: 'makki' },
            { number: 78, name: 'النبأ', englishName: 'An-Naba', ayahs: 40, type: 'makki' },
            { number: 79, name: 'النازعات', englishName: 'An-Naziat', ayahs: 46, type: 'makki' },
            { number: 80, name: 'عبس', englishName: 'Abasa', ayahs: 42, type: 'makki' },
            { number: 81, name: 'التكوير', englishName: 'At-Takwir', ayahs: 29, type: 'makki' },
            { number: 82, name: 'الانفطار', englishName: 'Al-Infitar', ayahs: 19, type: 'makki' },
            { number: 83, name: 'المطففين', englishName: 'Al-Mutaffifin', ayahs: 36, type: 'makki' },
            { number: 84, name: 'الانشقاق', englishName: 'Al-Inshiqaq', ayahs: 25, type: 'makki' },
            { number: 85, name: 'البروج', englishName: 'Al-Buruj', ayahs: 22, type: 'makki' },
            { number: 86, name: 'الطارق', englishName: 'At-Tariq', ayahs: 17, type: 'makki' },
            { number: 87, name: 'الأعلى', englishName: 'Al-Ala', ayahs: 19, type: 'makki' },
            { number: 88, name: 'الغاشية', englishName: 'Al-Ghashiyah', ayahs: 26, type: 'makki' },
            { number: 89, name: 'الفجر', englishName: 'Al-Fajr', ayahs: 30, type: 'makki' },
            { number: 90, name: 'البلد', englishName: 'Al-Balad', ayahs: 20, type: 'makki' },
            { number: 91, name: 'الشمس', englishName: 'Ash-Shams', ayahs: 15, type: 'makki' },
            { number: 92, name: 'الليل', englishName: 'Al-Layl', ayahs: 21, type: 'makki' },
            { number: 93, name: 'الضحى', englishName: 'Ad-Duha', ayahs: 11, type: 'makki' },
            { number: 94, name: 'الشرح', englishName: 'Ash-Sharh', ayahs: 8, type: 'makki' },
            { number: 95, name: 'التين', englishName: 'At-Tin', ayahs: 8, type: 'makki' },
            { number: 96, name: 'العلق', englishName: 'Al-Alaq', ayahs: 19, type: 'makki' },
            { number: 97, name: 'القدر', englishName: 'Al-Qadr', ayahs: 5, type: 'makki' },
            { number: 98, name: 'البينة', englishName: 'Al-Bayyinah', ayahs: 8, type: 'madani' },
            { number: 99, name: 'الزلزلة', englishName: 'Az-Zalzalah', ayahs: 8, type: 'madani' },
            { number: 100, name: 'العاديات', englishName: 'Al-Adiyat', ayahs: 11, type: 'makki' },
            { number: 101, name: 'القارعة', englishName: 'Al-Qariah', ayahs: 11, type: 'makki' },
            { number: 102, name: 'التكاثر', englishName: 'At-Takathur', ayahs: 8, type: 'makki' },
            { number: 103, name: 'العصر', englishName: 'Al-Asr', ayahs: 3, type: 'makki' },
            { number: 104, name: 'الهمزة', englishName: 'Al-Humazah', ayahs: 9, type: 'makki' },
            { number: 105, name: 'الفيل', englishName: 'Al-Fil', ayahs: 5, type: 'makki' },
            { number: 106, name: 'قريش', englishName: 'Quraysh', ayahs: 4, type: 'makki' },
            { number: 107, name: 'الماعون', englishName: 'Al-Maun', ayahs: 7, type: 'makki' },
            { number: 108, name: 'الكوثر', englishName: 'Al-Kawthar', ayahs: 3, type: 'makki' },
            { number: 109, name: 'الكافرون', englishName: 'Al-Kafirun', ayahs: 6, type: 'makki' },
            { number: 110, name: 'النصر', englishName: 'An-Nasr', ayahs: 3, type: 'madani' },
            { number: 111, name: 'المسد', englishName: 'Al-Masad', ayahs: 5, type: 'makki' },
            { number: 112, name: 'الإخلاص', englishName: 'Al-Ikhlas', ayahs: 4, type: 'makki' },
            { number: 113, name: 'الفلق', englishName: 'Al-Falaq', ayahs: 5, type: 'makki' },
            { number: 114, name: 'الناس', englishName: 'An-Nas', ayahs: 6, type: 'makki' }
        ];
        
        this.init();
    }
    
    async init() {
        // Get surah number and page from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.currentSurahNumber = parseInt(urlParams.get('surah')) || null;
        this.currentPage = parseInt(urlParams.get('page')) || 1;
        
        // If surah is specified, load that surah's first page
        // Otherwise, load the specified page number
        if (this.currentSurahNumber) {
            if (this.currentSurahNumber < 1 || this.currentSurahNumber > 114) {
                this.currentSurahNumber = 1;
            }
            this.currentSurah = this.surahs.find(s => s.number === this.currentSurahNumber);
        }
        
        if (this.currentPage < 1) this.currentPage = 1;
        if (this.currentPage > 604) this.currentPage = 604;
        
        this.setupEventListeners();
        this.populateSurahSelector();
        await this.loadPage();
    }
    
    setupEventListeners() {
        const btnPrev = document.getElementById('btnPrevSurah');
        const btnNext = document.getElementById('btnNextSurah');
        const surahSelector = document.getElementById('surahSelector');
        
        if (btnPrev) {
            btnPrev.addEventListener('click', () => {
                this.navigateToPage(this.currentPage - 1);
            });
        }
        
        if (btnNext) {
            btnNext.addEventListener('click', () => {
                this.navigateToPage(this.currentPage + 1);
            });
        }
        
        if (surahSelector) {
            surahSelector.addEventListener('change', (e) => {
                const surahNum = parseInt(e.target.value);
                // Navigate to first page of selected surah
                this.navigateToSurah(surahNum);
            });
        }
        
        // Add page navigation input
        const pageInput = document.getElementById('pageInput');
        if (pageInput) {
            pageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= 604) {
                        this.navigateToPage(page);
                    }
                }
            });
        }
    }
    
    populateSurahSelector() {
        const selector = document.getElementById('surahSelector');
        if (!selector) return;
        
        selector.innerHTML = '<option value="">اختر سورة</option>';
        this.surahs.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.name}`;
            if (this.currentSurah && surah.number === this.currentSurah.number) {
                option.selected = true;
            }
            selector.appendChild(option);
        });
    }
    
    async loadPage() {
        const loading = document.getElementById('loadingState');
        const error = document.getElementById('errorState');
        const content = document.getElementById('surahContentSection');
        const navigation = document.getElementById('surahNavigation');
        const pageInput = document.getElementById('pageInput');
        
        if (loading) loading.style.display = 'block';
        if (error) error.style.display = 'none';
        if (content) content.style.display = 'none';
        if (navigation) navigation.style.display = 'none';
        if (pageInput) pageInput.value = this.currentPage;
        
        try {
            // Fetch page from API (Quran pages are standardized - 604 pages)
            let success = false;
            let lastError = null;
            
            for (let i = 0; i < this.apiEndpoints.length; i++) {
                try {
                    const baseUrl = this.apiEndpoints[i];
                    // Use page endpoint instead of surah endpoint
                    const apiUrl = `${baseUrl}/page/${this.currentPage}/quran-uthmani`;
                    
                    console.log(`Loading page ${this.currentPage} from API ${i + 1}: ${baseUrl}`);
                    
                    // Try direct fetch first, then use proxy if needed
                    let response;
                    try {
                        response = await fetch(apiUrl, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json'
                            },
                            mode: 'cors'
                        });
                    } catch (corsError) {
                        // CORS error - use proxy
                        console.log('Direct fetch failed, using proxy...');
                        const proxyUrl = this.corsProxy + encodeURIComponent(apiUrl);
                        response = await fetch(proxyUrl, {
                            method: 'GET',
                            headers: {
                                'Accept': 'application/json'
                            }
                        });
                    }
                    
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    
                    const data = await response.json();
                    
                    // Handle different API response formats
                    let ayahs = null;
                    if (data.data && data.data.ayahs) {
                        // Al-Quran Cloud format
                        ayahs = data.data.ayahs;
                    } else if (data.ayahs) {
                        // Alternative format
                        ayahs = data.ayahs;
                    } else if (Array.isArray(data)) {
                        // Direct array format
                        ayahs = data;
                    }
                    
                    if (ayahs && ayahs.length > 0) {
                        this.verses = ayahs;
                        // Determine which surah(s) are on this page
                        this.determineSurahsOnPage();
                        this.renderPage();
                        this.currentApiIndex = i;
                        success = true;
                        
                        if (loading) loading.style.display = 'none';
                        if (content) content.style.display = 'block';
                        if (navigation) navigation.style.display = 'flex';
                        break;
                    } else {
                        throw new Error('Invalid data format');
                    }
                } catch (apiError) {
                    console.error(`API ${i + 1} failed:`, apiError);
                    lastError = apiError;
                    continue;
                }
            }
            
            if (!success) {
                throw lastError || new Error('جميع محاولات الاتصال فشلت');
            }
        } catch (e) {
            if (loading) loading.style.display = 'none';
            this.showError(`خطأ في تحميل الصفحة: ${e.message || 'يرجى التحقق من الاتصال بالإنترنت'}`);
        }
    }
    
    determineSurahsOnPage() {
        if (this.verses.length === 0) return;
        
        // Get unique surah numbers from verses
        const surahNumbers = [...new Set(this.verses.map(v => {
            if (v.surah && typeof v.surah === 'object' && v.surah.number) {
                return v.surah.number;
            }
            return null;
        }).filter(Boolean))];
        
        if (surahNumbers.length === 1) {
            this.currentSurah = this.surahs.find(s => s.number === surahNumbers[0]);
        } else {
            // Page contains multiple surahs
            this.currentSurah = null;
        }
    }
    
    updateHeader() {
        const title = document.getElementById('surahTitle');
        const info = document.getElementById('surahInfo');
        
        if (title) {
            if (this.currentSurah) {
                title.textContent = `${this.currentSurah.number}. ${this.currentSurah.name}`;
            } else {
                title.textContent = `الصفحة ${this.currentPage}`;
            }
        }
        
        if (info) {
            if (this.currentSurah) {
                info.textContent = `${this.currentSurah.englishName} • ${this.currentSurah.ayahs} آية • ${this.currentSurah.type === 'makki' ? 'مكية' : 'مدنية'}`;
            } else {
                // Multiple surahs on this page
                const surahNumbers = [...new Set(this.verses.map(v => v.surah?.number))].filter(Boolean);
                if (surahNumbers.length > 0) {
                    const surahNames = surahNumbers.map(n => {
                        const s = this.surahs.find(s => s.number === n);
                        return s ? s.name : '';
                    }).filter(Boolean).join(' - ');
                    info.textContent = `الصفحة ${this.currentPage} من 604 • ${surahNames}`;
                } else {
                    info.textContent = `الصفحة ${this.currentPage} من 604`;
                }
            }
        }
    }
    
    renderPage() {
        const container = document.getElementById('versesContainer');
        if (!container) return;
        
        container.innerHTML = '';
        this.updateHeader();
        
        // Create single page element with all verses
        const pageElement = this.createPageElement();
        container.appendChild(pageElement);
    }
    
    createPageElement() {
        const pageDiv = document.createElement('div');
        pageDiv.className = 'quran-page-content glass-card';
        pageDiv.id = `page-${this.currentPage}`;
        
        // Group verses by surah if page contains multiple surahs
        const versesBySurah = {};
        this.verses.forEach(verse => {
            // Get surah number from verse object
            const surahNum = verse.surah?.number || (verse.surah && typeof verse.surah === 'object' ? verse.surah.number : null);
            if (!surahNum) {
                // Try alternative property names
                const altSurahNum = verse.numberInSurah ? null : (verse.surahNumber || null);
                if (altSurahNum) {
                    if (!versesBySurah[altSurahNum]) {
                        versesBySurah[altSurahNum] = [];
                    }
                    versesBySurah[altSurahNum].push(verse);
                } else {
                    // If we can't determine surah, put in a default group
                    if (!versesBySurah['unknown']) {
                        versesBySurah['unknown'] = [];
                    }
                    versesBySurah['unknown'].push(verse);
                }
            } else {
                if (!versesBySurah[surahNum]) {
                    versesBySurah[surahNum] = [];
                }
                versesBySurah[surahNum].push(verse);
            }
        });
        
        let versesHTML = '';
        const surahNumbers = Object.keys(versesBySurah).map(Number).sort((a, b) => a - b);
        
        surahNumbers.forEach(surahNum => {
            const surah = this.surahs.find(s => s.number === surahNum);
            const surahVerses = versesBySurah[surahNum];
            
            // Add surah header if page starts with new surah or contains multiple surahs
            const firstVerseInSurah = surahVerses[0];
            const verseNumberInSurah = firstVerseInSurah.numberInSurah || firstVerseInSurah.number || 1;
            
            if (surahNumbers.length > 1 || verseNumberInSurah === 1) {
                versesHTML += `
                    <div class="surah-separator">
                        <div class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</div>
                        ${surah ? `<div class="surah-title-in-page">${surah.name}</div>` : ''}
                    </div>
                `;
            }
            
            surahVerses.forEach(verse => {
                const verseNum = verse.numberInSurah || verse.number || '';
                versesHTML += `
                    <div class="verse-item">
                        <span class="verse-number">${verseNum}</span>
                        <span class="verse-text">${verse.text}</span>
                    </div>
                `;
            });
        });
        
        // Get surah info for footer
        const firstSurah = this.surahs.find(s => s.number === surahNumbers[0]);
        const lastSurah = this.surahs.find(s => s.number === surahNumbers[surahNumbers.length - 1]);
        const surahInfo = surahNumbers.length === 1 
            ? firstSurah.name 
            : `${firstSurah?.name || ''}${lastSurah && firstSurah?.number !== lastSurah.number ? ` - ${lastSurah.name}` : ''}`;
        
        pageDiv.innerHTML = `
            <button class="btn-save-page-icon" data-page="${this.currentPage}" title="حفظ هذه الصفحة">
                <span>💾</span>
            </button>
            <div class="page-header">
                <div class="page-info">
                    <span class="surah-name-page">${surahInfo}</span>
                    <span class="page-number">الصفحة ${this.currentPage} من 604</span>
                </div>
            </div>
            <div class="verses-content">
                ${versesHTML}
            </div>
        `;
        
        // Add save button event listener
        const saveBtn = pageDiv.querySelector('.btn-save-page-icon');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePageProgress(this.currentPage);
            });
        }
        
        return pageDiv;
    }
    
    navigateToPage(pageNumber) {
        if (pageNumber < 1) pageNumber = 604;
        if (pageNumber > 604) pageNumber = 1;
        
        window.location.href = `quran-surah.html?page=${pageNumber}`;
    }
    
    navigateToSurah(surahNumber) {
        if (surahNumber < 1) surahNumber = 114;
        if (surahNumber > 114) surahNumber = 1;
        
        // Find the first page of this surah (approximate)
        // This is a simplified approach - in reality, you'd need a mapping
        // For now, we'll navigate to surah and let the API handle it
        window.location.href = `quran-surah.html?surah=${surahNumber}&page=1`;
    }
    
    saveProgress() {
        const progress = {
            page: this.currentPage,
            surahNumber: this.currentSurah?.number || null,
            surahName: this.currentSurah?.name || `الصفحة ${this.currentPage}`,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('quranProgress', JSON.stringify(progress));
        this.showSaveSuccess();
    }
    
    savePageProgress(pageNumber) {
        const progress = {
            page: pageNumber,
            surahNumber: this.currentSurah?.number || null,
            surahName: this.currentSurah?.name || `الصفحة ${pageNumber}`,
            timestamp: new Date().toISOString()
        };
        
        // Save to saved pages list
        let savedPages = JSON.parse(localStorage.getItem('quranSavedPages') || '[]');
        
        // Remove if already exists (same page)
        savedPages = savedPages.filter(p => p.page !== progress.page);
        
        // Add new saved page
        savedPages.unshift(progress);
        
        // Keep only last 20 saved pages
        if (savedPages.length > 20) {
            savedPages = savedPages.slice(0, 20);
        }
        
        localStorage.setItem('quranSavedPages', JSON.stringify(savedPages));
        localStorage.setItem('quranProgress', JSON.stringify(progress));
        
        this.showSaveSuccess();
    }
    
    showSaveSuccess() {
        // Find the save button icon in the current page
        const pageContent = document.querySelector('.quran-page-content');
        if (pageContent) {
            const btnSave = pageContent.querySelector('.btn-save-page-icon');
            if (btnSave) {
                const originalHTML = btnSave.innerHTML;
                btnSave.innerHTML = '<span>✓</span>';
                btnSave.style.background = 'var(--gradient-secondary)';
                btnSave.style.borderColor = 'var(--secondary)';
                
                setTimeout(() => {
                    btnSave.innerHTML = originalHTML;
                    btnSave.style.background = '';
                    btnSave.style.borderColor = '';
                }, 2000);
            }
        }
    }
    
    showError(message) {
        const error = document.getElementById('errorState');
        if (error) {
            error.textContent = message;
            error.style.display = 'block';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.quranSurahReader = new QuranSurahReader();
});

