# Laravel Blade Structure Documentation

## Overview
All HTML files have been converted to Laravel Blade templates (.blade.php) for proper Laravel integration.

## Directory Structure

```
backend/
├── resources/
│   └── views/
│       ├── layouts/
│       │   ├── app.blade.php          # Main layout for public pages
│       │   └── auth.blade.php         # Layout for authentication pages
│       ├── auth/
│       │   ├── login.blade.php        # Login page
│       │   └── register.blade.php     # Registration page
│       ├── components/
│       │   ├── nav.blade.php          # Navigation bar component
│       │   └── footer.blade.php       # Footer component
│       ├── pages/
│       │   ├── prayer-times.blade.php
│       │   ├── duas.blade.php
│       │   ├── challenges.blade.php
│       │   ├── hijri_calendar.blade.php
│       │   ├── self_accountability.blade.php
│       │   ├── istikhara.blade.php
│       │   ├── posts.blade.php
│       │   ├── post_details.blade.php
│       │   ├── leaderthink.blade.php
│       │   ├── thaqalayn.blade.php
│       │   ├── thaqalayn_book.blade.php
│       │   ├── quran.blade.php
│       │   ├── quran_surah.blade.php
│       │   ├── hyder_ai.blade.php
│       │   ├── profile.blade.php
│       │   └── settings.blade.php
│       └── index.blade.php            # Home page

├── app/
│   └── Http/
│       └── Controllers/
│           └── PageController.php     # Handles all page routes

└── routes/
    └── web.php                        # Route definitions
```

## Route Configuration

Routes are defined in `backend/routes/web.php`:

### Public Routes
- `GET /` → `PageController@home` → `index.blade.php`
- `GET /login` → `PageController@login` → `auth/login.blade.php`
- `GET /register` → `PageController@register` → `auth/register.blade.php`
- `GET /password-reset` → `PageController@passwordReset` → `auth/password-reset.blade.php`

### Protected Routes (Require Authentication)
All feature pages require authentication:
- `GET /prayer-times` → `PageController@prayerTimes` → `pages/prayer-times.blade.php`
- `GET /duas` → `PageController@duas` → `pages/duas.blade.php`
- `GET /challenges` → `PageController@challenges` → `pages/challenges.blade.php`
- `GET /hijri-calendar` → `PageController@hijriCalendar` → `pages/hijri_calendar.blade.php`
- `GET /self-accountability` → `PageController@selfAccountability` → `pages/self_accountability.blade.php`
- `GET /istikhara` → `PageController@istikhara` → `pages/istikhara.blade.php`
- `GET /posts` → `PageController@posts` → `pages/posts.blade.php`
- `GET /post-details/{id}` → `PageController@postDetails` → `pages/post_details.blade.php`
- `GET /leaderthink` → `PageController@leaderthink` → `pages/leaderthink.blade.php`
- `GET /thaqalayn` → `PageController@thaqalayn` → `pages/thaqalayn.blade.php`
- `GET /thaqalayn-book/{id}` → `PageController@thaqalaynBook` → `pages/thaqalayn_book.blade.php`
- `GET /quran` → `PageController@quran` → `pages/quran.blade.php`
- `GET /quran-surah/{id}` → `PageController@quranSurah` → `pages/quran_surah.blade.php`
- `GET /hyder-ai` → `PageController@hyderAi` → `pages/hyder_ai.blade.php`
- `GET /profile` → `PageController@profile` → `pages/profile.blade.php`
- `GET /settings` → `PageController@settings` → `pages/settings.blade.php`

## Asset Paths

All assets use Laravel's `asset()` helper function:

```blade
<!-- CSS -->
<link rel="stylesheet" href="{{ asset('css/global-styles.css') }}">

<!-- Images -->
<img src="{{ asset('assets/images/logo.png') }}" alt="Logo">

<!-- JavaScript -->
<script src="{{ asset('js/auth.js') }}"></script>
```

## Layout System

### app.blade.php (Main Layout)
Used by all public pages and feature pages.

**Sections:**
- `title` - Page title
- `extra-css` - Additional CSS files
- `content` - Main page content
- `extra-js` - Additional JavaScript

**Components:**
- Navigation bar
- Particles animation
- Theme switcher
- User profile dropdown
- All JavaScript files

### auth.blade.php (Auth Layout)
Used by authentication pages (login, register, password-reset).

**Sections:**
- `title` - Page title
- `content` - Auth form content
- `extra-js` - Additional JavaScript

**Features:**
- Background with pattern overlay
- Back to home button
- Proper CSRF token handling

## Navigation System

### Route Names Usage

Routes are referenced by name throughout templates:

```blade
<!-- Named route navigation -->
<a href="{{ route('home') }}">الرئيسية</a>
<a href="{{ route('login') }}">تسجيل الدخول</a>
<a href="{{ route('prayer-times') }}">مواقيت الصلاة</a>

<!-- Dynamic routes with parameters -->
<a href="{{ route('post-details', $postId) }}">تفاصيل المنشور</a>
<a href="{{ route('quran-surah', $surahId) }}">اقرأ السورة</a>
```

### Active Link Detection

The navigation automatically highlights the current page:

```blade
<li><a href="{{ route('home') }}" 
    class="@if(Route::currentRouteName() === 'home') active @endif">
    الرئيسية
</a></li>
```

## Form Handling

All forms include CSRF token:

```blade
<form method="POST" action="{{ route('api.login') }}">
    @csrf
    <!-- Form fields -->
</form>
```

## User Authentication

Authentication is handled through:
1. Login form → `auth/login.blade.php`
2. API call to `/api/login` endpoint
3. Token stored in localStorage
4. User data stored in localStorage
5. Protected routes via `auth:sanctum` middleware

## Component Usage

### Navigation Component
```blade
@include('components.nav')
```

### Footer Component
```blade
@include('components.footer')
```

## Asset Organization

Public assets are stored in `backend/public/`:

```
public/
├── assets/
│   ├── images/
│   └── audio/
├── css/
├── js/
└── index.php (Laravel public entry point)
```

## Important Notes

1. **Asset Helper**: Always use `{{ asset() }}` for asset paths
2. **Route Names**: Use `{{ route('name') }}` instead of hardcoded URLs
3. **CSRF Protection**: All forms include `@csrf` token
4. **Authentication Middleware**: Protected routes use `auth:sanctum` middleware
5. **Component Naming**: Blade components use kebab-case (e.g., `nav.blade.php`)
6. **View Inheritance**: All pages extend either `layouts.app` or `layouts.auth`

## Next Steps

1. Ensure `PageController` methods return correct view names
2. Update `routes/web.php` with proper route definitions
3. Test all route navigation
4. Verify CSS and JS files load correctly
5. Test authentication flow
