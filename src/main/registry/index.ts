import { BrowserWindow } from 'electron'
import windowControl from './window_control'
import connect from './connect'

function registerIpc(window: BrowserWindow) {
  windowControl(window)
  connect(window)
}

export default registerIpc
