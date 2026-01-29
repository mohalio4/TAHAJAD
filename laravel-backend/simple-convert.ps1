# Simple HTML to Blade Converter
# This script extracts the main content from HTML files and wraps them in Blade directives

$htmlSourceDir = "C:\Users\moh04\OneDrive\Documents\HTML Uni\Tahajad\html"
$bladeDestDir = "C:\Users\moh04\OneDrive\Documents\HTML Uni\Tahajad\laravel-backend\resources\views\pages"
$authBladeDestDir = "C:\Users\moh04\OneDrive\Documents\HTML Uni\Tahajad\laravel-backend\resources\views\auth"

# Ensure directories exist
New-Item -ItemType Directory -Path $bladeDestDir -Force | Out-Null
New-Item -ItemType Directory -Path $authBladeDestDir -Force | Out-Null

# Mapping of HTML files to Blade files with their configurations
$fileMappings = @{
    "prayer_times_page.html" = @{
        blade = "prayer_times.blade.php"
        dest = $bladeDestDir
        title = "مواقيت الصلاة - تهجّد"
        styles = @("prayer-times.css")
        bodyClass = "prayer-times-page"
        scripts = @("prayer-times.js")
    }
    "duas_page.html" = @{
        blade = "duas.blade.php"
        dest = $bladeDestDir
        title = "مكتبة الأدعية - تهجّد"
        styles = @("duas.css")
        bodyClass = "duas-page"
        scripts = @("duas.js")
    }
    "challenges_page.html" = @{
        blade = "challenges.blade.php"
        dest = $bladeDestDir
        title = "التحديات - تهجّد"
        styles = @("challenges.css")
        bodyClass = "challenges-page"
        scripts = @("challenges.js")
    }
    "settings.html" = @{
        blade = "settings.blade.php"
        dest = $bladeDestDir
        title = "الإعدادات - تهجّد"
        styles = @("prayer-times.css")
        bodyClass = "settings-page"
        scripts = @("settings.js")
    }
    "hijri-calendar.html" = @{
        blade = "hijri_calendar.blade.php"
        dest = $bladeDestDir
        title = "التقويم الهجري - تهجّد"
        styles = @("hijri-calendar.css")
        bodyClass = "calendar-page"
        scripts = @("hijri-calendar.js")
    }
    "self-accountability.html" = @{
        blade = "self_accountability.blade.php"
        dest = $bladeDestDir
        title = "محاسبة النفس - تهجّد"
        styles = @("khirah.css")
        bodyClass = "khirah-page"
        scripts = @("khirah.js")
    }
    "istikhara.html" = @{
        blade = "istikhara.blade.php"
        dest = $bladeDestDir
        title = "الاستخارة بالقرآن - تهجّد"
        styles = @("istikhara.css")
        bodyClass = "istikhara-page"
        scripts = @("istikhara.js")
    }
    "quran.html" = @{
        blade = "quran.blade.php"
        dest = $bladeDestDir
        title = "القرآن الكريم - تهجّد"
        styles = @("quran.css")
        bodyClass = "quran-page"
        scripts = @("quran.js")
    }
    "quran-surah.html" = @{
        blade = "quran_surah.blade.php"
        dest = $bladeDestDir
        title = "قراءة السورة - القرآن الكريم - تهجّد"
        styles = @("quran.css", "quran-surah.css")
        bodyClass = "quran-page"
        scripts = @("quran-surah.js")
    }
    "maktaba-masmouaa.html" = @{
        blade = "maktaba_masmouaa.blade.php"
        dest = $bladeDestDir
        title = "مكتبة مسموعة - دليل إعداد Laravel"
        styles = @("maktaba-masmouaa.css")
        bodyClass = ""
        scripts = @()
        headScripts = @(
            '<link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">',
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>',
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-php.min.js"></script>',
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-bash.min.js"></script>',
            '<script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-json.min.js"></script>'
        )
    }
    "post_page.html" = @{
        blade = "post_page.blade.php"
        dest = $bladeDestDir
        title = "المنشورات - تهجّد"
        styles = @("posts.css")
        bodyClass = "posts-page"
        scripts = @("posts.js")
    }
    "post_details.html" = @{
        blade = "post_details.blade.php"
        dest = $bladeDestDir
        title = "تفاصيل المنشور - تهجّد"
        styles = @("posts.css")
        bodyClass = "post-details-page"
        scripts = @("post-details.js")
    }
    "leaderthink.html" = @{
        blade = "leaderthink.blade.php"
        dest = $bladeDestDir
        title = "فكر القائد - تهجّد"
        styles = @("leaderthink.css")
        bodyClass = "leaderthink-page"
        scripts = @("leaderthink.js")
    }
    "thaqalayn.html" = @{
        blade = "thaqalayn.blade.php"
        dest = $bladeDestDir
        title = "الثقلين - تهجّد"
        styles = @("thaqalayn.css")
        bodyClass = "thaqalayn-page"
        scripts = @("thaqalayn.js")
    }
    "thaqalayn-book.html" = @{
        blade = "thaqalayn_book.blade.php"
        dest = $bladeDestDir
        title = "كتاب الثقلين - تهجّد"
        styles = @("thaqalayn.css")
        bodyClass = "thaqalayn-book-page"
        scripts = @("thaqalayn-book.js")
    }
    "hyder-ai.html" = @{
        blade = "hyder_ai.blade.php"
        dest = $bladeDestDir
        title = "اسأل Hyder.ai - تهجّد"
        styles = @("hyder-ai.css")
        bodyClass = ""
        scripts = @("hyder-ai.js")
    }
}

