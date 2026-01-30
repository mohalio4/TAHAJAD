# Blade Template Connection Guide

## Complete File-to-Route Mapping

### 1. HOME PAGE
**File**: `backend/resources/views/index.blade.php`
**Route**: `GET /` 
**Controller**: `PageController@home`
**Access**: Public

**Flow**:
```
User visits / 
  → PageController@home() 
  → return view('index')
  → renders index.blade.php
  → extends layouts.app
```

---

### 2. LOGIN PAGE
**File**: `backend/resources/views/auth/login.blade.php`
**Route**: `GET /login`
**Controller**: `PageController@login`
**Access**: Public (redirects to home if already authenticated)
**Related API**: `POST /api/auth/login` (in api.php)

**Flow**:
```
User visits /login
  → PageController@login()
  → return view('auth.login')
  → extends layouts.auth
  
User submits form
  → API call to /api/auth/login
  → AuthController@login()
  → Returns token + user data
  → Saves to localStorage
  → Redirects to home
```

---

### 3. REGISTER PAGE
**File**: `backend/resources/views/auth/register.blade.php`
**Route**: `GET /register`
**Controller**: `PageController@register`
**Access**: Public (redirects to home if already authenticated)
**Related API**: `POST /api/auth/register` (in api.php)

**Flow**:
```
User visits /register
  → PageController@register()
  → return view('auth.register')
  → extends layouts.auth
  → multi-step form
  
User submits form
  → API call to /api/auth/register
  → AuthController@register()
  → Creates user
  → Returns token + user data
  → Saves to localStorage
  → Redirects to home
```

---

### 4. PROTECTED PAGES (Require Authentication)
All these pages use `auth:sanctum` middleware:

#### Prayer Times
**File**: `backend/resources/views/pages/prayer-times.blade.php`
**Route**: `GET /prayer-times`
**Controller**: `PageController@prayerTimes`
**Access**: Protected (auth:sanctum)

#### Duas
**File**: `backend/resources/views/pages/duas.blade.php`
**Route**: `GET /duas`
**Controller**: `PageController@duas`
**Access**: Protected

#### Challenges
**File**: `backend/resources/views/pages/challenges.blade.php`
**Route**: `GET /challenges`
**Controller**: `PageController@challenges`
**Access**: Protected

#### Hijri Calendar
**File**: `backend/resources/views/pages/hijri_calendar.blade.php`
**Route**: `GET /hijri-calendar`
**Controller**: `PageController@hijriCalendar`
**Access**: Protected

#### Self Accountability
**File**: `backend/resources/views/pages/self_accountability.blade.php`
**Route**: `GET /self-accountability`
**Controller**: `PageController@selfAccountability`
**Access**: Protected

#### Istikhara
**File**: `backend/resources/views/pages/istikhara.blade.php`
**Route**: `GET /istikhara`
**Controller**: `PageController@istikhara`
**Access**: Protected

#### Posts
**File**: `backend/resources/views/pages/posts.blade.php`
**Route**: `GET /posts`
**Controller**: `PageController@posts`
**Access**: Protected

#### Post Details
**File**: `backend/resources/views/pages/post_details.blade.php`
**Route**: `GET /post-details/{id}`
**Controller**: `PageController@postDetails($id)`
**Access**: Protected
**Parameters**: `$postId` passed to view

#### Leader Think
**File**: `backend/resources/views/pages/leaderthink.blade.php`
**Route**: `GET /leaderthink`
**Controller**: `PageController@leaderthink`
**Access**: Protected

#### Thaqalayn
**File**: `backend/resources/views/pages/thaqalayn.blade.php`
**Route**: `GET /thaqalayn`
**Controller**: `PageController@thaqalayn`
**Access**: Protected

#### Thaqalayn Book
**File**: `backend/resources/views/pages/thaqalayn_book.blade.php`
**Route**: `GET /thaqalayn-book/{id}`
**Controller**: `PageController@thaqalaynBook($id)`
**Access**: Protected
**Parameters**: `$thaqalaynId` passed to view

#### Quran
**File**: `backend/resources/views/pages/quran.blade.php`
**Route**: `GET /quran`
**Controller**: `PageController@quran`
**Access**: Protected

#### Quran Surah
**File**: `backend/resources/views/pages/quran_surah.blade.php`
**Route**: `GET /quran-surah/{id}`
**Controller**: `PageController@quranSurah($id)`
**Access**: Protected
**Parameters**: `$surahId` passed to view

#### Hyder AI
**File**: `backend/resources/views/pages/hyder_ai.blade.php`
**Route**: `GET /hyder-ai`
**Controller**: `PageController@hyderAi`
**Access**: Protected

