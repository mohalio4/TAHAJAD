# Complete Laravel Backend Setup Guide

## Overview
This guide will help you complete the migration of all HTML, CSS, JS files to Laravel structure.

## Step 1: Run the Copy Script

Execute the PowerShell script to copy all files:

```powershell
cd laravel-backend
.\copy-files.ps1
```

Or manually copy:
- `css/` → `public/css/`
- `js/` → `public/js/`
- `assets/` → `public/assets/`
- `*.json` → `public/data/`

## Step 2: Convert HTML to Blade Templates

### Template Structure
All pages should extend `layouts/app.blade.php`:

```blade
@extends('layouts.app')

@section('title', 'Page Title')

@push('styles')
<link rel="stylesheet" href="{{ asset('css/page-specific.css') }}">
@endpush

@section('content')
<!-- Page content here -->
@endsection

@push('scripts')
<script src="{{ asset('js/page-specific.js') }}"></script>
@endpush
```

### Path Updates

Replace in all HTML files:
- `../css/` → `{{ asset('css/') }}`
- `../js/` → `{{ asset('js/') }}`
- `../assets/` → `{{ asset('assets/') }}`
- `page.html` → `{{ route('page-name') }}`

### Pages to Convert

1. ✅ `index.html` → `resources/views/pages/index.blade.php` (Done)
2. ✅ `dashboard_page.html` → `resources/views/pages/dashboard.blade.php` (Template created)
3. ✅ `login_page.html` → `resources/views/auth/login.blade.php` (Done)
4. `register_page.html` → `resources/views/auth/register.blade.php`
5. `prayer_times_page.html` → `resources/views/pages/prayer-times.blade.php`
6. `duas_page.html` → `resources/views/pages/duas.blade.php`
7. `challenges_page.html` → `resources/views/pages/challenges.blade.php`
8. `hijri-calendar.html` → `resources/views/pages/hijri-calendar.blade.php`
9. `self-accountability.html` → `resources/views/pages/self-accountability.blade.php`
10. `istikhara.html` → `resources/views/pages/istikhara.blade.php`
11. `post_page.html` → `resources/views/pages/posts.blade.php`
12. `post_details.html` → `resources/views/pages/post-details.blade.php`
13. `leaderthink.html` → `resources/views/pages/leaderthink.blade.php`
14. `thaqalayn.html` → `resources/views/pages/thaqalayn.blade.php`
15. `thaqalayn-book.html` → `resources/views/pages/thaqalayn-book.blade.php`
16. `quran.html` → `resources/views/pages/quran.blade.php`
17. `quran-surah.html` → `resources/views/pages/quran-surah.blade.php`
18. `hyder-ai.html` → `resources/views/pages/hyder-ai.blade.php`
19. `maktaba-masmouaa.html` → `resources/views/pages/maktaba-masmouaa.blade.php`
20. `settings.html` → `resources/views/pages/settings.blade.php`

## Step 3: Update JavaScript Files

Update all JS files that reference paths:

### Before:
```javascript
fetch('../data/ad3iya.json')
```

### After:
```javascript
fetch('/data/ad3iya.json')
// or
fetch('{{ asset('data/ad3iya.json') }}')
```

### API Calls
Update API endpoints to use Laravel routes:

```javascript
// Before
fetch('api/researches')

// After
fetch('/api/researches')
```

## Step 4: Create Missing Controllers

All controllers are created in `app/Http/Controllers/PageController.php`

## Step 5: Update Routes

All routes are defined in `routes/web.php` using the PageController.

## Step 6: Environment Setup

1. Copy `.env.example` to `.env`
2. Update database credentials
3. Run `php artisan key:generate`
4. Run migrations (if using Laravel migrations)

## Step 7: Test All Pages

Test each page to ensure:
- Assets load correctly
- Navigation works
- Forms submit properly
- JavaScript functions work
- API calls succeed

## Step 8: Additional Backend Features

### Authentication
- Implement Laravel Sanctum or use Supabase Auth
- Update `AuthController` with actual logic

### API Integration
- All API routes are in `routes/api.php`
- Controllers are in `app/Http/Controllers/Api/`

### Database
- Run SQL script from `researchesSql.txt` in Supabase
- Models are ready in `app/Models/`

## File Structure Summary

```
laravel-backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── Api/
│   │       │   ├── ResearchController.php
│   │       │   └── ProfileController.php
│   │       ├── AuthController.php
│   │       └── PageController.php
│   └── Models/
│       ├── Profile.php
│       └── Research.php
├── config/
│   ├── app.php
│   ├── database.php
│   ├── supabase.php
│   └── cors.php
├── public/
│   ├── css/          # All CSS files
│   ├── js/           # All JS files
│   ├── assets/      # Images, audio
│   └── data/        # JSON files
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php
│       ├── pages/    # All page templates
│       └── auth/      # Login, register
├── routes/
│   ├── api.php       # API routes
│   └── web.php       # Web routes
└── README.md
```

## Next Steps

1. Complete Blade template conversion for all pages
2. Test all functionality
3. Set up authentication
4. Deploy to production

## Troubleshooting

### Assets Not Loading
- Check `public/` directory permissions
- Verify asset paths use `{{ asset() }}`
- Clear Laravel cache: `php artisan cache:clear`

### Routes Not Working
- Run `php artisan route:list` to see all routes
- Clear route cache: `php artisan route:clear`

### Database Connection Issues
- Verify `.env` database credentials
- Check Supabase connection settings
- Test connection: `php artisan tinker` then `DB::connection()->getPdo()`

