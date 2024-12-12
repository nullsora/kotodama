import Connector, { parseAnnounce, parseMsg, parseSendingMsg } from './connector'
import {
  PrivateMessage,
  AnyMessage,
  GroupMessage,
  SendingMessage,
  FileInfo,
  ForwardMessageContent,
  GroupAnnouce
} from './message/message_types'
import { Friend, FriendsCategory, Group, GroupMember, MsgBody, Stranger, UserInfo } from './types'

export const packagedGetter = {
  getInfo: {
    self: async () => {
      return (await Connector.fetch('get_login_info', 'getUserInfo')) as MsgBody<UserInfo>
    },
    customFace: async () => {
      return (await Connector.fetch('fetch_custom_face', 'fetchCustomFace')) as MsgBody<string[]>
    },
    stranger: async (userId: number) => {
      return (await Connector.fetch('get_stranger_info', 'getStrangerInfo', {
        user_id: userId
      })) as MsgBody<Stranger>
    },
    groupMember: async (groupId: number, userId: number, noCache: boolean = false) => {
      return (await Connector.fetch('get_group_member_info', 'getGroupMemberInfo', {
        group_id: groupId,
        user_id: userId,
        no_cache: noCache
      })) as MsgBody<GroupMember>
    }
  },

  getList: {
    group: async () => {
      return (await Connector.fetch('get_group_list', 'getGroupList')) as MsgBody<Group[]>
    },
    membersOfGroup: async (groupId: number) => {
      return (await Connector.fetch('get_group_member_list', 'getGroupMemberList', {
        group_id: groupId
      })) as MsgBody<GroupMember[]>
    },
    friend: async () => {
      return (await Connector.fetch('get_friend_list', 'getFriendList')) as MsgBody<Friend[]>
    },
    friendWithCategory: async () => {
      const category = await Connector.fetch('get_friends_with_category', 'getFriendsWithCategory')
      console.log(category)
      return category as MsgBody<FriendsCategory[]>
    }
  },

  getMsg: {
    single: async (messageId: number) => {
      const res = (await Connector.fetch('get_msg', 'getMsg', {
        message_id: messageId
      })) as MsgBody<PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>>

      res.data.message = res.data.message.map(parseMsg)

      return res
    },
    friend: async (userId: number, count?: number, startMsgId?: number) => {
      const res = (await Connector.fetch('get_friend_msg_history', 'getFriendMsgHistory', {
        user_id: userId,
        count,
        message_seq: startMsgId
      })) as MsgBody<{
        messages: PrivateMessage<AnyMessage>[]
      }>

      res.data.messages = res.data.messages.map((msg) => {
        return {
          ...msg,
          message: msg.message.map(parseMsg)
        }
      })

      return res
    },
    group: async (groupId: number, count?: number, startMsgId?: number) => {
      const res = (await Connector.fetch('get_group_msg_history', 'getGroupMsgHistory', {
        group_id: groupId,
        count,
        message_seq: startMsgId
      })) as MsgBody<{
        messages: GroupMessage<AnyMessage>[]
      }>

      res.data.messages = res.data.messages.map((msg) => {
        return {
          ...msg,
          message: msg.message.map(parseMsg)
        }
      })

      return res
    },
    forward: async (forwardId: string) => {
      const res = (await Connector.fetch('get_forward_msg', 'getForwardMsg', {
        message_id: forwardId
      })) as MsgBody<ForwardMessageContent>

      res.data.messages = res.data.messages.map((msg) => {
        return {
          ...msg,
          content: msg.content.map(parseMsg)
        }
      })

      return res
    },
    downloadFile: async (fileId: string) => {
      return (await Connector.fetch('get_file', 'getFile', {
        file_id: fileId
      })) as MsgBody<FileInfo>
    },
    imgPath: async (fileId: string) => {
      return (await Connector.fetch('get_image', 'getImage', {
        file_id: fileId
      })) as MsgBody<FileInfo>
    },
    parseRecord: async (fileId: string, format: 'wav' | 'mp3' | 'amr' = 'mp3') => {
      return (await Connector.fetch('get_record', 'getRecord', {
        file_id: fileId,
        out_format: format
      })) as MsgBody<FileInfo>
    }
  },

  group: {
    getAnnouce: async (groupId: number) => {
      const res = (await Connector.fetch('_get_group_notice', 'getGroupAnnounce', {
        group_id: groupId
      })) as MsgBody<GroupAnnouce[]>

      res.data = res.data.map(parseAnnounce)

      return res
    }
  }
}

export const packagedSender = {
  msg: {
    send: async (sender: SendingMessage) => {
      sender.messages = sender.messages.map(parseSendingMsg)

      if (sender.type === 'private') {
        return (await Connector.fetch('send_private_msg', 'sendPrivateMsg', {
          user_id: sender.id,
          message: sender.messages
        })) as MsgBody<{ message_id: number }>
      } else {
        return (await Connector.fetch('send_group_msg', 'sendGroupMsg', {
          group_id: sender.id,
          message: sender.messages
        })) as MsgBody<{ message_id: number }>
      }
    }
  }
}
