import { ElectronAPI } from '@electron-toolkit/preload'
import { UUID } from 'crypto'

declare global {
  interface Window {
    electron: ElectronAPI
    kotodama: {
      window: {
        minimize: () => Promise<void>
        toggleMaximize: () => Promise<void>
        watchMaximize: (
          callback: (event: IpcRendererEvent, windowState: boolean, ...args: unknown[]) => void
        ) => void
        close: () => Promise<void>
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
      crypto: {
        randomUUID(): UUID
      }
    }
  }
}
