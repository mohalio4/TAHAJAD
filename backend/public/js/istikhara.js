/* ====================================
   ISTIKHARA (SEEKING GUIDANCE) FUNCTIONALITY
   Integration with Quran Istikhara API
   ==================================== */

class IstikharaManager {
    constructor() {
        this.userData = this.getUserData();
        this.history = this.loadHistory();
        this.apiBaseUrl = 'https://khotabaa.com/istikhara/kazem';
        // Use only the second proxy (corsproxy.io) as it always works
        this.corsProxy = 'https://corsproxy.io/?';
        
        if (!this.userData) {
            window.location.href = 'login_page.html';
            return;
        }
        
        this.init();
    }
    
    async init() {
        this.setupUserProfile();
        this.renderHistory();
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
    
    // ========== LOAD/SAVE HISTORY ==========
    loadHistory() {
        const saved = localStorage.getItem('istikharaHistory');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveHistory() {
        localStorage.setItem('istikharaHistory', JSON.stringify(this.history));
        this.renderHistory();
    }
    
    addToHistory(istikharaData) {
        const historyItem = {
            id: Date.now(),
            pageNumber: istikharaData.pageNumber,
            reason: istikharaData.reason || null,
            soura: istikharaData.soura || '',
            ayaNumber: istikharaData.ayaNumber || 0,
            quranText: istikharaData.quranText,
            general: istikharaData.general || '',
            economy: istikharaData.economy || '',
            marriage: istikharaData.marriage || '',
            date: new Date().toISOString()
        };
        
        this.history.unshift(historyItem);
        
        // Keep only last 20 items
        if (this.history.length > 20) {
            this.history = this.history.slice(0, 20);
        }
        
        this.saveHistory();
    }
    
    clearHistory() {
        if (confirm('هل أنت متأكد من حذف جميع الاستخارات السابقة؟')) {
            this.history = [];
            this.saveHistory();
            this.showToast('تم مسح السجل بنجاح', 'success');
        }
    }
    
    // ========== ISTIKHARA API ==========
    async performIstikhara(pageNumber, reason) {
        // Validate that page number is odd
        if (pageNumber % 2 === 0) {
            this.showToast('يجب أن يكون رقم الصفحة فردياً (1، 3، 5، 7...)', 'error');
            return false;
        }
        
        // Show loading
        this.showLoading();
        
        try {
            console.log('Fetching Istikhara for page:', pageNumber);
            const apiUrl = `${this.apiBaseUrl}/${pageNumber}`;
            console.log('API URL:', apiUrl);
            
            // Use the CORS proxy directly (corsproxy.io always works)
            const proxyUrl = this.corsProxy + encodeURIComponent(apiUrl);
            console.log('Using proxy:', proxyUrl);
            
            const response = await fetch(proxyUrl, {
                method: 'GET',
                headers: {
                    'accept': 'application/json'
                },
                mode: 'cors'
            });
            
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`فشل في الحصول على النتيجة - Status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('API Response data:', data);
            
            // Check if we got valid data
            if (!data || typeof data !== 'object') {
                throw new Error('البيانات المستلمة غير صحيحة');
            }
            
            // Check if API returned an error message
            if (data.error || data.message) {
                throw new Error(data.error || data.message || 'حدث خطأ في الاستجابة من الخادم');
            }
            
            // Process and display result
            this.displayResult(pageNumber, reason, data);
            
            // Add to history
            this.addToHistory({
                pageNumber,
                reason,
                soura: data.soura || '',
                ayaNumber: data.ayaNumber || 0,
                quranText: data.aya || '',
                general: data.general || '',
                economy: data.economy || '',
                marriage: data.marriage || ''
            });
            
            return true;
            
        } catch (error) {
            console.error('Istikhara API Error:', error);
            console.error('Error details:', error.message);
            console.error('Error stack:', error.stack);
            
            // Show more specific error message
            let errorMessage = 'حدث خطأ في الحصول على النتيجة.';
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = 'فشل الاتصال بالخادم. تأكد من الاتصال بالإنترنت وحاول مرة أخرى.';
            } else if (error.message.includes('Status:')) {
                errorMessage = `خطأ في الخادم: ${error.message}`;
            } else {
                errorMessage = error.message || errorMessage;
            }
            
            this.showToast(errorMessage, 'error');
            this.hideLoading();
            return false;
        }
    }
    
    // ========== DISPLAY RESULT ==========
    displayResult(pageNumber, reason, apiData) {
        console.log('Displaying result for page:', pageNumber);
        console.log('API Data:', apiData);
        
        // Hide loading
        this.hideLoading();
        
        // Get result elements
        const resultSection = document.getElementById('resultSection');
        const resultPage = document.getElementById('resultPage');
        const resultReason = document.getElementById('resultReason');
        const reasonInfo = document.getElementById('reasonInfo');
        const quranText = document.getElementById('quranText');
        const interpretationText = document.getElementById('interpretationText');
        const indicator = document.getElementById('resultIndicator');
        const indicatorIcon = document.getElementById('indicatorIcon');
        const indicatorText = document.getElementById('indicatorText');
        
        if (!resultSection) {
            console.error('Result section not found!');
            return;
        }
        
        // Set page number with Surah info if available
        if (apiData.soura && apiData.ayaNumber) {
            resultPage.textContent = `صفحة ${pageNumber} - سورة ${apiData.soura} - آية ${apiData.ayaNumber}`;
        } else {
            resultPage.textContent = `صفحة ${pageNumber}`;
        }
        
        // Set reason if provided
        if (reason && reason.trim()) {
            reasonInfo.style.display = 'flex';
            resultReason.textContent = reason;
        } else {
            reasonInfo.style.display = 'none';
        }
        
        // Determine result type from general guidance
        const resultType = this.determineResultType(apiData.general || '');
        console.log('Determined result type:', resultType);
        
        // Update indicator
        indicator.className = 'result-indicator ' + resultType;
        
        switch (resultType) {
            case 'positive':
                indicatorIcon.textContent = '✅';
                indicatorText.textContent = 'خير - أقدم';
                break;
            case 'negative':
                indicatorIcon.textContent = '⛔';
                indicatorText.textContent = 'شر - امتنع';
                break;
            default:
                indicatorIcon.textContent = '⚖️';
                indicatorText.textContent = 'تأمل واستشر';
        }
        
        // Set Quran text (aya) - check multiple possible field names
        const ayaText = apiData.aya || apiData.ayaText || apiData.text || apiData.quranText || 'بسم الله الرحمن الرحيم';
        quranText.textContent = ayaText;
        
        // Build interpretation text from all guidance fields
        let fullInterpretation = '';
        
        if (apiData.general) {
            fullInterpretation += `📌 التوجيه العام:\n${apiData.general}`;
        }
        
        if (apiData.economy) {
            if (fullInterpretation) fullInterpretation += '\n\n';
            fullInterpretation += `💰 في الأمور الاقتصادية:\n${apiData.economy}`;
        }
        
        if (apiData.marriage) {
            if (fullInterpretation) fullInterpretation += '\n\n';
            fullInterpretation += `💍 في أمور الزواج:\n${apiData.marriage}`;
        }
        
        interpretationText.textContent = fullInterpretation || 'استشر أهل العلم والخبرة في هذا الأمر';
        
        // Show result section
        resultSection.style.display = 'block';
        resultSection.style.visibility = 'visible';
        resultSection.style.opacity = '1';
        
        console.log('Result section displayed:', resultSection.style.display);
        
        // Scroll to result
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        // Show success toast
        this.showToast('تمت الاستخارة بنجاح! 🤲', 'success');
    }
    
    determineResultType(generalGuidance) {
        // Determine result type from general guidance text
        const text = String(generalGuidance).toLowerCase();
        
        console.log('Analyzing guidance:', text);
        
        // Positive indicators in Arabic
        if (text.includes('جيد') || text.includes('ممتاز') || text.includes('أقدم') || 
            text.includes('موافق') || text.includes('بركة') || text.includes('خير') ||
            text.includes('حسن') || text.includes('افعل')) {
            return 'positive';
        }
        
        // Negative indicators in Arabic
        if (text.includes('سيء') || text.includes('لا تقدم') || text.includes('امتنع') ||
            text.includes('غير موافق') || text.includes('تجنب') || text.includes('احذر')) {
            return 'negative';
        }
        
        // Default to neutral
        return 'neutral';
    }
    
    // ========== LOADING STATES ==========
    showLoading() {
        const loadingSection = document.getElementById('loadingSection');
        const resultSection = document.getElementById('resultSection');
        const submitBtn = document.getElementById('submitBtn');
        
        if (loadingSection) loadingSection.style.display = 'block';
        if (resultSection) resultSection.style.display = 'none';
        if (submitBtn) submitBtn.disabled = true;
    }
    
    hideLoading() {
        const loadingSection = document.getElementById('loadingSection');
        const submitBtn = document.getElementById('submitBtn');
        
        if (loadingSection) loadingSection.style.display = 'none';
        if (submitBtn) submitBtn.disabled = false;
    }
    
    // ========== RENDER HISTORY ==========
    renderHistory() {
        const historyGrid = document.getElementById('historyGrid');
        const emptyHistory = document.getElementById('emptyHistory');
        
        if (!historyGrid) return;
        
        if (this.history.length === 0) {
            historyGrid.style.display = 'none';
            if (emptyHistory) emptyHistory.style.display = 'block';
            return;
        }
        
        historyGrid.style.display = 'grid';
        if (emptyHistory) emptyHistory.style.display = 'none';
        
        historyGrid.innerHTML = '';
        
        this.history.forEach(item => {
            const card = this.createHistoryCard(item);
            historyGrid.appendChild(card);
        });
    }
    
    createHistoryCard(item) {
        const card = document.createElement('div');
        card.className = 'history-item fade-in-up';
        
        const date = new Date(item.date);
        const dateStr = date.toLocaleDateString('ar-SA', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        
        // Determine result type from general guidance
        const generalText = item.general || '';
        let resultClass = 'neutral';
        let resultText = 'تأمل';
        
        if (generalText.includes('جيد') || generalText.includes('أقدم') || generalText.includes('ممتاز')) {
            resultClass = 'positive';
            resultText = 'خير';
        } else if (generalText.includes('سيء') || generalText.includes('احذر') || generalText.includes('امتنع')) {
            resultClass = 'negative';
            resultText = 'شر';
        }
        
        let pageInfo = `صفحة ${item.pageNumber}`;
        if (item.soura) {
            pageInfo += ` - ${item.soura}`;
        }
        
        card.innerHTML = `
            <div class="history-item-header">
                <div class="history-page">${pageInfo}</div>
                <div class="history-result ${resultClass}">${resultText}</div>
            </div>
            ${item.reason ? `<div class="history-reason">${item.reason}</div>` : ''}
            <div class="history-date">${dateStr}</div>
        `;
        
        card.onclick = () => this.viewHistoryItem(item);
        
        return card;
    }
    
    viewHistoryItem(item) {
        // Populate result section with history data
        if (item.soura && item.ayaNumber) {
            document.getElementById('resultPage').textContent = `صفحة ${item.pageNumber} - سورة ${item.soura} - آية ${item.ayaNumber}`;
        } else {
            document.getElementById('resultPage').textContent = `صفحة ${item.pageNumber}`;
        }
        
        if (item.reason) {
            document.getElementById('reasonInfo').style.display = 'flex';
            document.getElementById('resultReason').textContent = item.reason;
        } else {
            document.getElementById('reasonInfo').style.display = 'none';
        }
        
        // Determine result type
        const generalText = item.general || '';
        let resultType = 'neutral';
        
        if (generalText.includes('جيد') || generalText.includes('أقدم') || generalText.includes('ممتاز')) {
            resultType = 'positive';
        } else if (generalText.includes('سيء') || generalText.includes('احذر') || generalText.includes('امتنع')) {
            resultType = 'negative';
        }
        
        const indicator = document.getElementById('resultIndicator');
        const indicatorIcon = document.getElementById('indicatorIcon');
        const indicatorText = document.getElementById('indicatorText');
        
        indicator.className = 'result-indicator ' + resultType;
        
        switch (resultType) {
            case 'positive':
                indicatorIcon.textContent = '✅';
                indicatorText.textContent = 'خير - أقدم';
                break;
            case 'negative':
                indicatorIcon.textContent = '⛔';
                indicatorText.textContent = 'شر - امتنع';
                break;
            default:
                indicatorIcon.textContent = '⚖️';
                indicatorText.textContent = 'تأمل واستشر';
        }
        
        document.getElementById('quranText').textContent = item.quranText;
        
        // Build full interpretation
        let fullInterpretation = '';
        
        if (item.general) {
            fullInterpretation += `📌 التوجيه العام:\n${item.general}\n\n`;
        }
        
        if (item.economy) {
            fullInterpretation += `💰 في الأمور الاقتصادية:\n${item.economy}\n\n`;
        }
        
        if (item.marriage) {
            fullInterpretation += `💍 في أمور الزواج:\n${item.marriage}`;
        }
        
        document.getElementById('interpretationText').textContent = fullInterpretation || 'استشر أهل العلم';
        
        document.getElementById('resultSection').style.display = 'block';
        document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
    }
    
    // ========== EVENT LISTENERS ==========
    setupEventListeners() {
        const form = document.getElementById('istikharaForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
        
        // Page number input validation (only odd numbers)
        const pageInput = document.getElementById('pageNumber');
        if (pageInput) {
            pageInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value);
                if (value && value % 2 === 0) {
                    e.target.setCustomValidity('يجب أن يكون الرقم فردياً');
                } else {
                    e.target.setCustomValidity('');
                }
            });
        }
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
                    window.apiManager.logout();
                }
            });
        }
    }
    
    async handleFormSubmit() {
        console.log('Form submitted!');
        const pageInput = document.getElementById('pageNumber');
        const reasonInput = document.getElementById('istikharaReason');
        
        if (!pageInput) {
            console.error('Page number input not found!');
            this.showToast('خطأ في النموذج - لم يتم العثور على حقل رقم الصفحة', 'error');
            return;
        }
        
        const pageNumber = parseInt(pageInput.value);
        const reason = reasonInput ? reasonInput.value.trim() : '';
        
        console.log('Page number:', pageNumber);
        console.log('Reason:', reason);
        
        if (!pageNumber || pageNumber < 1 || isNaN(pageNumber)) {
            this.showToast('الرجاء إدخال رقم صفحة صحيح', 'error');
            pageInput.focus();
            return;
        }
        
        if (pageNumber % 2 === 0) {
            this.showToast('يجب أن يكون رقم الصفحة فردياً (1، 3، 5...)', 'error');
            pageInput.focus();
            return;
        }
        
        console.log('Calling performIstikhara with:', { pageNumber, reason });
        await this.performIstikhara(pageNumber, reason);
    }
    
    // ========== HELPER FUNCTIONS ==========
    showToast(message, type = 'success') {
        const toast = document.getElementById('istikharaToast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.className = `istikhara-toast show ${type}`;
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// ========== GLOBAL FUNCTIONS ==========
function resetForm() {
    document.getElementById('istikharaForm').reset();
    document.getElementById('resultSection').style.display = 'none';
    
    // Scroll to form
    document.getElementById('istikharaForm').scrollIntoView({ behavior: 'smooth' });
}

function saveIstikhara() {
    const pageNumber = document.getElementById('resultPage').textContent;
    const reason = document.getElementById('resultReason').textContent;
    const quranText = document.getElementById('quranText').textContent;
    const interpretation = document.getElementById('interpretationText').textContent;
    const indicatorText = document.getElementById('indicatorText').textContent;
    
    const text = `استخارة بالقرآن - ${pageNumber}\n\n` +
                 `${reason ? 'السبب: ' + reason + '\n\n' : ''}` +
                 `النتيجة: ${indicatorText}\n\n` +
                 `النص القرآني:\n${quranText}\n\n` +
                 `التوجيهات:\n${interpretation}\n\n` +
                 `التاريخ: ${new Date().toLocaleDateString('ar-SA')}`;
    
    // Create download
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `استخارة-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    
    if (window.istikharaManager) {
        window.istikharaManager.showToast('تم حفظ النتيجة بنجاح', 'success');
    }
}

function shareResult() {
    const pageNumber = document.getElementById('resultPage').textContent;
    const indicatorText = document.getElementById('indicatorText').textContent;
    
    const text = `استخارة بالقرآن الكريم\n${pageNumber}\nالنتيجة: ${indicatorText}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'استخارة بالقرآن',
            text: text
        }).then(() => {
            if (window.istikharaManager) {
                window.istikharaManager.showToast('تمت المشاركة بنجاح', 'success');
            }
        }).catch(() => {
            copyToClipboard(text);
        });
    } else {
        copyToClipboard(text);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            if (window.istikharaManager) {
                window.istikharaManager.showToast('تم نسخ النتيجة للحافظة', 'success');
            }
        });
    } else {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        
        if (window.istikharaManager) {
            window.istikharaManager.showToast('تم نسخ النتيجة', 'success');
        }
    }
}

function clearHistory() {
    if (window.istikharaManager) {
        window.istikharaManager.clearHistory();
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.istikharaManager = new IstikharaManager();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { IstikharaManager };
}

