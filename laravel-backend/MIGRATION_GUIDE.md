# Migration Guide: Moving HTML/JS/CSS to Laravel

This guide explains how to migrate all frontend files to Laravel structure.

## Directory Structure

```
laravel-backend/
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php          # Main layout
│       ├── pages/
│       │   ├── index.blade.php        # Landing page
│       │   ├── dashboard.blade.php    # Dashboard
│       │   ├── prayer-times.blade.php
│       │   ├── duas.blade.php
│       │   ├── challenges.blade.php
│       │   ├── hijri-calendar.blade.php
│       │   ├── self-accountability.blade.php
│       │   ├── istikhara.blade.php
│       │   ├── posts.blade.php
│       │   ├── post-details.blade.php
│       │   ├── leaderthink.blade.php
│       │   ├── thaqalayn.blade.php
│       │   ├── thaqalayn-book.blade.php
│       │   ├── quran.blade.php
│       │   ├── quran-surah.blade.php
│       │   ├── hyder-ai.blade.php
│       │   ├── maktaba-masmouaa.blade.php
│       │   └── settings.blade.php
│       └── auth/
│           ├── login.blade.php
│           └── register.blade.php
├── public/
│   ├── css/                           # All CSS files
│   ├── js/                            # All JS files
│   └── assets/
│       ├── images/                    # All images
│       └── audio/                     # All audio files
└── routes/
    └── web.php                        # All page routes
```

## Steps to Migrate

### 1. Copy CSS Files
Copy all CSS files from `css/` to `public/css/`

### 2. Copy JS Files
Copy all JS files from `js/` to `public/js/`

### 3. Copy Assets
Copy all files from `assets/` to `public/assets/`

### 4. Convert HTML to Blade
- Replace `../css/` with `{{ asset('css/') }}`
- Replace `../js/` with `{{ asset('js/') }}`
- Replace `../assets/` with `{{ asset('assets/') }}`
- Replace `.html` links with `{{ route('name') }}`
- Extract common parts to `layouts/app.blade.php`

### 5. Update Routes
All routes are defined in `routes/web.php`

## Asset Helper Usage

In Blade templates, use:
- `{{ asset('css/file.css') }}` for CSS
- `{{ asset('js/file.js') }}` for JS
- `{{ asset('assets/images/image.jpg') }}` for images
- `{{ route('page-name') }}` for internal links

