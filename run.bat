@echo off
docker compose up --build -d
echo.
echo Task Management System is starting up...
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:4000
echo Database: localhost:5433
echo.
echo Useful commands:
echo   run.bat logs
echo   run.bat down
if "%1"=="logs" docker compose logs -f
if "%1"=="down" docker compose down -v
