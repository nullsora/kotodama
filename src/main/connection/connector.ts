import { BrowserWindow, ipcMain } from 'electron'
import WebSocket from 'ws'

export class Connector {
  private window: BrowserWindow
  private ws: WebSocket | null = null
  private reconnectTimes = 0

  constructor(window: BrowserWindow) {
    this.window = window

    ipcMain.handle('onebot:send', async (_event, json) => {
      this.ws?.send(json)
    })
    ipcMain.handle('onebot:close', async () => {
      this.ws?.close(1000)
      this.ws = null
    })
  }

  public connect(url: string, assessToken: string) {
    if (url.indexOf('ws://') < 0 && url.indexOf('wss://') < 0) {
      url = 'wss://' + url
    }

    if (!this.ws) {
      this.ws = new WebSocket(`${url}?access_token=${assessToken}`)
    } else {
      this.ws.close(1000)
      this.connect(url, assessToken)
    }

    this.ws.onopen = () => {
      this.reconnectTimes = 0
      this.window.webContents.send('onebot:onopen', { url, assessToken })
    }

    this.ws.onmessage = (event) => {
      this.window.webContents.send('onebot:onmessage', event.data)
    }

    this.ws.onclose = (event) => {
      this.ws = null

      if (event.code !== 1006 && event.code !== 1015) {
        this.window.webContents.send('onebot:onclose', {
          code: event.code,
          message: event.reason,
          address: url,
          token: assessToken
        })
      } else {
        this.window.webContents.send('onebot:onclose', {
          code: -1,
          message: event.reason,
          address: url,
          token: assessToken
        })
      }

      if (this.reconnectTimes < 4) {
        setTimeout(() => {
          if (event.code == 1006) {
            if (url.indexOf('wss://') >= 0) {
              url = url.replace('wss://', 'ws://')
            } else {
              url = url.replace('ws://', 'wss://')
            }
            this.connect(url, assessToken)
          }
          this.reconnectTimes++
        }, 1500)
      }
    }

    this.ws.onerror = (_event) => {
      this.ws = null
    }
  }
}
