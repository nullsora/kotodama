import { computed, ref, Ref } from 'vue'
import { AnyMessage, GroupMessage, PrivateMessage } from './message/message_types'
import { packagedGetter } from './packaged_api'
import { Chat, Friend, Group, UserSetting } from './types'
import localforage from 'localforage'

export class DataManager {
  private static instance: DataManager
  // @ts-ignore allow window
  private static onebot = window.kotodama.onebot

  private static sortChats(chats: Chat[]) {
    return chats.sort((a, b) => (b?.latestMsg?.time ?? 0) - (a?.latestMsg?.time ?? 0))
  }

  private working = ref(false)
  private userConfigs: Ref<UserSetting[]>
  private userIndex = ref<number | null>(null)

  private _connected = computed(() => this.working.value && this.userIndex.value !== null)
  private _user = computed(() => this.userConfigs.value[this.userIndex.value as number])
  private _userInfo = computed(() => this.userConfigs.value[this.userIndex.value as number].info)

  shownChatInfo = ref<{
    type: 'friend' | 'group'
    id: number
  } | null>(null)
  renderingMsgs = ref<PrivateMessage<AnyMessage>[] | GroupMessage<AnyMessage>[]>([])

  constructor(userConfigs: Ref<UserSetting[]>) {
    this.userConfigs = userConfigs
    DataManager.instance = this
  }

  static getInstance(): DataManager {
    if (!this.instance) {
      throw new Error('DataManager has not been initialized')
    }
    return this.instance
  }

  private checkWorking() {
    if (!this.working.value || this.userIndex.value === null) {
      throw new Error('Not Connected')
    }
  }

  get connected() {
    return this._connected
  }
  get user() {
    this.checkWorking()
    return this._user
  }
  get userInfo() {
    this.checkWorking()
    return this._userInfo
  }

  //========== 用户数据操作  ==========
  private pushChat(chat: Chat) {
    this.userConfigs.value[this.userIndex.value as number].contacts.showing.push(chat)
    DataManager.sortChats(this.userConfigs.value[this.userIndex.value as number].contacts.showing)
  }

  async pushFriend(friendId: number) {
    if (
      this.userConfigs.value[this.userIndex.value as number].contacts.showing.find(
        (chat) => chat.type === 'private' && (chat.data as Friend).user_id === friendId
      )
    ) {
      return
    }
    const friend = this.userConfigs.value[this.userIndex.value as number].contacts.friends.find(
      (friend) => friend.user_id === friendId
    )
    if (!friend) {
      throw new Error('Friend not found')
    }
    const latestMsg = (await packagedGetter.getFriendMsgHistory(friendId, 1)).data.messages[0]
    this.pushChat({
      type: 'private',
      data: friend,
      latestMsg
    })
  }

  async pushGroup(groupId: number) {
    if (
      this.userConfigs.value[this.userIndex.value as number].contacts.showing.find(
        (chat) => chat.type === 'group' && (chat.data as Group).group_id === groupId
      )
    ) {
      return
    }
    const group = this.userConfigs.value[this.userIndex.value as number].contacts.groups.find(
      (group) => group.group_id === groupId
    )
    if (!group) {
      throw new Error('Group not found')
    }
    const latestMsg = (await packagedGetter.getGroupMsgHistory(groupId, 1)).data.messages[0]
    this.pushChat({
      type: 'group',
      data: group,
      latestMsg
    })
  }

  //========== 前后端连接操作 ==========
  watchConnect(
    closeCallback?: ({
      code,
      message,
      address,
      token
    }: {
      code: number
      message: string
      address: string
      token: string
    }) => void
  ) {
    DataManager.onebot.onOpen(async (_event, connection) => {
      this.working.value = true

      const { user_id: userId } = (await packagedGetter.getUserInfo()).data
      this.userIndex.value = this.userConfigs.value.findIndex(
        (user) => user.info.main.user_id === userId
      )

      if (this.userIndex.value === -1) {
        const friendList = (await packagedGetter.getFriendList()).data
        const friendsCategoryList = (await packagedGetter.getFriendsWithCategory()).data
        const groupList = (await packagedGetter.getGroupList()).data

        this.userIndex.value =
          this.userConfigs.value.push({
            connection: connection,
            info: {
              main: (await packagedGetter.getUserInfo()).data,
              more: friendList.find((friend) => friend.user_id === userId)
            },
            contacts: {
              friends: friendList,
              friendsCategories: friendsCategoryList,
              groups: groupList,

              showing: []
            },
            contactGroups: []
          }) - 1
      } else {
        await this.updateInfo()
        this.userConfigs.value[this.userIndex.value as number].connection = connection
      }

      for (const chat of this.userConfigs.value[this.userIndex.value as number].contacts.showing) {
        await this.updateLatestMessage(chat)
      }

      DataManager.sortChats(this.userConfigs.value[this.userIndex.value as number].contacts.showing)
    })

    DataManager.onebot.onClose((_event, closeMsg) => {
      this.working.value = false
      if (closeCallback) closeCallback(closeMsg)
    })
  }

