import localforage from 'localforage'
import Connector from './connector'
import {
  PrivateMessage,
  AnyMessage,
  GroupMessage,
  SendingMessage,
  FileInfo,
  ForwardMessageContent
} from './message/message_types'
import { Friend, FriendsCategory, Group, GroupMember, MsgBody, Stranger, UserInfo } from './types'

export const packagedGetter = {
  cachedFile: {
    recordBlob: {
      get: async (url: string) => {
        const ext = url.split('.').pop()
        let recordCache = await localforage.getItem<{
          [url: string]: {
            blob: Blob
            savedTime: number
          }
        }>('record-cache')

        if (!recordCache) {
          recordCache = {}
          await localforage.setItem('record-cache', recordCache)
        }

        const fetchBlob = async () => {
          // @ts-ignore allow window
          const res = await window.kotodama.file.getFileBuffer(url)
          const blob = new Blob([res], { type: `audio/${ext ?? 'mpeg'}` })
          recordCache[url] = {
            blob: blob,
            savedTime: Date.now()
          }
          await localforage.setItem('record-cache', recordCache)
          return blob
        }

        const recordBlob = recordCache?.[url]?.blob
        if (recordBlob) {
          const nowDate = Date.now()
          if (nowDate - recordCache[url].savedTime < 1000 * 60 * 60 * 24) {
            return recordBlob
          } else {
            delete recordCache[url]
            await localforage.setItem('record-cache', recordCache)
            return await fetchBlob()
          }
        } else return await fetchBlob()
      },
      clear: async (all: boolean = false) => {
        let recordCache = await localforage.getItem<{
          [url: string]: {
            blob: Blob
            savedTime: number
          }
        }>('record-cache')

        if (!recordCache) {
          recordCache = {}
          await localforage.setItem('record-cache', recordCache)
        }

        if (all) {
          await localforage.removeItem('record-cache')
        } else {
          for (const url in recordCache) {
            if (Date.now() - recordCache[url].savedTime > 1000 * 60 * 60 * 24) {
              delete recordCache[url]
            }
          }
          await localforage.setItem('record-cache', recordCache)
        }
      }
    }
  },

  getInfo: {
    self: async () => {
      return (await Connector.fetch('get_login_info', 'getUserInfo')) as MsgBody<UserInfo>
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
      return (await Connector.fetch('get_msg', 'getMsg', {
        message_id: messageId
      })) as MsgBody<PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>>
    },
    friend: async (userId: number, count?: number, startMsgId?: number) => {
      return (await Connector.fetch('get_friend_msg_history', 'getFriendMsgHistory', {
        user_id: userId,
        count,
        message_seq: startMsgId
      })) as MsgBody<{
        messages: PrivateMessage<AnyMessage>[]
      }>
    },
    group: async (groupId: number, count?: number, startMsgId?: number) => {
      return (await Connector.fetch('get_group_msg_history', 'getGroupMsgHistory', {
        group_id: groupId,
        count,
        message_seq: startMsgId
      })) as MsgBody<{
        messages: GroupMessage<AnyMessage>[]
      }>
    },
    forward: async (forwardId: string) => {
      return (await Connector.fetch('get_forward_msg', 'getForwardMsg', {
        message_id: forwardId
      })) as MsgBody<ForwardMessageContent>
    },
    downloadFile: async (fileId: string) => {
      return (await Connector.fetch('get_file', 'getFile', {
        file: fileId,
        file_id: fileId
      })) as MsgBody<FileInfo>
    },
    parseRecord: async (fileId: string, format: 'wav' | 'mp3' | 'amr' = 'mp3') => {
      return (await Connector.fetch('get_record', 'getRecord', {
        file: fileId,
        file_id: fileId,
        out_format: format
      })) as MsgBody<FileInfo>
    }
  }
  /*
  getRecentContacts: async (count: number = 10) => {
    return (await Connector.fetch('get_recent_contacts', 'getRecentContacts', {
      count
    })) as MsgBody<>
  }
  */
}

export const packagedSender = {
  msg: {
    send: async (sender: SendingMessage) => {
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
