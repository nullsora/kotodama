import { computed, ref, Ref } from 'vue'
import { AnyMessage, GroupMessage, PrivateMessage } from './message/message_types'
import { packagedGetter } from './packaged_api'
import { Chat, UserSetting } from './types'

export class DataManager {
  // @ts-ignore allow window
  private static onebot = window.kotodama.onebot

  private static instance: DataManager

  private static sortChats(chats: Chat[]) {
    return chats.sort((a, b) => (b?.latestMsg?.time ?? 0) - (a?.latestMsg?.time ?? 0))
  }

  static getInstance(): DataManager {
    if (!this.instance) {
      throw new Error('DataManager has not been initialized')
    }
    return this.instance
  }

  private working = ref(false)
  private userConfigs: Ref<UserSetting[]>
  private userIndex = ref<number | null>(null)

  showingChat = ref<{
    type: 'friend' | 'group'
    id: number
  } | null>(null)

  renderingMsgs = ref<PrivateMessage<AnyMessage>[] | GroupMessage<AnyMessage>[]>([])

  constructor(userConfigs: Ref<UserSetting[]>) {
    this.userConfigs = userConfigs
    DataManager.instance = this
  }

  private checkWorking() {
    if (!this.working.value || this.userIndex.value === null) {
      throw new Error('Not Connected')
    }
  }

  //========== getters  ==========
  get curContacts() {
    this.checkWorking()
    return this.userConfigs.value[this.userIndex.value!].contacts
  }

  readonly connected = computed(() => this.working.value && this.userIndex.value !== null)
  readonly user = computed(() => {
    this.checkWorking()
    return this.userConfigs.value[this.userIndex.value!]
  })
  readonly userInfo = computed(() => {
    this.checkWorking()
    return this.userConfigs.value[this.userIndex.value!].info
  })

  //========== 用户数据操作  ==========
  addToList = {
    chat: (chat: Chat) => {
      this.curContacts.showing.push(chat)
      DataManager.sortChats(this.curContacts.showing)
    },

    private: async (friendId: number) => {
      if (
        this.curContacts.showing.find(
          (chat) => chat.type === 'friend' && chat.data.user_id === friendId
        )
      )
        return

      const friend = this.curContacts.friends.find((friend) => friend.user_id === friendId)
      if (!friend) {
        throw new Error('Friend not found')
      }
      const latestMsg = (await packagedGetter.getMsg.friend(friendId, 1)).data.messages[0]
      this.addToList.chat({
        type: 'friend',
        data: friend,
        latestMsg
      })
    },

    group: async (groupId: number) => {
      if (
        this.curContacts.showing.find(
          (chat) => chat.type === 'group' && chat.data.group_id === groupId
        )
      )
        return

      const group = this.curContacts.groups.find((group) => group.group_id === groupId)
      if (!group) {
        throw new Error('Group not found')
      }
      const latestMsg = (await packagedGetter.getMsg.group(groupId, 1)).data.messages[0]
      this.addToList.chat({
        type: 'group',
        data: group,
        latestMsg
      })
    }
  }

