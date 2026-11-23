'use strict';

// Narrow bridge for the Home window: it can list sessions, start or stop
// Listening, and ask the overlay to open a session. Nothing else.
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('volyxHome', {
  listSessions: () => ipcRenderer.invoke('home:list'),
  captureState: () => ipcRenderer.invoke('home:capture-state'),
  toggleCapture: () => ipcRenderer.invoke('home:toggle-capture'),
  openSession: (id) => ipcRenderer.invoke('home:open-session', id),
  onChange: (cb) => {
    const handler = (_event, channel, data) => cb(channel, data);
    ipcRenderer.on('home:event', handler);
    return () => ipcRenderer.removeListener('home:event', handler);
  },
});
