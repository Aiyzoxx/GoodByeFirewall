$ErrorActionPreference = "SilentlyContinue"

# Nettoyage ancienne tâche
schtasks /delete /tn "GoodByeFirewall_SkipUAC" /f | Out-Null

# Configuration tâche planifiée (support batterie)
$task = Get-ScheduledTask -TaskName "GoodByeFirewall" -ErrorAction SilentlyContinue
if ($task) {
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Days 0)
    Set-ScheduledTask -TaskName "GoodByeFirewall" -Settings $settings -ErrorAction SilentlyContinue | Out-Null
}

# Détection chemin exécutable
$appDir = "$env:LOCALAPPDATA\Programs\GoodByeFirewall"
$exePath = Join-Path $appDir "GoodByeFirewall.exe"

if (-not (Test-Path $exePath)) {
    $progFilesExe = "$env:ProgramFiles\GoodByeFirewall\GoodByeFirewall.exe"
    if (Test-Path $progFilesExe) {
        $appDir = "$env:ProgramFiles\GoodByeFirewall"
        $exePath = $progFilesExe
    }
}

if (Test-Path $exePath) {
    $action = New-ScheduledTaskAction -Execute $exePath -Argument "--no-task-elevate"
    $principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest
    $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit (New-TimeSpan -Days 0)
    Register-ScheduledTask -TaskName "GoodByeFirewall" -Action $action -Principal $principal -Settings $settings -Force -ErrorAction SilentlyContinue | Out-Null
}

# Nettoyage ancien script
$vbsPath = Join-Path $appDir "launch.vbs"
if (Test-Path $vbsPath) {
    Remove-Item -Path $vbsPath -Force -ErrorAction SilentlyContinue
}

# Raccourcis bureau et menu démarrer
$iconPath = Join-Path $appDir "AppIcon.ico"
if (-not (Test-Path $iconPath)) {
    $iconPath = Join-Path $appDir "assets\AppIcon.ico"
}

$wsh = New-Object -ComObject WScript.Shell

$desktopDir = [Environment]::GetFolderPath('Desktop')
$desktopLnk = Join-Path $desktopDir "GoodByeFirewall.lnk"
if (Test-Path $desktopLnk) {
    $sc = $wsh.CreateShortcut($desktopLnk)
    $sc.TargetPath = $exePath
    $sc.Arguments = ""
    $sc.WorkingDirectory = $appDir
    if (Test-Path $iconPath) {
        $sc.IconLocation = "$iconPath,0"
    }
    $sc.Description = "GoodByeFirewall"
    $sc.Save()
}

$startMenuDir = [Environment]::GetFolderPath('StartMenu')
$startMenuLnk = Join-Path $startMenuDir "Programs\GoodByeFirewall.lnk"
if (Test-Path (Split-Path $startMenuLnk)) {
    $sc2 = $wsh.CreateShortcut($startMenuLnk)
    $sc2.TargetPath = $exePath
    $sc2.Arguments = ""
    $sc2.WorkingDirectory = $appDir
    if (Test-Path $iconPath) {
        $sc2.IconLocation = "$iconPath,0"
    }
    $sc2.Description = "GoodByeFirewall"
    $sc2.Save()
}

# Enregistrement notifications Windows
$regAumid = "HKCU:\Software\Classes\AppUserModelId\GoodByeFirewall"
if (-not (Test-Path $regAumid)) { New-Item -Path $regAumid -Force | Out-Null }
Set-ItemProperty -Path $regAumid -Name "DisplayName" -Value "GoodByeFirewall" -Force
Set-ItemProperty -Path $regAumid -Name "IconUri" -Value $iconPath -Force
Set-ItemProperty -Path $regAumid -Name "ShowInSettings" -Value 1 -Type DWord -Force

# Rafraîchissement icônes shell
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class ShellNotify {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
[ShellNotify]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)

Write-Host "Raccourcis et configuration GoodByeFirewall rétablis avec succès." -ForegroundColor Green
