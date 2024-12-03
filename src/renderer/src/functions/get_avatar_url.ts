import { Chat } from './types'

export const getAvatarUrlFromId = (id: number | string, type: 'friend' | 'group') => {
  if (type === 'group') return `k-avatar://p.qlogo.cn/gh/${id}/${id}/640`
  else return `k-avatar://q1.qlogo.cn/g?b=qq&s=0&nk=${id}`
}

export const getAvatarUrl = (chat: Chat) => {
  if (chat.type === 'friend') return getAvatarUrlFromId(chat.data.user_id, 'friend')
  else return getAvatarUrlFromId(chat.data.group_id, 'group')
}
