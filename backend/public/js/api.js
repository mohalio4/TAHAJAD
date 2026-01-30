/* ====================================
   API MANAGER
   Handles all API communications with Laravel backend
   ==================================== */

class APIManager {
    constructor() {
        // Base API URL - Laravel backend
        this.baseURL = 'http://localhost:8000/api';
        
        // API endpoints
        this.endpoints = {
            // Auth endpoints
            login: '/auth/login',
            register: '/auth/register',
            logout: '/auth/logout',
            resetPassword: '/auth/reset-password',
            verifyEmail: '/auth/verify-email',
            
            // User endpoints
            getUserProfile: '/user/profile',
            updateUserProfile: '/user/profile/update',
            changePassword: '/user/password/change',
            
            // Prayer times endpoints
            getPrayerTimes: '/prayer-times',
            logPrayer: '/prayer-times/log',
            getPrayerStats: '/prayer-times/stats',
            
            // Duas endpoints
            getDuas: '/duas',
            getDuaById: '/duas/:id',
            favoriteDua: '/duas/:id/favorite',
            searchDuas: '/duas/search',
            
            // Challenges endpoints
            getChallenges: '/challenges',
            getChallengeById: '/challenges/:id',
            updateChallengeProgress: '/challenges/:id/progress',
            completeChallengeDay: '/challenges/:id/complete',
            
            // Hijri calendar endpoints
            getHijriDate: '/hijri-calendar/current',
            getHijriMonth: '/hijri-calendar/month',
            getSpecialDays: '/hijri-calendar/special-days',
            
            // Translation endpoints
            translateText: '/translate/text',
            
            // Posts endpoints
            getPosts: '/posts',
            getPostById: '/posts/:id',
            createPost: '/posts',
            updatePost: '/posts/:id',
            deletePost: '/posts/:id',
            toggleSavePost: '/posts/:id/toggle-save',
            getSavedPosts: '/posts/saved',
            
            // Khirah (good deeds) endpoints
            getKhirahEntries: '/khirah',
            addKhirahEntry: '/khirah/add',
            deleteKhirahEntry: '/khirah/:id',
            getKhirahStats: '/khirah/stats',
            
            // Late prayers (Qada) endpoints
            getLatePrayers: '/late-prayers',
            createLatePrayer: '/late-prayers',
            updateLatePrayer: '/late-prayers/:id',
            deleteLatePrayer: '/late-prayers/:id',
            incrementLatePrayer: '/late-prayers/:id/increment',
            
            // Admin endpoints
            getAdminContent: '/admin/content',
            createContent: '/admin/content/create',
            updateContent: '/admin/content/:id',
            deleteContent: '/admin/content/:id',
            
            // Super Admin endpoints
            getAdmins: '/super-admin/admins',
            createAdmin: '/super-admin/admins/create',
            deleteAdmin: '/super-admin/admins/:id'
        };
    }
    
    // ========== HELPER METHODS ==========
    
    getAuthToken() {
        return localStorage.getItem('authToken');
    }
    
    getUserId() {
        const userData = localStorage.getItem('userData');
        if (userData) {
            try {
                const user = JSON.parse(userData);
                return user.id;
            } catch (e) {
                return null;
            }
        }
        return null;
    }
    
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (includeAuth) {
            const token = this.getAuthToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }
    
    // Get user-specific localStorage key
    getUserKey(key) {
        const userId = this.getUserId();
        if (!userId) return key;
        return `user_${userId}_${key}`;
    }
    
    // User-specific data storage methods
    getUserData(key, defaultValue = null) {
        const userKey = this.getUserKey(key);
        const data = localStorage.getItem(userKey);
        if (!data) return defaultValue;
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }
    
    setUserData(key, value) {
        const userKey = this.getUserKey(key);
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(userKey, stringValue);
    }
    
    removeUserData(key) {
        const userKey = this.getUserKey(key);
        localStorage.removeItem(userKey);
    }
    
