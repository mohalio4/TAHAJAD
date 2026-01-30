# Copy Files Instructions

## Manual Copy Steps

Since we can't automatically copy files, please follow these steps:

### 1. Copy CSS Files
Copy all files from `css/` directory to `laravel-backend/public/css/`:
- root-variables.css
- global-styles.css
- landing-page.css
- dashboard.css
- prayer-times.css
- duas.css
- challenges.css
- hijri-calendar.css
- khirah.css (self-accountability)
- istikhara.css
- posts.css
- leaderthink.css
- thaqalayn.css
- quran.css
- quran-surah.css
- hyder-ai.css
- maktaba-masmouaa.css
- auth-pages.css
- animations.css

### 2. Copy JS Files
Copy all files from `js/` directory to `laravel-backend/public/js/`:
- navigation.js
- theme-manager.js
- particles.js
- animations.js
- logo-loader.js
- mouse-light-tracker.js
- user-navigation.js
- api.js
- auth.js
- dashboard.js
- prayer-times.js
- duas.js
- challenges.js
- hijri-calendar.js
- khirah.js (self-accountability)
- istikhara.js
- posts.js
- post-details.js
- leaderthink.js
- thaqalayn.js
- thaqalayn-book.js
- quran.js
- quran-surah.js
- hyder-ai.js
- settings.js

### 3. Copy Assets
Copy entire `assets/` directory to `laravel-backend/public/assets/`:
- assets/images/* (all images)
- assets/audio/* (all audio files)

### 4. Copy JSON Data Files (if needed)
Copy JSON files to `laravel-backend/storage/app/public/data/` or `public/data/`:
- ad3iya.json
- ziyara.json
- taqibat.json
- seerah.json
- leaderthink.json
- events_levant_1447.json

## After Copying

1. Update all asset paths in Blade templates to use `{{ asset() }}`
2. Update all internal links to use `{{ route() }}`
3. Test all pages to ensure assets load correctly

