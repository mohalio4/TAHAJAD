# Laravel Blade Architecture Diagram

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       USER BROWSER                              │
│                                                                  │
│  Visits URL (e.g., https://tahajad.local/prayer-times)         │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LARAVEL ROUTER                               │
│                    (routes/web.php)                             │
│                                                                  │
│  GET /prayer-times ──────────────────────────────────────────┐  │
│                         │                                    │  │
│                         ├─ Apply Middleware (auth:sanctum) ┐│  │
│                         │  ✓ Is authenticated?             ││  │
│                         │  ✗ Redirect to /login            ││  │
│                         │                                 ││  │
│                         ▼                                 ││  │
│  Routes to Controller and Method                        ││  │
│  PageController@prayerTimes                             ││  │
└────────────────────────┬─────────────────────────────────┘│  │
                         │                                   │  │
                         ▼                                   │  │
┌─────────────────────────────────────────────────────────────┬┐ │
│                      CONTROLLER                             │││
│         app/Http/Controllers/PageController.php            │││
│                                                            │││
│  public function prayerTimes()                            │││
│  {                                                        │││
│    // Fetch data from models/database (optional)         │││
│    $prayers = Prayer::all();                             │││
│                                                          │││
│    // Return view with data                             │││
│    return view('pages.prayer-times', [                 │││
│        'prayers' => $prayers                            │││
│    ]);                                                   │││
│  }                                                        │││
└────────────────────────┬────────────────────────────────┬─┘│ │
                         │                                │  │
                         ▼                                │  │
┌─────────────────────────────────────────────────────────┼──┐│ │
│                    BLADE VIEW                           │  ││ │
│       resources/views/pages/prayer-times.blade.php      │  ││ │
│                                                         │  ││ │
│  @extends('layouts.app')                              │  ││ │
│                                                         │  ││ │
│  @section('title', 'مواقيت الصلاة')                    │  ││ │
│                                                         │  ││ │
│  @section('extra-css')                                │  ││ │
│    <link rel="stylesheet" href="{{ asset(...) }}">    │  ││ │
│  @endsection                                           │  ││ │
│                                                         │  ││ │
│  @section('content')                                  │  ││ │
│    @foreach($prayers as $prayer)                      │  ││ │
│      <div>{{ $prayer->name }}</div>                   │  ││ │
│    @endforeach                                        │  ││ │
│  @endsection                                          │  ││ │
│                                                         │  ││ │
│  @section('extra-js')                                │  ││ │
│    <script src="{{ asset(...) }}"></script>           │  ││ │
│  @endsection                                          │  ││ │
└────────────────────────┬────────────────────────────┬──┘  ││ │
                         │                            │     ││ │
                         ▼                            │     ││ │
┌─────────────────────────────────────────────────┼─────┬──┘│ │
│              MAIN LAYOUT (app.blade.php)        │     │   │ │
│                                                  │     │   │ │
│  <!DOCTYPE html>                                │     │   │ │
│  <html>                                         │     │   │ │
│    <head>                                       │     │   │ │
│      <title>@yield('title')</title>             │     │   │ │
│      <meta name="csrf-token" ...>               │     │   │ │
│      <link rel="stylesheet" href="{{ asset(...) "}}-┐ │   │ │
│      @yield('extra-css')  ◄──────────────────────┘ │   │ │
│    </head>                                       │     │   │ │
│    <body>                                        │     │   │ │
│      @include('components.nav')                 │     │   │ │
│      <main>                                      │     │   │ │
│        @yield('content')  ◄──────────────────────┤───┘   │ │
│      </main>                                     │       │ │
│      @include('components.footer')              │       │ │
│      <script src="{{ asset(...) }}"></script>   │       │ │
│      @yield('extra-js')  ◄──────────────────────┘       │ │
│    </body>                                       │       │ │
│  </html>                                        │       │ │
└─────────────────────────────────────────────────┼───────┘ │
                                                  │         │
                         ▼                        │         │
