# Verification Script - Copy to Browser Console

## Quick Test 1: Check SessionManager is Loaded
```javascript
console.log("1. Checking SessionManager...");
console.log("window.sessionManager exists:", !!window.sessionManager);
console.log("SessionManager info:", window.sessionManager.getSessionInfo());
```

## Quick Test 2: Check Current Session Status
```javascript
console.log("2. Current Session Status:");
console.log("Session Active:", window.sessionManager.sessionActive);
console.log("Current User ID:", window.sessionManager.currentUserId);
console.log("Auth Token exists:", !!localStorage.getItem('authToken'));
console.log("User Data:", localStorage.getItem('userData'));
```

## Quick Test 3: Check User-Specific Data Keys
```javascript
console.log("3. User-Specific Data in localStorage:");
const allKeys = Object.keys(localStorage);
const userKeys = allKeys.filter(k => k.startsWith('user_'));
console.log("Found", userKeys.length, "user-specific keys:");
userKeys.forEach(key => {
    const value = localStorage.getItem(key);
    const size = value.length;
    console.log(`  - ${key}: ${size} bytes`);
});

console.log("\nOld Global Keys (should be empty/missing):");
['challenges', 'istikharaHistory', 'favoriteDuas', 'muhasabahDeeds'].forEach(key => {
    const val = localStorage.getItem(key);
    if (val) {
        console.warn(`  ⚠ OLD DATA FOUND: ${key} (this should be empty!)`);
    } else {
        console.log(`  ✓ ${key}: clean (not found)`);
    }
});
```

## Quick Test 4: Test Data Isolation
```javascript
console.log("4. Testing Data Isolation:");
if (window.sessionManager && window.sessionManager.sessionActive) {
    console.log("Logged in as User", window.sessionManager.currentUserId);
    
    // Try to load challenges
    const challenges = window.sessionManager.loadUserData('challenges', []);
    console.log("Challenges:", challenges);
    
    // Try to load istikhara history
    const history = window.sessionManager.loadUserData('istikharaHistory', []);
    console.log("Istikhara History:", history);
} else {
    console.log("Not logged in. Session not active.");
    console.log("Test this after logging in.");
}
```

## Quick Test 5: Simulate User Change
```javascript
console.log("5. Simulating User Session Change:");
const testUserId = 99;
const testUser = { id: testUserId, name: "Test User" };

console.log(`Simulating User ${testUserId} session...`);
window.sessionManager.startSession(testUser);

console.log("After startSession:");
console.log("  Current User ID:", window.sessionManager.currentUserId);
console.log("  Session Active:", window.sessionManager.sessionActive);
console.log("  Old user keys cleared:", !Object.keys(localStorage).some(k => k.startsWith('user_1_') || k.startsWith('user_2_')));

// End session
window.sessionManager.endSession();
console.log("After endSession:");
console.log("  Session Active:", window.sessionManager.sessionActive);
console.log("  User-specific keys remaining:", Object.keys(localStorage).filter(k => k.startsWith('user_')).length);
```

## Full Integration Test (Manual Steps)
```
1. Open Challenges page (challenges_page.html)
2. Run in console: console.log(window.sessionManager);
   → Should show SessionManager object
   → currentUserId should be null (not logged in)

3. Login with User A
4. Run in console: console.log(window.sessionManager.currentUserId);
   → Should show User A's ID (e.g., 1)

5. Create a challenge
6. Run in console: localStorage.getItem('user_1_challenges');
   → Should show your challenge data

7. Logout
8. Run in console: Object.keys(localStorage).filter(k => k.startsWith('user_1_'));
   → Should be empty []

9. Login with User B (same computer)
10. Open Challenges page
11. Run in console: localStorage.getItem('user_2_challenges');
    → Should be null (User B has no challenges yet)

12. Create different challenge as User B
13. Run in console: localStorage.getItem('user_2_challenges');
    → Should show ONLY User B's challenges

14. Logout, login as User A again
15. Check challenges - should see User A's original challenge!
    ✓ PASS: Complete data isolation working!
```

## Expected Results

### If Everything Is Working ✅
```
1. SessionManager loads without errors
2. User-specific keys like user_1_challenges exist
3. Old global keys like "challenges" do NOT exist
4. Different users see only their own data
5. Data persists when re-logging in
6. Data clears on logout
```

### If Something Is Wrong ❌
```
Check for:
1. window.sessionManager is undefined
   → Verify session-manager.js is included in HTML
   
2. Old keys like "challenges" still exist
   → Session system is not being used (using fallback)
   
3. Data shared between users
   → Session not starting properly on login
   
4. Data not persisting
   → Check browser localStorage isn't disabled
```

---

**Copy and paste each section into your browser's DevTools Console**  
**Run these tests after fixing to verify everything works!**
