/* ====================================
   SESSION MANAGER
   Handles user-specific session data isolation
   ==================================== */

class SessionManager {
    constructor() {
        this.currentUserId = null;
        this.sessionActive = false;
        this.globalKeys = ['authToken', 'userData', 'theme', 'language', 'appSettings'];
        this.scopedPrefixes = ['user_', 'guest_', 'temp_'];
        this.storagePatched = false;
        this.initialize();
    }
    
    /**
     * Initialize session manager on page load
     */
    initialize() {
        this.patchLocalStorage();
        this.checkActiveSession();
        this.setupSessionListeners();
    }
    
    /**
     * Check if there's an active session
     */
    checkActiveSession() {
        const authToken = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (authToken && userData) {
            try {
                const user = JSON.parse(userData);
                this.currentUserId = user.id;
                this.sessionActive = true;
                console.log(`[SessionManager] Session active for user: ${user.name} (ID: ${this.currentUserId})`);
                this.migrateUnscopedKeysToUser();
            } catch (e) {
                console.error('[SessionManager] Error parsing user data:', e);
                this.endSession();
            }
        } else {
            this.sessionActive = false;
            this.currentUserId = null;
        }
    }
    
    /**
     * Start a new session for a user (called after login/register)
     */
    startSession(user) {
        this.currentUserId = user.id;
        this.sessionActive = true;
        
        // Clear only guest/temporary data (preserve user data)
        this.clearSessionData();

        // Move any legacy unscoped data to this user
        this.migrateUnscopedKeysToUser();
        
        console.log(`[SessionManager] New session started for: ${user.name} (ID: ${this.currentUserId})`);
        
        // Trigger session start event
        this.dispatchEvent('sessionStart', { user });
    }
    
    /**
     * End current session (called on logout)
     */
    endSession() {
        console.log(`[SessionManager] Session ended for user ID: ${this.currentUserId}`);
        
        this.dispatchEvent('sessionEnd', { userId: this.currentUserId });
        
        // Do not clear user data on logout to preserve progress
        
        this.currentUserId = null;
        this.sessionActive = false;
    }
    
    /**
     * Clear all user-specific session data from localStorage
     */
    clearSessionData() {
        const keysToRemove = [];
        
        // Iterate through all localStorage keys and remove user-specific data
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            
            // Keep these global keys
            if (!key || this.globalKeys.includes(key)) {
                continue;
            }

            // Preserve all user data (user_*), and only clear guest/temp data
            if (key.startsWith('user_')) {
                continue;
            }

            if (key.startsWith('guest_') || key.startsWith('temp_')) {
                keysToRemove.push(key);
            }
        }
        
