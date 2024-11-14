import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { randomUUID } from 'crypto'

const kotodama = {
  window: {
    minimize: async () => await ipcRenderer.invoke('window:minimize'),
    toggleMaximize: async () => await ipcRenderer.invoke('window:toggleMaximize'),
    watchMaximize: async (
      callback: (event: IpcRendererEvent, windowState: boolean, ...args: unknown[]) => void
    ) => {
      ipcRenderer.on('window:watchMaximize', callback)
    },
    close: async () => await ipcRenderer.invoke('window:close')
  },
  onebot: {
    connect: async (url: string, token: string) =>
      await ipcRenderer.invoke('onebot:connect', { url, token }),
    send: async (json: string) => await ipcRenderer.invoke('onebot:send', json),
    close: async () => await ipcRenderer.invoke('onebot:close'),
    onOpen: (
      callback: (
        event: IpcRendererEvent,
        { url, accessToken }: { url: string; accessToken: string }
      ) => void
    ) => {
      ipcRenderer.on('onebot:onopen', callback)
    },
    onMessage: (callback: (event: IpcRendererEvent, data: string) => void) => {
      ipcRenderer.on('onebot:onmessage', callback)
    },
    onClose: (
      callback: (
        event: IpcRendererEvent,
        {
          code,
          message,
          address,
          token
        }: {
          code: number
          message: string
          address: string
          token: string
        }
      ) => void
    ) => {
      ipcRenderer.on('onebot:onclose', callback)
    }
  },
  web: {
    fetch: async (url: string, options?: RequestInit) =>
      await ipcRenderer.invoke('web:fetch', { url, options }),
    fetchBuffer: async (url: string, options?: RequestInit) =>
      await ipcRenderer.invoke('web:fetchBlob', { url, options })
  },
  crypto: {
    randomUUID
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('kotodama', kotodama)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.kotodama = kotodama
}