@ECHO OFF

:: Yönetici izinlerini kontrol et
NET SESSION >nul 2>&1
IF %ERRORLEVEL% EQU 0 (
    echo Yonetici izinleri verildi.
) ELSE (
    echo Bu batch dosyasini yonetici olarak calistirmaniz gerekmektedir.
    echo Yonetici izinleri aliniyor...
    :: Yönetici yetkisi alma komutu
    powershell -Command "Start-Process cmd -ArgumentList '/c %~f0' -Verb runAs"
    IF %ERRORLEVEL% EQU 0 (
        echo Yonetici izinleri alindi.
    ) ELSE (
        echo Yonetici izinleri alinirken hata olustu.
    )
    EXIT /B
)

:: Kullanıcı onayı al
CHOICE /M "Hizmetleri kaldirmak istediginizden emin misiniz? (Evet icin Y tusuna, Hayir icin N tusuna basin.)"
IF %ERRORLEVEL% NEQ 1 (
    echo Islem iptal edildi.
    PAUSE
    EXIT /B
)

:: Hizmetleri kaldır
echo Hizmetler kaldiriliyor...
sc stop "GoodbyeDPI"
sc delete "GoodbyeDPI"
sc stop "WinDivert"
sc delete "WinDivert"
sc stop "WinDivert14"
sc delete "WinDivert14"
echo Hizmetler basariyla kaldirildi.
pause
