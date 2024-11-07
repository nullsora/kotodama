import { BrowserWindow, ipcMain } from 'electron'
import log4js from 'log4js'
import WebSocket from 'ws'

const isDevelopment = process.env.NODE_ENV !== 'production'
const logLevel = isDevelopment ? log4js.levels.DEBUG : log4js.levels.INFO

export class Connector {
  private logger = log4js.getLogger('Connector')

  private window: BrowserWindow
  private ws: WebSocket | null = null
  private reconnectTimes = 0

  constructor(window: BrowserWindow) {
    this.logger.level = logLevel
    this.window = window

    ipcMain.handle('onebot:send', async (_event, json) => {
      this.ws?.send(json)
    })
    ipcMain.handle('onebot:close', async () => {
      this.ws?.close(1000)
      this.ws = null
    })

    this.logger.info('Connector initialized')
  }

  public connect(url: string, assessToken: string) {
    if (url.indexOf('ws://') < 0 && url.indexOf('wss://') < 0) {
      url = 'wss://' + url
    }

    if (!this.ws) {
      this.logger.info(`Connecting to ${url}`)
      this.ws = new WebSocket(`${url}?access_token=${assessToken}`)
    } else {
      this.ws.close(1000)
      this.connect(url, assessToken)
    }

    this.ws.onopen = () => {
      this.reconnectTimes = 0
      this.logger.info(`Successfully connected to: ${url}`)
      this.window.webContents.send('onebot:onopen', { url, assessToken })
    }

    this.ws.onmessage = (event) => {
      this.window.webContents.send('onebot:onmessage', event.data)
    }

    this.ws.onclose = (event) => {
      this.ws = null
      this.logger.info(`Connection closed with code [${event.code}]: ${event.reason}`)

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
            this.logger.warn('Connection failed, switching to another protocol...')
            this.connect(url, assessToken)
          }
          this.reconnectTimes++
        }, 1500)
      }
    }

    this.ws.onerror = (event) => {
      this.ws = null
      this.logger.error(`Connection error: ${event.message}`)
    }
  }
}
