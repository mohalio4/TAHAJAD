# Laravel Backend Setup for Supabase Integration

## Project Structure

```
laravel-backend/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── ResearchController.php
│   │           └── ProfileController.php
│   └── Models/
│       ├── Profile.php
│       └── Research.php
├── config/
│   └── database.php (updated)
├── routes/
│   └── api.php
├── .env.example
└── composer.json (dependencies)
```

## Installation Steps

1. Create Laravel project:
```bash
composer create-project laravel/laravel laravel-backend
cd laravel-backend
```

2. Install Supabase PHP Client:
```bash
composer require supabase/supabase-php
```

3. Copy .env.example to .env and configure

4. Run migrations (if using Laravel migrations) or use Supabase SQL directly

5. Start server:
```bash
php artisan serve
```

