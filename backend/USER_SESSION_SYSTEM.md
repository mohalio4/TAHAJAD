# User-Specific Data Isolation System

## Overview
This system ensures that each user has a completely isolated session with their own data. When a user logs in or registers, they get a fresh session with empty data that cannot be accessed by other users.

## Architecture

### Components

1. **Session Manager** (`session-manager.js`)
   - Manages user sessions and data isolation
   - Tracks active user ID and session status
   - Provides user-specific localStorage key generation
   - Handles data import/export for backup

2. **Auth Manager** (`auth.js`)
   - Integrates with Session Manager on login/register
   - Calls `sessionManager.startSession()` after successful login
   - Properly clears session on logout

3. **Data Managers** (Challenges, Istikhara, etc.)
   - Updated to use Session Manager for all user-specific data
   - Fallback to localStorage for backward compatibility
   - Automatic data isolation based on user ID

## How It Works

### Session Lifecycle

```
User Not Logged In
        ↓
   [Login/Register]
        ↓
localStorage stores authToken & userData
        ↓
sessionManager.startSession(user)
        ↓
clearSessionData() - removes old user data
        ↓
Session Active - User has empty, isolated data
        ↓
   All subsequent saves use user_{userId}_dataType keys
```

### Data Storage Pattern

**Before (Shared):**
```
localStorage {
  "userChallenges": [...],
  "istikharaHistory": [...]
}
```

**After (User-Specific):**
```
localStorage {
  "user_1_challenges": [...],
  "user_1_istikharaHistory": [...],
  "user_2_challenges": [...],
  "user_2_istikharaHistory": [...]
}
```

## API

### SessionManager Methods

#### Core Methods

```javascript
// Initialize session
sessionManager.startSession(user)
// Starts a new session for a user, clears old data

sessionManager.endSession()
// Ends current session, clears user data

sessionManager.clearSessionData()
// Removes all user-specific data from localStorage

sessionManager.checkActiveSession()
// Verifies if there's an active session
```

#### Data Operations

```javascript
// Save user-specific data
sessionManager.saveUserData('challenges', challengesArray)

// Load user-specific data
const challenges = sessionManager.loadUserData('challenges', [])

// Remove specific user data
sessionManager.removeUserData('challenges')

// Check if user has data
const hasData = sessionManager.hasUserData('challenges')

// Get all user data keys
const keys = sessionManager.getUserDataKeys()
```

#### Backup/Restore

```javascript
// Export all user data
const backup = sessionManager.exportUserData()
// Returns: { userId, exportDate, data: {...} }

// Import user data from backup
sessionManager.importUserData(backup)
```

#### Info & Events

```javascript
// Get session information
const info = sessionManager.getSessionInfo()
// Returns: { active, userId, dataKeys, dataCount }

// Listen to session events
sessionManager.on('sessionStart', (detail) => {
  console.log('Session started for user:', detail.user)
})

sessionManager.on('sessionEnd', (detail) => {
  console.log('Session ended for user:', detail.userId)
})

sessionManager.on('dataUpdated', (detail) => {
  console.log('Data updated:', detail.dataType)
})
```

## Implementation Guide

### Updating a Data Manager

```javascript
// OLD CODE:
loadChallenges() {
  const stored = localStorage.getItem('userChallenges');
  return stored ? JSON.parse(stored) : [];
}

saveChallenges() {
  localStorage.setItem('userChallenges', JSON.stringify(this.challenges));
}

// NEW CODE:
loadChallenges() {
  if (window.sessionManager && window.sessionManager.sessionActive) {
    const stored = window.sessionManager.loadUserData('challenges', []);
    console.log(`[Manager] Loaded from session:`, stored);
    return stored;
  } else {
    // Fallback for backward compatibility
    const stored = localStorage.getItem('userChallenges');
    return stored ? JSON.parse(stored) : [];
  }
}

saveChallenges() {
  if (window.sessionManager && window.sessionManager.sessionActive) {
    window.sessionManager.saveUserData('challenges', this.challenges);
    console.log(`[Manager] Saved to session`);
  } else {
    localStorage.setItem('userChallenges', JSON.stringify(this.challenges));
  }
}
```

## Updated Features

### 1. Challenges
- ✅ User-specific challenges created per session
- ✅ Challenge completions isolated by user
- ✅ Achievements tracked per user
- ✅ Fresh empty data on new login

