const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const { spawn, exec } = require('child_process');
const net = require('net');

app.name = 'GoodByeFirewall';
if (process.platform === 'win32') {
  app.setAppUserModelId('GoodByeFirewall');
}

app.commandLine.appendSwitch('disable-gpu-shader-disk-cache');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

let mainWindow = null;
let tray = null;
let currentProcess = null;
let isServiceMode = false;
let isProtectionRunning = false;
let hasShownTrayNotification = false;

const startHidden = process.argv.includes('--hidden') || process.argv.includes('--minimized');

function getConfigPath() {
  if (app.isPackaged) {
    const userDir = app.getPath('userData');
    if (!fs.existsSync(userDir)) {
      try { fs.mkdirSync(userDir, { recursive: true }); } catch (e) {}
    }
    return path.join(userDir, 'config.json');
  }
  return path.join(__dirname, 'config.json');
}

const defaultConfig = {
  preset: '-5',
  ttl: 'none',
  dns: 'cloudflare',
  customDnsIp: '1.1.1.1',
  customDnsPort: '53',
  extraArgs: '',
  language: 'fr',
  theme: 'light',
  isServiceMode: false
};

function loadConfig() {
  const cfgPath = getConfigPath();
  try {
    if (fs.existsSync(cfgPath)) {
      return JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    }
    const templatePath = path.join(__dirname, 'config.json');
    if (fs.existsSync(templatePath)) {
      const initial = JSON.parse(fs.readFileSync(templatePath, 'utf8'));
      saveConfig(initial);
      return initial;
    }
  } catch (e) {
    console.error('Error loading config:', e);
  }
  return defaultConfig;
}

function saveConfig(cfg) {
  const cfgPath = getConfigPath();
  try {
    fs.writeFileSync(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving config:', e);
  }
}

function getExecutablePath() {
  const is64 = process.arch === 'x64' || process.env.PROCESSOR_ARCHITECTURE === 'AMD64';
  const archDir = is64 ? 'x86_64' : 'x86';
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'BinTools', archDir, 'goodbyedpi.exe');
  }
  const localBin = path.join(__dirname, 'BinTools', archDir, 'goodbyedpi.exe');
  if (fs.existsSync(localBin)) {
    return localBin;
  }
  return path.join(__dirname, '..', 'BinTools', archDir, 'goodbyedpi.exe');
}

function buildArgumentList(cfg) {
  if (cfg.preset === 'custom') {
    const custom = (cfg.extraArgs || '').trim().split(/\s+/).filter(Boolean);
    return custom.length ? custom : ['-5'];
  }

  const args = [];
  args.push(cfg.preset || '-5');

  if (cfg.ttl && cfg.ttl !== 'none') {
    args.push(...cfg.ttl.split(/\s+/));
  }

  switch (cfg.dns) {
    case 'yandex':
      args.push('--dns-addr', '77.88.8.8', '--dns-port', '1253', '--dnsv6-addr', '2a02:6b8::feed:0ff', '--dnsv6-port', '1253');
      break;
    case 'cloudflare':
      args.push('--dns-addr', '1.1.1.1', '--dns-port', '53', '--dnsv6-addr', '2606:4700:4700::1111', '--dnsv6-port', '53');
      break;
    case 'google':
      args.push('--dns-addr', '8.8.8.8', '--dns-port', '53', '--dnsv6-addr', '2001:4860:4860::8888', '--dnsv6-port', '53');
      break;
    case 'quad9':
      args.push('--dns-addr', '9.9.9.9', '--dns-port', '53', '--dnsv6-addr', '2620:fe::fe', '--dnsv6-port', '53');
      break;
    case 'custom':
      if (cfg.customDnsIp) {
        args.push('--dns-addr', cfg.customDnsIp.trim());
        if (cfg.customDnsPort) {
          args.push('--dns-port', cfg.customDnsPort.trim());
        }
      }
      break;
    case 'none':
    default:
      break;
  }

  if (cfg.extraArgs && cfg.extraArgs.trim()) {
    args.push(...cfg.extraArgs.trim().split(/\s+/));
  }

  return args;
}

function syncLoginItem(enable) {
  try {
    app.setLoginItemSettings({
      openAtLogin: !!enable,
      args: ['--hidden']
    });
  } catch (e) {
    console.error('Error syncing login item settings:', e);
  }
}

