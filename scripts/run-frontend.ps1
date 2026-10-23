# Run UPGW React/Vite Frontend
$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$FrontendDir = Join-Path $ProjectRoot "frontend"

Write-Host "Starting UPGW React Frontend on http://127.0.0.1:5173..." -ForegroundColor Cyan

Push-Location $FrontendDir
npm run dev
Pop-Location
