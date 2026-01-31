@echo off
REM Smart College Canteen Management System - Setup Script for Windows

echo ==================================================
echo Smart College Canteen Management System - Setup
echo ==================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js is not installed. Please install Node.js v18 or higher.
    pause
    exit /b 1
)

echo [OK] Node.js is installed
node --version
echo.

REM Check if MongoDB is installed
where mongod >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] MongoDB is not installed. Please install MongoDB v6 or higher.
    echo     You can continue, but you'll need to install MongoDB later.
) else (
    echo [OK] MongoDB is installed
)

echo.
echo Installing dependencies...
echo.

REM Install backend dependencies
echo Installing backend dependencies...
cd backend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [X] Failed to install backend dependencies
    pause
    exit /b 1
)

echo [OK] Backend dependencies installed
echo.

REM Install frontend dependencies
echo Installing frontend dependencies...
cd ..\frontend
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo [X] Failed to install frontend dependencies
    pause
    exit /b 1
)

echo [OK] Frontend dependencies installed
echo.

REM Seed database
echo Seeding database with sample data...
cd ..\backend

REM Check if MongoDB is running
where mongod >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    call npm run seed
    
    if %ERRORLEVEL% EQU 0 (
        echo [OK] Database seeded successfully
    ) else (
        echo [!] Database seeding failed. Please make sure MongoDB is running.
        echo     You can run 'cd backend && npm run seed' manually later.
    )
) else (
    echo [!] Skipping database seeding (MongoDB not found)
)

echo.
echo ==================================================
echo [OK] Setup Complete!
echo ==================================================
echo.
echo Default Credentials:
echo   Admin    - Username: admin    Password: admin123
echo   Kitchen  - Username: kitchen  Password: kitchen123
echo.
echo To start the application:
echo.
echo 1. Start Backend Server:
echo    cd backend
echo    npm start
echo    (Server will run on http://localhost:5000)
echo.
echo 2. Start Frontend Application (in a new terminal):
echo    cd frontend
echo    npm run dev
echo    (App will run on http://localhost:5173)
echo.
echo 3. Open http://localhost:5173 in your browser
echo.
echo ==================================================
echo.
pause