const trayI18n = {
  fr: {
    tooltipActive: 'GoodByeFirewall — Protection ACTIVE',
    tooltipInactive: 'GoodByeFirewall — Protection INACTIVE',
    headerActive: 'GoodByeFirewall — ACTIF',
    headerInactive: 'GoodByeFirewall — INACTIF',
    deactivate: '🔴 Désactiver la protection',
    activate: '🟢 Activer la protection',
    showWindow: 'Afficher la fenêtre',
    hideWindow: 'Masquer la fenêtre',
    quit: 'Quitter complètement',
    balloonTitle: 'GoodByeFirewall',
    balloonContent: 'L\'application reste active dans les icônes cachées.'
  },
  en: {
    tooltipActive: 'GoodByeFirewall — Protection ACTIVE',
    tooltipInactive: 'GoodByeFirewall — Protection INACTIVE',
    headerActive: 'GoodByeFirewall — ACTIVE',
    headerInactive: 'GoodByeFirewall — INACTIVE',
    deactivate: '🔴 Disable Protection',
    activate: '🟢 Enable Protection',
    showWindow: 'Show Window',
    hideWindow: 'Hide Window',
    quit: 'Quit Completely',
    balloonTitle: 'GoodByeFirewall',
    balloonContent: 'Application remains active in the system tray.'
  }
};

function getTrayStrings() {
  const cfg = loadConfig();
  const lang = (cfg && cfg.language === 'en') ? 'en' : 'fr';
  return trayI18n[lang] || trayI18n.fr;
}

function showHideNotification() {
  if (tray && !hasShownTrayNotification) {
    hasShownTrayNotification = true;
    try {
      const t = getTrayStrings();
      const iconPath = path.join(__dirname, 'assets', 'AppIcon.ico');
      tray.displayBalloon({
        icon: fs.existsSync(iconPath) ? iconPath : undefined,
        title: t.balloonTitle,
        content: t.balloonContent,
        iconType: 'info'
      });
    } catch (e) {}
  }
}

