/**
 * Thaqalayn Book Page - Display all hadiths from a specific book
 */

class ThaqalaynBookPage {
    constructor() {
        this.baseUrl = 'https://www.thaqalayn-api.net/api/v2';
        this.bookId = null;
        this.bookInfo = null;
        this.allHadiths = [];
        this.filteredHadiths = [];
        
        this.init();
    }
    
    async init() {
        // Get book ID from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.bookId = urlParams.get('bookId');
        
        if (!this.bookId) {
            this.showError('لم يتم تحديد الكتاب');
            return;
        }
        
        await this.loadBookInfo();
        await this.loadHadiths();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const clearSearch = document.getElementById('clearSearch');
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query) {
                    if (clearSearch) clearSearch.style.display = 'flex';
                    searchTimeout = setTimeout(() => {
                        this.filterHadiths(query);
                    }, 300);
                } else {
                    if (clearSearch) clearSearch.style.display = 'none';
                    this.filterHadiths('');
                }
            });
        }
        
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    clearSearch.style.display = 'none';
                    this.filterHadiths('');
                }
            });
        }
    }
    
    async loadBookInfo() {
        try {
            const response = await fetch(`${this.baseUrl}/allbooks`);
            if (!response.ok) {
                throw new Error(`Failed to load books: ${response.status}`);
            }
            const books = await response.json();
            const bookData = Array.isArray(books) 
                ? books.find(b => (b.bookId?.toString() || '') === this.bookId.toString())
                : null;
            
            if (bookData) {
                this.bookInfo = this.parseBook(bookData);
                this.updateBookHeader();
            }
        } catch (e) {
            console.error('Error loading book info:', e);
        }
    }
    
    async loadHadiths() {
        const loading = document.getElementById('loadingState');
        const error = document.getElementById('errorState');
        const section = document.getElementById('hadithsSection');
        
        if (loading) loading.style.display = 'block';
        if (error) error.style.display = 'none';
        if (section) section.style.display = 'none';
        
        try {
            const response = await fetch(`${this.baseUrl}/${this.bookId}`);
            if (!response.ok) {
                throw new Error(`Failed to load hadiths: ${response.status}`);
            }
            const data = await response.json();
            this.allHadiths = Array.isArray(data) 
                ? data.map(item => this.parseHadith(item))
                : [];
            this.filteredHadiths = [...this.allHadiths];
            
            this.renderHadiths();
            
            if (loading) loading.style.display = 'none';
            if (section) section.style.display = 'block';
        } catch (e) {
            if (loading) loading.style.display = 'none';
            this.showError(`خطأ في تحميل الأحاديث: ${e.message}`);
        }
    }
    
    filterHadiths(query) {
        if (!query.trim()) {
            this.filteredHadiths = [...this.allHadiths];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredHadiths = this.allHadiths.filter(hadith => {
                const arabic = (hadith.arabic || '').toLowerCase();
                const english = (hadith.english || '').toLowerCase();
                const narrator = (hadith.narrator || '').toLowerCase();
                const chapter = (hadith.chapter || '').toLowerCase();
                const title = (hadith.title || '').toLowerCase();
                
                return arabic.includes(lowerQuery) ||
                       english.includes(lowerQuery) ||
                       narrator.includes(lowerQuery) ||
                       chapter.includes(lowerQuery) ||
                       title.includes(lowerQuery);
            });
        }
        
        this.renderHadiths();
    }
    
    renderHadiths() {
        const list = document.getElementById('hadithsList');
        const empty = document.getElementById('emptyState');
        const count = document.getElementById('hadithsCount');
        
        if (!list) return;
        
        list.innerHTML = '';
        
        if (this.filteredHadiths.length === 0) {
            if (empty) empty.style.display = 'block';
            if (count) count.textContent = 'لا توجد نتائج';
            return;
        }
        
        if (empty) empty.style.display = 'none';
        if (count) {
            count.textContent = `الأحاديث (${this.filteredHadiths.length}${this.allHadiths.length !== this.filteredHadiths.length ? ` من ${this.allHadiths.length}` : ''})`;
        }
        
        this.filteredHadiths.forEach((hadith, index) => {
            const hadithCard = this.createHadithCard(hadith, index + 1);
            list.appendChild(hadithCard);
        });
    }
    
    createHadithCard(hadith, number) {
        const card = document.createElement('div');
        card.className = 'hadith-card glass-card';
        
        card.innerHTML = `
            <div class="hadith-number">#${number}</div>
            ${hadith.chapter ? `<div class="hadith-chapter">${this.escapeHtml(hadith.chapter)}</div>` : ''}
            ${hadith.title ? `<div class="hadith-title">${this.escapeHtml(hadith.title)}</div>` : ''}
            ${hadith.arabic ? `<div class="hadith-text">${this.escapeHtml(hadith.arabic)}</div>` : ''}
            ${hadith.english ? `<div class="hadith-text-english">${this.escapeHtml(hadith.english)}</div>` : ''}
            <div class="hadith-meta">
                ${hadith.narrator ? `<span class="hadith-narrator">${this.escapeHtml(hadith.narrator)}</span>` : ''}
                ${hadith.grade ? `<span class="hadith-grade">${this.escapeHtml(hadith.grade)}</span>` : ''}
            </div>
            ${hadith.reference ? `
                <a href="${hadith.reference}" target="_blank" class="hadith-reference">المصدر</a>
            ` : ''}
        `;
        
        return card;
    }
    
    updateBookHeader() {
        if (!this.bookInfo) return;
        
        const title = document.getElementById('bookTitle');
        const subtitle = document.getElementById('bookSubtitle');
        
        if (title) {
            title.textContent = this.bookInfo.title;
        }
        
        if (subtitle) {
            let subtitleText = '';
            if (this.bookInfo.author) {
                subtitleText += `المؤلف: ${this.bookInfo.author}`;
            }
            if (this.bookInfo.idRangeMin && this.bookInfo.idRangeMax) {
                if (subtitleText) subtitleText += ' • ';
                subtitleText += `الأحاديث: ${this.bookInfo.idRangeMin} - ${this.bookInfo.idRangeMax}`;
            }
            subtitle.textContent = subtitleText || 'مكتبة الأحاديث الإسلامية';
        }
    }
    
    parseBook(data) {
        return {
            id: data.bookId?.toString() || '',
            title: data.BookName || '',
            englishName: data.englishName || null,
            author: data.author || null,
            description: data.bookDescription || null,
            coverUrl: data.bookCover || null,
            idRangeMin: data.idRangeMin || null,
            idRangeMax: data.idRangeMax || null,
            translator: data.translator || null,
            volume: data.volume || null
        };
    }
    
    parseHadith(data) {
        return {
            id: data.hadithId || data.id || 0,
            bookId: data.bookId?.toString() || '',
            bookName: data.book || null,
            chapter: data.chapterTitle || null,
            title: data.title || null,
            arabic: data.arabicText || null,
            english: data.englishText || null,
            narrator: data.narrator || null,
            grade: data.grade || data.majlisiGrading || data.mohseniGrading || data.behbudiGrading || null,
            reference: data.URL || null,
            volume: data.volume || null
        };
    }
    
    showError(message) {
        const loading = document.getElementById('loadingState');
        const error = document.getElementById('errorState');
        
        if (loading) loading.style.display = 'none';
        if (error) {
            error.textContent = message;
            error.style.display = 'block';
        }
    }
    
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.thaqalaynBookPage = new ThaqalaynBookPage();
});

