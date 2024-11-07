import Connector from './connector'
import { PrivateMessage, AnyMessage, GroupMessage, SendingMessage } from './message/message_types'
import { Friend, FriendsCategory, Group, GroupMember, MsgBody, Stranger, UserInfo } from './types'

export const packagedGetter = {
  getUserInfo: async () => {
    return (await Connector.fetch('get_login_info', 'getUserInfo')) as MsgBody<UserInfo>
  },

  getStrangerInfo: async (userId: number) => {
    return (await Connector.fetch('get_stranger_info', 'getStrangerInfo', {
      user_id: userId
    })) as MsgBody<Stranger>
  },
  getMsg: async (messageId: number) => {
    return (await Connector.fetch('get_msg', 'getMsg', {
      message_id: messageId
    })) as MsgBody<PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>>
  },

  getGroupList: async () => {
    return (await Connector.fetch('get_group_list', 'getGroupList')) as MsgBody<Group[]>
  },
  getFriendList: async () => {
    return (await Connector.fetch('get_friend_list', 'getFriendList')) as MsgBody<Friend[]>
  },
  getFriendsWithCategory: async () => {
    const category = await Connector.fetch('get_friends_with_category', 'getFriendsWithCategory')
    console.log(category)
    return category as MsgBody<FriendsCategory[]>
  },

  getGroupMemberList: async (groupId: number) => {
    return (await Connector.fetch('get_group_member_list', 'getGroupMemberList', {
      group_id: groupId
    })) as MsgBody<GroupMember[]>
  },
  getGroupMemberInfo: async (groupId: number, userId: number, noCache: boolean = false) => {
    return (await Connector.fetch('get_group_member_info', 'getGroupMemberInfo', {
      group_id: groupId,
      user_id: userId,
      no_cache: noCache
    })) as MsgBody<GroupMember>
  },

  getFriendMsgHistory: async (userId: number, count?: number, startMsgId?: number) => {
    return (await Connector.fetch('get_friend_msg_history', 'getFriendMsgHistory', {
      user_id: userId,
      count,
      message_id: startMsgId
    })) as MsgBody<{
      messages: PrivateMessage<AnyMessage>[]
    }>
  },
  getGroupMsgHistory: async (groupId: number, count?: number, startMsgId?: number) => {
    return (await Connector.fetch('get_group_msg_history', 'getGroupMsgHistory', {
      group_id: groupId,
      count,
      message_id: startMsgId
    })) as MsgBody<{
      messages: GroupMessage<AnyMessage>[]
    }>
  },
  /*
  getRecentContacts: async (count: number = 10) => {
    return (await Connector.fetch('get_recent_contacts', 'getRecentContacts', {
      count
    })) as MsgBody<>
  }
  */

  sendMessage: async (sender: SendingMessage) => {
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
