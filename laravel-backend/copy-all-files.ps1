# Copy all frontend files to Laravel structure
$root = "C:\Users\moh04\OneDrive\Documents\HTML Uni\Tahajad"
$laravel = "$root\laravel-backend"

Write-Host "Copying CSS files..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$laravel\public\css" | Out-Null
Copy-Item -Path "$root\css\*" -Destination "$laravel\public\css\" -Recurse -Force

Write-Host "Copying JS files..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$laravel\public\js" | Out-Null
Copy-Item -Path "$root\js\*" -Destination "$laravel\public\js\" -Recurse -Force

Write-Host "Copying assets..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$laravel\public\assets" | Out-Null
Copy-Item -Path "$root\assets\*" -Destination "$laravel\public\assets\" -Recurse -Force

Write-Host "Copying JSON files..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$laravel\public\data" | Out-Null
Copy-Item -Path "$root\*.json" -Destination "$laravel\public\data\" -Force -ErrorAction SilentlyContinue

Write-Host "Done!" -ForegroundColor Green

