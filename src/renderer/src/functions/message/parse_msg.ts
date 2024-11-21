import { packagedGetter } from '../packaged_api'
import { AnyMessage, GroupMessage, JsonInnerMsg, PrivateMessage } from './message_types'

const parseShortMsg = async (msg: AnyMessage, groupId?: number) => {
  let shortMsg = ''
  switch (msg.type) {
    case 'text':
      shortMsg = msg.data.text
      break
    case 'face':
      shortMsg = '[表情]'
      break
    case 'image':
      if (
        (() => {
          if (msg.data.file === 'marketface') return true
          else if (msg.data.sub_type) return true
          else if (msg.data.subType) return true
          else return false
        })()
      )
        shortMsg = '[动画表情]'
      else shortMsg = '[图片]'
      break
    case 'mface':
      shortMsg = msg.data.summary
      break
    case 'record':
      shortMsg = '[语音]'
      break
    case 'video':
      shortMsg = '[视频]'
      break
    case 'at':
      shortMsg = await parseAtMsg(msg.data.qq, groupId)
      break
    case 'rps':
      shortMsg = '[猜拳]'
      break
    case 'dice':
      shortMsg = '[骰子]'
      break
    case 'shake':
      shortMsg = '[窗口抖动]'
      break
    case 'poke':
      shortMsg = '[戳一戳]'
      break
    case 'share':
      shortMsg = '[分享]'
      break
    case 'contact':
      shortMsg = '[分享名片]'
      break
    case 'location':
      shortMsg = '[分享位置]'
      break
    case 'reply':
      break // 忽略回复
    case 'forward':
      shortMsg = '[聊天记录]'
      break
    // TODO: XML 消息格式解析
    case 'xml':
      shortMsg = '[XML]'
      break
    case 'json':
      shortMsg = (JSON.parse(msg.data.data) as JsonInnerMsg).prompt
      break
    case 'file':
      shortMsg = `[文件] ${msg.data.file}`
      break
    case 'markdown':
      shortMsg = '[Markdown]'
      break
    default:
      // @ts-ignore 未知消息类型
      shortMsg = `[${msg.type}: 解析错误]`
      console.log(msg)
  }
  return shortMsg
}

const parseAtMsg = async (msg: string, sendGroupId?: number) => {
  if (msg.includes('全体成员') || msg.includes('all')) {
    return '@全体成员 '
  }
  const qq = parseInt(msg)
  let name: string
  try {
    if (sendGroupId) {
      const info = (await packagedGetter.getGroupMemberInfo(sendGroupId, qq)).data
      name = info.card === '' ? info.nickname : info.card
    } else {
      name = (await packagedGetter.getStrangerInfo(qq)).data.nickname
    }
    return `@${name} `
  } catch (e) {
    console.log(qq)
    return '@全体成员 '
  }
}

export const msgListToShortMsg = async (
  message: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>
) => {
  if (!message || !message.message) return null
  if (message.message.length === 0) return '[已撤回的消息]'
  let shortMsg = ''
  for (const msg of message.message) {
    shortMsg += await parseShortMsg(
      msg,
      message.message_type === 'group' ? message.group_id : undefined
    )
  }
  return shortMsg
}