    // Clear all user-specific data on logout
    clearUserData() {
        const userId = this.getUserId();
        if (!userId) return;
        
        const keysToRemove = [];
        const prefix = `user_${userId}_`;
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith(prefix)) {
                keysToRemove.push(key);
            }
        }
        
        // Note: We don't actually remove user data, just clear auth
        // User data stays cached for when they log back in
    }
    
    async request(endpoint, method = 'GET', data = null, includeAuth = true) {
        const url = `${this.baseURL}${endpoint}`;
        
        const options = {
            method,
            headers: this.getHeaders(includeAuth),
        };
        
        if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            
            // Handle 401 Unauthorized
            if (response.status === 401) {
                this.handleUnauthorized();
                throw new Error('جلسة العمل منتهية. الرجاء تسجيل الدخول مرة أخرى');
            }
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'حدث خطأ في الاتصال بالخادم');
            }
            
            return result;
        } catch (error) {
            console.error('API Error:', error);
            
            // Handle network errors
            if (error.message === 'Failed to fetch') {
                throw new Error('فشل الاتصال بالخادم. الرجاء التحقق من الاتصال بالإنترنت');
            }
            
            throw error;
        }
    }
    
    handleUnauthorized() {
        // Clear stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('login_page.html')) {
            window.location.href = 'login_page.html';
        }
    }
    
    // ========== AUTHENTICATION API ==========
    
    async login(email, password, rememberMe = false) {
        // For development/demo, simulate API response
        if (this.isDevelopmentMode()) {
            return this.mockLogin(email, password);
        }
        
        return await this.request(this.endpoints.login, 'POST', {
            email,
            password,
            remember_me: rememberMe
        }, false);
    }
    
    async register(userData) {
        // For development/demo, simulate API response
        if (this.isDevelopmentMode()) {
            return this.mockRegister(userData);
        }
        
        return await this.request(this.endpoints.register, 'POST', userData, false);
    }
    
    async logout() {
        try {
            await this.request(this.endpoints.logout, 'POST');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear local data regardless
            localStorage.removeItem('authToken');
            localStorage.removeItem('userData');
            window.location.href = 'login_page.html';
        }
    }
    
    async resetPassword(email) {
        // For development/demo
        if (this.isDevelopmentMode()) {
            return this.mockResetPassword(email);
        }
        
        return await this.request(this.endpoints.resetPassword, 'POST', { email }, false);
    }
    
    // ========== USER API ==========
    
    async getUserProfile() {
        return await this.request(this.endpoints.getUserProfile);
    }
    
    async updateUserProfile(userData) {
        return await this.request(this.endpoints.updateUserProfile, 'PUT', userData);
    }
    
    async changePassword(currentPassword, newPassword) {
        return await this.request(this.endpoints.changePassword, 'POST', {
            current_password: currentPassword,
            new_password: newPassword
        });
    }
    
    // ========== PRAYER TIMES API ==========
    
    async getPrayerTimes(location, date = null) {
        const params = new URLSearchParams({ location });
        if (date) params.append('date', date);
        
        return await this.request(`${this.endpoints.getPrayerTimes}?${params}`);
    }
    
    async logPrayer(prayerName, date = null) {
        return await this.request(this.endpoints.logPrayer, 'POST', {
            prayer_name: prayerName,
            date: date || new Date().toISOString()
        });
    }
    
    async getPrayerStats(period = 'week') {
        return await this.request(`${this.endpoints.getPrayerStats}?period=${period}`);
    }
    
    // ========== DUAS API ==========
    
    async getDuas(category = null, page = 1) {
        const params = new URLSearchParams({ page });
        if (category) params.append('category', category);
        
        return await this.request(`${this.endpoints.getDuas}?${params}`);
    }
    
    async getDuaById(id) {
        return await this.request(this.endpoints.getDuaById.replace(':id', id));
    }
    
    async favoriteDua(id) {
        return await this.request(
            this.endpoints.favoriteDua.replace(':id', id),
            'POST'
        );
    }
    
    async searchDuas(query) {
        return await this.request(
            `${this.endpoints.searchDuas}?q=${encodeURIComponent(query)}`
        );
    }
    
    // ========== CHALLENGES API ==========
    
    async getChallenges() {
        return await this.request(this.endpoints.getChallenges);
    }
    
    async getChallengeById(id) {
        return await this.request(this.endpoints.getChallengeById.replace(':id', id));
    }
    
    async updateChallengeProgress(id, progress) {
        return await this.request(
            this.endpoints.updateChallengeProgress.replace(':id', id),
            'POST',
            { progress }
        );
    }
    
    async completeChallengeDay(id, day) {
        return await this.request(
            this.endpoints.completeChallengeDay.replace(':id', id),
            'POST',
            { day, completed_at: new Date().toISOString() }
        );
    }
    
    // ========== HIJRI CALENDAR API ==========
    
    async getHijriDate() {
        return await this.request(this.endpoints.getHijriDate);
    }
    
    async getHijriMonth(year, month) {
        return await this.request(
            `${this.endpoints.getHijriMonth}?year=${year}&month=${month}`
        );
    }
    
    async getSpecialDays() {
        return await this.request(this.endpoints.getSpecialDays);
    }
    
    // ========== TRANSLATION API ==========
    
    async translateText(text, targetLang = 'en') {
        // For development/demo, provide a simple mock translation
        if (this.isDevelopmentMode()) {
            return this.mockTranslateText(text, targetLang);
        }
        
        return await this.request(
            this.endpoints.translateText,
            'POST',
            { text, target_lang: targetLang }
        );
    }
    
    // ========== POSTS API ==========
    
    async getPosts(params = {}) {
        const searchParams = new URLSearchParams();
        if (params.search) searchParams.append('q', params.search);
        if (params.filter) searchParams.append('filter', params.filter);
        if (params.page) searchParams.append('page', params.page);
        
        const query = searchParams.toString();
        const endpoint = query ? `${this.endpoints.getPosts}?${query}` : this.endpoints.getPosts;
        return await this.request(endpoint);
    }
    
    async getPostById(id) {
        return await this.request(this.endpoints.getPostById.replace(':id', id));
    }
    
    async createPost(postData) {
        return await this.request(this.endpoints.createPost, 'POST', postData);
    }
    
    async updatePost(id, postData) {
        return await this.request(
            this.endpoints.updatePost.replace(':id', id),
            'PUT',
            postData
        );
    }
    
    async deletePost(id) {
        return await this.request(
            this.endpoints.deletePost.replace(':id', id),
            'DELETE'
        );
    }
    
    async toggleSavePost(id) {
        return await this.request(
            this.endpoints.toggleSavePost.replace(':id', id),
            'POST'
        );
    }
    
    async getSavedPosts() {
        return await this.request(this.endpoints.getSavedPosts);
    }
    
    // ========== LATE PRAYERS (QADA) API ==========
    
    async getLatePrayers() {
        return await this.request(this.endpoints.getLatePrayers);
    }
    
    async createLatePrayer(task) {
        return await this.request(this.endpoints.createLatePrayer, 'POST', task);
    }
    
    async updateLatePrayer(id, task) {
        return await this.request(
            this.endpoints.updateLatePrayer.replace(':id', id),
            'PUT',
            task
        );
    }
    
    async deleteLatePrayer(id) {
        return await this.request(
            this.endpoints.deleteLatePrayer.replace(':id', id),
            'DELETE'
        );
    }
    
    async incrementLatePrayer(id) {
        return await this.request(
            this.endpoints.incrementLatePrayer.replace(':id', id),
            'POST'
        );
    }
    
    // ========== KHIRAH API ==========
    
    async getKhirahEntries(page = 1) {
        return await this.request(`${this.endpoints.getKhirahEntries}?page=${page}`);
    }
    
    async addKhirahEntry(entry) {
        return await this.request(this.endpoints.addKhirahEntry, 'POST', entry);
    }
    
    async deleteKhirahEntry(id) {
        return await this.request(
            this.endpoints.deleteKhirahEntry.replace(':id', id),
            'DELETE'
        );
    }
    
    async getKhirahStats() {
        return await this.request(this.endpoints.getKhirahStats);
    }
    
    // ========== ADMIN API ==========
    
    async getAdminContent() {
        return await this.request(this.endpoints.getAdminContent);
    }
    
    async createContent(content) {
        return await this.request(this.endpoints.createContent, 'POST', content);
    }
    
    async updateContent(id, content) {
        return await this.request(
            this.endpoints.updateContent.replace(':id', id),
            'PUT',
            content
        );
    }
    
    async deleteContent(id) {
        return await this.request(
            this.endpoints.deleteContent.replace(':id', id),
            'DELETE'
        );
    }
    
    // ========== SUPER ADMIN API ==========
    
    async getAdmins() {
        return await this.request(this.endpoints.getAdmins);
    }
    
    async createAdmin(adminData) {
        return await this.request(this.endpoints.createAdmin, 'POST', adminData);
    }
    
    async deleteAdmin(id) {
        return await this.request(
            this.endpoints.deleteAdmin.replace(':id', id),
            'DELETE'
        );
    }
    
    // ========== DEVELOPMENT MODE HELPERS ==========
    
    isDevelopmentMode() {
        // Check if backend is not available (for demo purposes)
        return window.location.hostname === 'localhost' || 
               window.location.hostname === '127.0.0.1' ||
               !navigator.onLine;
    }
    
    // Mock API responses for development/testing
    mockLogin(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    token: 'mock_token_' + Date.now(),
                    user: {
                        id: 1,
                        name: 'مستخدم تجريبي',
                        email: email,
                        location: 'beirut',
                        created_at: new Date().toISOString()
                    }
                });
            }, 1000);
        });
    }
    
    mockRegister(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    token: 'mock_token_' + Date.now(),
                    user: {
                        id: Math.floor(Math.random() * 1000),
                        name: userData.fullName,
                        email: userData.email,
                        phone: userData.phone,
                        location: userData.location,
                        preferences: userData.preferences,
                        created_at: new Date().toISOString()
                    }
                });
            }, 1500);
        });
    }
    
    mockTranslateText(text, targetLang) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    translation: `[${targetLang.toUpperCase()} demo translation] This is a placeholder translation. Backend will provide real translation later.\n\n` + text
                });
            }, 800);
        });
    }
    
    mockResetPassword(email) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'تم إرسال رابط استعادة كلمة المرور'
                });
            }, 1000);
        });
    }
}

