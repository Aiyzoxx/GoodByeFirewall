$ErrorActionPreference = "Stop"

$appDir = "$env:LOCALAPPDATA\Programs\GoodByeFirewall"
$exePath = Join-Path $appDir "GoodByeFirewall.exe"

if (-not (Test-Path $exePath)) {
    $appDir = $PSScriptRoot
    $exePath = Join-Path $appDir "Lancer-GoodByeFirewall.bat"
}

Write-Host "Target: $exePath" -ForegroundColor Cyan

# 1. Create launch.vbs in app directory
$vbsPath = Join-Path $appDir "launch.vbs"
$vbsContent = "Set WshShell = CreateObject(`"WScript.Shell`")`r`nWshShell.Run `"schtasks /run /tn `"`"GoodByeFirewall_SkipUAC`"`" /I`", 0, False`r`n"
[System.IO.File]::WriteAllText($vbsPath, $vbsContent, [System.Text.Encoding]::ASCII)

# 2. Register Scheduled Task with Highest Privileges
$taskName = "GoodByeFirewall_SkipUAC"
$action = New-ScheduledTaskAction -Execute $exePath -WorkingDirectory $appDir
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero) -MultipleInstances Parallel
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Settings $settings -Principal $principal -Force | Out-Null

# 3. Update Desktop & Start Menu Shortcuts
$iconPath = Join-Path $appDir "AppIcon.ico"
if (-not (Test-Path $iconPath)) {
    $iconPath = Join-Path $appDir "assets\AppIcon.ico"
}

$wsh = New-Object -ComObject WScript.Shell

$desktopDir = [Environment]::GetFolderPath('Desktop')
$desktopLnk = Join-Path $desktopDir "GoodByeFirewall.lnk"
$sc = $wsh.CreateShortcut($desktopLnk)
$sc.TargetPath = "wscript.exe"
$sc.Arguments = "`"$vbsPath`""
$sc.WorkingDirectory = $appDir
if (Test-Path $iconPath) {
    $sc.IconLocation = "$iconPath,0"
}
$sc.Description = "GoodByeFirewall"
$sc.Save()

$startMenuDir = [Environment]::GetFolderPath('StartMenu')
$startMenuLnk = Join-Path $startMenuDir "Programs\GoodByeFirewall.lnk"
if (Test-Path (Split-Path $startMenuLnk)) {
    $sc2 = $wsh.CreateShortcut($startMenuLnk)
    $sc2.TargetPath = "wscript.exe"
    $sc2.Arguments = "`"$vbsPath`""
    $sc2.WorkingDirectory = $appDir
    if (Test-Path $iconPath) {
        $sc2.IconLocation = "$iconPath,0"
    }
    $sc2.Description = "GoodByeFirewall"
    $sc2.Save()
}

# 4. Register AppUserModelId for Windows Toast Notifications
$regAumid = "HKCU:\Software\Classes\AppUserModelId\GoodByeFirewall"
if (-not (Test-Path $regAumid)) { New-Item -Path $regAumid -Force | Out-Null }
Set-ItemProperty -Path $regAumid -Name "DisplayName" -Value "GoodByeFirewall" -Force
Set-ItemProperty -Path $regAumid -Name "IconUri" -Value $iconPath -Force
Set-ItemProperty -Path $regAumid -Name "ShowInSettings" -Value 1 -Type DWord -Force

# 5. Refresh Windows Explorer Icon Cache
Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class ShellNotify {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
[ShellNotify]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)
Write-Host "Setup completed successfully." -ForegroundColor Green