        // Remove all user-specific keys
        keysToRemove.forEach(key => {
            console.log(`[SessionManager] Clearing: ${key}`);
            localStorage.removeItem(key);
        });
    }

    /**
     * Determine if a key should be scoped to the active user
     */
    shouldScopeKey(key) {
        if (!this.sessionActive || !this.currentUserId || !key) return false;
        if (this.globalKeys.includes(key)) return false;
        return !this.scopedPrefixes.some(prefix => key.startsWith(prefix));
    }

    /**
     * Get scoped storage key for active user
     */
    getScopedKey(key) {
        return `user_${this.currentUserId}_${key}`;
    }

    /**
     * Migrate legacy unscoped keys into scoped user keys
     */
    migrateUnscopedKeysToUser() {
        if (!this.sessionActive || !this.currentUserId) return;

        const keysToMigrate = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key) continue;
            if (this.globalKeys.includes(key)) continue;
            if (this.scopedPrefixes.some(prefix => key.startsWith(prefix))) continue;
            keysToMigrate.push(key);
        }

        keysToMigrate.forEach(key => {
            const scopedKey = this.getScopedKey(key);
            if (localStorage.getItem(scopedKey) === null) {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    localStorage.setItem(scopedKey, value);
                }
            }
            localStorage.removeItem(key);
        });
    }

    /**
     * Patch localStorage to auto-scope user data keys
     */
    patchLocalStorage() {
        if (this.storagePatched || localStorage.__sessionScoped) return;

        const rawGet = localStorage.getItem.bind(localStorage);
        const rawSet = localStorage.setItem.bind(localStorage);
        const rawRemove = localStorage.removeItem.bind(localStorage);

        const manager = this;

        localStorage.getItem = function (key) {
            if (manager.shouldScopeKey(key)) {
                const scopedKey = manager.getScopedKey(key);
                let value = rawGet(scopedKey);
                if (value === null) {
                    const legacy = rawGet(key);
                    if (legacy !== null) {
                        rawSet(scopedKey, legacy);
                        rawRemove(key);
                        value = legacy;
                    }
                }
                return value;
            }
            return rawGet(key);
        };

        localStorage.setItem = function (key, value) {
            if (manager.shouldScopeKey(key)) {
                const scopedKey = manager.getScopedKey(key);
                rawSet(scopedKey, value);
                rawRemove(key);
                return;
            }
            rawSet(key, value);
        };

        localStorage.removeItem = function (key) {
            if (manager.shouldScopeKey(key)) {
                const scopedKey = manager.getScopedKey(key);
                rawRemove(scopedKey);
                return;
            }
            rawRemove(key);
        };

        localStorage.__sessionScoped = true;
        this.storagePatched = true;
    }
    
    /**
     * Get user-specific key for localStorage
     * Ensures data isolation between users
     */
    getUserKey(dataType) {
        if (!this.currentUserId) {
            console.warn('[SessionManager] No active session. Using guest key.');
            return `guest_${dataType}`;
        }
        return `user_${this.currentUserId}_${dataType}`;
    }
    
    /**
     * Save user-specific data
     */
    saveUserData(dataType, data) {
        if (!this.sessionActive) {
            console.warn('[SessionManager] No active session. Data not saved.');
            return false;
        }
        
        const key = this.getUserKey(dataType);
        const stringValue = typeof data === 'string' ? data : JSON.stringify(data);
        localStorage.setItem(key, stringValue);
        console.log(`[SessionManager] Saved ${dataType} for user ${this.currentUserId}`);
        
        this.dispatchEvent('dataUpdated', { dataType, userId: this.currentUserId });
        return true;
    }
    
    /**
     * Load user-specific data
     */
    loadUserData(dataType, defaultValue = null) {
        const key = this.getUserKey(dataType);
        const data = localStorage.getItem(key);
        
        if (!data) {
            return defaultValue;
        }
        
        try {
            return JSON.parse(data);
        } catch (e) {
            // If not JSON, return as string
            return data;
        }
    }
    
    /**
     * Remove user-specific data
     */
    removeUserData(dataType) {
        if (!this.sessionActive) {
            console.warn('[SessionManager] No active session. Data not removed.');
            return false;
        }
        
        const key = this.getUserKey(dataType);
        localStorage.removeItem(key);
        console.log(`[SessionManager] Removed ${dataType} for user ${this.currentUserId}`);
        return true;
    }
    
    /**
     * Check if user has specific data
     */
    hasUserData(dataType) {
        const key = this.getUserKey(dataType);
        return localStorage.getItem(key) !== null;
    }
    
    /**
     * Get all user-specific data keys
     */
    getUserDataKeys() {
        if (!this.currentUserId) return [];
        
        const prefix = `user_${this.currentUserId}_`;
        const keys = [];
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(prefix)) {
                keys.push(key.replace(prefix, ''));
            }
        }
        
        return keys;
    }
    
    /**
     * Export all user data (for backup)
     */
    exportUserData() {
        if (!this.sessionActive) {
            console.warn('[SessionManager] No active session. Cannot export data.');
            return null;
        }
        
        const userData = {
            userId: this.currentUserId,
            exportDate: new Date().toISOString(),
            data: {}
        };
        
        const keys = this.getUserDataKeys();
        keys.forEach(key => {
            userData.data[key] = this.loadUserData(key);
        });
        
        return userData;
    }
    
    /**
     * Import user data (for restore)
     */
    importUserData(exportedData) {
        if (!this.sessionActive) {
            console.warn('[SessionManager] No active session. Cannot import data.');
            return false;
        }
        
        if (exportedData.userId !== this.currentUserId) {
            console.warn('[SessionManager] User ID mismatch. Cannot import data.');
            return false;
        }
        
        for (const [key, value] of Object.entries(exportedData.data)) {
            this.saveUserData(key, value);
        }
        
        console.log('[SessionManager] User data imported successfully');
        this.dispatchEvent('dataImported', { userId: this.currentUserId });
        return true;
    }
    
    /**
     * Setup event listeners for session changes
     */
    setupSessionListeners() {
        // Listen for storage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'authToken' || e.key === 'userData') {
                this.checkActiveSession();
                if (!this.sessionActive) {
                    console.log('[SessionManager] Session changed in another tab. Refreshing...');
                    window.location.reload();
                }
            }
        });
    }
    
    /**
     * Dispatch custom events
     */
    dispatchEvent(eventName, detail) {
        const event = new CustomEvent(`session:${eventName}`, { detail });
        window.dispatchEvent(event);
    }
    
    /**
     * Listen to session events
     */
    on(eventName, callback) {
        window.addEventListener(`session:${eventName}`, (e) => {
            callback(e.detail);
        });
    }
    
    /**
     * Get session info
     */
    getSessionInfo() {
        return {
            active: this.sessionActive,
            userId: this.currentUserId,
            dataKeys: this.getUserDataKeys(),
            dataCount: this.getUserDataKeys().length
        };
    }
}

// Create global session manager instance and attach to window
window.sessionManager = new SessionManager();
