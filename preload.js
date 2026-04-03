const { contextBridge } = require('electron');

// Expose safe APIs if needed later
contextBridge.exposeInMainWorld('electronAPI', {
  // add functions if needed
});
