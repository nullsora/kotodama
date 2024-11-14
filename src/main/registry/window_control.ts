import { BrowserWindow, ipcMain } from 'electron'

export default (window: BrowserWindow) => {
  ipcMain.handle('window:toggleMaximize', async (_event) => {
    window.isMaximized() ? window.unmaximize() : window.maximize()
  })

  window.on('resize', () => {
    window.webContents.send('window:watchMaximize', window.isMaximized())
  })

  ipcMain.handle('window:minimize', async (_event) => {
    window.minimize()
  })

  ipcMain.handle('window:close', async (_event) => {
    window.close()
  })
}