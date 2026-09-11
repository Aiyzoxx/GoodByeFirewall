// GoodByeFirewall - Renderer Controller
const i18n = {
  fr: {
    title: 'GoodByeFirewall',
    statusConnected: 'PROTECTION ACTIVE',
    statusDisconnected: 'DÉCONNECTÉ / INACTIF',
    hintConnected: 'Votre trafic internet est sécurisé et le filtrage DPI contourné',
    hintDisconnected: 'Cliquez pour activer le contournement DPI et pare-feu',
    modeRunOnce: 'Session Rapide',
    modeService: 'Service Windows',
    switchEnabled: 'Activé',
    switchDisabled: 'Désactivé',
    cardDpiTitle: 'NIVEAU DPI',
    cardServiceTitle: 'SERVICE AUTO',
    cardDnsTitle: 'SERVEUR DNS',
    cardDnsSubtitle: 'Anti-censure résolveur',
    cardAdvancedSettingsTitle: 'PARAMÈTRES AVANCÉS',
    subAdvancedSettings: 'Tromperie DPI (TTL) & Options',
    lblTTL: 'TROMPERIE DPI (TTL / FAUX PAQUETS)',
    lblExtraArgs: 'Arguments Personnalisés Libres',
    cardInspectorTitle: 'CONSOLE D\'INSPECTION',
    cardAdvancedTitle: 'CONSOLE D\'INSPECTION',
    subInspector: 'Flux de télémétrie en direct',
    driverReady: 'Moteur WinDivert : Prêt',
    driverActive: 'Moteur WinDivert : Actif (Filtrage)',
    btnUninstall: 'Désinstaller Service',
    uninstallConfirm: 'Voulez-vous vraiment désinstaller le service GoodbyeDPI et WinDivert ?',
    uninstallSuccess: 'Service Windows et pilotes WinDivert désinstallés.',
    errStart: 'Erreur lors du démarrage : ',
    tipClose: 'Masquer dans les icônes cachées (Actif en arrière-plan)',
    tipMin: 'Réduire dans la barre des tâches',
    tipTheme: 'Changer de thème (Clair / Sombre)',
    tipPing: 'Latence réseau en direct',
    btnPowerActivate: 'Activer la protection',
    btnPowerDeactivate: 'Désactiver la protection',
    logStopping: '[Action] Arrêt de la protection...',
    logStarting: '[Action] Démarrage de GoodByeFirewall...',
    logHidden: '[Système] Fenêtre masquée. GoodByeFirewall reste actif dans les icônes cachées.',
    logThemeDark: '[Thème] Basculé vers le mode Sombre',
    logThemeLight: '[Thème] Basculé vers le mode Clair',
    logUninstalling: '[Service] Désinstallation demandée...',
    adminModalTitle: 'Autorisation Administrateur',
    adminModalDesc: 'Pour activer le contournement DPI et charger le pilote réseau sécurisé <strong>WinDivert</strong>, GoodByeFirewall doit être exécuté avec les privilèges Administrateur.',
    adminModalNote: 'Cette autorisation n\'est demandée <strong>qu\'une seule fois</strong>. Les prochains lancements se feront directement sans confirmation UAC.',
    adminBtnClose: 'Fermer',
    adminBtnAuthorize: 'Autoriser (UAC)',
    adminAuthorizing: 'Demande en cours...',
    adminSuccess: 'Autorisé avec succès ! Redémarrage...',
    adminDenied: 'Autorisation refusée ou annulée par l\'utilisateur.',
    placeholderExtraArgs: 'ex: -a -p --blacklist list.txt',
    presets: {
      '-5': 'Niveau 5 (Agressif)',
      '-1': 'Niveau 1 (Standard)',
      '-2': 'Niveau 2 (Quick ACK)',
      '-3': 'Niveau 3 (Sans fragmentation)',
      '-4': 'Niveau 4 (Ultra Rapide)',
      '-6': 'Niveau 6 (Avancé)',
      '-7': 'Niveau 7 (Avancé)',
      '-8': 'Niveau 8 (Avancé)',
      '-9': 'Niveau 9 (Avancé)',
      'custom': 'Arguments Libres...'
    },
    dns: {
      'cloudflare': 'Cloudflare (1.1.1.1)',
      'none': 'DNS Système (Par défaut)',
      'google': 'Google DNS (8.8.8.8)',
      'quad9': 'Quad9 (9.9.9.9)',
      'yandex': 'Yandex (Port 1253)',
      'custom': 'Personnalisé...'
    },
    ttl: {
      'none': 'Désactivé (Recommandé)',
      '--auto-ttl': '--auto-ttl (Calcul Auto)',
      '--set-ttl 5': '--set-ttl 5',
      '--set-ttl 4': '--set-ttl 4',
      '--set-ttl 3': '--set-ttl 3',
      '--set-ttl 6': '--set-ttl 6'
    }
  },
  en: {
    title: 'GoodByeFirewall',
    statusConnected: 'PROTECTION ACTIVE',
    statusDisconnected: 'DISCONNECTED / INACTIVE',
    hintConnected: 'Your internet traffic is shielded against DPI inspection',
    hintDisconnected: 'Click to activate DPI & firewall bypass',
    modeRunOnce: 'Quick Session',
    modeService: 'Windows Service',
    switchEnabled: 'Enabled',
    switchDisabled: 'Disabled',
    cardDpiTitle: 'DPI LEVEL',
    cardServiceTitle: 'AUTO SERVICE',
    cardDnsTitle: 'DNS SERVER',
    cardDnsSubtitle: 'Anti-censorship resolver',
    cardAdvancedSettingsTitle: 'ADVANCED SETTINGS',
    subAdvancedSettings: 'DPI Spoofing (TTL) & Options',
    lblTTL: 'DPI SPOOFING (TTL / FAKE PACKETS)',
    lblExtraArgs: 'Custom Command Line Arguments',
    cardInspectorTitle: 'INSPECTOR CONSOLE',
    cardAdvancedTitle: 'INSPECTOR CONSOLE',
    subInspector: 'Live telemetry stream',
    driverReady: 'WinDivert Engine: Ready',
    driverActive: 'WinDivert Engine: Active (Filtering)',
    btnUninstall: 'Uninstall Service',
    uninstallConfirm: 'Do you really want to uninstall GoodbyeDPI and WinDivert services?',
    uninstallSuccess: 'Windows service and WinDivert drivers uninstalled.',
    errStart: 'Failed to start bypass: ',
    tipClose: 'Hide to notification tray (Active in background)',
    tipMin: 'Minimize to taskbar',
    tipTheme: 'Toggle theme (Light / Dark)',
    tipPing: 'Live network latency',
    btnPowerActivate: 'Activate protection',
    btnPowerDeactivate: 'Deactivate protection',
    logStopping: '[Action] Stopping protection...',
    logStarting: '[Action] Starting GoodByeFirewall...',
    logHidden: '[System] Window hidden. GoodByeFirewall remains active in system tray.',
    logThemeDark: '[Theme] Switched to Dark mode',
    logThemeLight: '[Theme] Switched to Light mode',
    logUninstalling: '[Service] Uninstall requested...',
    adminModalTitle: 'Administrator Privileges',
    adminModalDesc: 'To enable DPI bypass and load the secure <strong>WinDivert</strong> network driver, GoodByeFirewall must run with Administrator privileges.',
    adminModalNote: 'This permission is only requested <strong>once</strong>. Future launches will start directly without any UAC prompt.',
    adminBtnClose: 'Close',
    adminBtnAuthorize: 'Grant Access (UAC)',
    adminAuthorizing: 'Requesting access...',
    adminSuccess: 'Access granted! Restarting...',
    adminDenied: 'Access was canceled or denied by the user.',
    placeholderExtraArgs: 'e.g. -a -p --blacklist list.txt',
    presets: {
      '-5': 'Level 5 (Aggressive)',
      '-1': 'Level 1 (Standard)',
      '-2': 'Level 2 (Quick ACK)',
      '-3': 'Level 3 (No fragmentation)',
      '-4': 'Level 4 (Ultra Fast)',
      '-6': 'Level 6 (Advanced)',
      '-7': 'Level 7 (Advanced)',
      '-8': 'Level 8 (Advanced)',
      '-9': 'Level 9 (Advanced)',
      'custom': 'Custom Arguments...'
    },
    dns: {
      'cloudflare': 'Cloudflare (1.1.1.1)',
      'none': 'System DNS (Default)',
      'google': 'Google DNS (8.8.8.8)',
      'quad9': 'Quad9 (9.9.9.9)',
      'yandex': 'Yandex (Port 1253)',
      'custom': 'Custom...'
    },
    ttl: {
      'none': 'Disabled (Recommended)',
      '--auto-ttl': '--auto-ttl (Auto Calculate)',
      '--set-ttl 5': '--set-ttl 5',
      '--set-ttl 4': '--set-ttl 4',
      '--set-ttl 3': '--set-ttl 3',
      '--set-ttl 6': '--set-ttl 6'
    }
  }
};

