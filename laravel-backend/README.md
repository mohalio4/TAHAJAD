# Tahajad Laravel Backend

Laravel backend API for Tahajad application with Supabase integration.

## Setup Instructions

### 1. Install Dependencies

```bash
composer install
```

### 2. Configure Environment

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Update the following in `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=db.laayksyzdyaqoteyzjoe.supabase.co
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres
DB_PASSWORD=your_supabase_password

SUPABASE_URL=https://laayksyzdyaqoteyzjoe.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhYXlrc3l6ZHlhcW90ZXl6am9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjExNTUsImV4cCI6MjA3OTc5NzE1NX0.Tc9SQ1dYFWGwfeikftGQWS-4MAZE2fRZpsHmJ1O8gX4
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

### 4. Setup Database

Run the SQL script from `researchesSql.txt` in your Supabase SQL Editor to create the tables and policies.

### 5. Install Sanctum (for authentication)

```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

### 6. Start Development Server

```bash
php artisan serve
```

The API will be available at `http://localhost:8000/api`

## API Endpoints

### Public Endpoints

- `GET /api/researches` - Get all researches (with pagination, search, filters)
- `GET /api/researches/{id}` - Get single research
- `POST /api/researches/{id}/increment-views` - Increment research views

### Authenticated Endpoints

- `GET /api/profile` - Get authenticated user's profile
- `PUT /api/profile` - Update authenticated user's profile
- `POST /api/researches` - Create new research (publisher/admin only)
- `PUT /api/researches/{id}` - Update research (owner/admin only)
- `DELETE /api/researches/{id}` - Delete research (owner/admin only)

### Admin Only Endpoints

- `GET /api/profiles` - Get all profiles (admin only)

## Authentication

This API uses Laravel Sanctum for authentication. Include the token in requests:

```
Authorization: Bearer {token}
```

## Query Parameters

### GET /api/researches

- `search` - Search in title, content, writer, publisher, keywords
- `writer` - Filter by writer name
- `publisher` - Filter by publisher name
- `keywords` - Filter by keywords (comma-separated or array)
- `sort_by` - Sort by: published_at, created_at, views, title
- `sort_order` - Sort order: asc, desc
- `per_page` - Items per page (max 100, default 15)

## Example Requests

### Get all researches
```bash
curl http://localhost:8000/api/researches
```

### Search researches
```bash
curl "http://localhost:8000/api/researches?search=islamic&sort_by=views&sort_order=desc"
```

### Create research (authenticated)
```bash
curl -X POST http://localhost:8000/api/researches \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Research Title",
    "content_plain": "Plain text content",
    "content_html": "<p>HTML content</p>",
    "published_at": "2024-01-15",
    "writer": "Writer Name",
    "publisher": "Publisher Name",
    "keywords": ["keyword1", "keyword2"]
  }'
```

## Database Schema

The database schema is managed in Supabase. See `researchesSql.txt` for the complete SQL setup.

### Tables

- `profiles` - User profiles with roles (viewer, publisher, admin)
- `researches` - Research articles with content, metadata, and views

## Security

- Row Level Security (RLS) is configured in Supabase
- API authentication via Laravel Sanctum
- Role-based access control (RBAC) for different user types
- CORS configured for cross-origin requests

## Notes

- Make sure to set your Supabase database password in `.env`
- The Supabase SQL script must be run before using the API
- Views increment uses Supabase function `increment_research_views` if available

