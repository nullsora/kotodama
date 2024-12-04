<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { MessageTypes } from '@renderer/functions/message/message_types'
import { packagedGetter } from '@renderer/functions/packaged_api'

const { msg, sendGroupId } = defineProps<{
  msg: MessageTypes['At']
  sendGroupId?: number
}>()

const name = ref('')

const getTargetName = async () => {
  if (msg.data.qq === 'all') return '全体成员'
  const qq = parseInt(msg.data.qq)
  if (sendGroupId) {
    const info = (await packagedGetter.getInfo.groupMember(sendGroupId, qq)).data
    if (info) return info.card === '' ? info.nickname : info.card
    else return (await packagedGetter.getInfo.stranger(qq)).data.nickname
  }
  return (await packagedGetter.getInfo.stranger(qq)).data.nickname
}

const updateName = async () => (name.value = await getTargetName())

onMounted(updateName)
watch(() => msg.data.qq, updateName)
</script>

<template>
  <Tag rounded>
    <span class="text-xs">@{{ name }}</span>
  </Tag>
</template>
