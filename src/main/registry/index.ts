import { BrowserWindow } from 'electron'
import windowControl from './window_control'
import connect from './connect'
import fileManage from './file_manage'

function registerIpc(window: BrowserWindow) {
  windowControl(window)
  connect(window)
  fileManage()
}

export default registerIpc