#### Profile
**File**: `backend/resources/views/pages/profile.blade.php`
**Route**: `GET /profile`
**Controller**: `PageController@profile($request)`
**Access**: Protected
**Parameters**: `$user` from `$request->user()`

#### Settings
**File**: `backend/resources/views/pages/settings.blade.php`
**Route**: `GET /settings`
**Controller**: `PageController@settings($request)`
**Access**: Protected
**Parameters**: `$user` from `$request->user()`

---

## Blade Template Inheritance Chain

```
views/
├── layouts/
│   ├── app.blade.php (Main layout)
│   │   ├── @include('components.nav')
│   │   └── @include('components.footer')
│   │
│   └── auth.blade.php (Auth layout)
│
├── index.blade.php
│   └── @extends('layouts.app')
│
├── auth/
│   ├── login.blade.php
│   │   └── @extends('layouts.auth')
│   │
│   └── register.blade.php
│       └── @extends('layouts.auth')
│
└── pages/
    ├── prayer-times.blade.php
    │   └── @extends('layouts.app')
    │
    ├── duas.blade.php
    │   └── @extends('layouts.app')
    │
    ├── ... (all other pages)
    │   └── @extends('layouts.app')
```

---

## Asset Loading

All assets load through Laravel's `asset()` helper:

```blade
<!-- From layouts/app.blade.php -->
<link rel="stylesheet" href="{{ asset('css/global-styles.css') }}">
<script src="{{ asset('js/auth.js') }}"></script>
<img src="{{ asset('assets/images/tahajad_logo.png') }}">
```

**Asset Path**: `backend/public/`
```
public/
├── assets/
│   ├── images/
│   │   └── tahajad_logo.png
│   └── audio/
├── css/
│   ├── global-styles.css
│   ├── auth-pages.css
│   └── ...
├── js/
│   ├── auth.js
│   ├── api.js
│   └── ...
└── index.php
```

---

## API Endpoints Integration

### Authentication
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout (protected)
GET /api/user/profile (protected)
```

### User
```
PUT /api/user/profile/update (protected)
POST /api/user/password/change (protected)
GET /api/user/settings (protected)
PUT /api/user/settings (protected)
```

### Features
```
GET /api/prayer-times (protected)
POST /api/prayer-times/log (protected)
GET /api/duas (protected)
GET /api/challenges (protected)
POST /api/challenges/{id}/progress (protected)
GET /api/quran (protected)
... and more
```

---

## Request Flow Example

### User Registration Flow:
```
1. User visits /register
   ↓
2. GET /register routes to PageController@register
   ↓
3. Renders resources/views/auth/register.blade.php
   ↓
4. User fills form and clicks submit
   ↓
5. JavaScript makes API call: POST /api/auth/register
   ↓
6. API routes to Controllers/Api/AuthController@register
   ↓
7. Creates user in database
   ↓
8. Returns JSON with token + user data
   ↓
9. JavaScript saves token to localStorage
   ↓
10. Redirects to / (home page)
```

### Accessing Protected Page Flow:
```
1. User visits /prayer-times
   ↓
2. auth:sanctum middleware checks authentication
   ↓
3. If authenticated:
   - Routes to PageController@prayerTimes
   - Renders pages/prayer-times.blade.php
   - Page loads with user data
   ↓
4. If not authenticated:
   - Redirects to /login
```

---

## Important Files Summary

| File | Purpose |
|------|---------|
| `routes/web.php` | Web route definitions |
| `routes/api.php` | API route definitions |
| `app/Http/Controllers/PageController.php` | Page rendering controller |
| `app/Http/Controllers/Api/AuthController.php` | Authentication API controller |
| `resources/views/layouts/app.blade.php` | Main layout template |
| `resources/views/layouts/auth.blade.php` | Auth layout template |
| `resources/views/auth/login.blade.php` | Login page |
| `resources/views/auth/register.blade.php` | Registration page |
| `resources/views/components/nav.blade.php` | Navigation component |
| `public/` | All assets (CSS, JS, Images) |

---

## Configuration Checklist

- [x] Blade templates created
- [x] Route definitions in place
- [x] PageController methods defined
- [x] API AuthController configured
- [x] Asset paths use `asset()` helper
- [x] CSRF token included in forms
- [x] Authentication middleware configured
- [x] Layout inheritance set up
- [x] Components created and ready to use
- [x] Login/Register pages configured without social auth

## Testing the Setup

1. Visit `http://localhost/tahajad/backend/public` (home page)
2. Click "تسجيل الدخول" → should go to `/login`
3. Click "إنشاء حساب جديد" → should go to `/register`
4. Try registering a new account
5. Should be redirected to home after successful registration
6. Click on protected pages (e.g., مواقيت الصلاة)
7. Should require authentication
