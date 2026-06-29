@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo =================================================================
echo  Konstanta Edu Presence - DEPLOY ke VPS (Docker Compose)
echo  Target: konstanta.my.id
echo =================================================================
echo.

git config --global --add safe.directory "%CD%"

REM === Validasi branch ===
echo [1/4] Mengecek branch...
for /f "delims=" %%b in ('git branch --show-current') do set CURRENT_BRANCH=%%b
if not "%CURRENT_BRANCH%"=="main" (
    echo [WARNING] Deploy disarankan dari branch main. Saat ini: %CURRENT_BRANCH%
    set /p proceed="Lanjutkan deploy dari branch %CURRENT_BRANCH%? (y/n): "
    if /i not "!proceed!"=="y" (
        exit /b 1
    )
)

REM === Load .env.local ===
echo [2/4] Memuat environment dari .env.local...
if not exist ".env.local" (
    echo [ERROR] File .env.local tidak ditemukan!
    echo Buat file .env.local dari .env.local.example lalu isi nilainya.
    pause
    exit /b 1
)

for /f "usebackq tokens=1,* delims==" %%A in (".env.local") do (
    set "LINE=%%A"
    if not "!LINE:~0,1!"=="#" (
        if not "%%B"=="" (
            set "%%A=%%B"
        )
    )
)
echo    .env.local berhasil dimuat.

REM === Git commit dan push ===
echo.
echo [3/4] Status perubahan lokal:
git status -s
echo.

set /p msg="Pesan commit (kosongkan untuk 'Auto update'): "
if "%msg%"=="" set msg=Auto update

git add .
git commit -m "%msg%"

echo.
echo [+] Push ke GitHub...
git push origin %CURRENT_BRANCH%
if %errorlevel% neq 0 (
    echo [ERROR] Push gagal. Periksa koneksi internet.
    pause
    exit /b 1
)

REM === Deploy ke VPS via SSH ===
echo.
echo [4/4] Deploy ke VPS via SSH...
echo.

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@148.230.98.96 "bash -s" < NUL ^
 || echo Menjalankan script remote...

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@148.230.98.96 ^
    "set -e && ^
     if [ ! -d /var/www/konstanta-edu-presence ]; then mkdir -p /var/www/konstanta-edu-presence; fi && ^
     cd /var/www/konstanta-edu-presence && ^
     if [ ! -d .git ]; then git clone https://github.com/youtaid/konstanta-edu-presence.git .; fi && ^
     git fetch origin %CURRENT_BRANCH% && ^
     git reset --hard origin/%CURRENT_BRANCH% && ^
     echo 'NEXT_PUBLIC_SUPABASE_URL=!NEXT_PUBLIC_SUPABASE_URL!' > .env && ^
     echo 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=!NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!' >> .env && ^
     echo 'SUPABASE_SECRET_KEY=!SUPABASE_SECRET_KEY!' >> .env && ^
     echo 'SUPABASE_JWKS_URL=!SUPABASE_JWKS_URL!' >> .env && ^
     chmod +x deploy/scripts/update-vps.sh && ^
     bash deploy/scripts/update-vps.sh"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deploy VPS gagal. Cek output SSH di atas.
    pause
    exit /b 1
)

echo.
echo =================================================================
echo  DEPLOY SELESAI!
echo =================================================================
echo.
echo Membuka halaman production untuk verifikasi...
start "" "https://konstanta.my.id"
echo.
pause