### 2. Istikhara (Seeking Guidance)
- ✅ User-specific istikhara history
- ✅ Results isolated by user
- ✅ Search history per user

### 3. Quran (Previously Implemented)
- ✅ Saved pages per user
- ✅ Reading progress per user
- ✅ Bookmarks per user

### 4. Data to be Updated

**Immediate Priority:**
- [ ] Late Prayers tracking
- [ ] Prayer logs
- [ ] Duas (favorites)
- [ ] Settings (User preferences)
- [ ] Khirah entries (Daily deeds)

**Implementation Pattern:**
1. Replace `localStorage.getItem()` with `sessionManager.loadUserData()`
2. Replace `localStorage.setItem()` with `sessionManager.saveUserData()`
3. Add fallback for backward compatibility
4. Test with multiple user accounts

## Testing User Isolation

### Test Scenario 1: Multiple Users Same Browser

```javascript
// User 1 logs in
// Creates challenge: "Quran Reading"
// Completes 5 days
// sessionManager shows: user_1_challenges

// User 1 logs out
// User 2 logs in
// sessionManager shows: NO challenges (empty)
// sessionManager shows: user_2_challenges (empty initially)
// User 2 creates their own challenge
// User 1 and User 2 data are completely isolated
```

### Test Scenario 2: Verify Data Persistence

```javascript
// User X logs in
// Creates data (challenges, istikhara results)
// sessionManager saves to: user_X_*
// User X logs out
// User X logs back in
// sessionManager loads all data for user_X_*
// All previous data is restored
```

### Test Scenario 3: Clear Data on New Session

```javascript
// Old localStorage keys: user_1_challenges, user_1_istikharaHistory
// User 1 logs out
// User 2 logs in (new user)
// sessionManager.startSession() called
// clearSessionData() executed
// Removes: user_1_challenges, user_1_istikharaHistory
// User 2 starts with clean data
// Only user_2_* keys created
```

## Debugging

### Check Current Session
```javascript
console.log(sessionManager.getSessionInfo())
// Output: {
//   active: true,
//   userId: 1,
//   dataKeys: ['challenges', 'istikharaHistory', 'achievements'],
//   dataCount: 3
// }
```

### Check User Data Keys
```javascript
for (let i = 0; i < localStorage.length; i++) {
  console.log(localStorage.key(i))
}
// Shows all keys including user-specific ones
```

### Export User Data
```javascript
const backup = sessionManager.exportUserData()
console.log(JSON.stringify(backup, null, 2))
// See exactly what data is stored for current user
```

## Browser Support

- ✅ Chrome/Edge (95+)
- ✅ Firefox (88+)
- ✅ Safari (14+)
- ✅ Opera (81+)

## Security Considerations

1. **Session Isolation**: Each user ID creates a unique namespace
2. **No Cross-User Data**: Data from one user cannot be accessed by another
3. **Logout Clears Data**: All user-specific localStorage cleared on logout
4. **Token Security**: authToken required for all API calls (server-side)
5. **LocalStorage Note**: Session data stored in localStorage - suitable for desktop/mobile apps where each device = one user typically

## Migration Path

```
Phase 1 ✅ COMPLETED:
- Session Manager created
- Auth Manager integrated
- Challenges updated
- Istikhara updated
- Logout updated

Phase 2 TODO:
- Late Prayers update
- Prayer logs update
- Duas update
- Settings update
- Khirah update

Phase 3 TODO:
- Backend API endpoints for persistence
- Sync localStorage with server
- Handle multi-device sessions
- Session timeout management
```

## Configuration

### Global Keys (Not User-Specific)
```javascript
const globalKeys = [
  'authToken',        // Auth token
  'userData',         // Current user info
  'theme',            // Theme setting
  'language',         // Language setting
  'appSettings'       // Global app settings
];
```

These are preserved when switching users and cleared on logout.

## Performance Impact

- **Minimal**: Session Manager uses efficient localStorage operations
- **Negligible overhead**: String operations only
- **No API calls**: Uses client-side storage
- **Fast lookups**: O(1) for data retrieval

## Future Enhancements

1. **IndexedDB Support**: For larger datasets per user
2. **Server Sync**: Real-time sync with backend database
3. **Multi-Device**: Shared session across devices
4. **Offline Support**: Service Workers for offline access
5. **Encryption**: Encrypt user-specific data at rest
