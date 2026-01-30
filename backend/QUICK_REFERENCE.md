# Quick Reference Card

## 🎯 Key Points

### File Locations
- **Views**: `backend/resources/views/`
- **Routes**: `backend/routes/web.php` (pages) + `backend/routes/api.php` (API)
- **Controllers**: `backend/app/Http/Controllers/`
- **Assets**: `backend/public/` (css, js, images)

### Main Layouts
1. **app.blade.php** - For all public & protected pages
2. **auth.blade.php** - For login, register pages

### How Routes Work
```
URL → Route Definition → Controller Method → View (Blade Template)

GET /prayer-times 
  → routes/web.php 
  → PageController@prayerTimes 
  → pages/prayer-times.blade.php
```

### How Templates Use Blade
```blade
<!-- Extend a layout -->
@extends('layouts.app')

<!-- Add custom CSS -->
@section('extra-css')
  <link rel="stylesheet" href="{{ asset('css/custom.css') }}">
@endsection

<!-- Add page content -->
@section('content')
  <!-- HTML here -->
@endsection

<!-- Add custom JS -->
@section('extra-js')
  <script src="{{ asset('js/custom.js') }}"></script>
@endsection
```

### Blade Helpers Used
```blade
{{ route('home') }}              # Route by name
{{ asset('css/file.css') }}      # Asset path
{{ csrf_token() }}               # CSRF token
@csrf                            # CSRF in forms
@if(auth()->check())             # Check authentication
{{ auth()->user()->name }}       # Get user data
@auth                            # Auth block
@guest                           # Guest block
```

### Protected Routes
Routes with `auth:sanctum` middleware require user login:
```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/prayer-times', [PageController::class, 'prayerTimes']);
    // ... more routes
});
```

### Authentication Flow
```
1. User visits /register
2. Fills form & submits
3. API POST /api/auth/register
4. AuthController creates user
5. Returns token
6. Token saved to localStorage
7. Redirect to home
```

### API Endpoints
```
POST /api/auth/register        Public
POST /api/auth/login           Public
POST /api/auth/logout          Protected
GET /api/user/profile          Protected
```

### Form Submission
```blade
<form action="{{ route('api.login') }}" method="POST">
    @csrf
    <!-- fields -->
</form>
```

---

## 📂 Directory Map

```
backend/
├── resources/views/
│   ├── layouts/
│   │   ├── app.blade.php          ← Main layout
│   │   └── auth.blade.php         ← Auth layout
│   ├── components/
│   │   ├── nav.blade.php
│   │   └── footer.blade.php
│   ├── auth/
│   │   ├── login.blade.php        ← No social auth
│   │   └── register.blade.php     ← No social auth
│   ├── pages/                     ← All feature pages
│   │   ├── prayer-times.blade.php
│   │   ├── duas.blade.php
│   │   └── ... 15 more pages
│   └── index.blade.php            ← Home page
│
├── app/Http/Controllers/
│   ├── PageController.php         ← Renders pages
│   └── Api/
│       └── AuthController.php     ← Auth API
│
├── routes/
│   ├── web.php                    ← Page routes
│   └── api.php                    ← API routes
│
└── public/                        ← Static assets
    ├── css/
    ├── js/
    └── assets/
        ├── images/
        └── audio/
```

---

## 🔗 Connection Examples

### Adding a New Page
```
1. Create view: resources/views/pages/new-page.blade.php
2. Add method in PageController:
   public function newPage() {
       return view('pages.new-page');
   }
3. Add route in routes/web.php:
   Route::get('/new-page', [PageController::class, 'newPage'])->name('new-page');
4. Link to it:
   <a href="{{ route('new-page') }}">New Page</a>
```

### Accessing Authenticated User
```blade
@if(auth()->check())
    Welcome {{ auth()->user()->name }}!
@else
    <a href="{{ route('login') }}">Login</a>
@endif
```

### Including a Component
```blade
@include('components.nav')
@include('components.footer')
```

### Passing Data to View
```php
// In Controller
return view('pages.profile', [
    'user' => auth()->user(),
    'stats' => $userStats
]);

// In View
<h1>{{ $user->name }}</h1>
<p>{{ $stats->total_prayers }}</p>
```

---

## ✅ Status Check

| Item | Status |
|------|--------|
| HTML → Blade Conversion | ✅ Complete |
| Route Setup | ✅ Complete |
| Controller Setup | ✅ Complete |
| Layout Inheritance | ✅ Complete |
| Asset Paths | ✅ Complete |
| Authentication | ✅ Complete |
| Social Auth | ✅ Removed |
| Protected Routes | ✅ Configured |
| Components | ✅ Created |

---

## 🎓 Key Terms

- **Route**: URL pattern → `GET /prayer-times`
- **Controller**: Logic handler → `PageController@prayerTimes`
- **View**: Template file → `pages/prayer-times.blade.php`
- **Blade**: Laravel templating language
- **Asset**: Static file (CSS, JS, images)
- **Middleware**: Request filter → `auth:sanctum`
- **Component**: Reusable template piece → `nav.blade.php`
- **Sanctuary**: Laravel token authentication

---

## 💡 Tips

1. Always use `route()` for links, not hardcoded URLs
2. Always use `asset()` for CSS, JS, images
3. Always add `@csrf` to forms
4. Check route names: `php artisan route:list`
5. Clear cache after changes: `php artisan cache:clear`
6. Use components for repetitive HTML
7. Pass data from controller to view using second parameter

---

## 🚀 Quick Commands

```bash
# List all routes
php artisan route:list

# Clear cache
php artisan cache:clear

# Run migrations
php artisan migrate

# Create new migration
php artisan make:migration table_name

# Test server
php artisan serve

# Optimize
php artisan optimize
```

---

## 📞 Support Docs

1. **BLADE_STRUCTURE.md** - Detailed file organization
2. **BLADE_CONNECTION_GUIDE.md** - Complete route mapping
3. **BLADE_IMPLEMENTATION_SUMMARY.md** - Full implementation details

---

**All HTML files have been successfully converted to Laravel Blade templates with complete routing and controller connections! 🎉**
