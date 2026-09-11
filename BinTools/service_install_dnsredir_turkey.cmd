@ECHO OFF
PUSHD "%~dp0"

NET SESSION >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo Administrator permissions granted.
) ELSE (
    echo Requesting administrator permissions...
    powershell -Command "Start-Process cmd -ArgumentList '/c %~f0' -Verb runAs"
    POPD
    EXIT /B
)

set _arch=x86
IF "%PROCESSOR_ARCHITECTURE%"=="AMD64" (set _arch=x86_64)
IF DEFINED PROCESSOR_ARCHITEW6432 (set _arch=x86_64)

echo Installing GoodbyeDPI Windows Service...
sc stop "GoodbyeDPI" >nul 2>&1
sc delete "GoodbyeDPI" >nul 2>&1
sc create "GoodbyeDPI" binPath= "\"%CD%\%_arch%\goodbyedpi.exe\" -5 --set-ttl 5 --dns-addr 77.88.8.8 --dns-port 1253 --dnsv6-addr 2a02:6b8::feed:0ff --dnsv6-port 1253" start= "auto"
sc description "GoodbyeDPI" "GoodbyeDPI Anti-Censorship Service"
echo Service installed successfully.

echo Starting service...
sc start "GoodbyeDPI"
echo Service started.

POPD
exit
