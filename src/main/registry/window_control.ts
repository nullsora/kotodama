import * as childProcess from 'child_process'
import { BrowserWindow, ipcMain, shell } from 'electron'

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

  ipcMain.handle('window:openNewWindow', async (_event, { url }: { url: string }) => {
    const newWindow = new BrowserWindow({
      width: 800,
      height: 600
    })

    newWindow.loadURL(url)
  })

  ipcMain.handle('window:openExternal', async (_event, { url }: { url: string }) => {
    try {
      await shell.openExternal(url)
    } catch (e) {
      const extWhiteList = [
        'jpg',
        'jpeg',
        'png',
        'gif',
        'bmp',
        'webp',
        'svg',
        'ico',
        'html',
        'htm',
        'pdf',
        'txt',
        'md',
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'zip',
        'rar',
        '7z',
        'tar',
        'gz',
        'mp3',
        'mp4',
        'avi',
        'flv',
        'mov',
        'wmv',
        'mkv',
        'wav',
        'ogg',
        'flac'
      ]
      if (extWhiteList.includes(url.split('.').pop()!)) {
        childProcess.exec(`"${url}"`)
      } else {
        const slash = /\\|\//
        const sysSlash = process.platform === 'win32' ? '\\' : '/'
        const dir = url.split(slash).slice(0, -1).join(sysSlash)
        childProcess.exec(`explorer "${dir}"`)
      }
    }
  })
}