// DOM Element References
const btnPower = document.getElementById('btnPower');
const powerRing = document.getElementById('powerRing');
const statusBadge = document.getElementById('statusBadge');
const statusText = document.getElementById('statusText');
const statusHint = document.getElementById('statusHint');
const pingValue = document.getElementById('pingValue');
const pingBadge = document.getElementById('pingBadge');
const langSelect = document.getElementById('langSelect');
const iosServiceToggle = document.getElementById('iosServiceToggle');
const serviceSubtitle = document.getElementById('serviceSubtitle');
const switchStateText = document.getElementById('switchStateText');
const btnModeRunOnce = document.getElementById('btnModeRunOnce');
const btnModeService = document.getElementById('btnModeService');
const selectPreset = document.getElementById('selectPreset');
const presetSubtitle = document.getElementById('presetSubtitle');
const selectDNS = document.getElementById('selectDNS');

function updatePresetSubtitle(val) {
  if (presetSubtitle) {
    const dict = i18n[currentLang] || i18n.fr;
    presetSubtitle.textContent = (dict.presets && dict.presets[val]) || (val ? `Niveau / Level ${val}` : '');
  }
}
const customDnsRow = document.getElementById('customDnsRow');
const inputCustomIp = document.getElementById('inputCustomIp');
const inputCustomPort = document.getElementById('inputCustomPort');
const selectTTL = document.getElementById('selectTTL');
const inputExtraArgs = document.getElementById('inputExtraArgs');
const terminalToggle = document.getElementById('terminalToggle');
const terminalLogs = document.getElementById('terminalLogs');
const driverStatusText = document.getElementById('driverStatusText');
const btnUninstallService = document.getElementById('btnUninstallService');
const btnMin = document.getElementById('btnMin');
const btnClose = document.getElementById('btnClose');
const btnTheme = document.getElementById('btnTheme');
const iconSun = document.getElementById('iconSun');
const iconMoon = document.getElementById('iconMoon');
const waveCanvas = document.getElementById('waveCanvas');

