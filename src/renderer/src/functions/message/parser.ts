import { Logger } from '../logger'
import { AnyMessage, GroupMessage, PrivateMessage } from './message_types'
import { DataManager } from '../data_manager'
import { parseMsg } from '../connector'

export class Parser {
  private static instance: Parser
  private watching: boolean
  private constructor() {
    this.watching = false
  }

  static getInstance() {
    if (!Parser.instance) {
      Parser.instance = new Parser()
    }
    return Parser.instance
  }

  static registerListener(listener: string, callback: (value: unknown) => void) {
    parseMsgFuncs[listener] = (data: unknown) => {
      callback(data)
      delete parseMsgFuncs[listener]
    }
  }

  handleIncomingMessage(data: string) {
    if (!this.watching) {
      this.watching = true
    }
    let msgType = 'unknown'
    let msg: { [key: string]: unknown } | null = null

    try {
      msg = JSON.parse(data)
      // get heartbeats
      if (data.indexOf('"meta_event_type":"heartbeat"') < 0) {
        // Logger.getInstance().debug(`GET: ${data}`, data)
      }
    } catch (e) {
      if (data.indexOf('"meta_event_type":"heartbeat"') < 0) {
        // Logger.getInstance().debug(`GET: ${data}`, data)
      }
    }

    try {
      if (msg) {
        if (msg.echo !== undefined) {
          msgType = msg.echo as string
          parseMsgFuncs[msgType](msg)
        } else {
          msgType = msg.post_type as string

          if (msgType === 'notice') {
            msgType = (msg.notice_type ?? msg.sub_type) as string
            // DataManager.getInstance().updateInfo()
          }
          parseNoticeFuncs[msgType](msgType, msg)
        }
      }
    } catch (e) {
      Logger.getInstance().error(`Parsing Message Error: Type ${msgType}`)
    }
  }
}

const parseNoticeFuncs = {
  // 心跳包
  meta_event: (_type: string, _msg: { [key: string]: unknown }) => {
    // TODO: 记录心跳相关信息
    // DataManager.getInstance().connected = true
  },
  message: (_type: string, _msg: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>) => {
    const innerMsgs = _msg.message.map(parseMsg)

    const msg = {
      ..._msg,
      message: innerMsgs
    }

    DataManager.getInstance().pushNewMessage(msg)
  }
}

const parseMsgFuncs = {}
