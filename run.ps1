param(
  [switch]$Down,
  [switch]$Logs
)

$ErrorActionPreference = "Stop"

if ($Down) {
  docker compose down -v
  exit $LASTEXITCODE
}

if ($Logs) {
  docker compose logs -f
  exit $LASTEXITCODE
}

docker compose up --build -d

Write-Host ""
Write-Host "Task Management System is starting up..."
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend:  http://localhost:4000"
Write-Host "Database: localhost:5433"
Write-Host ""
Write-Host "Useful commands:"
Write-Host "  .\run.ps1 -Logs"
Write-Host "  .\run.ps1 -Down"

