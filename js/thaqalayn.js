/**
 * Thaqalayn Page - Books and Hadiths
 * Implements provider pattern similar to Flutter code
 */

class ThaqalaynProvider {
    constructor() {
        this.baseUrl = 'https://www.thaqalayn-api.net/api/v2';
        
        // State
        this.books = [];
        this.isLoadingBooks = false;
        this.booksError = null;
        
        this.randomHadith = null;
        this.isLoadingRandom = false;
        this.randomError = null;
        
        this.searchResults = [];
        this.isSearching = false;
        this.searchError = null;
        
        this.selectedBookId = null;
        
        this.init();
    }
    
    async init() {
        await this.loadBooks();
        await this.fetchRandomHadith();
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        const refreshRandomBtn = document.getElementById('refreshRandomBtn');
        const refreshBooksBtn = document.getElementById('refreshBooksBtn');
        const searchInput = document.getElementById('searchInput');
        const bookFilter = document.getElementById('bookFilter');
        const clearSearch = document.getElementById('clearSearch');
        
        if (refreshRandomBtn) {
            refreshRandomBtn.addEventListener('click', () => {
                this.fetchRandomHadith(this.selectedBookId);
            });
        }
        
        if (refreshBooksBtn) {
            refreshBooksBtn.addEventListener('click', () => {
                this.loadBooks(true);
            });
        }
        
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                const query = e.target.value.trim();
                
                if (query) {
                    clearSearch.style.display = 'flex';
                    searchTimeout = setTimeout(() => {
                        this.searchAllBooks(query);
                    }, 500);
                } else {
                    clearSearch.style.display = 'none';
                    this.clearSearch();
                }
            });
        }
        
        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                clearSearch.style.display = 'none';
                this.clearSearch();
            });
        }
        
        if (bookFilter) {
            bookFilter.addEventListener('change', (e) => {
                this.selectedBookId = e.target.value || null;
                const query = searchInput.value.trim();
                if (query) {
                    if (this.selectedBookId) {
                        this.searchInBook(this.selectedBookId, query);
                    } else {
                        this.searchAllBooks(query);
                    }
                }
            });
        }
    }
    
    // ─────────────────────────────────────────────
    // API Methods
    // ─────────────────────────────────────────────
    
    async getAllBooks() {
        const response = await fetch(`${this.baseUrl}/allbooks`);
        if (!response.ok) {
            throw new Error(`Failed to load books: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }
    
    async getRandomHadith(bookId = null) {
        const path = bookId ? `${bookId}/random` : 'random';
        const response = await fetch(`${this.baseUrl}/${path}`);
        if (!response.ok) {
            throw new Error(`Failed to load random hadith: ${response.status}`);
        }
        const data = await response.json();
        // Handle both object and array responses
        if (Array.isArray(data) && data.length > 0) {
            return data[0];
        }
        return data;
    }
    
    async searchAllBooks(query) {
        const response = await fetch(`${this.baseUrl}/query?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Failed to search: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }
    
    async searchInBook(bookId, query) {
        const response = await fetch(`${this.baseUrl}/query/${bookId}?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Failed to search in book: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }
    
    async getAllHadithOfBook(bookId) {
        const response = await fetch(`${this.baseUrl}/${bookId}`);
        if (!response.ok) {
            throw new Error(`Failed to load hadiths: ${response.status}`);
        }
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    }
    
    // ─────────────────────────────────────────────
    // Provider Methods
    // ─────────────────────────────────────────────
    
    async loadBooks(forceRefresh = false) {
        this.isLoadingBooks = true;
        this.booksError = null;
        this.updateBooksUI();
        
        try {
            this.books = await this.getAllBooks();
            this.populateBookFilter();
            this.renderBooks();
        } catch (e) {
            this.booksError = e.message;
            this.showBooksError();
        } finally {
            this.isLoadingBooks = false;
            this.updateBooksUI();
        }
    }
    
    async fetchRandomHadith(bookId = null) {
        this.isLoadingRandom = true;
        this.randomError = null;
        this.updateRandomUI();
        
        try {
            const data = await this.getRandomHadith(bookId);
            this.randomHadith = this.parseHadith(data);
            this.renderRandomHadith();
        } catch (e) {
            this.randomError = e.message;
            this.showRandomError();
        } finally {
            this.isLoadingRandom = false;
            this.updateRandomUI();
        }
    }
    
    async searchAllBooks(query) {
        if (!query.trim()) {
            this.clearSearch();
            return;
        }
        
        this.isSearching = true;
        this.searchError = null;
        this.updateSearchUI();
        
        try {
            const data = await this.searchAllBooks(query);
            this.searchResults = data.map(item => this.parseHadith(item));
            this.renderSearchResults();
        } catch (e) {
            this.searchError = e.message;
            this.showSearchError();
        } finally {
            this.isSearching = false;
            this.updateSearchUI();
        }
    }
    
    async searchInBook(bookId, query) {
        if (!query.trim()) {
            this.clearSearch();
            return;
        }
        
        this.isSearching = true;
        this.searchError = null;
        this.updateSearchUI();
        
        try {
            const data = await this.searchInBook(bookId, query);
            this.searchResults = data.map(item => this.parseHadith(item));
            this.renderSearchResults();
        } catch (e) {
            this.searchError = e.message;
            this.showSearchError();
        } finally {
            this.isSearching = false;
            this.updateSearchUI();
        }
    }
    
    clearSearch() {
        this.searchResults = [];
        this.searchError = null;
        const searchSection = document.getElementById('searchResultsSection');
        if (searchSection) {
            searchSection.style.display = 'none';
        }
    }
    
    // ─────────────────────────────────────────────
    // Parsing Methods
    // ─────────────────────────────────────────────
    
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
    
    // ─────────────────────────────────────────────
    // UI Update Methods
    // ─────────────────────────────────────────────
    
    updateBooksUI() {
        const loading = document.getElementById('booksLoading');
        const error = document.getElementById('booksError');
        const grid = document.getElementById('booksGrid');
        
        if (this.isLoadingBooks) {
            if (loading) loading.style.display = 'block';
            if (error) error.style.display = 'none';
            if (grid) grid.style.display = 'none';
        } else {
            if (loading) loading.style.display = 'none';
        }
    }
    
    updateRandomUI() {
        const loading = document.getElementById('randomLoading');
        const error = document.getElementById('randomError');
        const content = document.getElementById('randomHadithContent');
        
        if (this.isLoadingRandom) {
            if (loading) loading.style.display = 'block';
            if (error) error.style.display = 'none';
            if (content) content.style.display = 'none';
        } else {
            if (loading) loading.style.display = 'none';
        }
    }
    
    updateSearchUI() {
        const loading = document.getElementById('searchLoading');
        const error = document.getElementById('searchError');
        const section = document.getElementById('searchResultsSection');
        const resultsInfo = document.getElementById('searchResultsInfo');
        const resultsCount = document.getElementById('searchResultsCount');
        
        if (this.isSearching) {
            if (loading) loading.style.display = 'block';
            if (error) error.style.display = 'none';
        } else {
            if (loading) loading.style.display = 'none';
        }
        
        if (this.searchResults.length > 0 || this.isSearching) {
            if (section) section.style.display = 'block';
            if (resultsInfo) {
                resultsInfo.style.display = 'block';
                if (resultsCount) resultsCount.textContent = this.searchResults.length;
            }
        }
    }
    
    renderBooks() {
        const grid = document.getElementById('booksGrid');
        if (!grid) return;
        
        if (this.books.length === 0) {
            grid.style.display = 'none';
            return;
        }
        
        grid.innerHTML = '';
        grid.style.display = 'grid';
        
        this.books.forEach(bookData => {
            const book = this.parseBook(bookData);
            const bookCard = this.createBookCard(book);
            grid.appendChild(bookCard);
        });
    }
    
    createBookCard(book) {
        const card = document.createElement('div');
        card.className = 'book-card glass-card';
        
        card.innerHTML = `
            ${book.coverUrl ? `
                <div class="book-cover">
                    <img src="${book.coverUrl}" alt="${book.title}" onerror="this.style.display='none'">
                </div>
            ` : ''}
            <div class="book-content">
                <h3 class="book-title">${this.escapeHtml(book.title)}</h3>
                ${book.englishName ? `<p class="book-english-name">${this.escapeHtml(book.englishName)}</p>` : ''}
                ${book.author ? `<p class="book-author">المؤلف: ${this.escapeHtml(book.author)}</p>` : ''}
                ${book.description ? `<p class="book-description">${this.escapeHtml(book.description)}</p>` : ''}
                ${book.idRangeMin && book.idRangeMax ? `
                    <p class="book-range">الأحاديث: ${book.idRangeMin} - ${book.idRangeMax}</p>
                ` : ''}
                <button class="btn-view-book" data-book-id="${book.id}">
                    <span>عرض الأحاديث</span>
                    <span>▶</span>
                </button>
            </div>
        `;
        
        const viewBtn = card.querySelector('.btn-view-book');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                this.loadBookHadiths(book.id);
            });
        }
        
        return card;
    }
    
    renderRandomHadith() {
        if (!this.randomHadith) return;
        
        const content = document.getElementById('randomHadithContent');
        const bookName = document.getElementById('randomBookName');
        const arabicText = document.getElementById('randomArabicText');
        const englishText = document.getElementById('randomEnglishText');
        const narrator = document.getElementById('randomNarrator');
        const grade = document.getElementById('randomGrade');
        const reference = document.getElementById('randomReference');
        
        if (!content) return;
        
        content.style.display = 'block';
        
        if (bookName) {
            bookName.textContent = this.randomHadith.bookName || 'كتاب';
        }
        
        if (arabicText) {
            arabicText.textContent = this.randomHadith.arabic || 'لا يوجد نص عربي';
        }
        
        if (englishText && this.randomHadith.english) {
            englishText.textContent = this.randomHadith.english;
            englishText.style.display = 'block';
        } else if (englishText) {
            englishText.style.display = 'none';
        }
        
        if (narrator) {
            narrator.textContent = this.randomHadith.narrator || '';
            narrator.style.display = this.randomHadith.narrator ? 'inline' : 'none';
        }
        
        if (grade) {
            grade.textContent = this.randomHadith.grade || '';
            grade.style.display = this.randomHadith.grade ? 'inline' : 'none';
        }
        
        if (reference && this.randomHadith.reference) {
            reference.href = this.randomHadith.reference;
            reference.style.display = 'inline-block';
        } else if (reference) {
            reference.style.display = 'none';
        }
    }
    
    renderSearchResults() {
        const list = document.getElementById('searchResultsList');
        if (!list) return;
        
        list.innerHTML = '';
        
        if (this.searchResults.length === 0) {
            list.innerHTML = '<div class="empty-state">لا توجد نتائج</div>';
            return;
        }
        
        this.searchResults.forEach(hadith => {
            const hadithCard = this.createHadithCard(hadith);
            list.appendChild(hadithCard);
        });
    }
    
    createHadithCard(hadith) {
        const card = document.createElement('div');
        card.className = 'hadith-card glass-card';
        
        card.innerHTML = `
            ${hadith.bookName ? `<div class="hadith-book-name">${this.escapeHtml(hadith.bookName)}</div>` : ''}
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
    
    async loadBookHadiths(bookId) {
        // Show hadiths in search results section
        this.isSearching = true;
        this.updateSearchUI();
        
        try {
            const data = await this.getAllHadithOfBook(bookId);
            this.searchResults = data.map(item => this.parseHadith(item));
            this.renderSearchResults();
            
            const section = document.getElementById('searchResultsSection');
            if (section) {
                section.style.display = 'block';
                section.scrollIntoView({ behavior: 'smooth' });
            }
        } catch (e) {
            this.searchError = e.message;
            this.showSearchError();
        } finally {
            this.isSearching = false;
            this.updateSearchUI();
        }
    }
    
    populateBookFilter() {
        const filter = document.getElementById('bookFilter');
        if (!filter) return;
        
        // Clear existing options except "all books"
        filter.innerHTML = '<option value="">جميع الكتب</option>';
        
        this.books.forEach(bookData => {
            const book = this.parseBook(bookData);
            const option = document.createElement('option');
            option.value = book.id;
            option.textContent = book.title;
            filter.appendChild(option);
        });
    }
    
    showBooksError() {
        const error = document.getElementById('booksError');
        if (error && this.booksError) {
            error.textContent = `خطأ: ${this.booksError}`;
            error.style.display = 'block';
        }
    }
    
    showRandomError() {
        const error = document.getElementById('randomError');
        if (error && this.randomError) {
            error.textContent = `خطأ: ${this.randomError}`;
            error.style.display = 'block';
        }
    }
    
    showSearchError() {
        const error = document.getElementById('searchError');
        if (error && this.searchError) {
            error.textContent = `خطأ: ${this.searchError}`;
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
    window.thaqalaynProvider = new ThaqalaynProvider();
});

