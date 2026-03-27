@echo off
echo ============================================
echo Deploying Portfolio to GitHub Pages
echo ============================================

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo Building project...
call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo Exporting static files...
call npm run export

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Export failed
    pause
    exit /b 1
)

echo ============================================
echo Build complete! The static files are in the 'out' folder.
echo ============================================
echo.
echo Next steps:
echo 1. Push this repository to GitHub (if not already)
echo 2. Create a branch named 'gh-pages' or use GitHub Pages from 'docs' folder
echo 3. Copy contents of 'out' folder to your GitHub Pages branch/folder
echo 4. Configure GitHub Pages in repository settings
echo.
echo Alternatively, use GitHub Actions for automated deployment.
echo.
pause