foreach ($mapping in $fileMappings.GetEnumerator()) {
    $htmlFile = $mapping.Name
    $config = $mapping.Value
    
    $htmlPath = Join-Path $htmlSourceDir $htmlFile
    $bladePath = Join-Path $config.dest $config.blade
    
    if (-not (Test-Path $htmlPath)) {
        Write-Warning "HTML file not found: $htmlPath"
        continue
    }
    
    Write-Host "Converting $htmlFile to $($config.blade)..."
    
    $htmlContent = Get-Content $htmlPath -Raw -Encoding UTF8
    
    # Extract content between <main> and </main> (or <body> if no main)
    $mainMatch = [regex]::Match($htmlContent, '(?s)<main[^>]*>(.*?)</main>')
    if ($mainMatch.Success) {
        $mainContent = $mainMatch.Groups[1].Value
    } else {
        # Fallback: extract everything between <body> and </body>, excluding nav and scripts
        $bodyMatch = [regex]::Match($htmlContent, '(?s)<body[^>]*>.*?<nav.*?</nav>(.*?)</body>')
        if ($bodyMatch.Success) {
            $mainContent = $bodyMatch.Groups[1].Value
            # Remove scripts
            $mainContent = $mainContent -replace '(?s)<script[^>]*>.*?</script>', ''
        } else {
            Write-Warning "Could not extract main content from $htmlFile"
            continue
        }
    }
    
    # Build Blade template
    $bladeContent = "@extends('layouts.app')`n`n"
    $bladeContent += "@section('title', '$($config.title)')`n`n"
    
    if ($config.styles.Count -gt 0) {
        $bladeContent += "@push('styles')`n"
        foreach ($style in $config.styles) {
            $bladeContent += "    <link rel=`"stylesheet`" href=`"{{ asset('css/$style') }}`">`n"
        }
        $bladeContent += "@endpush`n`n"
    }
    
    if ($config.bodyClass) {
        $bladeContent += "@section('body_class', '$($config.bodyClass)')`n`n"
    }
    
    if ($config.headScripts -and $config.headScripts.Count -gt 0) {
        $bladeContent += "@push('head_scripts')`n"
        foreach ($script in $config.headScripts) {
            $bladeContent += "    $script`n"
        }
        $bladeContent += "@endpush`n`n"
    }
    
    $bladeContent += "@section('content')`n"
    $bladeContent += $mainContent
    $bladeContent += "`n@endsection`n`n"
    
    if ($config.scripts.Count -gt 0) {
        $bladeContent += "@push('scripts')`n"
        foreach ($script in $config.scripts) {
            $bladeContent += "    <script src=`"{{ asset('js/$script') }}`"></script>`n"
        }
        $bladeContent += "@endpush`n"
    }
    
    # Replace asset paths
    $bladeContent = $bladeContent -replace 'src="\.\./assets/images/(.*?)"', 'src="{{ asset(''assets/images/$1'') }}"'
    $bladeContent = $bladeContent -replace 'href="\.\./assets/images/(.*?)"', 'href="{{ asset(''assets/images/$1'') }}"'
    
    # Replace route links (basic replacements)
    $bladeContent = $bladeContent -replace 'href="index\.html"', 'href="{{ route(''home'') }}"'
    $bladeContent = $bladeContent -replace 'href="dashboard_page\.html"', 'href="{{ route(''dashboard'') }}"'
    $bladeContent = $bladeContent -replace 'href="prayer_times_page\.html"', 'href="{{ route(''prayer-times'') }}"'
    $bladeContent = $bladeContent -replace 'href="duas_page\.html"', 'href="{{ route(''duas'') }}"'
    $bladeContent = $bladeContent -replace 'href="challenges_page\.html"', 'href="{{ route(''challenges'') }}"'
    $bladeContent = $bladeContent -replace 'href="hijri-calendar\.html"', 'href="{{ route(''hijri-calendar'') }}"'
    $bladeContent = $bladeContent -replace 'href="self-accountability\.html"', 'href="{{ route(''self-accountability'') }}"'
    $bladeContent = $bladeContent -replace 'href="istikhara\.html"', 'href="{{ route(''istikhara'') }}"'
    $bladeContent = $bladeContent -replace 'href="quran\.html"', 'href="{{ route(''quran'') }}"'
    $bladeContent = $bladeContent -replace 'href="quran-surah\.html"', 'href="{{ route(''quran-surah'') }}"'
    $bladeContent = $bladeContent -replace 'href="maktaba-masmouaa\.html"', 'href="{{ route(''maktaba-masmouaa'') }}"'
    $bladeContent = $bladeContent -replace 'href="post_page\.html"', 'href="{{ route(''post-page'') }}"'
    $bladeContent = $bladeContent -replace 'href="post_details\.html"', 'href="{{ route(''post-details'') }}"'
    $bladeContent = $bladeContent -replace 'href="leaderthink\.html"', 'href="{{ route(''leaderthink'') }}"'
    $bladeContent = $bladeContent -replace 'href="thaqalayn\.html"', 'href="{{ route(''thaqalayn'') }}"'
    $bladeContent = $bladeContent -replace 'href="thaqalayn-book\.html"', 'href="{{ route(''thaqalayn-book'') }}"'
    $bladeContent = $bladeContent -replace 'href="hyder-ai\.html"', 'href="{{ route(''hyder-ai'') }}"'
    $bladeContent = $bladeContent -replace 'href="login_page\.html"', 'href="{{ route(''login'') }}"'
    $bladeContent = $bladeContent -replace 'href="register_page\.html"', 'href="{{ route(''register'') }}"'
    $bladeContent = $bladeContent -replace 'href="settings\.html"', 'href="{{ route(''settings'') }}"'
    
    # Replace JSON file paths
    $bladeContent = $bladeContent -replace '\.\./json/', "{{ asset('json/') }}"
    
    Set-Content -Path $bladePath -Value $bladeContent -Encoding UTF8
    Write-Host "Successfully converted $htmlFile to $($config.blade)"
}

Write-Host "`nConversion complete!"

