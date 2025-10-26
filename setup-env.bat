@echo off
echo ========================================
echo   Samartha Setu - Environment Setup
echo ========================================
echo.

cd backend

if exist .env (
    echo [INFO] .env file already exists!
    echo.
    choice /C YN /M "Do you want to overwrite it"
    if errorlevel 2 goto :skip
)

echo [STEP 1] Creating .env file from .env.example...
copy .env.example .env >nul
echo [SUCCESS] .env file created!
echo.

:skip
echo [STEP 2] Verifying Cloudinary credentials...
findstr "CLOUDINARY_CLOUD_NAME" .env >nul
if %errorlevel% equ 0 (
    echo [SUCCESS] Cloudinary credentials found!
) else (
    echo [WARNING] Cloudinary credentials missing!
    echo Please add them to backend\.env file
)
echo.

echo [STEP 3] Installing dependencies...
call npm install
echo.

echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start backend: cd backend ^&^& npm run dev
echo 2. Start frontend: cd frontend ^&^& npm start
echo 3. Test image upload in Create Listing page
echo.
pause
