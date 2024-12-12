import { Logger } from './logger'
import { Parser } from './message/parser'
import { BotConfig, MsgBody, OnebotInfo } from './types'

import LLOneBot from '../bot_mapping/LLOnebot.json'
import { AnyMessage, AnySendingMessage, GroupAnnouce } from './message/message_types'

// @ts-ignore - window is defined in preload
const { onebot, crypto } = window.kotodama

let onebotInfo: OnebotInfo | null = null

const getBotConfig = () => {
  let botConfig: BotConfig | null = null

  switch (onebotInfo?.app_name) {
    case 'LLOneBot':
      botConfig = LLOneBot
      break
    default:
      break
  }

  return botConfig
}

const parseAction = (actionName: string, config: BotConfig) => {
  if (!config.apiMap) return actionName

  return config.apiMap.find((map) => map.base === actionName)?.alias ?? actionName
}

/**
 * 将参数中的键名转换为映射表中的别名
 */
const parseParam = (actionName: string, params: { [key: string]: unknown }) => {
  const config = getBotConfig()
  if (!config) return params

  // 查找映射表
  const mapping = config?.mappings?.find((m) => m.actions.includes(actionName))
  if (!mapping) return params

  // 创建别名映射表
  const aliasMap = new Map(mapping.parse.map(({ alias, base }) => [base, alias]))

  // 处理参数
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [aliasMap.get(key) ?? key, value])
  )
}

/**
 * 转换message
 */
export const parseMsg = (msg: AnyMessage) => {
  const config = getBotConfig()
  if (!config) return msg

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

export const parseSendingMsg = (msg: AnySendingMessage) => {
  const config = getBotConfig()
  if (!config) return msg

  const mappings = config?.structures?.message?.[msg.type]
  if (!mappings) return msg

  const aliasMap = new Map(mappings.map(({ alias, base }) => [base, alias]))
  const res = {
    ...msg,
    data: Object.fromEntries(
      Object.entries(msg.data).map(([key, value]) => [aliasMap.get(key) ?? key, value])
    )
  }

  return res as AnySendingMessage
}

export const parseAnnounce = (msg: GroupAnnouce) => {
  const config = getBotConfig()
  if (!config) return msg

  const mappings = config?.structures?.response?.annouce
  if (!mappings) return msg

  const aliasMap = new Map(mappings.map(({ alias, base }) => [alias, base]))
  const res = {
    ...msg,
    message: Object.fromEntries(
      Object.entries(msg.message).map(([key, value]) => [aliasMap.get(key) ?? key, value])
    )
  }

  return res as GroupAnnouce
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
    const parsedAction = parseAction(actionName, LLOneBot)
    const parsedParams = parseParam(parsedAction, params)

    const data = JSON.stringify({
      action: parsedAction,
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
