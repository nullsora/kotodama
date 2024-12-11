import { Logger } from './logger'
import { Parser } from './message/parser'
import { BotConfig, MsgBody, OnebotInfo } from './types'

import LLOneBot from '../bot_mapping/LLOnebot.json'
import { AnyMessage } from './message/message_types'

// @ts-ignore - window is defined in preload
const { onebot, crypto } = window.kotodama

let onebotInfo: OnebotInfo | null = null

/**
 * 将参数中的键名转换为映射表中的别名
 */
const parseParam = (actionName: string, params: { [key: string]: unknown }, config: BotConfig) => {
  // 查找映射表
  const mapping = config?.mappings?.find((m) => m.actions.includes(actionName))
  if (!mapping) return params

  // 创建别名映射表
  const aliasMap = new Map(mapping.parse.map(({ alias, base }) => [base, alias]))

  // 处理参数
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [aliasMap.get(key) || key, value])
  )
}

export const parseMsg = (msg: { type: string; data: { [key: string]: unknown } }) => {
  let config: BotConfig | null = null

  switch (onebotInfo?.app_name) {
    case 'LLOneBot':
      config = LLOneBot
      break
    default:
      return msg
  }

  const mappings = config?.structures?.message?.[msg.type]
  if (!mappings) return msg

  const aliasMap = new Map(mappings.map(({ alias, base }) => [alias, base]))
  const res = {
    ...msg,
    data: Object.fromEntries(
      Object.entries(msg.data).map(([key, value]) => [aliasMap.get(key) ?? key, value])
    )
  }

  return res as AnyMessage
}

const Connector = {
  connect: (url: string, token: string) => {
    onebot.connect(url, token)
  },
  close: () => {
    onebot.close()
  },
  watchConnection: (
    onConnect?: (params: { url: string; accessToken: string }) => void,
    onClose?: (params: { code: number; message: string; address: string; token: string }) => void
  ) => {
    onebot.onOpen((_event, params) => {
      if (onConnect) onConnect(params)
    })
    onebot.onClose((_event, params) => {
      if (onClose) onClose(params)
    })
  },

  listenMessage: () => {
    onebot.onMessage((_event, data) => Parser.getInstance().handleIncomingMessage(data))
  },

  init: () => {
    Connector.listenMessage()
    Connector.watchConnection(Connector.onebotInfo.get, Connector.onebotInfo.reset)
  },

  sendRaw: (data: string) => {
    onebot.send(data)
    Logger.getInstance().ws('PUT: ', JSON.parse(data))
  },

  send: (actionName: string, params: { [key: string]: unknown }, callbackName: string) => {
    let parsedParams: typeof params = {}

    switch (onebotInfo?.app_name) {
      case 'LLOneBot':
        parsedParams = parseParam(actionName, params, LLOneBot)
        break
      default:
        parsedParams = params
    }

    const data = JSON.stringify({
      action: actionName,
      params: parsedParams,
      echo: callbackName
    })

    Connector.sendRaw(data)
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
  },

  onebotInfo: {
    get: async () => {
      const res = (await Connector.fetch(
        'get_version_info',
        'getVersionInfo'
      )) as MsgBody<OnebotInfo>
      onebotInfo = res.data
    },
    reset: () => {
      onebotInfo = null
    }
  }
}

export default Connector
