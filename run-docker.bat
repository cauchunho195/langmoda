@echo off
chcp 65001 > nul
echo ========================================================
echo DANG BUILD VA KHOI CHAY HE THONG WEB VA QUAN TRI ADMIN...
echo ========================================================
docker compose up -d --build
if %errorlevel% neq 0 (
    echo.
    echo [LOI] Khong the chay docker compose.
    echo Vui long kiem tra Docker Desktop da duoc bat len chua!
    pause
    exit /b %errorlevel%
)
echo.
echo ========================================================
echo KHOI CHAY THANH CONG!
echo - Trang chu website:  http://localhost:8080
echo - Trang quan tri:     http://localhost:8080/admin
echo - Tai khoan quan tri: admin
echo - Mat khau quan tri:  modadep8386
echo ========================================================
start http://localhost:8080/admin
start http://localhost:8080
pause
