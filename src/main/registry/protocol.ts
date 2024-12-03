import { net, protocol } from 'electron'
import { pathToFileURL } from 'url'

const schemes = {
  webImg: 'k-web-img',
  avatar: 'k-avatar',
  file: 'k-file'
}

const trustedHosts = ['qq.com', 'qq.com.cn', 'qpic.cn', 'qlogo.cn']

const checkHostSafe = (host: string) => {
  for (const h of trustedHosts) {
    if (host.endsWith(h)) return true
  }
  return false
}

export const registerProtocol = () => {
  protocol.registerSchemesAsPrivileged([
    { scheme: schemes.webImg, privileges: { secure: true, standard: true, bypassCSP: true } },
    { scheme: schemes.avatar, privileges: { secure: true, standard: true, bypassCSP: true } },
    { scheme: schemes.file, privileges: { secure: true, standard: true, bypassCSP: true } }
  ])
}

export const handleProtocol = () => {
  protocol.handle(schemes.webImg, (request) => {
    const url = 'https://' + request.url.slice(`${schemes.webImg}://`.length)
    // const { host } = new URL(url)
    // if (!checkHostSafe(host)) {
    //   return new Response('Not allowed', { status: 403 })
    // }

    return net.fetch(url)
  })

  protocol.handle(schemes.avatar, (request) => {
    const url = 'https://' + request.url.slice(`${schemes.avatar}://`.length)
    const { host } = new URL(url)
    if (!checkHostSafe(host)) {
      return new Response('Not allowed', { status: 403 })
    }

    return net.fetch(url, {
      cache: 'force-cache',
      headers: {
        'Cache-Control': `max-age=${60 * 60 * 24}`
      }
    })
  })

  protocol.handle(schemes.file, (request) => {
    const url = request.url.slice(`${schemes.file}://`.length)

    return net.fetch(pathToFileURL(url).toString())
  })
}
