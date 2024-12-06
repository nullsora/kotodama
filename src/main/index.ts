import { app, shell, BrowserWindow, Tray, Menu } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import trayIcon from '../../resources/tray.png?asset'

import registerIpc from './registry'
import { handleProtocol, registerProtocol } from './registry/protocol'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1000,
    minWidth: 1000,
    height: 720,
    minHeight: 600,
    title: 'Kotodama',
    show: false,
    frame: false,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  registerIpc(mainWindow)
  handleProtocol()

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
    // mainWindow.webContents.openDevTools()
  })

  mainWindow.on('close', (event) => {
    mainWindow.hide()
    mainWindow.setSkipTaskbar(true)
    event.preventDefault()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

function openWindow() {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  } else {
    BrowserWindow.getAllWindows().forEach((win) => {
      win.focus()
      if (!win.isVisible()) {
        win.show()
        win.setSkipTaskbar(false)
      }
    })
  }
}

function forceQuit() {
  BrowserWindow.getAllWindows().forEach((win) => {
    win.destroy()
  })
}

let tray: Tray | null = null

registerProtocol()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron.kotodama')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC register

  tray = new Tray(trayIcon)
  tray.setToolTip('Kotodama')
  tray.on('click', openWindow)
  const contextMenu = Menu.buildFromTemplate([
    { label: '打开窗口', click: openWindow },
    {
      label: '退出',
      click: () => {
        forceQuit()
        app.quit()
      }
    }
  ])
  tray.setContextMenu(contextMenu)

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

const lock = app.requestSingleInstanceLock()

if (!lock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    openWindow()
  })
}
