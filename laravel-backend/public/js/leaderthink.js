/**
 * Leaderthink Page - Display and Search Functionality
 * Loads and displays content from leaderthink.json
 */

class LeaderthinkManager {
    constructor() {
        this.data = null;
        this.allIdeas = [];
        this.filteredIdeas = [];
        this.currentSectionFilter = '';
        this.currentSearchQuery = '';
        this.expandedSections = new Set(); // Track which sections are expanded
        
        this.init();
    }
    
    async init() {
        await this.loadData();
        this.setupEventListeners();
        // Show all main section titles by default
        this.renderAllSections();
    }
    
    async loadData() {
        try {
            const leaderthinkPath = window.Laravel?.jsonPaths?.leaderthink || '/json/leaderthink.json';
            const response = await fetch(leaderthinkPath);
            if (!response.ok) {
                throw new Error('Failed to load data');
            }
            this.data = await response.json();
            this.processData();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading leaderthink data:', error);
            this.showError('حدث خطأ أثناء تحميل البيانات');
        }
    }
    
    processData() {
        // Flatten all ideas from all sections
        this.allIdeas = [];
        
        if (this.data && this.data.sections) {
            this.data.sections.forEach(section => {
                if (section.ideas && section.ideas.length > 0) {
                    section.ideas.forEach(idea => {
                        this.allIdeas.push({
                            ...idea,
                            sectionId: section.id,
                            sectionTitle: section.title
                        });
                    });
                }
            });
        }
        
        this.filteredIdeas = [...this.allIdeas];
    }
    
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const sectionFilter = document.getElementById('sectionFilter');
        const clearSearch = document.getElementById('clearSearch');
        
        // Populate section filter
        this.populateSectionFilter();
        
        // Search input
        searchInput.addEventListener('input', (e) => {
            this.currentSearchQuery = e.target.value.trim();
            this.handleSearch();
            clearSearch.style.display = this.currentSearchQuery ? 'flex' : 'none';
        });
        
