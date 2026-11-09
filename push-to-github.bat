@echo off
chcp 65001 > nul
echo ========================================================
echo   CONG CU HO TRO DAY SOURCE CODE LEN GITHUB
echo   Website: modadep.com.vn
echo ========================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [THONG BAO] May tinh cua ban hien tai chua cai dat Git CLI.
    echo.
    echo Ban co 2 cach cuc ky de de day len GitHub:
    echo.
    echo Cach 1: Cai dat phan mem 'GitHub Desktop' (Khuyen dung, de nhat):
    echo   👉 Link tai: https://desktop.github.com/
    echo   Sau khi cai, mo GitHub Desktop va chon 'Add Existing Repository'
    echo   tro toi thu muc nay roi bam 'Publish repository'.
    echo.
    echo Cach 2: Cai dat Git CLI:
    echo   👉 Link tai: https://git-scm.com/download/win
    echo   Sau khi cai xong, chay lai file nay de day code tu dong!
    echo.
    pause
    exit /b
)

echo [OK] Da tim thay Git tren may tinh!
echo.
set /p REPO_URL="Dan duong link Repository GitHub cua ban (Vi du: https://github.com/username/modadep.git): "

if "%REPO_URL%"=="" (
    echo [LOI] Ban chua nhap link repository. Vui long thu lai!
    pause
    exit /b
)

echo.
echo Dang khoi tao git va commit ma nguon...
git init
git add .
git commit -m "Khoi tao website Mo Da Dep - modadep.com.vn"
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Dang day code len GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================================
    echo CHUC MUNG! DA DAY WEBSITE LEN GITHUB THANH CONG!
    echo ========================================================
) else (
    echo.
    echo [CHU Y] Neu gap loi xac thuc, hay dang nhap vao tai khoan GitHub cua ban trong trinh duyet khi duoc hoi!
)

pause