// Admin Permission Modal DOM Elements
const modalAdminPermission = document.getElementById('modalAdminPermission');
const btnAdminClose = document.getElementById('btnAdminClose');
const btnAdminAuthorize = document.getElementById('btnAdminAuthorize');
const btnAdminAuthorizeText = document.getElementById('btnAdminAuthorizeText');
const adminModalError = document.getElementById('adminModalError');



// Application State
let isRunning = false;
let isServiceMode = false;
let currentLang = 'fr';
let pingInterval = null;

/* ==========================================================================
   Interactive 60/120 FPS HTML5 Canvas Waves Engine
   ========================================================================== */
class WaveAnimationEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.waves = [];
    this.maxWaves = 5;
    this.lastSpawn = 0;
    this.animId = null;
    this.centerX = 0;
    this.centerY = 0;
    this.active = false;

    this.initCanvasSize();
    window.addEventListener('resize', () => this.initCanvasSize());
  }

  initCanvasSize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.width = rect.width;
    this.height = rect.height;
    this.centerX = this.width / 2;
    
    // Dynamic centering on power button so waves align perfectly
    const powerArea = document.getElementById('powerArea');
    if (powerArea && rect.height > 0) {
      const pRect = powerArea.getBoundingClientRect();
      this.centerY = (pRect.top + pRect.height / 2) - rect.top;
    } else {
      this.centerY = 50;
    }
  }

  setActive(active) {
    this.active = active;
  }

  spawnWave() {
    this.waves.push({
      radius: 52,
      opacity: this.active ? 0.65 : 0.28,
      speed: this.active ? 1.4 : 0.6,
      lineWidth: this.active ? 2.2 : 1.2,
      maxRadius: Math.max(this.width, this.height) * 0.95
    });
  }

  render(timestamp) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const spawnInterval = this.active ? 950 : 2200;
    if (timestamp - this.lastSpawn > spawnInterval) {
      if (this.waves.length < this.maxWaves) {
        this.spawnWave();
      }
      this.lastSpawn = timestamp;
    }

    // Update and draw waves
    for (let i = this.waves.length - 1; i >= 0; i--) {
      const w = this.waves[i];
      w.radius += w.speed;
      w.opacity *= 0.985;

      this.ctx.beginPath();
      this.ctx.arc(this.centerX, this.centerY, w.radius, 0, Math.PI * 2);

      if (this.active) {
        // Vibrant Apple Emerald glow waves
        this.ctx.strokeStyle = `rgba(52, 199, 89, ${w.opacity})`;
        this.ctx.shadowColor = 'rgba(52, 199, 89, 0.4)';
        this.ctx.shadowBlur = 8;
      } else {
        // Serene subtle Apple Blue waves
        this.ctx.strokeStyle = `rgba(0, 113, 227, ${w.opacity * 0.7})`;
        this.ctx.shadowColor = 'transparent';
        this.ctx.shadowBlur = 0;
      }

      this.ctx.lineWidth = w.lineWidth;
      this.ctx.stroke();

      if (w.radius > w.maxRadius || w.opacity < 0.01) {
        this.waves.splice(i, 1);
      }
    }

    this.animId = requestAnimationFrame((ts) => this.render(ts));
  }

  start() {
    if (!this.animId) {
      this.lastSpawn = performance.now();
      this.animId = requestAnimationFrame((ts) => this.render(ts));
    }
  }
}

