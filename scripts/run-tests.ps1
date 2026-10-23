# Run UPGW Backend Automated Tests
$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$BackendDir = Join-Path $ProjectRoot "backend"
$VenvPython = Join-Path $BackendDir "venv\Scripts\python.exe"

Write-Host "Running UPGW Test Suite with Pytest..." -ForegroundColor Cyan

Push-Location $BackendDir
& $VenvPython -m pytest app/tests -v
Pop-Location
