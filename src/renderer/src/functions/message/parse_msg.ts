import { DataManager } from '../data_manager'
import { faceMap } from '../face_map'
import { packagedGetter } from '../packaged_api'
import { checkImgFace } from './check_img_face'
import {
  AnyMessage,
  GroupMessage,
  JsonInnerMsg,
  MessageTypes,
  PrivateMessage
} from './message_types'

const parseAtMsg = async (msg: MessageTypes['At'], sendGroupId?: number) => {
  if (msg.data.name) return `@${msg.data.name} `

  const qqString = msg.data.qq

  if (qqString.includes('全体成员') || qqString.includes('all')) {
    return '@全体成员 '
  }
  const qq = parseInt(qqString)
  let name: string
  try {
    if (sendGroupId) {
      const info = (await packagedGetter.getInfo.groupMember(sendGroupId, qq)).data
      name = info.card === '' ? info.nickname : info.card
    } else {
      name = (await packagedGetter.getInfo.stranger(qq)).data.nickname
    }
    return `@${name} `
  } catch (e) {
    console.log(qq)
    return '@全体成员 '
  }
}

const parseRps = (rpsRes: '1' | '2' | '3') => {
  switch (rpsRes) {
    case '1':
      return '布'
    case '2':
      return '剪刀'
    case '3':
      return '石头'
  }
}

export const parseShortMsg = async (msg: AnyMessage, groupId?: number) => {
  let shortMsg = ''
  switch (msg.type) {
    case 'text':
      shortMsg = msg.data.text
      break
    case 'face':
      shortMsg = `[${faceMap[msg.data.id] ?? '表情'}]`
      break
    case 'image':
      shortMsg = checkImgFace(msg) ? '[动画表情]' : '[图片]'
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
      shortMsg = await parseAtMsg(msg, groupId)
      break
    case 'rps':
      shortMsg = `[猜拳: ${parseRps(msg.data.result!)}]`
      break
    case 'dice':
      shortMsg = `[骰子: ${msg.data.result}点]`
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
      break // Markdown 有对应的 text 字段
    default:
      // @ts-ignore 未知消息类型
      shortMsg = `[${msg.type}: 解析错误]`
      console.log(msg)
  }
  return shortMsg
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

export const getSenderName = ({
  message_type: _message_type,
  sender
}: {
  message_type: 'private' | 'group'
  sender: { nickname: string; card?: string; user_id?: number }
}) => {
  if (sender.card && sender.card !== '') return sender.card
  else if (sender.user_id) {
    const user = DataManager.getInstance().find.friend(sender.user_id)
    return user && user.remark !== '' ? user.remark : sender.nickname
  } else return sender.nickname
}
