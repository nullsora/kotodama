import { AnyMessage, GroupMessage, PrivateMessage } from './message/message_types'

export enum Pages {
  Chat = 'chat',
  Contacts = 'contacts',
  Settings = 'settings',
  Login = 'login'
}

export enum PrimaryColor {
  Noir = 'slate',
  Emerald = 'emerald',
  Green = 'green',
  Lime = 'lime',
  Red = 'red',
  Orange = 'orange',
  Amber = 'amber',
  Yellow = 'yellow',
  Teal = 'teal',
  Cyan = 'cyan',
  Sky = 'sky',
  Blue = 'blue',
  Indigo = 'indigo',
  Violet = 'violet',
  Purple = 'purple',
  Fuchsia = 'fuchsia',
  Pink = 'pink',
  Rose = 'rose'
}

export type BotConfig = {
  name: string
  mappings?: {
    actions: string[]
    parse: {
      alias: string
      base: string
    }[]
  }[]
  structures?: {
    [key: string]: {
      [key: string]: {
        alias: string
        base: string
      }[]
    }
  }
}

// API body types

export interface MsgBody<T> {
  status: string
  retcode: number
  data: T
  message: string
  wording: string
  echo: string
}

export type OnebotInfo = {
  app_name: string
  app_version: string
  protocol_version: string
}

export type UserInfo = {
  user_id: number
  nickname: string
}

export type Group = {
  group_id: number
  group_name: string
  member_count: number
  max_member_count: number

  group_momo?: string
  group_create_time?: number
}

export type Stranger = {
  user_id: number
  nickname: string
  sex: 'male' | 'female' | 'unknown'
  age: number

  qid?: string
  level?: number
  login_days?: number
  reg_time?: number
  long_nick?: string
  city?: string
}

export type Friend = {
  /** 备注 */
  remark: string
  /** QQ号 */
  user_id: number
  /** 用户昵称 */
  nickname: string

  age: number
  sex: 'male' | 'female' | 'unknown'

  qid?: string
  longNick?: string
  birthday_year?: number
  birthday_month?: number
  birthday_day?: number
  eMail?: string
  phoneNum?: string
  /** 用户分类 */
  categoryId?: number
  /** 注册时间 */
  richTime?: number
  /** 这是什么？ */
  richBuffer?: {
    [index: string]: number
  }
  uid?: string
  uin?: string
  /** 还是用户昵称 */
  nick?: string
  level?: number
}

export type GroupMember = {
  group_id: number
  user_id: number
  nickname: string
  /** 群名片 / 备注 */
  card: string
  sex: 'male' | 'female' | 'unknown'
  age: number
  /** 地区 */
  area: string
  /** 加群时间戳 */
  join_time: number
  /** 最后发言时间戳 */
  last_sent_time: number
  role: 'owner' | 'admin' | 'member'
  /** 是否不良记录成员 */
  unfriendly: boolean
  /** 专属头衔 */
  title: string
  /** 专属头衔过期时间戳 */
  title_expire_time: number
  /** 是否允许修改群名片 */
  card_changeable: boolean
}

export type FriendsCategory = {
  /** 分组ID */
  categoryId: number
  /** 分组排序ID */
  categorySortId: number
  /** 分组名称 */
  categoryName: string
  /** 分组内好友数量 */
  categoryMbCount: number
  /** 在线好友数量 */
  onlineCount: number
  buddyList: Friend[]
}

// Runtime Data types

export type Chat =
  | {
      type: 'friend'
      data: Friend
      latestMsg?: PrivateMessage<AnyMessage>
      pinned?: boolean
      archived?: boolean
    }
  | {
      type: 'group'
      data: Group
      latestMsg?: GroupMessage<AnyMessage>
      pinned?: boolean
      archived?: boolean
    }
export type ChatInfo = {
  type: 'friend' | 'group'
  id: number
}

export type UserSetting = {
  connection: {
    url: string
    token?: string
  }
  info: {
    main: UserInfo
    more?: Friend
    faces: string[]
  }
  contacts: {
    friends: Friend[]
    friendsCategories: FriendsCategory[]
    groups: Group[]

    showing: Chat[]
  }
  contactGroups: {
    name: string
    iconClass: string
    chats: Chat[]
  }[]
}

export type PrivateMsgChainNode = {
  type: 'private'
  /** 当天0:00的时间戳 / 1000 */
  time: number
  messages: {
    sender: {
      user_id: number
      nickname: string
      sex: 'male' | 'female' | 'unknown'
    }
    data: PrivateMessage<AnyMessage>[]
  }[]
}

export type GroupMsgChainNode = {
  type: 'group'
  /** 当天0:00的时间戳 / 1000 */
  time: number
  messages: {
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
    data: GroupMessage<AnyMessage>[]
  }[]
}