  findChat = {
    friend: (id: number) =>
      this.user.value.contacts.friends.find((friend) => friend.user_id === id),
    group: (id: number) => this.user.value.contacts.groups.find((group) => group.group_id === id),
    inShowing: (id: number, type: 'friend' | 'group') => {
      return this.user.value.contacts.showing.find((chat) => {
        if (type === 'friend') {
          return chat.type === 'friend' && chat.data.user_id === id
        } else {
          return chat.type === 'group' && chat.data.group_id === id
        }
      })
    }
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

      const { user_id: userId } = (await packagedGetter.getInfo.self()).data
      this.userIndex.value = this.userConfigs.value.findIndex(
        (user) => user.info.main.user_id === userId
      )

      if (this.userIndex.value === -1) {
        const friendList = (await packagedGetter.getList.friend()).data
        const friendsCategoryList = (await packagedGetter.getList.friendWithCategory()).data
        const groupList = (await packagedGetter.getList.group()).data

        this.userIndex.value =
          this.userConfigs.value.push({
            connection: connection,
            info: {
              main: (await packagedGetter.getInfo.self()).data,
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

      await Promise.all(
        this.userConfigs.value[this.userIndex.value as number].contacts.showing.map((chat) =>
          this.updateLatestMessage(chat)
        )
      )

      DataManager.sortChats(this.userConfigs.value[this.userIndex.value as number].contacts.showing)
    })

    DataManager.onebot.onClose((_event, closeMsg) => {
      this.working.value = false
      if (closeCallback) closeCallback(closeMsg)
    })
  }

  async updateInfo({
    selfInfo = true,
    friend = true,
    friendsCategory: _friendsCategory = true,
    group = true
  } = {}) {
    this.checkWorking()

    const [userInfo, friendList, friendsCategory, groupList] = await Promise.all([
      packagedGetter.getInfo.self().then((res) => res.data),
      packagedGetter.getList.friend().then((res) => res.data),
      packagedGetter.getList.friendWithCategory().then((res) => res.data),
      packagedGetter.getList.group().then((res) => res.data)
    ])

    if (selfInfo) {
      this.userConfigs.value[this.userIndex.value as number].info.main = userInfo
      this.userConfigs.value[this.userIndex.value as number].info.more = friendList.find(
        (friend) => friend.user_id === userInfo.user_id
      )
    }

    if (friend) {
      this.userConfigs.value[this.userIndex.value as number].contacts.friends = friendList
    }

    if (_friendsCategory) {
      this.userConfigs.value[this.userIndex.value as number].contacts.friendsCategories =
        friendsCategory
    }

    if (group) {
      this.userConfigs.value[this.userIndex.value as number].contacts.groups = groupList
    }
  }

  async updateLatestMessage(chat: Chat) {
    this.checkWorking()

    let latestMsg: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage> | undefined

    let msgCount = 1
    while (!latestMsg?.time && msgCount < 10) {
      if (chat.type === 'friend') {
        latestMsg = (await packagedGetter.getMsg.friend(chat.data.user_id, msgCount)).data
          .messages[0]
      } else {
        latestMsg = (await packagedGetter.getMsg.group(chat.data.group_id, msgCount)).data
          .messages[0]
      }
      msgCount++
    }
    chat.latestMsg = latestMsg
    return latestMsg
  }

  async pushNewMessage(message: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>) {
    this.checkWorking()

    const chatId = message.message_type === 'private' ? message.sender.user_id : message.group_id

    if (message.message_type === 'private') {
      const showingChatIndex = this.curContacts.showing.findIndex((chat) => {
        return chat.type === 'friend' && chat.data.user_id === chatId
      })

      if (showingChatIndex !== -1) {
        this.curContacts.showing[showingChatIndex].latestMsg = message
      } else {
        const sender = this.curContacts.friends.find((friend) => friend.user_id === chatId)
        if (!sender) {
          throw new Error('Sender not found')
        }
        this.addToList.chat({
          type: 'friend',
          data: sender,
          latestMsg: message
        })
      }
    } else {
      const showingChatIndex = this.curContacts.showing.findIndex((chat) => {
        return chat.type === 'group' && chat.data.group_id === chatId
      })

      if (showingChatIndex !== -1) {
        this.curContacts.showing[showingChatIndex].latestMsg = message
      } else {
        const group = this.curContacts.groups.find((group) => group.group_id === chatId)
        if (!group) {
          throw new Error('Group not found')
        }
        this.addToList.chat({
          type: 'group',
          data: group,
          latestMsg: message
        })
      }
    }

    const curChatType = this.showingChat.value?.type === 'friend' ? 'private' : 'group'

    if (curChatType === message.message_type && chatId === this.showingChat.value?.id) {
      // @ts-ignore this will be right
      this.renderingMsgs.value.push(message)
    }

    DataManager.sortChats(this.curContacts.showing)
  }
}
