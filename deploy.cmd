@echo off
setlocal enabledelayedexpansion

cd /d "%~dp0"

echo =======================================================
echo  Konstanta Education - DEPLOY ke VPS (Docker Compose)
echo =======================================================
echo.

git config --global --add safe.directory "%CD%"

REM === Validasi branch ===
echo [1/4] Mengecek branch...
for /f "delims=" %%b in ('git branch --show-current') do set CURRENT_BRANCH=%%b
if not "%CURRENT_BRANCH%"=="main" (
    echo [ERROR] Deploy harus dari branch main. Saat ini: %CURRENT_BRANCH%
    pause
    exit /b 1
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

if not defined NEXT_PUBLIC_SUPABASE_URL (
    echo [ERROR] NEXT_PUBLIC_SUPABASE_URL kosong di .env.local.
    pause
    exit /b 1
)
if not defined NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (
    echo [ERROR] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY kosong di .env.local.
    pause
    exit /b 1
)
if not defined SUPABASE_SECRET_KEY (
    echo [ERROR] SUPABASE_SECRET_KEY kosong di .env.local.
    pause
    exit /b 1
)
echo    Konfigurasi Supabase wajib terdeteksi.

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
git push origin main
if %errorlevel% neq 0 (
    echo [ERROR] Push gagal. Periksa koneksi internet.
    pause
    exit /b 1
)

REM === Deploy ke VPS via SSH ===
echo.
echo [4/4] Deploy ke VPS via SSH...
echo.

set "ENVTMP=%TEMP%\konstanta-edu-presence-deploy.env"
> "%ENVTMP%" echo NEXT_PUBLIC_SITE_URL=!NEXT_PUBLIC_SITE_URL!
>> "%ENVTMP%" echo NEXT_PUBLIC_SUPABASE_URL=!NEXT_PUBLIC_SUPABASE_URL!
>> "%ENVTMP%" echo NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=!NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
>> "%ENVTMP%" echo NEXT_PUBLIC_WHATSAPP_NUMBER=!NEXT_PUBLIC_WHATSAPP_NUMBER!
>> "%ENVTMP%" echo SUPABASE_SECRET_KEY=!SUPABASE_SECRET_KEY!

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@148.230.98.96 "mkdir -p /var/www/konstanta-edu-presence && cd /var/www/konstanta-edu-presence && { [ -d .git ] || git clone github-konstanta:youtaid/konstanta-edu-presence.git .; }"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Persiapan folder/clone di VPS gagal. Cek output SSH di atas.
    pause
    exit /b 1
)

scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null "%ENVTMP%" root@148.230.98.96:/var/www/konstanta-edu-presence/.env
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Gagal mengirim .env ke VPS. Cek output di atas.
    del "%ENVTMP%" >nul 2>&1
    pause
    exit /b 1
)
del "%ENVTMP%" >nul 2>&1

ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@148.230.98.96 "set -e; cd /var/www/konstanta-edu-presence; git remote set-url origin github-konstanta:youtaid/konstanta-edu-presence.git; git fetch origin main; git reset --hard origin/main; chmod +x deploy/scripts/update-vps.sh; bash deploy/scripts/update-vps.sh"
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Deploy VPS gagal. Cek output SSH di atas.
    pause
    exit /b 1
)

echo.
echo =======================================================
echo  DEPLOY SELESAI!
echo =======================================================
echo.
echo Membuka halaman production untuk verifikasi...
start "" "https://konstanta.my.id"
echo.
pause