let waveEngine = null;

/* ==========================================================================
   UI Localization
   ========================================================================== */
function applyLanguage(lang) {
  currentLang = (lang === 'en') ? 'en' : 'fr';
  const dict = i18n[currentLang] || i18n.fr;

  // 1. Text elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) {
      if (dict[key].includes('<')) {
        el.innerHTML = dict[key];
      } else {
        el.textContent = dict[key];
      }
    }
  });

  // 2. Tooltips, placeholders and accessible labels
  if (btnClose) {
    btnClose.title = dict.tipClose;
    btnClose.setAttribute('aria-label', dict.tipClose);
  }
  if (btnMin) {
    btnMin.title = dict.tipMin;
    btnMin.setAttribute('aria-label', dict.tipMin);
  }
  if (btnTheme) {
    btnTheme.title = dict.tipTheme;
    btnTheme.setAttribute('aria-label', dict.tipTheme);
  }
  if (pingBadge) {
    pingBadge.title = dict.tipPing;
  }
  if (inputExtraArgs) {
    inputExtraArgs.placeholder = dict.placeholderExtraArgs;
  }

  // 3. Update Preset dropdown option labels
  if (selectPreset) {
    selectPreset.querySelectorAll('option').forEach(opt => {
      const v = opt.value;
      if (dict.presets && dict.presets[v]) opt.textContent = dict.presets[v];
    });
    const menuPreset = document.getElementById('menuPreset');
    if (menuPreset) {
      menuPreset.querySelectorAll('.custom-option').forEach(opt => {
        const v = opt.getAttribute('data-value');
        if (dict.presets && dict.presets[v]) opt.textContent = dict.presets[v];
      });
    }
    updatePresetSubtitle(selectPreset.value);
    syncCustomDropdown('containerPreset', selectPreset.value);
  }

  // 4. Update DNS dropdown option labels
  if (selectDNS) {
    selectDNS.querySelectorAll('option').forEach(opt => {
      const v = opt.value;
      if (dict.dns && dict.dns[v]) opt.textContent = dict.dns[v];
    });
    const menuDNS = document.getElementById('menuDNS');
    if (menuDNS) {
      menuDNS.querySelectorAll('.custom-option').forEach(opt => {
        const v = opt.getAttribute('data-value');
        if (dict.dns && dict.dns[v]) opt.textContent = dict.dns[v];
      });
    }
    syncCustomDropdown('containerDNS', selectDNS.value);
  }

  // 5. Update TTL dropdown option labels
  if (selectTTL) {
    selectTTL.querySelectorAll('option').forEach(opt => {
      const v = opt.value;
      if (dict.ttl && dict.ttl[v]) opt.textContent = dict.ttl[v];
    });
    const menuTTL = document.getElementById('menuTTL');
    if (menuTTL) {
      menuTTL.querySelectorAll('.custom-option').forEach(opt => {
        const v = opt.getAttribute('data-value');
        if (dict.ttl && dict.ttl[v]) opt.textContent = dict.ttl[v];
      });
    }
    syncCustomDropdown('containerTTL', selectTTL.value);
  }

  // 6. Sync Language Trigger
  const labelLang = document.getElementById('labelLang');
  if (labelLang) {
    labelLang.textContent = currentLang.toUpperCase();
  }
  syncCustomDropdown('containerLang', currentLang);

  // 7. Update service mode & status texts
  setMode(isServiceMode);
  updateStatusUI(isRunning);

  saveCurrentConfig();
}

/* ==========================================================================
   UI Connection State Transitions
   ========================================================================== */
