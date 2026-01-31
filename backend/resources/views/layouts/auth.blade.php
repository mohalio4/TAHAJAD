<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'تهجّد')</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="{{ asset('assets/images/logo1.png') }}">
    
    <!-- Link CSS Files -->
    <link rel="stylesheet" href="{{ asset('css/root-variables.css') }}">
    <link rel="stylesheet" href="{{ asset('css/global-styles.css') }}">
    <link rel="stylesheet" href="{{ asset('css/auth-pages.css') }}">
    <link rel="stylesheet" href="{{ asset('css/animations.css') }}">
    <link rel="stylesheet" href="{{ asset('css/landing-page.css') }}">
    
    <!-- Google Fonts - Arabic Support -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
</head>
<body class="emerald-theme auth-page">
    
    <!-- Animated Background Particles -->
    <div class="particles-container" id="particles"></div>
    
    <!-- Auth Background Pattern -->
    <div class="auth-background">
        <div class="pattern-overlay"></div>
    </div>
    
    <!-- Back to Home Button -->
    <a href="{{ route('home') }}" class="back-home">
        <span class="back-icon">→</span>
        <span>العودة للرئيسية</span>
    </a>
    
    <!-- Main Auth Container -->
    <div class="auth-container">
        @yield('content')
    </div>

    <!-- Toast -->
    <div id="authToast" class="auth-toast" role="status" aria-live="polite"></div>
    
    <!-- Scripts -->
    <script src="{{ asset('js/particles.js') }}"></script>
    <script src="{{ asset('js/theme-manager.js') }}"></script>
    <script src="{{ asset('js/animations.js') }}"></script>
    <script src="{{ asset('js/api.js') }}"></script>
    @yield('extra-js')
</body>
</html>
