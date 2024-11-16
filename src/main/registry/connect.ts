import { BrowserWindow, ipcMain } from 'electron'
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

  ipcMain.handle('web:fetchBlob', async (_event, { url, params }) => {
    const res = await fetch(url, params)
    const blob = await res.blob()
    const buffer = await blob.arrayBuffer()
    return buffer
  })
}
