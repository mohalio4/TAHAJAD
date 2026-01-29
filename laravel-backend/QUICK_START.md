# Quick Start Guide

## 1. Install Laravel (if not already installed)

```bash
composer create-project laravel/laravel laravel-backend
cd laravel-backend
```

## 2. Copy Files

Copy all files from this directory structure to your Laravel project.

## 3. Install Dependencies

```bash
composer install
composer require laravel/sanctum
```

## 4. Setup Environment

Copy `ENV_SETUP.md` content to `.env` file and update:
- `DB_PASSWORD` with your Supabase password
- Run `php artisan key:generate`

## 5. Setup Supabase Database

1. Go to Supabase Dashboard → SQL Editor
2. Copy SQL from `researchesSql.txt`
3. Paste and execute

## 6. Publish Sanctum

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

## 7. Start Server

```bash
php artisan serve
```

## 8. Test API

```bash
curl http://localhost:8000/api/researches
```

## File Structure

```
laravel-backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/
│   │   │   ├── ResearchController.php
│   │   │   └── ProfileController.php
│   │   └── Middleware/
│   ├── Models/
│   │   ├── Profile.php
│   │   └── Research.php
│   └── Providers/
│       ├── AppServiceProvider.php
│       ├── RouteServiceProvider.php
│       └── SupabaseServiceProvider.php
├── config/
│   ├── app.php
│   ├── cors.php
│   ├── database.php
│   └── supabase.php
├── routes/
│   ├── api.php
│   └── web.php
├── .env (create from ENV_SETUP.md)
└── README.md
```

## Next Steps

- Read `INSTALLATION.md` for detailed setup
- Read `API_DOCUMENTATION.md` for API usage
- Test all endpoints
- Deploy to production

