# Backend Database Requirements for TAHAJAD2

## Overview
Each user must have their own isolated session and data stored in the database. All user-specific data starts from zero for new users.

## Database Schema Requirements

### 1. Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. Prayer Logs Table
```sql
CREATE TABLE prayer_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    prayer_name VARCHAR(50) NOT NULL,
    logged_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_prayer (user_id, logged_at)
);
```

### 3. Challenge Progress Table
```sql
CREATE TABLE challenge_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    challenge_id INT NOT NULL,
    day INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_challenge_day (user_id, challenge_id, day),
    INDEX idx_user_challenge (user_id, challenge_id)
);
```

### 4. Favorite Duas Table
```sql
CREATE TABLE favorite_duas (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    dua_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_dua (user_id, dua_id),
    INDEX idx_user_duas (user_id)
);
```

### 5. Saved Posts Table
```sql
CREATE TABLE saved_posts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    post_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_post (user_id, post_id),
    INDEX idx_user_posts (user_id)
);
```

### 6. Quran Progress Table
```sql
CREATE TABLE quran_progress (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    surah INT NOT NULL,
    ayah INT NOT NULL,
    last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_surah (user_id, surah),
    INDEX idx_user_progress (user_id)
);
```

### 7. Good Deeds (Khirah) Table
```sql
CREATE TABLE khirah_entries (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    type ENUM('deed', 'journal', 'goal') NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    completed BOOLEAN DEFAULT FALSE,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_khirah (user_id, date)
);
```

### 8. Late Prayers (Qada) Table
```sql
CREATE TABLE late_prayers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    prayer_name VARCHAR(50) NOT NULL,
    count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_prayer (user_id, prayer_name),
    INDEX idx_user_late_prayers (user_id)
);
```

### 9. User Settings Table
```sql
CREATE TABLE user_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    prayer_adjustments JSON,
    hijri_adjustment INT DEFAULT 0,
    theme VARCHAR(50) DEFAULT 'emerald',
    notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_settings (user_id)
);
```

## API Implementation Requirements

### Authentication
All API endpoints (except login/register) must:
1. Require Bearer token authentication
2. Extract user ID from the authenticated token
3. Only return/modify data belonging to that user

### Example Laravel Middleware
```php
// In routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    // All protected routes here
    Route::get('/prayer-times/stats', [PrayerController::class, 'getStats']);
    Route::post('/prayer-times/log', [PrayerController::class, 'logPrayer']);
    // ... etc
});
```

### Example Controller Method
```php
public function logPrayer(Request $request)
{
    $userId = auth()->id(); // Get authenticated user ID
    
    PrayerLog::create([
        'user_id' => $userId,
        'prayer_name' => $request->prayer_name,
        'logged_at' => $request->date ?? now()
    ]);
    
    return response()->json(['success' => true]);
}
```

## Frontend Integration

### Current Implementation
The frontend now includes user-scoped data storage helper methods in `api.js`:

- `getUserId()` - Get current user's ID
- `getUserKey(key)` - Generate user-specific storage key
- `getUserData(key, defaultValue)` - Retrieve user-specific data
- `setUserData(key, value)` - Store user-specific data
- `removeUserData(key)` - Remove user-specific data

### Migration Steps

1. **Update all localStorage calls** to use user-scoped methods:
   ```javascript
   // Old way:
   localStorage.setItem('quranProgress', JSON.stringify(data));
   
   // New way:
   window.apiManager.setUserData('quranProgress', data);
   ```

2. **Ensure API calls include authentication**:
   All API methods already include the Bearer token automatically.

3. **Sync local data with backend**:
   When user logs in, fetch their data from the backend.
   When user performs actions, save to backend AND local cache.

## Security Considerations

1. **Never trust client-side data** - Always validate on server
2. **Use row-level security** - Always filter by authenticated user ID
3. **Implement rate limiting** - Prevent abuse of API endpoints
4. **Validate all inputs** - Sanitize and validate all user inputs
5. **Use HTTPS only** - Ensure all API communication is encrypted

## Testing Requirements

1. Create multiple test users
2. Verify data isolation between users
3. Test logout clears only auth, not cached data
4. Test login restores user's specific data
5. Verify database queries always filter by user_id