┌─────────────────────────────────────────────────┴────────┐ │
│             STATIC ASSETS (public/)              │         │ │
│  ✓ CSS Files (css/*.css)                        │         │ │
│  ✓ JavaScript Files (js/*.js)                   │         │ │
│  ✓ Images (assets/images/*)                     │         │ │
│  ✓ Audio Files (assets/audio/*)                 │         │ │
└───────────────────────────────────────────────────────────┘ │
                                                           │
                                    │
                    ▼
        ┌─────────────────────────────┐
        │   RENDERED HTML SENT         │
        │   TO USER BROWSER            │
        │                              │
        │   Display Prayer Times Page  │
        │   with Theme, Navigation,    │
        │   and Content                │
        └─────────────────────────────┘
```

---

## Authentication Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    USER REGISTRATION                         │
└──────────────────────────────────────────────────────────────┘

   1. User visits /register
      │
      └──► PageController@register()
           │
           └──► view('auth.register')
                │
                └──► register.blade.php
                     (displays multi-step form)

   2. User fills form and submits
      │
      └──► JavaScript captures form data
           │
           └──► POST /api/auth/register (JSON)
                │
                └──► Api\AuthController@register()
                     ├─ Validate input
                     ├─ Hash password
                     ├─ Create user in database
                     └─ Generate Sanctum token

   3. API returns response
      │
      └──► {
              "success": true,
              "token": "...token...",
              "user": {...user data...}
            }

   4. JavaScript saves token
      │
      └──► localStorage.setItem('authToken', token)
           localStorage.setItem('userData', JSON.stringify(user))

   5. Redirect to home
      │
      └──► window.location.href = '/'
           │
           └──► User now logged in


┌──────────────────────────────────────────────────────────────┐
│                    USER LOGIN                                │
└──────────────────────────────────────────────────────────────┘

   1. User visits /login
      │
      └──► PageController@login()
           │
           └──► view('auth.login')
                │
                └──► login.blade.php
                     (displays login form)

   2. User enters credentials and submits
      │
      └──► JavaScript captures form data
           │
           └──► POST /api/auth/login (JSON)
                │
                └──► Api\AuthController@login()
                     ├─ Validate email exists
                     ├─ Check password
                     └─ Generate Sanctum token

   3. API returns response
      │
      └──► {
              "success": true,
              "token": "...token...",
              "user": {...user data...}
            }

   4. JavaScript saves token
      │
      └──► localStorage.setItem('authToken', token)

   5. Redirect to home
      │
      └──► User now logged in


┌──────────────────────────────────────────────────────────────┐
│              ACCESSING PROTECTED PAGES                        │
└──────────────────────────────────────────────────────────────┘

   1. User visits /prayer-times
      │
      └──► Router checks middleware: auth:sanctum
           │
           ├─ Has valid token in header?
           │  ├─ YES ──► Continue to controller
           │  │
           │  └─ NO ──► Redirect to /login
           │
           └──► PageController@prayerTimes()
                │
                └──► view('pages.prayer-times')
                     │
                     └──► Displays protected content

   2. API calls are made
      │
      └──► Requests include token in header:
           Authorization: Bearer <token>
           │
           └──► Api\AuthController validates token
                ├─ Valid ──► Return data
                └─ Invalid ──► Return 401 Unauthorized
```

---

## File Organization

```
TAHAJAD PROJECT
│
├── backend/                          (Laravel Application)
│   ├── resources/views/              (All Blade Templates)
│   │   ├── layouts/
│   │   │   ├── app.blade.php        (Main layout)
│   │   │   └── auth.blade.php       (Auth layout)
│   │   │
│   │   ├── components/
│   │   │   ├── nav.blade.php        (Navigation)
│   │   │   └── footer.blade.php     (Footer)
│   │   │
│   │   ├── auth/
│   │   │   ├── login.blade.php      (Login page)
│   │   │   └── register.blade.php   (Register page)
│   │   │
│   │   ├── pages/                   (Feature pages - all protected)
│   │   │   ├── prayer-times.blade.php
│   │   │   ├── duas.blade.php
│   │   │   ├── challenges.blade.php
│   │   │   └── ... (13 more pages)
│   │   │
│   │   └── index.blade.php          (Home page)
│   │
│   ├── app/Http/Controllers/
│   │   ├── PageController.php       (Renders pages)
│   │   └── Api/
│   │       ├── AuthController.php   (Auth API)
│   │       └── ... (other API controllers)
│   │
│   ├── routes/
│   │   ├── web.php                  (Page routes)
│   │   └── api.php                  (API routes)
│   │
│   ├── public/                       (Static assets)
│   │   ├── css/                      (CSS files)
│   │   │   ├── global-styles.css
│   │   │   ├── auth-pages.css
│   │   │   └── ...
│   │   │
│   │   ├── js/                       (JavaScript files)
│   │   │   ├── auth.js              (Form handling)
│   │   │   ├── api.js               (API calls)
│   │   │   ├── theme-manager.js
│   │   │   └── ...
│   │   │
│   │   └── assets/
│   │       ├── images/              (Logo, icons, etc)
│   │       └── audio/               (Audio files)
│   │
│   └── Documentation/
│       ├── BLADE_STRUCTURE.md
│       ├── BLADE_CONNECTION_GUIDE.md
│       ├── BLADE_IMPLEMENTATION_SUMMARY.md
│       ├── QUICK_REFERENCE.md
│       └── IMPLEMENTATION_CHECKLIST.md
│
├── html/                            (Original HTML files - reference only)
├── css/                             (Original CSS files - reference only)
├── js/                              (Original JS files - reference only)
└── assets/                          (Original assets - reference only)
```

---

## Route → Controller → View Flow

```
┌─ PUBLIC ROUTES ─────────────────────────────────────┐
│                                                      │
│  GET /              → PageController@home             │
│                        → index.blade.php              │
│                                                      │
│  GET /login         → PageController@login            │
│                        → auth/login.blade.php         │
│                                                      │
│  GET /register      → PageController@register         │
│                        → auth/register.blade.php      │
│                                                      │
│  GET /password-reset → PageController@passwordReset  │
│                        → auth/password-reset.blade.php│
│                                                      │
└──────────────────────────────────────────────────────┘

┌─ PROTECTED ROUTES (auth:sanctum) ───────────────────┐
│                                                      │
│  GET /prayer-times  → PageController@prayerTimes     │
│                        → pages/prayer-times.blade.php │
│                                                      │
│  GET /duas          → PageController@duas            │
│                        → pages/duas.blade.php         │
│                                                      │
│  GET /challenges    → PageController@challenges      │
│                        → pages/challenges.blade.php   │
│                                                      │
│  ... (12 more protected routes)                      │
│                                                      │
│  GET /profile       → PageController@profile($user)  │
│                        → pages/profile.blade.php      │
│                                                      │
│  GET /settings      → PageController@settings($user) │
│                        → pages/settings.blade.php     │
│                                                      │
└──────────────────────────────────────────────────────┘

┌─ API ROUTES ────────────────────────────────────────┐
│                                                      │
│  POST /api/auth/register                             │
│    → Api\AuthController@register                     │
│    → Returns: { token, user }                        │
│                                                      │
│  POST /api/auth/login                                │
│    → Api\AuthController@login                        │
│    → Returns: { token, user }                        │
│                                                      │
│  POST /api/auth/logout (protected)                   │
│    → Api\AuthController@logout                       │
│    → Returns: { success }                            │
│                                                      │
│  ... (30+ more API endpoints)                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## Blade Template Composition

```
┌──────────────────────────────────────────────────┐
│          REGISTER.BLADE.PHP STRUCTURE            │
│                                                  │
│  @extends('layouts.auth')                       │
│  │                                              │
│  ├─ @section('title')                          │
│  │  └─ "إنشاء حساب - تهجّد"                     │
│  │                                              │
│  └─ @section('content')                        │
│     ├─ Step 1 form                            │
│     ├─ Step 2 form                            │
│     ├─ Step 3 form                            │
│     └─ @section('extra-js')                   │
│        └─ Multi-step form JavaScript          │
│                                              │
└──────────────────────────────────────────────────┘

            │
            ├─ Extends ──► layouts/auth.blade.php
            │             ├─ <html>
            │             ├─ <head>
            │             │  ├─ @yield('title')
            │             │  ├─ CSS links
            │             │  └─ Meta tags
            │             │
            │             ├─ <body>
            │             │  ├─ Particles
            │             │  ├─ Background
            │             │  ├─ Back button
            │             │  ├─ @yield('content') ◄── Register form content
            │             │  └─ JS scripts
            │             │     └─ @yield('extra-js') ◄── Form JavaScript
            │             │
            │             └─ </body>
            │
            └─ Renders as ──► Complete HTML page
                             Ready to display in browser
```

---

## Summary

1. **User visits URL** → Router matches route
2. **Middleware checked** → Authentication verified (if protected)
3. **Controller method called** → Fetches data if needed
4. **Blade view rendered** → Inherits from layout, uses components
5. **HTML sent to browser** → Assets loaded from public/
6. **User sees complete page** → With styling, scripts, and interactivity