function updateStatusUI(active) {
  isRunning = active;
  const dict = i18n[currentLang] || i18n.fr;

  if (waveEngine) {
    waveEngine.setActive(active);
  }

  if (btnPower) {
    btnPower.setAttribute('aria-label', active ? dict.btnPowerDeactivate : dict.btnPowerActivate);
  }

  if (active) {
    document.body.classList.add('shield-active');
    statusBadge.classList.remove('disconnected');
    statusBadge.classList.add('connected');
    statusText.textContent = dict.statusConnected;
    statusHint.textContent = dict.hintConnected;
    driverStatusText.textContent = dict.driverActive;
  } else {
    document.body.classList.remove('shield-active');
    statusBadge.classList.remove('connected');
    statusBadge.classList.add('disconnected');
    statusText.textContent = dict.statusDisconnected;
    statusHint.textContent = dict.hintDisconnected;
    driverStatusText.textContent = dict.driverReady;
  }
}

/* ==========================================================================
   Live Ping Latency Heartbeat
   ========================================================================== */
async function checkPing() {
  try {
    const ms = await window.api.measurePing();
    if (ms !== null && ms !== undefined) {
      pingValue.textContent = `${ms} ms`;
      if (ms < 45) {
        pingBadge.style.color = '#15803d';
      } else if (ms < 110) {
        pingBadge.style.color = '#d97706';
      } else {
        pingBadge.style.color = '#dc2626';
      }
    } else {
      pingValue.textContent = '-- ms';
      pingBadge.style.color = 'var(--text-secondary)';
    }
  } catch (e) {
    pingValue.textContent = '-- ms';
  }
}

/* ==========================================================================
   Light / Dark Theme Switching Logic
   ========================================================================== */
function setTheme(theme) {
  const isDark = theme === 'dark';
  document.body.classList.toggle('dark-theme', isDark);
  if (iconSun && iconMoon) {
    iconSun.style.display = isDark ? 'none' : 'block';
    iconMoon.style.display = isDark ? 'block' : 'none';
  }
}

/* ==========================================================================
   Custom Dropdown Synchronizer & Popover Controller
   ========================================================================== */
function syncCustomDropdown(containerId, value) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const label = container.querySelector('.trigger-label');
  const options = container.querySelectorAll('.custom-option');
  let matched = false;

  options.forEach(opt => {
    if (opt.getAttribute('data-value') === value) {
      opt.classList.add('selected');
      if (label) {
        if (containerId === 'containerLang') {
          label.textContent = value.toUpperCase();
        } else {
          label.textContent = opt.textContent.trim();
        }
      }
      matched = true;
    } else {
      opt.classList.remove('selected');
    }
  });

  if (!matched && label) {
    label.textContent = containerId === 'containerLang' ? value.toUpperCase() : value;
  }
}

function initCustomDropdowns() {
  const dropdowns = [
    { containerId: 'containerPreset', triggerId: 'triggerPreset', selectId: 'selectPreset' },
    { containerId: 'containerDNS', triggerId: 'triggerDNS', selectId: 'selectDNS' },
    { containerId: 'containerTTL', triggerId: 'triggerTTL', selectId: 'selectTTL' },
    { containerId: 'containerLang', triggerId: 'triggerLang', selectId: 'langSelect' }
  ];

  dropdowns.forEach(({ containerId, triggerId, selectId }) => {
    const container = document.getElementById(containerId);
    const trigger = document.getElementById(triggerId);
    const select = document.getElementById(selectId);

    if (!container || !trigger || !select) return;

    // Toggle dropdown open/close with smart flip
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const wasOpen = container.classList.contains('open');

      // Close any other open dropdowns first
      document.querySelectorAll('.custom-select-container.open').forEach(c => {
        if (c !== container) {
          c.classList.remove('open');
          c.closest('.bento-card')?.classList.remove('dropdown-active');
          const tr = c.querySelector('.custom-select-trigger');
          if (tr) tr.setAttribute('aria-expanded', 'false');
        }
      });

      if (!wasOpen) {
        // Smart flip: dynamically check available space below and above to stay in rectangle
        const rect = trigger.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom - 12;
        const spaceAbove = rect.top - 12;
        const menu = container.querySelector('.custom-select-menu');

        if (spaceBelow >= 150 || spaceBelow >= spaceAbove) {
          container.classList.add('open-down');
          if (menu) {
            menu.style.maxHeight = `${Math.min(180, spaceBelow)}px`;
          }
        } else {
          container.classList.remove('open-down');
          if (menu) {
            menu.style.maxHeight = `${Math.min(180, spaceAbove)}px`;
          }
        }

        container.classList.add('open');
        container.closest('.bento-card')?.classList.add('dropdown-active');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        container.classList.remove('open');
        container.closest('.bento-card')?.classList.remove('dropdown-active');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Option selection
    const options = container.querySelectorAll('.custom-option');
    options.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const val = opt.getAttribute('data-value');

        // Update hidden native select & trigger change event
        select.value = val;
        select.dispatchEvent(new Event('change'));

        // Update visual labels & selection state
        syncCustomDropdown(containerId, val);

        // Close menu
        container.classList.remove('open');
        container.closest('.bento-card')?.classList.remove('dropdown-active');
        trigger.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Click outside to close any open dropdowns
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-select-container.open').forEach(c => {
      c.classList.remove('open');
      c.closest('.bento-card')?.classList.remove('dropdown-active');
      const tr = c.querySelector('.custom-select-trigger');
      if (tr) tr.setAttribute('aria-expanded', 'false');
    });
  });

  // ESC key closes any open dropdowns
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.custom-select-container.open').forEach(c => {
        c.classList.remove('open');
        c.closest('.bento-card')?.classList.remove('dropdown-active');
        const tr = c.querySelector('.custom-select-trigger');
        if (tr) tr.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ==========================================================================
   Configuration Management
   ========================================================================== */