// ========== OFFLINE DETECTION ==========
class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.initListeners();
    }
    
    initListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showConnectionStatus('تم استعادة الاتصال بالإنترنت', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showConnectionStatus('لا يوجد اتصال بالإنترنت', 'error');
        });
    }
    
    showConnectionStatus(message, type) {
        const toast = document.getElementById('authToast');
        if (toast) {
            toast.textContent = message;
            toast.className = `auth-toast ${type} show`;
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

// ========== REQUEST QUEUE FOR OFFLINE MODE ==========
class RequestQueue {
    constructor() {
        this.queue = this.loadQueue();
    }
    
    loadQueue() {
        const stored = localStorage.getItem('apiQueue');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveQueue() {
        localStorage.setItem('apiQueue', JSON.stringify(this.queue));
    }
    
    add(request) {
        this.queue.push({
            ...request,
            timestamp: Date.now()
        });
        this.saveQueue();
    }
    
    async processQueue() {
        if (!navigator.onLine || this.queue.length === 0) return;
        
        const request = this.queue[0];
        
        try {
            await window.apiManager.request(
                request.endpoint,
                request.method,
                request.data
            );
            
            // Remove from queue on success
            this.queue.shift();
            this.saveQueue();
            
            // Process next item
            if (this.queue.length > 0) {
                await this.processQueue();
            }
        } catch (error) {
            console.error('Failed to process queued request:', error);
        }
    }
    
    clear() {
        this.queue = [];
        this.saveQueue();
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    window.apiManager = new APIManager();
    window.offlineManager = new OfflineManager();
    window.requestQueue = new RequestQueue();
    
    // Process any queued requests
    if (navigator.onLine) {
        window.requestQueue.processQueue();
    }
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { APIManager, OfflineManager, RequestQueue };
}