function stopAllGoodbyeDpiInstances() {
  return new Promise((resolve) => {
    exec('taskkill /F /IM goodbyedpi.exe', () => {
      exec('sc stop GoodbyeDPI', () => {
        resolve();
      });
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'GoodByeFirewall',
    width: 480,
    height: 750,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    icon: path.join(__dirname, 'assets', 'AppIcon.ico'),
    backgroundColor: '#00000000',
    hasShadow: true,
    roundedCorners: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'renderer', 'index.html'));

  mainWindow.once('ready-to-show', () => {
    if (!startHidden) {
      mainWindow.show();
    }
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
      updateTray(isProtectionRunning);
      showHideNotification();
      return false;
    }
  });

  mainWindow.on('show', () => {
    updateTray(isProtectionRunning);
  });

  mainWindow.on('hide', () => {
    updateTray(isProtectionRunning);
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function toggleWindowVisibility() {
  if (!mainWindow) {
    createWindow();
  } else if (mainWindow.isVisible()) {
    mainWindow.hide();
  } else {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  }
  updateTray(isProtectionRunning);
}

function updateTray(active) {
  if (!tray) return;
  isProtectionRunning = !!active;

  const t = getTrayStrings();
  const isWinVisible = mainWindow && mainWindow.isVisible();
  const toggleLabel = active ? t.deactivate : t.activate;
  const windowLabel = isWinVisible ? t.hideWindow : t.showWindow;
  const headerLabel = active ? t.headerActive : t.headerInactive;

  const contextMenu = Menu.buildFromTemplate([
    { label: headerLabel, enabled: false },
    { type: 'separator' },
    {
      label: toggleLabel,
      click: async () => {
        if (isProtectionRunning) {
          await stopBypass();
        } else {
          const cfg = loadConfig();
          await startBypassWithConfig(cfg);
        }
      }
    },
    { type: 'separator' },
    {
      label: windowLabel,
      click: () => {
        toggleWindowVisibility();
      }
    },
    { type: 'separator' },
    {
      label: t.quit,
      click: async () => {
        app.isQuitting = true;
        await stopBypass();
        app.quit();
      }
    }
  ]);

  tray.setToolTip(active ? t.tooltipActive : t.tooltipInactive);
  tray.setContextMenu(contextMenu);
}

function createTray() {
  try {
    const iconPath = path.join(__dirname, 'assets', 'AppIcon.ico');
    tray = new Tray(fs.existsSync(iconPath) ? iconPath : nativeImage.createEmpty());

    updateTray(isProtectionRunning);

    tray.on('click', () => {
      toggleWindowVisibility();
    });

    tray.on('double-click', () => {
      toggleWindowVisibility();
    });
  } catch (e) {
    console.error('Tray creation error:', e);
  }
}

async function startBypassWithConfig(config) {
  saveConfig(config);
  isServiceMode = !!config.isServiceMode;
  syncLoginItem(isServiceMode);

  const exePath = getExecutablePath();
  if (!fs.existsSync(exePath)) {
    return { success: false, message: `Executable not found: ${exePath}` };
  }

  const args = buildArgumentList(config);
  const argsString = args.join(' ');

  await stopAllGoodbyeDpiInstances();

  if (isServiceMode) {
    return new Promise((resolve) => {
      exec('sc stop GoodbyeDPI', () => {
        exec('sc delete GoodbyeDPI', () => {
          const createCmd = `sc create "GoodbyeDPI" binPath= "\\"${exePath}\\" ${argsString}" start= "auto"`;
          exec(createCmd, (err) => {
            if (err) {
              resolve({ success: false, message: 'Failed to create service: ' + err.message });
              return;
            }
            exec('sc start GoodbyeDPI', (startErr) => {
              setTimeout(async () => {
                const running = await checkStatus();
                if (running || !startErr || (startErr.message && startErr.message.includes('1056'))) {
                  isProtectionRunning = true;
                  updateTray(true);
                  if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('status-changed', true);
                    mainWindow.webContents.send('log-message', `[Service] Started: goodbyedpi.exe ${argsString}`);
                  }
                  resolve({ success: true, message: 'Windows Service started.' });
                } else {
                  isProtectionRunning = false;
                  updateTray(false);
                  if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('status-changed', false);
                    mainWindow.webContents.send('log-message', `[Service Error] ${startErr.message}`);
                  }
                  resolve({ success: false, message: 'Failed to start service: ' + startErr.message });
                }
              }, 400);
            });
          });
        });
      });
    });
  } else {
    try {
      currentProcess = spawn(exePath, args, {
        cwd: path.dirname(exePath),
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'pipe']
      });

      isProtectionRunning = true;
      updateTray(true);

      if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send('status-changed', true);
        mainWindow.webContents.send('log-message', `[Session] Launched: goodbyedpi.exe ${argsString}`);
      }

      currentProcess.stdout.on('data', (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('log-message', data.toString().trim());
        }
      });

      currentProcess.stderr.on('data', (data) => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('log-message', `[ERR] ${data.toString().trim()}`);
        }
      });

      currentProcess.on('exit', (code) => {
        currentProcess = null;
        isProtectionRunning = false;
        updateTray(false);
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('status-changed', false);
          mainWindow.webContents.send('log-message', `[Session] Process terminated (Code ${code || 0}).`);
        }
      });

      return { success: true, message: 'GoodbyeDPI process started.' };
    } catch (err) {
      isProtectionRunning = false;
      updateTray(false);
      return { success: false, message: err.message };
    }
  }
}

async function stopBypass() {
  if (currentProcess) {
    try {
      currentProcess.kill('SIGKILL');
    } catch (e) {}
    currentProcess = null;
  }

  await stopAllGoodbyeDpiInstances();
  isProtectionRunning = false;
  updateTray(false);

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send('status-changed', false);
    mainWindow.webContents.send('log-message', '[System] Protection disabled.');
  }

  return { success: true };
}

function checkStatus() {
  return new Promise((resolve) => {
    exec('tasklist /FI "IMAGENAME eq goodbyedpi.exe"', (_err, stdout) => {
      const isRunning = (stdout || '').toLowerCase().includes('goodbyedpi.exe');
      resolve(isRunning);
    });
  });
}

ipcMain.handle('start-bypass', async (_event, config) => {
  return await startBypassWithConfig(config);
});

ipcMain.handle('stop-bypass', async () => {
  return await stopBypass();
});