function getConfigFromUI() {
  return {
    preset: (selectPreset && selectPreset.value) ? selectPreset.value : '-5',
    ttl: selectTTL.value,
    dns: selectDNS.value,
    customDnsIp: inputCustomIp.value.trim(),
    customDnsPort: inputCustomPort.value.trim(),
    extraArgs: inputExtraArgs.value.trim(),
    language: currentLang,
    theme: document.body.classList.contains('dark-theme') ? 'dark' : 'light',
    isServiceMode: isServiceMode
  };
}

function saveCurrentConfig() {
  const cfg = getConfigFromUI();
  window.api.saveConfig(cfg);
}

function applyConfigToUI(cfg) {
  if (!cfg) return;

  if (cfg.theme) {
    setTheme(cfg.theme);
  }

  if (selectPreset) {
    selectPreset.value = cfg.preset || '-5';
    updatePresetSubtitle(selectPreset.value);
    syncCustomDropdown('containerPreset', selectPreset.value);
  }

  if (cfg.ttl) {
    selectTTL.value = cfg.ttl;
    syncCustomDropdown('containerTTL', cfg.ttl);
  }

  if (cfg.dns) {
    if (cfg.dns === 'yandex' && (cfg.language === 'fr' || !cfg.language)) {
      cfg.dns = 'cloudflare';
    }
    selectDNS.value = cfg.dns;
    syncCustomDropdown('containerDNS', selectDNS.value);
    customDnsRow.classList.toggle('hidden', cfg.dns !== 'custom');
  }

  if (cfg.customDnsIp) inputCustomIp.value = cfg.customDnsIp;
  if (cfg.customDnsPort) inputCustomPort.value = cfg.customDnsPort;
  if (cfg.extraArgs) inputExtraArgs.value = cfg.extraArgs;

  if (cfg.language) {
    currentLang = cfg.language;
    langSelect.value = cfg.language;
    applyLanguage(cfg.language);
    syncCustomDropdown('containerLang', cfg.language);
  }

  if (cfg.isServiceMode !== undefined) {
    setMode(cfg.isServiceMode);
  }
}

/* ==========================================================================
   Service Mode & iOS Switch Logic
   ========================================================================== */
function setMode(serviceMode) {
  isServiceMode = serviceMode;
  const dict = i18n[currentLang] || i18n.fr;
  if (iosServiceToggle) {
    iosServiceToggle.checked = serviceMode;
  }
  if (serviceSubtitle) {
    serviceSubtitle.textContent = serviceMode ? dict.modeService : dict.modeRunOnce;
  }
  if (switchStateText) {
    switchStateText.textContent = serviceMode ? dict.switchEnabled : dict.switchDisabled;
    switchStateText.style.color = serviceMode ? 'var(--apple-green)' : 'var(--text-secondary)';
  }
  if (btnModeService && btnModeRunOnce) {
    btnModeService.textContent = dict.modeService;
    btnModeRunOnce.textContent = dict.modeRunOnce;
    btnModeService.classList.toggle('active', serviceMode);
    btnModeRunOnce.classList.toggle('active', !serviceMode);
  }
}

/* ==========================================================================
   Console Log Append
   ========================================================================== */
function appendLog(message) {
  const time = new Date().toLocaleTimeString();
  terminalLogs.textContent += `\n[${time}] ${message}`;
  terminalLogs.scrollTop = terminalLogs.scrollHeight;
}

/* ==========================================================================
   Power Button Toggle Action
   ========================================================================== */
