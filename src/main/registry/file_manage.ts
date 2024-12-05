import { ipcMain } from 'electron'
import * as fs from 'fs/promises'
import path from 'path'

const configPath = path.resolve(process.cwd(), 'config/config.json')
const getConfigAccess = async () => {
  try {
    await fs.access(configPath)
  } catch (err) {
    await fs.mkdir(path.resolve(process.cwd(), 'config'))
    await fs.writeFile(configPath, JSON.stringify({}))
  }
}

const getFacePathAccess = async () => {
  try {
    await getConfigAccess()
    await fs.access(path.resolve(process.cwd(), 'config/faces'))
  } catch (err) {
    await fs.mkdir(path.resolve(process.cwd(), 'config/faces'))
  }
}

export default () => {
  ipcMain.handle('file:getConfig', async () => {
    await getConfigAccess()
    const configFile = await fs.readFile(configPath, 'utf-8')
    return configFile
  })

  ipcMain.handle('file:saveConfig', async (_event, { config }: { config: string }) => {
    await getConfigAccess()
    await fs.writeFile(configPath, config)
  })

  ipcMain.handle('file:getFacePath', async () => {
    await getFacePathAccess()
    return path.resolve(process.cwd(), 'config/faces')
  })

  ipcMain.handle('file:getFaceList', async () => {
    await getFacePathAccess()
    const facePath = path.resolve(process.cwd(), 'config/faces')
    const faceList = await fs.readdir(facePath, { withFileTypes: true })
    const result: {
      category: string
      faces: string[]
    }[] = []

    // 根目录下的图片置于root分类
    const rootFaces = faceList.filter((face) => face.isFile())
    if (rootFaces.length) {
      const faces = rootFaces.map((face) => path.resolve(facePath, face.name))
      result.push({
        category: 'root',
        faces
      })
    }

    const faceCategoryList = faceList.filter((face) => face.isDirectory())
    for (const faceCategory of faceCategoryList) {
      if (faceCategory.isDirectory()) {
        const faceCategoryPath = path.resolve(facePath, faceCategory.name)
        const faceCategoryList = await fs.readdir(faceCategoryPath)

        for (const face of faceCategoryList) {
          const facePath = path.resolve(faceCategoryPath, face)

          const categoryId = result.findIndex((item) => item.category === faceCategory.name)
          if (categoryId !== -1) {
            result[categoryId].faces.push(facePath)
          } else {
            result.push({
              category: faceCategory.name,
              faces: [facePath]
            })
          }
        }
      }
    }

    return result
  })

  ipcMain.handle('file:access', async (_evnet, { path }) => {
    try {
      await fs.access(path)
      return true
    } catch (err) {
      return false
    }
  })

  ipcMain.handle('file:getFileBuffer', async (_event, { path }) => {
    return await fs.readFile(path)
  })
}
