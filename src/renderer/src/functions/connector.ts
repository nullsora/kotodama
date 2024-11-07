import { Logger } from './logger'
import { Parser } from './message/parser'

const { onebot, crypto } = window.kotodama

const Connector = {
  connect: (url: string, token: string) => {
    onebot.connect(url, token)
  },
  close: () => {
    onebot.close()
  },
  sendRaw: (data: string) => {
    onebot.send(data)
    Logger.getInstance().ws('PUT: ', JSON.parse(data))
  },
  send: (actionName: string, params: { [key: string]: unknown }, callbackName: string) => {
    const data = JSON.stringify({
      action: actionName,
      params,
      echo: callbackName
    })
    Connector.sendRaw(data)
  },

  listenMessage: () => {
    onebot.onMessage((_event, data) => {
      Parser.getInstance().watchMessage(data)
    })
  },

  fetch: async (
    actionName: string,
    callbackPrefix: string = '',
    params: { [key: string]: unknown } = {}
  ) => {
    return new Promise((resolve, _reject) => {
      const callbackName = callbackPrefix + (callbackPrefix === '' ? '' : ':') + crypto.randomUUID()
      Parser.registerListener(callbackName, resolve)
      Connector.send(actionName, params, callbackName)
    })
  }
}

export default Connector
