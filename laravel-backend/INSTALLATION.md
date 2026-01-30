# Laravel Backend Installation Guide

## Prerequisites

- PHP >= 8.1
- Composer
- PostgreSQL client libraries
- Supabase account with database access

## Step-by-Step Installation

### 1. Create Laravel Project

```bash
composer create-project laravel/laravel laravel-backend
cd laravel-backend
```

### 2. Copy Project Files

Copy all files from this directory to your Laravel project:

- `app/` → `app/`
- `config/` → `config/`
- `routes/` → `routes/`

### 3. Install Dependencies

```bash
composer require laravel/sanctum
composer require guzzlehttp/guzzle
```

### 4. Publish Sanctum

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 5. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and set:

```env
APP_NAME=Tahajad
APP_URL=http://localhost:8000

DB_CONNECTION=pgsql
DB_HOST=db.laayksyzdyaqoteyzjoe.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your_supabase_password_here

SUPABASE_URL=https://laayksyzdyaqoteyzjoe.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXlrc3l6ZHlhcW90ZXl6am9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjExNTUsImV4cCI6MjA3OTc5NzE1NX0.Tc9SQ1dYFWGwfeikftGQWS-4MAZE2fRZpsHmJ1O8gX4
```

**Important:** Replace `your_supabase_password_here` with your actual Supabase database password.

### 6. Generate Application Key

```bash
php artisan key:generate
```

### 7. Setup Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire SQL script from `researchesSql.txt`
4. Execute the script

This will create:
- `profiles` table with RLS policies
- `researches` table with RLS policies
- `increment_research_views` function
- All necessary triggers and indexes

### 8. Test Database Connection

```bash
php artisan tinker
```

Then in tinker:
```php
DB::connection()->getPdo();
```

If successful, you'll see the PDO object. If not, check your database credentials.

### 9. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

### 10. Test API Endpoints

#### Get all researches (public):
```bash
curl http://localhost:8000/api/researches
```

#### Get single research:
```bash
curl http://localhost:8000/api/researches/1
```

#### Create research (requires authentication):
```bash
curl -X POST http://localhost:8000/api/researches \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Research",
    "content_plain": "Plain content",
    "content_html": "<p>HTML content</p>",
    "published_at": "2024-01-15",
    "writer": "Writer Name",
    "publisher": "Publisher Name",
    "keywords": ["test", "research"]
  }'
```

## Authentication Setup

### Using Laravel Sanctum

1. Users authenticate via Supabase Auth
2. Get the JWT token from Supabase
3. Use that token with Laravel Sanctum

### Alternative: Direct Supabase Auth

You can also use Supabase's built-in authentication and pass the token to Laravel for validation.

## Troubleshooting

### Database Connection Issues

- Verify Supabase database password in `.env`
- Check if Supabase allows connections from your IP
- Ensure PostgreSQL extension is enabled in PHP

### RLS Policy Issues

- Make sure you've run the SQL script in Supabase
- Verify RLS is enabled on tables
- Check user roles in `profiles` table

### CORS Issues

- Check `config/cors.php` settings
- Ensure your frontend domain is allowed

## Next Steps

1. Set up user authentication (Supabase Auth or Laravel Sanctum)
2. Create test users and assign roles
3. Test all API endpoints
4. Deploy to production server

## Production Deployment

1. Set `APP_ENV=production` in `.env`
2. Set `APP_DEBUG=false`
3. Run `php artisan config:cache`
4. Run `php artisan route:cache`
5. Set up proper CORS origins
6. Use HTTPS
7. Set up rate limiting

