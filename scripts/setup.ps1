# UPGW Setup Script for Windows PowerShell
$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Setting up UPGW (Full-Stack AI Web)    " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$BackendDir = Join-Path $ProjectRoot "backend"
$FrontendDir = Join-Path $ProjectRoot "frontend"

# 1. Backend venv
Write-Host "`n[1/4] Checking Python Virtual Environment..." -ForegroundColor Yellow
$VenvPython = Join-Path $BackendDir "venv\Scripts\python.exe"
if (-not (Test-Path $VenvPython)) {
    Write-Host "Creating Python virtual environment in $BackendDir\venv..." -ForegroundColor Gray
    python -m venv (Join-Path $BackendDir "venv")
}

Write-Host "[2/4] Installing Backend Dependencies..." -ForegroundColor Yellow
& $VenvPython -m pip install -r (Join-Path $BackendDir "requirements.txt") --only-binary :all:

# 2. Frontend node_modules
Write-Host "`n[3/4] Installing Frontend Node Packages..." -ForegroundColor Yellow
Push-Location $FrontendDir
npm install
Pop-Location

# 3. Environment files
Write-Host "`n[4/4] Configuring Environment Files..." -ForegroundColor Yellow
$BackendEnv = Join-Path $BackendDir ".env"
$BackendExample = Join-Path $BackendDir ".env.example"
if (-not (Test-Path $BackendEnv)) {
    Copy-Item $BackendExample $BackendEnv
    Write-Host "Created backend\.env from template." -ForegroundColor Green
}

Write-Host "`n=========================================" -ForegroundColor Green
Write-Host "  UPGW Setup Completed Successfully!     " -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Run scripts\run-backend.ps1 to start the backend."
Write-Host "Run scripts\run-frontend.ps1 to start the frontend."
