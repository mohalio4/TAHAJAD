# Convert HTML files to Blade templates
$htmlDir = "C:\Users\moh04\OneDrive\Documents\HTML Uni\Tahajad\html"
$bladeDir = "C:\Users\moh04\OneDrive\Documents\HTML Uni\Tahajad\laravel-backend\resources\views\pages"

# Mapping of HTML files to Blade templates
$mappings = @{
    "index.html" = "index.blade.php"
    "dashboard_page.html" = "dashboard.blade.php"
    "prayer_times_page.html" = "prayer-times.blade.php"
    "duas_page.html" = "duas.blade.php"
    "challenges_page.html" = "challenges.blade.php"
    "hijri-calendar.html" = "hijri-calendar.blade.php"
    "self-accountability.html" = "self-accountability.blade.php"
    "istikhara.html" = "istikhara.blade.php"
    "post_page.html" = "posts.blade.php"
    "post_details.html" = "post-details.blade.php"
    "leaderthink.html" = "leaderthink.blade.php"
    "thaqalayn.html" = "thaqalayn.blade.php"
    "thaqalayn-book.html" = "thaqalayn-book.blade.php"
    "quran.html" = "quran.blade.php"
    "quran-surah.html" = "quran-surah.blade.php"
    "hyder-ai.html" = "hyder-ai.blade.php"
    "maktaba-masmouaa.html" = "maktaba-masmouaa.blade.php"
    "settings.html" = "settings.blade.php"
}

Write-Host "Converting HTML files to Blade templates..." -ForegroundColor Green

foreach ($mapping in $mappings.GetEnumerator()) {
    $htmlFile = Join-Path $htmlDir $mapping.Key
    $bladeFile = Join-Path $bladeDir $mapping.Value
    
    if (Test-Path $htmlFile) {
        Write-Host "Converting $($mapping.Key)..." -ForegroundColor Yellow
        
        $content = Get-Content $htmlFile -Raw -Encoding UTF8
        
        # Replace asset paths
        $content = $content -replace '\.\./css/', "{{ asset('css/') }}"
        $content = $content -replace '\.\./js/', "{{ asset('js/') }}"
        $content = $content -replace '\.\./assets/', "{{ asset('assets/') }}"
        
        # Replace HTML links with routes (basic replacements)
        $content = $content -replace 'href="index\.html"', 'href="{{ route(''home'') }}"'
        $content = $content -replace 'href="dashboard_page\.html"', 'href="{{ route(''dashboard'') }}"'
        $content = $content -replace 'href="prayer_times_page\.html"', 'href="{{ route(''prayer-times'') }}"'
        $content = $content -replace 'href="duas_page\.html"', 'href="{{ route(''duas'') }}"'
        $content = $content -replace 'href="challenges_page\.html"', 'href="{{ route(''challenges'') }}"'
        $content = $content -replace 'href="hijri-calendar\.html"', 'href="{{ route(''hijri-calendar'') }}"'
        $content = $content -replace 'href="self-accountability\.html"', 'href="{{ route(''self-accountability'') }}"'
        $content = $content -replace 'href="istikhara\.html"', 'href="{{ route(''istikhara'') }}"'
        $content = $content -replace 'href="post_page\.html"', 'href="{{ route(''posts'') }}"'
        $content = $content -replace 'href="leaderthink\.html"', 'href="{{ route(''leaderthink'') }}"'
        $content = $content -replace 'href="thaqalayn\.html"', 'href="{{ route(''thaqalayn'') }}"'
        $content = $content -replace 'href="quran\.html"', 'href="{{ route(''quran'') }}"'
        $content = $content -replace 'href="hyder-ai\.html"', 'href="{{ route(''hyder-ai'') }}"'
        $content = $content -replace 'href="maktaba-masmouaa\.html"', 'href="{{ route(''maktaba-masmouaa'') }}"'
        $content = $content -replace 'href="settings\.html"', 'href="{{ route(''settings'') }}"'
        $content = $content -replace 'href="login_page\.html"', 'href="{{ route(''login'') }}"'
        $content = $content -replace 'href="register_page\.html"', 'href="{{ route(''register'') }}"'
        
        # Wrap content in @extends and @section
        if (-not ($content -match '@extends')) {
            $title = if ($content -match '<title>(.*?)</title>') { $matches[1] } else { "تهجّد" }
            $bladeContent = "@extends('layouts.app')`n`n@section('title', '$title')`n`n@push('styles')`n"
            
            # Extract CSS links
            if ($content -match '<link rel="stylesheet" href="[^"]+\.css"[^>]*>') {
                $cssLinks = [regex]::Matches($content, '<link rel="stylesheet" href="([^"]+\.css)"[^>]*>')
                foreach ($match in $cssLinks) {
                    $cssPath = $match.Groups[1].Value -replace '\.\./css/', ''
                    $bladeContent += "<link rel=`"stylesheet`" href=`"{{ asset('css/$cssPath') }}`">`n"
                }
            }
            
            $bladeContent += "@endpush`n`n@section('content')`n"
            
            # Extract body content (remove head, nav will be in layout)
            if ($content -match '<body[^>]*>(.*?)</body>') {
                $bodyContent = $matches[1]
                # Remove navigation (already in layout)
                $bodyContent = $bodyContent -replace '<nav[^>]*>.*?</nav>', ''
                # Remove script tags (will be in @push('scripts'))
                $scripts = [regex]::Matches($bodyContent, '<script[^>]*>.*?</script>', [System.Text.RegularExpressions.RegexOptions]::Singleline)
                $bodyContent = $bodyContent -replace '<script[^>]*>.*?</script>', '', [System.Text.RegularExpressions.RegexOptions]::Singleline
                
                $bladeContent += $bodyContent
            }
            
            $bladeContent += "`n@endsection`n`n@push('scripts')`n"
            
            # Add script tags
            foreach ($script in $scripts) {
                $scriptSrc = if ($script.Value -match 'src="([^"]+)"') { 
                    $scriptPath = $matches[1] -replace '\.\./js/', ''
                    "<script src=`"{{ asset('js/$scriptPath') }}`"></script>`n"
                } else { "" }
                $bladeContent += $scriptSrc
            }
            
            $bladeContent += "@endpush`n"
            
            $content = $bladeContent
        }
        
        # Ensure directory exists
        $bladeDirParent = Split-Path $bladeFile -Parent
        if (-not (Test-Path $bladeDirParent)) {
            New-Item -ItemType Directory -Path $bladeDirParent -Force | Out-Null
        }
        
        # Write Blade file
        $content | Out-File -FilePath $bladeFile -Encoding UTF8 -NoNewline
        Write-Host "  ✓ Created $($mapping.Value)" -ForegroundColor Green
    } else {
        Write-Host "  ✗ File not found: $htmlFile" -ForegroundColor Red
    }
}

Write-Host "`nConversion complete!" -ForegroundColor Green
Write-Host "Note: Manual review and adjustments may be needed." -ForegroundColor Yellow