async function handlePowerToggle() {
  btnPower.disabled = true;
  const dict = i18n[currentLang] || i18n.fr;

  try {
    if (isRunning) {
      appendLog(dict.logStopping);
      await window.api.stopBypass();
      updateStatusUI(false);
    } else {
      appendLog(dict.logStarting);
      const cfg = getConfigFromUI();
      const res = await window.api.startBypass(cfg);
      if (!res.success) {
        appendLog(`[ERREUR / ERROR] ${res.message}`);
        alert(dict.errStart + res.message);
        updateStatusUI(false);
      } else {
        updateStatusUI(true);
      }
    }
  } catch (err) {
    appendLog(`[Exception] ${err.message}`);
  } finally {
    btnPower.disabled = false;
  }
}

/* ==========================================================================
   Administrator Permission Modal & Onboarding Flow
   ========================================================================== */
async function initAdminPermissionCheck() {
  if (!window.api || !window.api.checkIsAdmin) return;
  try {
    const isAdmin = await window.api.checkIsAdmin();
    if (!isAdmin && modalAdminPermission) {
      modalAdminPermission.style.display = 'flex';
    }
  } catch (err) {
    console.error('Failed to check admin status:', err);
  }

  if (btnAdminClose) {
    btnAdminClose.addEventListener('click', () => {
      if (window.api && window.api.quitApp) {
        window.api.quitApp();
      } else {
        window.close();
      }
    });
  }

  if (btnAdminAuthorize) {
    btnAdminAuthorize.addEventListener('click', async () => {
      btnAdminAuthorize.disabled = true;
      if (btnAdminClose) btnAdminClose.disabled = true;
      const dict = i18n[currentLang] || i18n.fr;
      if (btnAdminAuthorizeText) btnAdminAuthorizeText.textContent = dict.adminAuthorizing;
      if (adminModalError) adminModalError.style.display = 'none';

      try {
        const res = await window.api.requestAdminElevation();
        if (res && res.success) {
          if (btnAdminAuthorizeText) btnAdminAuthorizeText.textContent = dict.adminSuccess;
          btnAdminAuthorize.style.background = 'var(--apple-green)';
          setTimeout(() => {
            if (modalAdminPermission) modalAdminPermission.style.display = 'none';
          }, 1200);
        } else {
          btnAdminAuthorize.disabled = false;
          if (btnAdminClose) btnAdminClose.disabled = false;
          if (btnAdminAuthorizeText) btnAdminAuthorizeText.textContent = dict.adminBtnAuthorize;
          if (adminModalError) {
            adminModalError.textContent = res?.message || dict.adminDenied;
            adminModalError.style.display = 'block';
          }
        }
      } catch (e) {
        btnAdminAuthorize.disabled = false;
        if (btnAdminClose) btnAdminClose.disabled = false;
        if (btnAdminAuthorizeText) btnAdminAuthorizeText.textContent = dict.adminBtnAuthorize;
        if (adminModalError) {
          adminModalError.textContent = e.message || dict.adminDenied;
          adminModalError.style.display = 'block';
        }
      }
    });
  }
}

/* ==========================================================================
   Initialize Application Controller & Listeners
   ========================================================================== */
