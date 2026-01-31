# Quick Implementation Guide for User-Specific Data

## What Was Implemented

### ✅ Completed
1. **Session Manager** - Core user session management
2. **Challenges** - User-specific challenges with session isolation
3. **Istikhara** - User-specific istikhara history with session isolation
4. **Authentication** - Login/Register now starts sessions
5. **Logout** - Ends session and clears user data
6. **Achievements** - User-specific achievements tracking

## How to Update Other Modules

### Step-by-Step Template

Choose a module like `duas.js`, `prayer-times.js`, or `settings.js` and follow this pattern:

#### 1. Find all `localStorage.getItem()` calls
```javascript
// OLD
const favorites = localStorage.getItem('favoriteDuas');

// NEW
let favorites;
if (window.sessionManager && window.sessionManager.sessionActive) {
    favorites = window.sessionManager.loadUserData('favoriteDuas', '[]');
} else {
    favorites = localStorage.getItem('favoriteDuas');
}
```

#### 2. Find all `localStorage.setItem()` calls
```javascript
// OLD
localStorage.setItem('favoriteDuas', JSON.stringify(duasArray));

// NEW
if (window.sessionManager && window.sessionManager.sessionActive) {
    window.sessionManager.saveUserData('favoriteDuas', duasArray);
} else {
    localStorage.setItem('favoriteDuas', JSON.stringify(duasArray));
}
```

#### 3. Find all `localStorage.removeItem()` calls
```javascript
// OLD
localStorage.removeItem('favoriteDuas');

// NEW
if (window.sessionManager && window.sessionManager.sessionActive) {
    window.sessionManager.removeUserData('favoriteDuas');
} else {
    localStorage.removeItem('favoriteDuas');
}
```

## Files Already Updated

### 1. `public/js/session-manager.js` ✅ NEW FILE
   - Core session management system
   - 400+ lines of documented code

### 2. `public/js/auth.js` ✅ UPDATED
   - Lines 74-82: Login now calls `sessionManager.startSession()`
   - Lines 141-149: Register now calls `sessionManager.startSession()`

### 3. `public/js/user-navigation.js` ✅ UPDATED
   - Lines 218-224: Logout now calls `sessionManager.endSession()`

### 4. `public/js/challenges.js` ✅ UPDATED
   - Lines 265-281: Load/save challenges uses session manager
   - Lines 588-597: Challenge completions use session manager
   - Lines 620-626: isChallengeCompletedForDate uses session manager
   - Lines 1504-1512: Achievements use session manager
   - Lines 1527-1541: checkAchievements uses session manager

### 5. `public/js/istikhara.js` ✅ UPDATED
   - Lines 48-65: Load/save history uses session manager

### 6. `resources/views/layouts/app.blade.php` ✅ UPDATED
   - Added session-manager.js script include before api.js

## Files Needing Updates (Priority Order)

### HIGH PRIORITY (Core Features)
1. **`public/js/duas.js`**
   - Search: `localStorage.getItem('favoriteDuas')`
   - Search: `localStorage.setItem('favoriteDuas'`

2. **`public/js/prayer-times.js`**
   - Search: `localStorage` (prayer adjustments, hijri date)
   - Search: `localStorage.getItem('prayerTimeAdjustments'`
   - Search: `localStorage.getItem('hijriDateAdjustment'`

3. **`public/js/khirah.js`** (Khirah Entries)
   - Search: `localStorage` (khirah entries, goals)
   - Complete CRUD for user-specific entries

4. **`public/js/settings.js`**
   - Search: `localStorage` (user preferences)
   - Settings should be per-user

### MEDIUM PRIORITY (Enhancement)
5. **`public/js/quran.js`**
   - Already has some user-specific data
   - Verify session manager integration

6. **`public/js/posts.js`**
   - Search: `localStorage` (saved posts)
   - Needs user-specific isolation

### LOW PRIORITY (Verification)
7. **`public/js/hjri-calendar.js`**
   - Check event storage
   - Verify user-specific events

## Testing Checklist

### Before Updates
- [ ] Create test user account 1 (User A)
- [ ] Create test user account 2 (User B)
- [ ] Document initial state

### After Each Module Update
- [ ] User A logs in → Create data → Verify stored as `user_A_*`
- [ ] User A logs out
- [ ] User B logs in → Verify NO data from User A → Create own data
- [ ] User B logs out
- [ ] User A logs back in → Verify original data still there
- [ ] Check browser console for `[SessionManager]` logs

