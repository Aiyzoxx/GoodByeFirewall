const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  startBypass: (config) => ipcRenderer.invoke('start-bypass', config),
  stopBypass: () => ipcRenderer.invoke('stop-bypass'),
  checkStatus: () => ipcRenderer.invoke('check-status'),
  measurePing: () => ipcRenderer.invoke('measure-ping'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  uninstallService: () => ipcRenderer.invoke('uninstall-service'),
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  checkIsAdmin: () => ipcRenderer.invoke('check-is-admin'),
  requestAdminElevation: () => ipcRenderer.invoke('request-admin-elevation'),
  quitApp: () => ipcRenderer.send('quit-app-now'),

  onStatusChange: (callback) => {
    ipcRenderer.on('status-changed', (_event, status) => callback(status));
  },
  onLog: (callback) => {
    ipcRenderer.on('log-message', (_event, log) => callback(log));
  }
});
