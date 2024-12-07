import { computed, ref, Ref } from 'vue'
import { AnyMessage, GroupMessage, PrivateMessage } from './message/message_types'
import { packagedGetter } from './packaged_api'
import { Chat, UserSetting } from './types'

export class DataManager {
  // @ts-ignore - window is defined in preload
  private static onebot = window.kotodama.onebot
  // @ts-ignore - window is defined in preload
  private static fileMgr = window.kotodama.file

  private static instance: DataManager

  private static sortChats(chats: Chat[]) {
    return chats.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1

      return (b?.latestMsg?.time ?? 0) - (a?.latestMsg?.time ?? 0)
    })
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
  find = {
    friend: (id: number) =>
      this.user.value.contacts.friends.find((friend) => friend.user_id === id),
    group: (id: number) => this.user.value.contacts.groups.find((group) => group.group_id === id),
    showing: (id: number, type: 'friend' | 'group') => {
      return this.user.value.contacts.showing.find((chat) => {
        if (type === 'friend') {
          return chat.type === 'friend' && chat.data.user_id === id
        } else {
          return chat.type === 'group' && chat.data.group_id === id
        }
      })
    }
  }
  findIndex = {
    showing: (id: number, type: 'friend' | 'group') => {
      return this.user.value.contacts.showing.findIndex((chat) => {
        if (type === 'friend') {
          return chat.type === 'friend' && chat.data.user_id === id
        } else {
          return chat.type === 'group' && chat.data.group_id === id
        }
      })
    }
  }

  addToList = {
    chat: (chat: Chat) => {
      this.curContacts.showing.push(chat)
      DataManager.sortChats(this.curContacts.showing)
    },

    private: async (friendId: number) => {
      if (this.find.showing(friendId, 'friend')) return

      const friend = this.find.friend(friendId)
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
      if (this.find.showing(groupId, 'group')) return

      const group = this.find.group(groupId)
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

  //========== 前后端连接操作 ==========
  watchConnect(
    connectCallback?: () => void,
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

      if (connectCallback) connectCallback()

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
              more: friendList.find((friend) => friend.user_id === userId),
              faces: (await packagedGetter.getInfo.customFace()).data
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
        await this.updateInfo.all()
        this.userConfigs.value[this.userIndex.value!].connection = connection
      }

      await Promise.all(
        this.userConfigs.value[this.userIndex.value!].contacts.showing.map((chat) =>
          this.updateLatestMessage(chat)
        )
      )

      DataManager.sortChats(this.userConfigs.value[this.userIndex.value!].contacts.showing)
    })

    DataManager.onebot.onClose((_event, closeMsg) => {
      this.working.value = false
      if (closeCallback) closeCallback(closeMsg)
    })
  }

  updateInfo = {
    self: async () => {
      this.checkWorking()
      const [userInfo, friendList] = await Promise.all([
        packagedGetter.getInfo.self().then((res) => res.data),
        this.updateInfo.friend()
      ])
      this.userConfigs.value[this.userIndex.value!].info.main = userInfo
      this.userConfigs.value[this.userIndex.value!].info.more = friendList.find(
        (friend) => friend.user_id === userInfo.user_id
      )
    },

    face: async () => {
      this.checkWorking()
      const customFaces = await packagedGetter.getInfo.customFace().then((res) => res.data)
      this.userConfigs.value[this.userIndex.value!].info.faces = customFaces
    },

    friend: async () => {
      this.checkWorking()
      const friendList = await packagedGetter.getList.friend().then((res) => res.data)
      this.userConfigs.value[this.userIndex.value!].contacts.friends = friendList
      return friendList
    },

    friendCategory: async () => {
      this.checkWorking()
      const friendsCategory = await packagedGetter.getList
        .friendWithCategory()
        .then((res) => res.data)
      this.userConfigs.value[this.userIndex.value!].contacts.friendsCategories = friendsCategory
    },

    group: async () => {
      this.checkWorking()
      const groupList = await packagedGetter.getList.group().then((res) => res.data)
      this.userConfigs.value[this.userIndex.value!].contacts.groups = groupList
    },

    all: async () => {
      this.checkWorking()
      await Promise.all([
        this.updateInfo.self(),
        this.updateInfo.face(),
        this.updateInfo.friendCategory(),
        this.updateInfo.group()
      ])
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

  async sortShowingChats() {
    this.checkWorking()
    DataManager.sortChats(this.curContacts.showing)
  }

  async pushNewMessage(message: PrivateMessage<AnyMessage> | GroupMessage<AnyMessage>) {
    this.checkWorking()

    const chatId = message.message_type === 'private' ? message.sender.user_id : message.group_id

    if (message.message_type === 'private') {
      const showingChatIndex = this.findIndex.showing(chatId, 'friend')

      if (showingChatIndex !== -1) {
        this.curContacts.showing[showingChatIndex].latestMsg = message
      } else {
        const sender = this.find.friend(chatId)
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
      const showingChatIndex = this.findIndex.showing(chatId, 'group')

      if (showingChatIndex !== -1) {
        this.curContacts.showing[showingChatIndex].latestMsg = message
      } else {
        const group = this.find.group(chatId)
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
