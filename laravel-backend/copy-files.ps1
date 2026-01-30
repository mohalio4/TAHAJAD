# PowerShell Script to Copy Files to Laravel Structure
# Run this script from the project root directory

$projectRoot = "C:\Users\moh04\OneDrive\Documents\HTML Uni\Tahajad"
$laravelRoot = "$projectRoot\laravel-backend"

Write-Host "Starting file migration..." -ForegroundColor Green

# Create directories
Write-Host "Creating directories..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "$laravelRoot\public\css" | Out-Null
New-Item -ItemType Directory -Force -Path "$laravelRoot\public\js" | Out-Null
New-Item -ItemType Directory -Force -Path "$laravelRoot\public\assets\images" | Out-Null
New-Item -ItemType Directory -Force -Path "$laravelRoot\public\assets\audio" | Out-Null
New-Item -ItemType Directory -Force -Path "$laravelRoot\public\data" | Out-Null
New-Item -ItemType Directory -Force -Path "$laravelRoot\resources\views\pages" | Out-Null
New-Item -ItemType Directory -Force -Path "$laravelRoot\resources\views\auth" | Out-Null

# Copy CSS files
Write-Host "Copying CSS files..." -ForegroundColor Yellow
Copy-Item -Path "$projectRoot\css\*" -Destination "$laravelRoot\public\css\" -Recurse -Force

# Copy JS files
Write-Host "Copying JS files..." -ForegroundColor Yellow
Copy-Item -Path "$projectRoot\js\*" -Destination "$laravelRoot\public\js\" -Recurse -Force

# Copy assets
Write-Host "Copying assets..." -ForegroundColor Yellow
Copy-Item -Path "$projectRoot\assets\*" -Destination "$laravelRoot\public\assets\" -Recurse -Force

# Copy JSON data files
Write-Host "Copying JSON data files..." -ForegroundColor Yellow
Copy-Item -Path "$projectRoot\*.json" -Destination "$laravelRoot\public\data\" -Force -ErrorAction SilentlyContinue

Write-Host "File migration completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Convert HTML files to Blade templates" -ForegroundColor White
Write-Host "2. Update asset paths in Blade templates" -ForegroundColor White
Write-Host "3. Test all pages" -ForegroundColor White

