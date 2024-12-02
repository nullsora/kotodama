import { MessageTypes } from './message_types'

export const checkImgFace = (msg: MessageTypes['Image'] | MessageTypes['MFace']) => {
  if (msg.type === 'mface') return true

  if (msg.data.file === 'marketface') return true
  else if (msg.data.sub_type) return true
  else if (msg.data.subType) return true
  else return false
}
