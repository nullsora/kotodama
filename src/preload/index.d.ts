import { ElectronAPI } from '@electron-toolkit/preload'
import { UUID } from 'crypto'

declare global {
  interface Window {
    kotodama: {
      window: {
        minimize: () => Promise<void>
        toggleMaximize: () => Promise<void>
        watchMaximize: (
          callback: (event: IpcRendererEvent, windowState: boolean, ...args: unknown[]) => void
        ) => void
        close: () => Promise<void>

        openNewWindow: (url: string) => Promise<void>
        openExternal: (url: string) => Promise<boolean>
      }
      onebot: {
        connect(url: string, token: string): Promise<void>
        send(json: string): Promise<void>
        close(): Promise<void>
        onOpen(
          callback: (
            event: string,
            { url, accessToken }: { url: string; accessToken: string }
          ) => void
        ): void
        onMessage(callback: (event: string, data: string) => void): void
        onClose(
          callback: (
            event: string,
            {
              code,
              message,
              address,
              token
            }: { code: number; message: string; address: string; token: string }
          ) => void
        ): void
      }
      web: {
        fetch(url: string, options?: RequestInit): Promise<Response>
        fetchBuffer(url: string, options?: RequestInit): Promise<ArrayBuffer>
      }
      file: {
        access(path: string): Promise<boolean>
        getConfig(): Promise<string>
        saveConfig(config: string): Promise<void>
        getFacePath(): Promise<string>
        getFaceList(): Promise<{ category: string; faces: string[] }[]>
        getFileBuffer(path: string): Promise<Buffer>
      }
      crypto: {
        randomUUID(): UUID
      }
    }
  }
}
