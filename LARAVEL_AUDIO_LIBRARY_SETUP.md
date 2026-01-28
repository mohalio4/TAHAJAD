# Laravel Audio Library Service Setup Guide

This guide explains how to build the audio library backend service using Laravel that integrates with the Flutter mobile application.

## Overview

The Flutter app expects a REST API that provides audio catalog data. The current implementation connects to:
- **Base URL**: `https://fancy-boat-e3b2.tahajjad-lb.workers.dev`
- **API Endpoint**: `/api/catalog`

## API Requirements

### Endpoint: GET /api/catalog

**Response Format**: JSON array of audio items

**Expected Response Structure**:
```json
[
  {
    "id": "1",
    "title": "Audio Title",
    "speaker": "Speaker Name",
    "relation": "Relation/Context",
    "date": "2024-01-15",
    "audio": "/audio/example.m4a",
    "cover": "/images/cover.jpg",
    "durationSec": 3600,
    "type": "ad3eya"
  }
]
```

### Field Descriptions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier for the audio item |
| `title` | string | Yes | Title of the audio |
| `speaker` | string | Yes | Name of the speaker |
| `relation` | string | Yes | Relation or context (e.g., "زيارة", "دعاء") |
| `date` | string | Yes | Date in format "YYYY-MM-DD" |
| `audio` | string | Yes | Path to audio file (relative or absolute URL) |
| `cover` | string | No | Path to cover image (optional) |
| `durationSec` | integer | No | Duration in seconds (optional) |
| `type` | string | Yes | Audio type category (see types below) |

### Audio Types

The following types are supported:
- `ad3eya` - أدعية وزيارات (Prayers and Visits)
- `majlis` - عزاء (Mourning)
- `aakida` - عقائد (Beliefs)
- `sira` - سيرة (Biography)
- `fokoh` - فقه (Jurisprudence)
- `akhlak` - أخلاق (Ethics)
- `motnawe3` - متنوّع (Miscellaneous)
- `quran` - قرآن (Quran)
- `snasrollah` - الشّهيد السيد حسن نصرالله

## Laravel Implementation

### 1. Database Schema

Create a migration for the audio items table:

```php
<?php
// database/migrations/YYYY_MM_DD_create_audio_items_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audio_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('speaker');
            $table->string('relation');
            $table->date('date');
            $table->string('audio_path'); // Path to audio file
            $table->string('cover_path')->nullable(); // Path to cover image
            $table->integer('duration_sec')->nullable(); // Duration in seconds
            $table->string('type'); // Audio type category
            $table->timestamps();
            
            // Indexes for better query performance
            $table->index('type');
            $table->index('date');
            $table->index('speaker');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audio_items');
    }
};
```

### 2. Model

Create the AudioItem model:

```php
<?php
// app/Models/AudioItem.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AudioItem extends Model
{
    protected $fillable = [
        'title',
        'speaker',
        'relation',
        'date',
        'audio_path',
        'cover_path',
        'duration_sec',
        'type',
    ];

    protected $casts = [
        'date' => 'date',
        'duration_sec' => 'integer',
    ];

    /**
     * Get the API representation of the audio item
     */
    public function toApiArray(): array
    {
        return [
            'id' => (string) $this->id,
            'title' => $this->title,
            'speaker' => $this->speaker,
            'relation' => $this->relation,
            'date' => $this->date->format('Y-m-d'),
            'audio' => $this->getAudioUrl(),
            'cover' => $this->getCoverUrl(),
            'durationSec' => $this->duration_sec,
            'type' => $this->type,
        ];
    }

    /**
     * Get full URL for audio file
     */
    private function getAudioUrl(): string
    {
        // If audio_path is already a full URL, return it
        if (filter_var($this->audio_path, FILTER_VALIDATE_URL)) {
            return $this->audio_path;
        }
        
        // Otherwise, construct URL from base URL
        $baseUrl = rtrim(config('app.audio_base_url', config('app.url')), '/');
        return $baseUrl . '/' . ltrim($this->audio_path, '/');
    }

    /**
     * Get full URL for cover image
     */
    private function getCoverUrl(): ?string
    {
        if (!$this->cover_path) {
            return null;
        }
        
        // If cover_path is already a full URL, return it
        if (filter_var($this->cover_path, FILTER_VALIDATE_URL)) {
            return $this->cover_path;
        }
        
        // Otherwise, construct URL from base URL
        $baseUrl = rtrim(config('app.audio_base_url', config('app.url')), '/');
        return $baseUrl . '/' . ltrim($this->cover_path, '/');
    }
}
```

### 3. Controller

Create the AudioController:

```php
<?php
// app/Http/Controllers/Api/AudioController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AudioItem;
use Illuminate\Http\JsonResponse;

class AudioController extends Controller
{
    /**
     * Get all audio items catalog
     * 
     * @return JsonResponse
     */
    public function catalog(): JsonResponse
    {
        $items = AudioItem::orderBy('date', 'desc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($item) => $item->toApiArray());

        return response()->json($items);
    }
}
```