### Full Integration Test
```javascript
// Open DevTools Console

// 1. Check session info
console.log(sessionManager.getSessionInfo())

// 2. Export user data
const backup = sessionManager.exportUserData()
console.log(backup)

// 3. Check all localStorage keys
for (let i = 0; i < localStorage.length; i++) {
    console.log(localStorage.key(i))
}

// 4. Verify user-specific keys exist
// Should see: user_X_challenges, user_X_istikhara, etc.
```

## Code Examples

### Module: Duas (Favorite Duas)

```javascript
class DuasManager {
    constructor() {
        this.favorites = this.loadFavorites();
    }
    
    // NEW PATTERN - Load with session support
    loadFavorites() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            const favorites = window.sessionManager.loadUserData('favoriteDuas', []);
            console.log(`[Duas] Loaded favorites from session:`, favorites);
            return favorites;
        } else {
            const favorites = localStorage.getItem('favoriteDuas');
            return favorites ? JSON.parse(favorites) : [];
        }
    }
    
    // NEW PATTERN - Save with session support
    saveFavorites() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            window.sessionManager.saveUserData('favoriteDuas', this.favorites);
            console.log(`[Duas] Saved favorites to session`);
        } else {
            localStorage.setItem('favoriteDuas', JSON.stringify(this.favorites));
        }
    }
    
    // NEW PATTERN - Toggle favorite
    toggleFavorite(duaId) {
        const index = this.favorites.indexOf(duaId);
        if (index === -1) {
            this.favorites.push(duaId);
        } else {
            this.favorites.splice(index, 1);
        }
        this.saveFavorites();
        this.render();
    }
}
```

### Module: Settings (Prayer Adjustments)

```javascript
class SettingsManager {
    constructor() {
        this.adjustments = this.loadAdjustments();
    }
    
    loadAdjustments() {
        if (window.sessionManager && window.sessionManager.sessionActive) {
            const saved = window.sessionManager.loadUserData('prayerAdjustments', {});
            console.log(`[Settings] Loaded adjustments from session`);
            return saved;
        } else {
            const saved = localStorage.getItem('prayerAdjustments');
            return saved ? JSON.parse(saved) : {};
        }
    }
    
    saveAdjustment(prayerName, minutes) {
        this.adjustments[prayerName] = minutes;
        
        if (window.sessionManager && window.sessionManager.sessionActive) {
            window.sessionManager.saveUserData('prayerAdjustments', this.adjustments);
        } else {
            localStorage.setItem('prayerAdjustments', JSON.stringify(this.adjustments));
        }
    }
}
```

## Session Manager Public API Summary

```javascript
// Start session (called by auth.js automatically)
sessionManager.startSession(user)

// End session (called by logout automatically)
sessionManager.endSession()

// Save user data
sessionManager.saveUserData('dataType', data)

// Load user data
sessionManager.loadUserData('dataType', defaultValue)

// Remove user data
sessionManager.removeUserData('dataType')

// Check if data exists
sessionManager.hasUserData('dataType')

// Get session info
sessionManager.getSessionInfo()

// Listen to events
sessionManager.on('sessionStart', callback)
sessionManager.on('sessionEnd', callback)
sessionManager.on('dataUpdated', callback)

// Export/Import backup
sessionManager.exportUserData()
sessionManager.importUserData(backup)
```

## Debugging Tips

### Check if Session Manager is Available
```javascript
console.log(window.sessionManager)
// Should show SessionManager class instance
```

### Check if Session is Active
```javascript
console.log(sessionManager.sessionActive)
// Should be true if user is logged in
```

### Check Current User ID
```javascript
console.log(sessionManager.currentUserId)
// Should show numeric user ID
```

### View All User Data
```javascript
console.log(sessionManager.getUserDataKeys())
// Shows all data types for current user
```

### Export Complete User Data
```javascript
const backup = sessionManager.exportUserData()
console.table(backup)
// Shows all data in table format
```

## Notes

- ✅ **Backward Compatible**: Code falls back to localStorage if session manager unavailable
- ✅ **No Breaking Changes**: Existing functionality preserved
- ✅ **Automatic Cleanup**: Old data automatically cleared on new session
- ✅ **Multi-User Ready**: Supports multiple users on same browser
- ✅ **Easy to Debug**: Console logging shows all session operations

## Next Steps

1. Update remaining modules following the template
2. Test with multiple user accounts
3. Verify data isolation
4. Monitor browser console for session logs
5. Consider server-side persistence for data backup

---

**Questions?** Check `USER_SESSION_SYSTEM.md` for detailed documentation.