ipcMain.handle('check-status', async () => {
  const running = await checkStatus();
  isProtectionRunning = running;
  updateTray(running);
  return running;
});

ipcMain.handle('measure-ping', async () => {
  return new Promise((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();
    socket.setTimeout(1800);

    socket.connect(53, '1.1.1.1', () => {
      const latency = Date.now() - start;
      socket.destroy();
      resolve(latency);
    });

    socket.on('timeout', () => {
      socket.destroy();
      resolve(null);
    });

    socket.on('error', () => {
      socket.destroy();
      resolve(null);
    });
  });
});

ipcMain.handle('save-config', (_event, cfg) => {
  saveConfig(cfg);
  updateTray(isProtectionRunning);
  return true;
});

ipcMain.handle('load-config', () => {
  return loadConfig();
});

ipcMain.handle('uninstall-service', async () => {
  await stopBypass();
  syncLoginItem(false);
  return new Promise((resolve) => {
    exec('sc delete GoodbyeDPI', () => {
      exec('sc stop WinDivert', () => {
        exec('sc delete WinDivert', () => {
          if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('status-changed', false);
            mainWindow.webContents.send('log-message', '[Service] WinDivert service and drivers removed.');
          }
          resolve(true);
        });
      });
    });
  });
});

ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-close', () => {
  if (mainWindow) {
    mainWindow.hide();
    updateTray(isProtectionRunning);
    showHideNotification();
  }
});

ipcMain.handle('check-is-admin', async () => {
  return await checkIsAdmin();
});

ipcMain.handle('request-admin-elevation', async () => {
  return await requestAdminElevation();
});

ipcMain.on('quit-app-now', () => {
  app.isQuitting = true;
  app.quit();
});

app.isQuitting = false;

app.on('before-quit', () => {
  app.isQuitting = true;
});

function checkIsAdmin() {
  return new Promise((resolve) => {
    exec('net session', { windowsHide: true }, (err) => {
      resolve(!err);
    });
  });
}

function checkTaskExists() {
  return new Promise((resolve) => {
    exec('schtasks /query /tn "GoodByeFirewall_SkipUAC"', { windowsHide: true }, (err) => {
      resolve(!err);
    });
  });
}