async function init() {
  // Initialize and run Canvas wave animation engine
  if (waveCanvas) {
    waveEngine = new WaveAnimationEngine(waveCanvas);
    waveEngine.start();
  }

  // Load saved configuration from disk
  const savedCfg = await window.api.loadConfig();
  applyConfigToUI(savedCfg);

  // Check admin rights on startup and show in-app modal if not elevated
  await initAdminPermissionCheck();

  // Check initial process state
  const initialStatus = await window.api.checkStatus();
  updateStatusUI(initialStatus);

  // IPC Event Listeners from main process
  window.api.onStatusChange((status) => {
    updateStatusUI(status);
  });

  window.api.onLog((log) => {
    appendLog(log);
  });

  // Start ping monitoring
  checkPing();
  pingInterval = setInterval(checkPing, 2500);

  // Power Button
  btnPower.addEventListener('click', handlePowerToggle);

  // Initialize Custom Animated Dropdowns
  initCustomDropdowns();

  // Light / Dark Theme Button
  if (btnTheme) {
    btnTheme.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark-theme');
      const newTheme = isDark ? 'light' : 'dark';
      setTheme(newTheme);
      saveCurrentConfig();
      const dict = i18n[currentLang] || i18n.fr;
      appendLog(newTheme === 'dark' ? dict.logThemeDark : dict.logThemeLight);
    });
  }

  // Language Dropdown
  langSelect.addEventListener('change', (e) => {
    applyLanguage(e.target.value);
    syncCustomDropdown('containerLang', e.target.value);
  });

  // iOS Switch for Windows Service
  if (iosServiceToggle) {
    iosServiceToggle.addEventListener('change', (e) => {
      setMode(e.target.checked);
      saveCurrentConfig();
      const dict = i18n[currentLang] || i18n.fr;
      appendLog(`[Mode] ${e.target.checked ? dict.modeService : dict.modeRunOnce}`);
    });
  }

  // Preset Selector (Niveau DPI)
  if (selectPreset) {
    selectPreset.addEventListener('change', () => {
      updatePresetSubtitle(selectPreset.value);
      syncCustomDropdown('containerPreset', selectPreset.value);
      if (selectPreset.value === 'custom') {
        const advancedDrawer = document.querySelector('.advanced-drawer-card');
        if (advancedDrawer) {
          advancedDrawer.classList.add('expanded');
        }
        inputExtraArgs.focus();
      }
      saveCurrentConfig();
      const selectedLabel = selectPreset.options[selectPreset.selectedIndex]?.text || selectPreset.value;
      appendLog(`[${currentLang === 'en' ? 'DPI Level' : 'Niveau DPI'}] ${selectedLabel}`);
    });
  }

  // DNS Selector
  selectDNS.addEventListener('change', () => {
    syncCustomDropdown('containerDNS', selectDNS.value);
    customDnsRow.classList.toggle('hidden', selectDNS.value !== 'custom');
    saveCurrentConfig();
  });

  // TTL & Custom Arguments
  selectTTL.addEventListener('change', () => {
    syncCustomDropdown('containerTTL', selectTTL.value);
    saveCurrentConfig();
  });
  inputExtraArgs.addEventListener('input', saveCurrentConfig);
  inputCustomIp.addEventListener('input', saveCurrentConfig);
  inputCustomPort.addEventListener('input', saveCurrentConfig);

  // Advanced Settings Drawer Accordion
  const advancedToggle = document.getElementById('advancedToggle');
  if (advancedToggle) {
    advancedToggle.addEventListener('click', () => {
      const advancedCard = document.querySelector('.advanced-drawer-card');
      const terminalDrawer = document.querySelector('.terminal-drawer-card');
      if (advancedCard) {
        const isExpanding = !advancedCard.classList.contains('expanded');
        advancedCard.classList.toggle('expanded');
        if (isExpanding && terminalDrawer) {
          terminalDrawer.classList.remove('expanded');
        }
      }
    });
  }

  // Terminal Drawer Accordion
  terminalToggle.addEventListener('click', () => {
    const terminalDrawer = document.querySelector('.terminal-drawer-card');
    const advancedCard = document.querySelector('.advanced-drawer-card');
    if (terminalDrawer) {
      const isExpanding = !terminalDrawer.classList.contains('expanded');
      terminalDrawer.classList.toggle('expanded');
      if (isExpanding && advancedCard) {
        advancedCard.classList.remove('expanded');
      }
    }
  });

  // Titlebar controls
  btnMin.addEventListener('click', () => {
    window.api.minimizeWindow();
  });

  btnClose.addEventListener('click', () => {
    const dict = i18n[currentLang] || i18n.fr;
    appendLog(dict.logHidden);
    window.api.closeWindow();
  });

  // Uninstall Windows Service
  btnUninstallService.addEventListener('click', async () => {
    const dict = i18n[currentLang] || i18n.fr;
    if (confirm(dict.uninstallConfirm)) {
      appendLog(dict.logUninstalling);
      await window.api.uninstallService();
      updateStatusUI(false);
      alert(dict.uninstallSuccess);
    }
  });

  // Strictly prevent any window-level scrolling or sliding
  window.addEventListener('wheel', (e) => {
    // Only permit wheel scrolling inside scrollable areas (console log flow and open dropdown menu)
    const isScrollable = e.target.closest('.console-log-flow, .custom-select-menu');
    if (!isScrollable) {
      e.preventDefault();
    }
  }, { passive: false });

  // Prevent keyboard navigation keys (Space, PageUp, PageDown, Arrows) from scrolling the window
  window.addEventListener('keydown', (e) => {
    if (['Space', 'PageUp', 'PageDown'].includes(e.code)) {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
      }
    }
  });

  // Zero-out any accidental programmatic or browser scroll offset
  window.addEventListener('scroll', () => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  });
}

// Start everything once DOM is ready
document.addEventListener('DOMContentLoaded', init);
