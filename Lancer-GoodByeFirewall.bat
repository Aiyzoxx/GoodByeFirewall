@echo off
title GoodByeFirewall
cd /d "%~dp0"

:: Verification des privileges administrateur
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Demande des privileges administrateur requis pour WinDivert...
    powershell -Command "Start-Process -FilePath '%~f0' -Verb runAs"
    exit /b
)

:: Verification de Node / npm
where npm.cmd >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] Node.js / npm.cmd n'a pas ete trouve dans le PATH.
    echo Veuillez installer Node.js depuis https://nodejs.org/
    pause
    exit /b
)

:: Installation automatique des dependances si necessaire
if not exist "node_modules\electron" (
    echo [INFO] Premier lancement : Installation des dependances...
    call npm.cmd install
)

:: Lancement silencieux de l'application
echo [INFO] Lancement de GoodByeFirewall...
start "" npm.cmd start
exit
