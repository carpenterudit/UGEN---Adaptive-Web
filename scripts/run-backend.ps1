# Run UPGW Backend Server
$ProjectRoot = Resolve-Path "$PSScriptRoot\.."
$BackendDir = Join-Path $ProjectRoot "backend"
$VenvPython = Join-Path $BackendDir "venv\Scripts\python.exe"

Write-Host "Starting UPGW FastAPI Backend on http://127.0.0.1:8000..." -ForegroundColor Cyan
Write-Host "API Docs will be available at http://127.0.0.1:8000/docs" -ForegroundColor Gray

Push-Location $BackendDir
& $VenvPython -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
Pop-Location
