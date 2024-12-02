import { ipcMain } from 'electron'
import * as fs from 'fs/promises'
import path from 'path'

const configPath = path.resolve(process.cwd(), 'config/config.json')
const getAccess = async () => {
  try {
    await fs.access(configPath)
  } catch (err) {
    await fs.mkdir(path.resolve(process.cwd(), 'config'))
    await fs.writeFile(configPath, JSON.stringify({}))
  }
}

export default () => {
  ipcMain.handle('file:getConfig', async () => {
    await getAccess()
    const configFile = await fs.readFile(configPath, 'utf-8')
    return configFile
  })

  ipcMain.handle('file:saveConfig', async (_event, { config }: { config: string }) => {
    await getAccess()
    await fs.writeFile(configPath, config)
  })

  ipcMain.handle('file:getFileBuffer', async (_event, { path }) => {
    return await fs.readFile(path)
  })
}
