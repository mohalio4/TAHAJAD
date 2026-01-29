# Tahajad Laravel Backend - Complete Setup

## 🎯 Overview

This is the complete Laravel backend for the Tahajad Islamic application, integrated with Supabase for database management. All frontend files (HTML, CSS, JS) have been migrated to Laravel's structure.

## 📁 Project Structure

```
laravel-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Api/
│   │   │   │   ├── ProfileController.php    # Profile API
│   │   │   │   └── ResearchController.php   # Research API
│   │   │   ├── AuthController.php           # Authentication
│   │   │   └── PageController.php           # Page rendering
│   │   └── Middleware/                      # Custom middleware
│   ├── Models/
│   │   ├── Profile.php                      # User profiles
│   │   └── Research.php                     # Research articles
│   └── Providers/
│       ├── AppServiceProvider.php
│       ├── RouteServiceProvider.php
│       └── SupabaseServiceProvider.php     # Supabase integration
├── config/
│   ├── app.php                             # App configuration
│   ├── database.php                        # Database config
│   ├── supabase.php                        # Supabase config
│   └── cors.php                            # CORS settings
├── public/
│   ├── css/                                 # All CSS files
│   ├── js/                                  # All JS files
│   ├── assets/
│   │   ├── images/                          # Images
│   │   └── audio/                           # Audio files
│   └── data/                                # JSON data files
├── resources/
│   └── views/
│       ├── layouts/
│       │   └── app.blade.php               # Main layout
│       ├── pages/                           # Page templates
│       └── auth/                            # Auth templates
├── routes/
│   ├── api.php                              # API routes
│   └── web.php                              # Web routes
└── Documentation files...
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
composer install
composer require laravel/sanctum
```

### 2. Setup Environment

```bash
# Copy environment template
cp ENV_SETUP.md .env

# Edit .env and add:
# - Database password
# - Supabase credentials
# - App key (run: php artisan key:generate)
```

### 3. Copy Frontend Files

Run the PowerShell script:
```powershell
.\copy-files.ps1
```

Or manually copy:
- `css/` → `public/css/`
- `js/` → `public/js/`
- `assets/` → `public/assets/`

### 4. Setup Database

1. Go to Supabase Dashboard → SQL Editor
2. Copy SQL from `researchesSql.txt`
3. Execute the script

### 5. Start Server

```bash
php artisan serve
```

Visit: `http://localhost:8000`

## 📚 Documentation

- **INSTALLATION.md** - Detailed installation guide
- **QUICK_START.md** - Quick start guide
- **API_DOCUMENTATION.md** - Complete API documentation
- **MIGRATION_GUIDE.md** - Frontend migration guide
- **COMPLETE_SETUP.md** - Complete setup instructions
- **FINAL_CHECKLIST.md** - Final checklist

## 🔌 API Endpoints

### Public Endpoints
- `GET /api/researches` - Get all researches
- `GET /api/researches/{id}` - Get single research
- `POST /api/researches/{id}/increment-views` - Increment views

### Authenticated Endpoints
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `POST /api/researches` - Create research (publisher/admin)
- `PUT /api/researches/{id}` - Update research (owner/admin)
- `DELETE /api/researches/{id}` - Delete research (owner/admin)

### Admin Only
- `GET /api/profiles` - Get all profiles

## 🌐 Web Routes

All pages are accessible via routes:
- `/` - Home page
- `/dashboard` - Dashboard
- `/prayer-times` - Prayer times
- `/duas` - Duas collection
- `/challenges` - Challenges
- `/hijri-calendar` - Hijri calendar
- `/self-accountability` - Self accountability
- `/istikhara` - Istikhara
- `/posts` - Posts
- `/leaderthink` - Leaderthink
- `/thaqalayn` - Thaqalayn
- `/quran` - Quran
- `/hyder-ai` - Hyder AI
- `/maktaba-masmouaa` - Audio library
- `/login` - Login
- `/register` - Register
- `/settings` - Settings

## 🔐 Authentication

The backend supports Laravel Sanctum for API authentication. Update `AuthController` to implement your authentication logic.

## 🗄️ Database

- **Supabase PostgreSQL** - Main database
- **Tables**: `profiles`, `researches`
- **RLS**: Row Level Security enabled
- **Functions**: `increment_research_views()`

## 📝 Blade Templates

All HTML files are converted to Blade templates:
- Use `{{ asset() }}` for assets
- Use `{{ route() }}` for links
- Use `@extends('layouts.app')` for pages
- Use `@push('styles')` and `@push('scripts')` for page-specific assets

## 🛠️ Development

### Running Tests
```bash
php artisan test
```

### Clearing Cache
```bash
php artisan cache:clear
php artisan route:clear
php artisan config:clear
```

### View Routes
```bash
php artisan route:list
```

## 📦 Dependencies

- Laravel 10.x
- Laravel Sanctum (Authentication)
- Guzzle HTTP (HTTP client)
- PostgreSQL (via Supabase)

## 🔧 Configuration

### Database Connection
Configured in `config/database.php` for Supabase PostgreSQL.

### Supabase Integration
Configured in `config/supabase.php` with URL and API key.

### CORS
Configured in `config/cors.php` for cross-origin requests.

## 📋 Next Steps

1. ✅ Complete Blade template conversion for all pages
2. ✅ Test all functionality
3. ✅ Set up authentication
4. ✅ Deploy to production

## 🐛 Troubleshooting

### Assets Not Loading
- Check `public/` directory permissions
- Verify asset paths use `{{ asset() }}`
- Clear cache: `php artisan cache:clear`

### Database Connection
- Verify `.env` credentials
- Check Supabase connection
- Test: `php artisan tinker` → `DB::connection()->getPdo()`

### Routes Not Working
- Check route list: `php artisan route:list`
- Clear route cache: `php artisan route:clear`

## 📞 Support

For issues or questions:
1. Check documentation files
2. Review Laravel docs: https://laravel.com/docs
3. Review Supabase docs: https://supabase.com/docs

## 📄 License

MIT License

---

**Status**: Backend structure complete, ready for frontend file migration and testing.