function requestAdminElevation() {
  return new Promise((resolve) => {
    const isPackaged = app.isPackaged;
    const appDir = isPackaged ? path.dirname(process.execPath) : __dirname;
    const exePath = isPackaged ? process.execPath : path.join(appDir, 'Lancer-GoodByeFirewall.bat');
    let iconPath = path.join(appDir, 'AppIcon.ico');
    if (!fs.existsSync(iconPath)) {
      iconPath = path.join(__dirname, 'assets', 'AppIcon.ico');
    }
    const vbsPath = path.join(appDir, 'launch.vbs');
    const tempScript = path.join(app.getPath('temp'), 'setup_goodbye_skip_uac.ps1');

    const psContent = `$ErrorActionPreference = 'Stop'
$exePath = '${exePath.replace(/'/g, "''")}'
$appDir = '${appDir.replace(/'/g, "''")}'
$iconPath = '${iconPath.replace(/'/g, "''")}'
$vbsPath = '${vbsPath.replace(/'/g, "''")}'

$vbsContent = 'Set WshShell = CreateObject("WScript.Shell")' + [char]13 + [char]10 + 'WshShell.Run "schtasks /run /tn ""GoodByeFirewall_SkipUAC"" /I", 0, False' + [char]13 + [char]10
[System.IO.File]::WriteAllText($vbsPath, $vbsContent, [System.Text.Encoding]::ASCII)

$taskName = 'GoodByeFirewall_SkipUAC'
$action = New-ScheduledTaskAction -Execute $exePath -WorkingDirectory $appDir
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -ExecutionTimeLimit ([TimeSpan]::Zero) -MultipleInstances Parallel
$principal = New-ScheduledTaskPrincipal -UserId $env:USERNAME -LogonType Interactive -RunLevel Highest

Register-ScheduledTask -TaskName $taskName -Action $action -Settings $settings -Principal $principal -Force | Out-Null

$wsh = New-Object -ComObject WScript.Shell

$desktopDir = [Environment]::GetFolderPath('Desktop')
$desktopLnk = Join-Path $desktopDir 'GoodByeFirewall.lnk'
$sc = $wsh.CreateShortcut($desktopLnk)
$sc.TargetPath = 'wscript.exe'
$sc.Arguments = '\"' + $vbsPath + '\"'
$sc.WorkingDirectory = $appDir
if (Test-Path $iconPath) {
    $sc.IconLocation = $iconPath + ',0'
}
$sc.Description = 'GoodByeFirewall'
$sc.Save()

$startMenuDir = [Environment]::GetFolderPath('StartMenu')
$startMenuLnk = Join-Path $startMenuDir 'Programs\\GoodByeFirewall.lnk'
if (Test-Path (Split-Path $startMenuLnk)) {
    $sc2 = $wsh.CreateShortcut($startMenuLnk)
    $sc2.TargetPath = 'wscript.exe'
    $sc2.Arguments = '\"' + $vbsPath + '\"'
    $sc2.WorkingDirectory = $appDir
    if (Test-Path $iconPath) {
        $sc2.IconLocation = $iconPath + ',0'
    }
    $sc2.Description = 'GoodByeFirewall'
    $sc2.Save()
}

$regAumid = 'HKCU:\\Software\\Classes\\AppUserModelId\\GoodByeFirewall'
if (-not (Test-Path $regAumid)) { New-Item -Path $regAumid -Force | Out-Null }
Set-ItemProperty -Path $regAumid -Name 'DisplayName' -Value 'GoodByeFirewall' -Force
Set-ItemProperty -Path $regAumid -Name 'IconUri' -Value $iconPath -Force
Set-ItemProperty -Path $regAumid -Name 'ShowInSettings' -Value 1 -Type DWord -Force

Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
public class ShellNotify {
    [DllImport("shell32.dll")]
    public static extern void SHChangeNotify(int wEventId, int uFlags, IntPtr dwItem1, IntPtr dwItem2);
}
"@
[ShellNotify]::SHChangeNotify(0x08000000, 0, [IntPtr]::Zero, [IntPtr]::Zero)
`;

    try {
      fs.writeFileSync(tempScript, psContent, 'utf8');
    } catch (e) {
      resolve({ success: false, message: 'Temp script write error: ' + e.message });
      return;
    }

    const psCmd = `Start-Process powershell -WindowStyle Hidden -ArgumentList '-WindowStyle Hidden -NoProfile -NonInteractive -ExecutionPolicy Bypass -File ""${tempScript}""' -Verb RunAs -Wait`;

    exec(`powershell -WindowStyle Hidden -NoProfile -NonInteractive -Command "${psCmd}"`, { windowsHide: true }, (err) => {
      try { fs.unlinkSync(tempScript); } catch (e) {}

      if (err) {
        resolve({ success: false, message: 'Authorization declined or cancelled.' });
        return;
      }

      checkTaskExists().then((taskExists) => {
        if (taskExists) {
          resolve({ success: true, relaunching: true });

          try {
            app.releaseSingleInstanceLock();
          } catch (e) {}

          app.isQuitting = true;
          exec('schtasks /run /tn "GoodByeFirewall_SkipUAC" /I', { windowsHide: true }, () => {
            setTimeout(() => {
              app.exit(0);
            }, 600);
          });
        } else {
          resolve({ success: false, message: 'Scheduled task creation failed.' });
        }
      });
    });
  });
}

function ensureSkipUacTask() {
  if (!app.isPackaged) return;
  exec('net session', { windowsHide: true }, (netErr) => {
    if (netErr) return;
    checkTaskExists().then((taskExists) => {
      if (!taskExists) {
        requestAdminElevation();
      }
    });
  });
}

app.whenReady().then(async () => {
  const isAdmin = await checkIsAdmin();
  if (!isAdmin && app.isPackaged) {
    const taskExists = await checkTaskExists();
    if (taskExists) {
      try { app.releaseSingleInstanceLock(); } catch (e) {}
      exec('schtasks /run /tn "GoodByeFirewall_SkipUAC" /I', { windowsHide: true }, () => {
        app.exit(0);
      });
      return;
    }
  }

  createWindow();
  createTray();
  ensureSkipUacTask();

  const running = await checkStatus();
  isProtectionRunning = running;
  updateTray(running);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    } else if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
});

app.on('window-all-closed', () => {
  if (app.isQuitting) {
    app.quit();
  }
});
