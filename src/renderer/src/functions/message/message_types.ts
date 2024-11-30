interface BaseMessage<MessageContent> {
  /** 事件发生的时间戳 / 1000 */
  time: number
  /** 收到事件的机器人 QQ 号 */
  self_id: number
  /** 上报类型 */
  post_type: string

  message_type: 'group' | 'private'
  /** 消息 ID */
  message_id: number

  message_seq?: number
  real_id?: number

  /** 原始消息 (CQ码) */
  raw_message: string
  /** 消息内容 */
  message: MessageContent[]

  font: number
  /** 发送人信息 */
  sender: {
    user_id: number
    nickname: string
    sex: 'male' | 'female' | 'unknown'
  }
}

export interface PrivateMessage<MessageContent> extends BaseMessage<MessageContent> {
  message_type: 'private'
  /** 消息子类型，如果是好友则是 `friend`，如果是群临时会话则是 `group` */
  sub_type: 'friend' | 'group' | 'other'
  user_id: number
}

export interface GroupMessage<MessageContent> extends BaseMessage<MessageContent> {
  message_type: 'group'

  sender: {
    user_id: number
    nickname: string
    /** 群名片 */
    card?: string
    /** 群头衔 */
    title?: string
    role: 'owner' | 'admin' | 'member'
    sex: 'male' | 'female' | 'unknown'
  }

  /** 消息子类型，正常消息是 `normal`，匿名消息是 `anonymous`，系统提示（如「管理员已禁止群内匿名聊天」）是 `notice` */
  sub_type: 'normal' | 'anonymous' | 'notice'

  group_id: number
  user_id: number

  /** 匿名信息，如果不是匿名消息则为 null */
  anonymous?: {
    /** 匿名 ID */
    id: number
    /** 匿名名称 */
    name: string
  } | null
}

export type ForwardMessageContent = {
  messages: {
    content: AnyMessage[]
    sender: {
      user_id: number
      nickname: string
    }
    time: number
    message_format: 'string' | 'array'
    message_type: 'group' | 'private'
  }[]
}

export type SendingMessage = {
  type: 'group' | 'private'
  id: number
  messages: AnyMessage[]
}

export type MessageTypes = {
  Text: TextMessage
  QQFace: QQFaceMessage
  Image: ImageMessage
  MFace: MFaceMessage
  Record: RecordMessage
  Video: VideoMessage
  At: AtMessage
  Rps: RpsMessage
  Dice: DiceMessage
  Shake: ShakeMessage
  Poke: PokeMessage
  Share: ShareMessage
  Contact: ContactMessage
  Location: LocationMessage
  Reply: ReplyMessage
  Forward: ForwardMessage
  XML: XMLMessage
  JSON: JSONMessage
  File: FileMessage
  Markdown: MarkdownMessage
}

export type AnyMessage =
  | TextMessage
  | QQFaceMessage
  | ImageMessage
  | MFaceMessage
  | RecordMessage
  | VideoMessage
  | AtMessage
  | RpsMessage
  | DiceMessage
  | ShakeMessage
  | PokeMessage
  | ShareMessage
  | ContactMessage
  | LocationMessage
  | ReplyMessage
  | ForwardMessage
  | XMLMessage
  | JSONMessage
  | FileMessage
  | MarkdownMessage

export type FileInfo = {
  file: string
  url: string
  file_size: string
  file_name: string
}

type TextMessage = {
  type: 'text'
  data: {
    text: string
  }
}

type QQFaceMessage = {
  type: 'face'
  data: {
    id: number
  }
}

type ImageMessage = {
  type: 'image'
  data: {
    /** 图片文件名 */
    file: string
    /** 图片类型, 如果是闪照则为`'flash'`, 否则无此项 */
    type: 'flash' | undefined
    /** 非零为表情 */
    sub_type?: number
    /** 非零为表情 */
    subType?: number
    /** 图片URL */
    url: string
    file_size?: string
    file_unique?: string
  }
}

type MFaceMessage = {
  type: 'mface'
  data: {
    summary: string
    url: string
    emoji_id: string
    emoji_package_id: number
    key: string
  }
}

type RecordMessage = {
  type: 'record'
  data: {
    file: string
    url: string
    path?: string
    /** 变声为1 */
    magic: 0 | 1
  }
}

type VideoMessage = {
  type: 'video'
  data: {
    file: string
    url: string
    file_size: string
    path?: string
  }
}

type AtMessage = {
  type: 'at'
  data: {
    /** QQ号转字符串 */
    qq: string
  }
}

/** 猜拳魔法表情 */
type RpsMessage = {
  type: 'rps'
  data: {
    result?: '1' | '2' | '3'
  }
}

/** 掷骰子魔法表情 */
type DiceMessage = {
  type: 'dice'
  data: {
    result?: '1' | '2' | '3' | '4' | '5' | '6'
  }
}

/** 窗口抖动（戳一戳） */
type ShakeMessage = {
  type: 'shake'
  data: Record<string, never>
}

/** 戳一戳 */
type PokeMessage = {
  type: 'poke'
  data: {
    type: string
    id: string
    name: string
  }
}

/** 分享链接 */
type ShareMessage = {
  type: 'share'
  data: {
    url: string
    title: string
    content?: string
    image?: string
  }
}

type ContactMessage = {
  type: 'contact'
  data: {
    type: 'qq' | 'group'
    id: string
  }
}

type LocationMessage = {
  type: 'location'
  data: {
    /** 经度 */
    lon: number
    /** 纬度 */
    lat: number
    title: string
    content: string
  }
}

type ReplyMessage = {
  type: 'reply'
  data: {
    /** 回复的原消息ID */
    id: number
  }
}

type ForwardMessage = {
  type: 'forward'
  data: {
    /** 合并转发消息ID */
    id: string
  }
}

type XMLMessage = {
  type: 'xml'
  data: {
    data: string
  }
}

type JSONMessage = {
  type: 'json'
  data: {
    data: string
  }
}

type FileMessage = {
  type: 'file'
  data: {
    file: string
    file_id: string
    file_size: string
    file_unique: string
    path: string
    url: string
  }
}

type MarkdownMessage = {
  type: 'markdown'
  data: {
    content: string
  }
}

// 以下是JSON消息内联的特殊格式消息类型

export type JsonInnerMsg = {
  app: string
  bizsrc: string
  meta: {
    // @ts-ignore 未知类型
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }
  prompt: string
  view: string
}

export type GroupAnnounceMsg = {
  cr: number
  encode: number
  fid: string
  gc: string
  pic: {
    width: number
    height: number
    url: string
  }[]
  sign: string
  text: string
  title: string
  tw: number
  uin: number
}

export type MiniAppMsg = {
  appid: string
  preview: string
  shareTemplateData: Record<string, unknown>
  gamePointsUrl: string
  gamePoints: string
  url: string
  appType: number
  desc: string
  title: string
  scene: number
  host: { uin: number; nick: string }
  icon: string
  shareTemplateId: string
  qqdocurl: string
  showLittleTail: string
  shareOrigin: number
}

export type LocationMsg = {
  address: string
  enum_relation_type: number
  from: string
  from_account: number
  id: string
  lat: string
  lng: string
  name: string
  uint64_peer_account: number
}
