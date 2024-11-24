import { BrowserWindow, ipcMain } from 'electron'
import * as fs from 'fs/promises'
import { Connector } from '../connection/connector'

let connector: Connector | null = null

export default (window: BrowserWindow) => {
  ipcMain.handle('onebot:connect', (_event, { url, token }) => {
    if (!connector) {
      connector = new Connector(window)
    }
    connector.connect(url, token)
  })

  ipcMain.handle('web:fetch', (_event, { url, params }) => {
    return fetch(url, params)
  })

  ipcMain.handle('web:fetchBuffer', async (_event, { url, params }) => {
    const res = await fetch(url, params)
    const buffer = await res.arrayBuffer()
    return buffer
  })

  ipcMain.handle('file:getFileBuffer', async (_event, { path }) => {
    return await fs.readFile(path)
  })
}