### 4. Routes

Add the API route:

```php
<?php
// routes/api.php

use App\Http\Controllers\Api\AudioController;
use Illuminate\Support\Facades\Route;

// Audio Library API
Route::get('/catalog', [AudioController::class, 'catalog'])->name('api.audio.catalog');
```

### 5. Configuration

Add audio base URL to your `.env` file:

```env
AUDIO_BASE_URL=https://your-domain.com
```

Add to `config/app.php`:

```php
'audio_base_url' => env('AUDIO_BASE_URL', env('APP_URL')),
```

### 6. CORS Configuration

Ensure CORS is properly configured in `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_methods' => ['*'],
'allowed_origins' => ['*'], // Or specify your Flutter app domains
'allowed_headers' => ['*'],
```

## Authentication (Optional)

If you need to protect the API with authentication, you can use Laravel Sanctum or API tokens:

### Using API Token Authentication

1. Add middleware to the route:

```php
Route::middleware('auth:sanctum')->get('/catalog', [AudioController::class, 'catalog']);
```

2. The Flutter app would need to send the token in headers:

```dart
final headers = {
  'Authorization': 'Bearer YOUR_API_TOKEN',
  'Accept': 'application/json',
};
```

## Server Configuration

### URL and Access Credentials

**API Base URL**: 
```
https://your-laravel-domain.com/api
```

**Full Catalog Endpoint**:
```
https://your-laravel-domain.com/api/catalog
```

**Admin Panel URL** (if using Laravel admin):
```
https://your-laravel-domain.com/admin
```

**Database Credentials**:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password
```

**API Authentication Token** (if using Sanctum):
```
YOUR_API_TOKEN_HERE
```

## File Storage

### Option 1: Local Storage

Store files in `storage/app/public/audio/` and `storage/app/public/images/`:

```php
// In your migration or seeder
$audioPath = 'audio/example.m4a';
$coverPath = 'images/cover.jpg';
```

Make sure to create a symbolic link:
```bash
php artisan storage:link
```

### Option 2: Cloud Storage (S3, etc.)

Configure filesystem in `config/filesystems.php` and use:

```php
$audioPath = Storage::disk('s3')->url('audio/example.m4a');
```

## Testing the API

Test the endpoint using curl:

```bash
curl -X GET https://your-laravel-domain.com/api/catalog \
  -H "Accept: application/json"
```

Or using Postman/Insomnia:
- Method: GET
- URL: `https://your-laravel-domain.com/api/catalog`
- Headers: `Accept: application/json`

## Updating Flutter App Configuration

After setting up your Laravel backend, update the Flutter app's `audio_api.dart`:

```dart
class AudioApi {
  static const String baseUrl = "https://your-laravel-domain.com/api";
  // ... rest of the code
}
```

## Additional Features (Optional)

### 1. Filtering and Search

Add query parameters support:

```php
public function catalog(Request $request): JsonResponse
{
    $query = AudioItem::query();
    
    // Filter by type
    if ($request->has('type')) {
        $query->where('type', $request->type);
    }
    
    // Search in title and speaker
    if ($request->has('search')) {
        $search = $request->search;
        $query->where(function($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('speaker', 'like', "%{$search}%");
        });
    }
    
    $items = $query->orderBy('date', 'desc')->get()
        ->map(fn($item) => $item->toApiArray());

    return response()->json($items);
}
```

### 2. Pagination

```php
public function catalog(Request $request): JsonResponse
{
    $perPage = $request->get('per_page', 50);
    $items = AudioItem::orderBy('date', 'desc')
        ->paginate($perPage)
        ->through(fn($item) => $item->toApiArray());

    return response()->json($items);
}
```

### 3. Caching

Add caching to improve performance:

```php
public function catalog(): JsonResponse
{
    $items = Cache::remember('audio_catalog', 3600, function () {
        return AudioItem::orderBy('date', 'desc')
            ->get()
            ->map(fn($item) => $item->toApiArray());
    });

    return response()->json($items);
}
```

## Security Considerations

1. **Rate Limiting**: Add rate limiting to prevent abuse:
```php
Route::middleware(['throttle:60,1'])->get('/catalog', [AudioController::class, 'catalog']);
```

2. **Input Validation**: Validate any query parameters
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Configure CORS properly for production

## Troubleshooting

### Common Issues

1. **404 Not Found**: Ensure routes are registered and API prefix is correct
2. **CORS Errors**: Check CORS configuration
3. **File URLs Not Working**: Verify storage link and file permissions
4. **Slow Response**: Add caching and database indexes

## Next Steps

1. Set up your Laravel project
2. Run migrations to create the database table
3. Seed some test data
4. Configure file storage
5. Test the API endpoint
6. Update Flutter app with new base URL
7. Deploy to production server

---

**Note**: Replace placeholder values (URLs, passwords, tokens) with your actual credentials before deploying to production.
