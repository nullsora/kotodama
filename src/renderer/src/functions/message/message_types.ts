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

export type SendingMessage = {
  type: 'group' | 'private'
  id: number
  messages: AnySendingMessage[]
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

export type AnyMessage = MessageTypes[keyof MessageTypes]

export type SendingMessageTypes = Omit<MessageTypes, 'Image' | 'Video' | 'File'> & {
  Image: SendingImageMessage
  Video: SendingVideoMessage
  File: SendingFileMessage
}

export type AnySendingMessage = SendingMessageTypes[keyof SendingMessageTypes]

export type FileInfo = {
  file: string
  url: string
  file_size: string
  file_name: string
}

type BaseMessageContent<T, D> = {
  type: T
  data: D
}

type TextMessage = BaseMessageContent<'text', { text: string }>

type QQFaceMessage = BaseMessageContent<'face', { id: number }>

type ImageMessage = BaseMessageContent<
  'image',
  {
    /** 图片文件名 */
    file: string
    /** 图片类型, 如果是闪照则为`'flash'`, 否则无此项 */
    type?: 'flash'
    /** 非零为表情 */
    sub_type?: number
    /** 图片URL */
    url: string
    file_size?: string
    file_unique?: string
  }
>
type SendingImageMessage = BaseMessageContent<
  'image',
  {
    file: string
    sub_type?: number
  }
>

type MFaceMessage = BaseMessageContent<
  'mface',
  {
    summary: string
    url: string
    emoji_id: string
    emoji_package_id: number
    key: string
  }
>

type RecordMessage = BaseMessageContent<
  'record',
  {
    file: string
    url: string
    path?: string
    /** 变声为1 */
    magic: 0 | 1
  }
>

type VideoMessage = BaseMessageContent<
  'video',
  { file: string; url: string; file_size: string; path?: string }
>
type SendingVideoMessage = BaseMessageContent<'video', { file: string }>

type AtMessage = BaseMessageContent<'at', { qq: string; name?: string }>

/** 猜拳魔法表情 */
type RpsMessage = BaseMessageContent<'rps', { result?: '1' | '2' | '3' }>

/** 掷骰子魔法表情 */
type DiceMessage = BaseMessageContent<'dice', { result?: '1' | '2' | '3' | '4' | '5' | '6' }>

/** 窗口抖动（戳一戳） */
type ShakeMessage = BaseMessageContent<'shake', Record<string, never>>

/** 戳一戳 */
type PokeMessage = BaseMessageContent<'poke', { type: string; id: string; name: string }>

/** 分享链接 */
type ShareMessage = BaseMessageContent<
  'share',
  {
    url: string
    title: string
    content?: string
    image?: string
  }
>

type ContactMessage = BaseMessageContent<'contact', { type: 'qq' | 'group'; id: string }>

type LocationMessage = BaseMessageContent<
  'location',
  {
    /** 经度 */
    lon: number
    /** 纬度 */
    lat: number
    title: string
    content: string
  }
>

type ReplyMessage = BaseMessageContent<'reply', { id: number }>

type ForwardMessage = BaseMessageContent<
  'forward',
  {
    /** 合并转发消息ID */
    id: string | number
    /** (Napcat) 消息内容 */
    content?: PrivateMessage<AnyMessage>[] | GroupMessage<AnyMessage>[]
  }
>

type XMLMessage = BaseMessageContent<'xml', { data: string }>

type JSONMessage = BaseMessageContent<'json', { data: string }>

type FileMessage = BaseMessageContent<
  'file',
  {
    file: string
    file_id: string
    file_size: string
    file_unique: string
    path: string
    url: string
  }
>
type SendingFileMessage = BaseMessageContent<'file', { file: string }>

type MarkdownMessage = BaseMessageContent<'markdown', { content: string }>

// 以下是JSON消息内联的特殊格式消息类型

export type JsonInnerMsg = {
  app: string
  bizsrc: string
  meta: {
    // @ts-ignore I need any
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

export type ContactShareMsg = {
  avatar: string
  contact: string
  jumpUrl: string
  nickname: string
  tag: string
  tagIcon: string | null
}