        // Clear search
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            this.currentSearchQuery = '';
            clearSearch.style.display = 'none';
            this.currentSectionFilter = '';
            sectionFilter.value = '';
            this.expandedSections.clear();
            this.hideContentContainer();
        });
        
        // Section filter
        sectionFilter.addEventListener('change', (e) => {
            this.currentSectionFilter = e.target.value;
            this.expandedSections.clear(); // Clear expanded sections when filter changes
            this.handleSearch();
        });
        
        // Enter key to search
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
    }
    
    populateSectionFilter() {
        const sectionFilter = document.getElementById('sectionFilter');
        
        if (!this.data || !this.data.sections) return;
        
        this.data.sections.forEach(section => {
            const option = document.createElement('option');
            option.value = section.id;
            option.textContent = section.title;
            sectionFilter.appendChild(option);
        });
    }
    
    handleSearch() {
        let filtered = [...this.allIdeas];
        
        // Filter by section
        if (this.currentSectionFilter) {
            filtered = filtered.filter(idea => idea.sectionId === this.currentSectionFilter);
        }
        
        // Filter by search query
        if (this.currentSearchQuery) {
            const query = this.currentSearchQuery.toLowerCase();
            filtered = filtered.filter(idea => {
                const titleMatch = idea.title.toLowerCase().includes(query);
                const bodyMatch = idea.body.toLowerCase().includes(query);
                return titleMatch || bodyMatch;
            });
        }
        
        this.filteredIdeas = filtered;
        
        // If no filter and no search - show all main section titles
        // Otherwise show idea titles based on filter/search
        if (!this.currentSectionFilter && !this.currentSearchQuery) {
            this.renderAllSections();
        } else {
            this.renderTitlesList();
        }
        this.updateResultsInfo();
    }
    
    renderAllSections() {
        if (!this.data || !this.data.sections) return;
        
        this.hideEmptyState();
        
        const container = document.getElementById('ideasContainer');
        container.innerHTML = '';
        container.style.display = 'block';
        
        // Show all sections as expandable items
        this.data.sections.forEach((section, index) => {
            const isExpanded = this.expandedSections.has(section.id);
            
            // Create section group
            const sectionGroup = document.createElement('div');
            sectionGroup.className = 'section-group fade-in-up';
            
            // Section header (clickable for expand/collapse)
            const sectionHeader = document.createElement('div');
            sectionHeader.className = `section-header glass-card ${isExpanded ? 'expanded' : ''}`;
            sectionHeader.dataset.sectionId = section.id;
            sectionHeader.innerHTML = `
                <h2 class="section-title">
                    <span class="section-icon">📚</span>
                    <span>${section.title}</span>
                    <span class="section-expand-icon">${isExpanded ? '▼' : '▶'}</span>
                </h2>
            `;
            
            // Make section header clickable
            sectionHeader.style.cursor = 'pointer';
            sectionHeader.addEventListener('click', () => {
                this.toggleSection(section.id);
            });
            
            // Titles list (collapsible)
            const titlesList = document.createElement('div');
            titlesList.className = `section-content ${isExpanded ? 'expanded' : ''}`;
            
            if (isExpanded) {
                // Get ideas for this section
                const ideas = this.allIdeas.filter(idea => idea.sectionId === section.id);
                ideas.forEach((idea, idx) => {
                    const titleItem = this.createTitleItem(idea, idx + 1);
                    titlesList.appendChild(titleItem);
                });
            }
            
            sectionGroup.appendChild(sectionHeader);
            sectionGroup.appendChild(titlesList);
            container.appendChild(sectionGroup);
        });
    }
    
    renderTitlesList() {
        if (this.filteredIdeas.length === 0) {
            this.showEmptyState();
            return;
        }
        
        this.hideEmptyState();
        
        const container = document.getElementById('ideasContainer');
        container.innerHTML = '';
        container.style.display = 'block';
        
        // Group ideas by section
        const ideasBySection = {};
        this.filteredIdeas.forEach(idea => {
            if (!ideasBySection[idea.sectionId]) {
                ideasBySection[idea.sectionId] = {
                    section: this.data.sections.find(s => s.id === idea.sectionId),
                    ideas: []
                };
            }
            ideasBySection[idea.sectionId].ideas.push(idea);
        });
        
        // Sort sections by their order in original data
        const sectionOrder = this.data.sections.map(s => s.id);
        const sortedSections = Object.keys(ideasBySection).sort((a, b) => {
            return sectionOrder.indexOf(a) - sectionOrder.indexOf(b);
        });
        
        sortedSections.forEach(sectionId => {
            const { section, ideas } = ideasBySection[sectionId];
            const isExpanded = this.expandedSections.has(sectionId);
            
            // Create section group
            const sectionGroup = document.createElement('div');
            sectionGroup.className = 'section-group fade-in-up';
            
            // Section header (clickable for expand/collapse)
            const sectionHeader = document.createElement('div');
            sectionHeader.className = `section-header glass-card ${isExpanded ? 'expanded' : ''}`;
            sectionHeader.dataset.sectionId = sectionId;
            sectionHeader.innerHTML = `
                <h2 class="section-title">
                    <span class="section-icon">📚</span>
                    <span>${this.highlightText(section.title)}</span>
                    <span class="section-expand-icon">${isExpanded ? '▼' : '▶'}</span>
                </h2>
            `;
            
            // Make section header clickable
            sectionHeader.style.cursor = 'pointer';
            sectionHeader.addEventListener('click', () => {
                this.toggleSection(sectionId);
            });
            
            // Titles list (collapsible)
            const titlesList = document.createElement('div');
            titlesList.className = `section-content ${isExpanded ? 'expanded' : ''}`;
            
            if (isExpanded) {
                ideas.forEach((idea, index) => {
                    const titleItem = this.createTitleItem(idea, index + 1);
                    titlesList.appendChild(titleItem);
                });
            }
            
            sectionGroup.appendChild(sectionHeader);
            sectionGroup.appendChild(titlesList);
            container.appendChild(sectionGroup);
        });
    }
    
    toggleSection(sectionId) {
        if (this.expandedSections.has(sectionId)) {
            this.expandedSections.delete(sectionId);
        } else {
            this.expandedSections.add(sectionId);
        }
        
        // Find the section and update its content
        const sectionHeader = document.querySelector(`[data-section-id="${sectionId}"]`);
        if (sectionHeader) {
            const sectionGroup = sectionHeader.closest('.section-group');
            const titlesList = sectionGroup.querySelector('.section-content');
            const expandIcon = sectionHeader.querySelector('.section-expand-icon');
            
            if (this.expandedSections.has(sectionId)) {
                // Expand - show titles
                sectionHeader.classList.add('expanded');
                titlesList.classList.add('expanded');
                
                // Get the section data to render ideas
                const section = this.data.sections.find(s => s.id === sectionId);
                const ideas = this.filteredIdeas.filter(idea => idea.sectionId === sectionId);
                
                titlesList.innerHTML = '';
                ideas.forEach((idea, index) => {
                    const titleItem = this.createTitleItem(idea, index + 1);
                    titlesList.appendChild(titleItem);
                });
                
                if (expandIcon) expandIcon.textContent = '▼';
            } else {
                // Collapse - hide titles
                sectionHeader.classList.remove('expanded');
                titlesList.classList.remove('expanded');
                setTimeout(() => {
                    if (!this.expandedSections.has(sectionId)) {
                        titlesList.innerHTML = '';
                    }
                }, 400); // Wait for animation
                if (expandIcon) expandIcon.textContent = '▶';
            }
        }
    }
    
    createTitleItem(idea, number) {
        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'title-item-wrapper';
        
        const titleItem = document.createElement('div');
        titleItem.className = 'title-item glass-card';
        titleItem.dataset.ideaId = idea.id;
        
        // Title header
        const titleHeader = document.createElement('div');
        titleHeader.className = 'title-header';
        titleHeader.innerHTML = `
            <div class="title-number">${number}</div>
            <h3 class="title-text">${this.highlightText(idea.title)}</h3>
        `;
        
        // Content (always visible - no dropdown for subtitles)
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'idea-content expanded';
        contentWrapper.innerHTML = this.createIdeaContent(idea);
        
        titleItem.appendChild(titleHeader);
        titleItem.appendChild(contentWrapper);
        titleWrapper.appendChild(titleItem);
        
        return titleWrapper;
    }
    
    
    createIdeaContent(idea) {
        // Extract date from body if present
        const dateMatch = idea.body.match(/التاريخ:\s*(\d{4}\/\d{2}\/\d{2})/);
        const date = dateMatch ? dateMatch[1] : '';
        const bodyWithoutDate = idea.body.replace(/التاريخ:\s*\d{4}\/\d{2}\/\d{2}\n\n?/, '');
        
        return `
            <div class="idea-body">${this.highlightText(bodyWithoutDate)}</div>
            <div class="idea-footer">
                ${date ? `
                    <div class="idea-date">
                        <span class="date-icon">📅</span>
                        <span>${date}</span>
                    </div>
                ` : '<div></div>'}
                ${idea.text_source_url ? `
                    <a href="${idea.text_source_url}" target="_blank" rel="noopener noreferrer" class="idea-link">
                        <span>المصدر</span>
                        <span class="link-icon">🔗</span>
                    </a>
                ` : ''}
            </div>
        `;
    }
    
    
    highlightText(text) {
        if (!this.currentSearchQuery) {
            return this.escapeHtml(text);
        }
        
        const query = this.currentSearchQuery;
        const regex = new RegExp(`(${this.escapeRegex(query)})`, 'gi');
        const escaped = this.escapeHtml(text);
        
        return escaped.replace(regex, '<span class="highlight">$1</span>');
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    escapeRegex(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    updateResultsInfo() {
        const resultsInfo = document.getElementById('resultsInfo');
        const resultsCount = document.getElementById('resultsCount');
        
        if (resultsInfo && resultsCount) {
            // If showing all sections, count sections; otherwise count ideas
            if (!this.currentSectionFilter && !this.currentSearchQuery) {
                const sectionCount = this.data && this.data.sections ? this.data.sections.length : 0;
                resultsCount.textContent = sectionCount;
            } else {
                resultsCount.textContent = this.filteredIdeas.length;
            }
            resultsInfo.style.display = 'block';
        }
    }
    
    hideContentContainer() {
        const container = document.getElementById('ideasContainer');
        const emptyState = document.getElementById('emptyState');
        
        if (container) {
            container.style.display = 'none';
        }
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }
    
    hideLoading() {
        const loadingState = document.getElementById('loadingState');
        if (loadingState) {
            loadingState.style.display = 'none';
        }
    }
    
    showEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const ideasContainer = document.getElementById('ideasContainer');
        
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        if (ideasContainer) {
            ideasContainer.style.display = 'none';
        }
    }
    
    hideEmptyState() {
        const emptyState = document.getElementById('emptyState');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }
    
    showError(message) {
        const container = document.getElementById('contentSection');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚠️</div>
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new LeaderthinkManager();
});