  async updateInfo() {
    this.checkWorking()

    const userInfo = (await packagedGetter.getUserInfo()).data
    const friendList = (await packagedGetter.getFriendList()).data
    const friendsCategory = (await packagedGetter.getFriendsWithCategory()).data
    const groupList = (await packagedGetter.getGroupList()).data

    this.userConfigs.value[this.userIndex.value as number].info.main = userInfo
    this.userConfigs.value[this.userIndex.value as number].info.more = friendList.find(
      (friend) => friend.user_id === userInfo.user_id
    )

    this.userConfigs.value[this.userIndex.value as number].contacts.friends = friendList
    this.userConfigs.value[this.userIndex.value as number].contacts.friendsCategories =
      friendsCategory
    this.userConfigs.value[this.userIndex.value as number].contacts.groups = groupList
  }

  async pushNewMessage(message: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>) {
    this.checkWorking()

    const index = this.userIndex.value as number

    let chatType: 'private' | 'group', chatId: number

    if (message.message_type === 'private') {
      chatType = 'private'
      chatId = message.user_id

      const sender = this.userConfigs.value[index].contacts.friends.find(
        (friend) => friend.user_id === chatId
      )
      const showingChatIndex = this.userConfigs.value[index].contacts.showing.findIndex(
        (chat) => chat.type === chatType && (chat.data as Friend).user_id === chatId
      )

      if (showingChatIndex === -1 && sender) {
        this.userConfigs.value[index].contacts.showing.push({
          type: chatType,
          data: sender,
          latestMsg: message
        })
      } else {
        this.userConfigs.value[index].contacts.showing[showingChatIndex].latestMsg = message
      }

      if (this.shownChatInfo.value?.type === 'friend' && this.shownChatInfo.value.id === chatId) {
        ;(this.renderingMsgs.value as PrivateMessage<AnyMessage>[]).push(message)
      }
    } else {
      chatType = 'group'
      chatId = message.group_id

      const sender = this.userConfigs.value[index].contacts.groups.find(
        (group) => group.group_id === chatId
      )
      const showingChatIndex = this.userConfigs.value[index].contacts.showing.findIndex(
        (chat) => chat.type === chatType && (chat.data as Group).group_id === chatId
      )

      if (showingChatIndex === -1 && sender) {
        this.userConfigs.value[index].contacts.showing.push({
          type: chatType,
          data: sender,
          latestMsg: message
        })
      } else {
        this.userConfigs.value[index].contacts.showing[showingChatIndex].latestMsg = message
      }

      if (this.shownChatInfo.value?.type === 'group' && this.shownChatInfo.value.id === chatId) {
        ;(this.renderingMsgs.value as GroupMessage<AnyMessage>[]).push(message)
      }
    }

    DataManager.sortChats(this.userConfigs.value[index].contacts.showing)
  }

  async updateLatestMessage(chat: Chat) {
    this.checkWorking()

    let latestMsg: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage> | undefined

    let msgCount = 1
    while (!latestMsg?.time && msgCount < 10) {
      if (chat.type === 'private') {
        latestMsg = (
          await packagedGetter.getFriendMsgHistory((chat.data as Friend).user_id, msgCount)
        ).data.messages[0]
      } else {
        latestMsg = (
          await packagedGetter.getGroupMsgHistory((chat.data as Group).group_id, msgCount)
        ).data.messages[0]
      }
      msgCount++
    }
    chat.latestMsg = latestMsg
    return latestMsg
  }
}
