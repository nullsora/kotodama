<script setup lang="ts">
import MsgImage from '@renderer/components/message/basic/MsgImage.vue'
import { getAvatarUrlFromId } from '@renderer/functions/get_avatar_url'
import { GroupAnnouce } from '@renderer/functions/message/message_types'
import { getUserNameById } from '@renderer/functions/message/parse_msg'
import { packagedGetter } from '@renderer/functions/packaged_api'
import { onMounted, ref, watch } from 'vue'

const { groupId } = defineProps<{ groupId: number }>()
const show = defineModel<boolean>({ required: true })

const annouces = ref<(GroupAnnouce & { sender_name: string })[] | null>(null)

const getAnnouces = async () => {
  annouces.value = null
  const res = (await packagedGetter.group.getAnnouce(groupId)).data
  annouces.value = await Promise.all(
    res.map(async (msg) => ({
      ...msg,
      sender_name: await getUserNameById(msg.sender_id, groupId)
    }))
  )
}

const parseTime = (time: number) => {
  const date = new Date(time * 1000)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`
}

const getImgUrl = (id: string) => {
  return `https://gdynamic.qpic.cn/gdynamic/${id}/0`
}

onMounted(getAnnouces)
watch(() => groupId, getAnnouces)
</script>

<template>
  <Dialog v-model:visible="show" class="w-3/5 h-4/5" header="群公告" modal>
    <div class="h-full p-2 scrollbar scrollbar-w-1 scrollbar-rounded">
      <div v-for="(msg, index) in annouces" :key="index" class="glassmorphism mb-2 p-sm">
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-sm">
              <img
                :src="getAvatarUrlFromId(msg.sender_id, 'friend')"
                class="w-9 h-9 rd-full select-none drag-none"
              />
              <div class="dark-gray-text">{{ msg.sender_name }}</div>
            </div>
            <div class="text-sm gray-text">{{ parseTime(msg.publish_time) }}</div>
          </div>
          <div class="divider" />
          <div class="text-sm whitespace-pre-wrap">{{ msg.message.text }}</div>
          <div v-if="msg.message.images" class="flex items-center">
            <MsgImage
              v-for="(img, i) in msg.message.images"
              :key="i"
              class="max-w-30 max-h-30"
              :src="getImgUrl(img.id)"
              :show-menu="false"
              :preview="true"
              :drag="false"
            />
          </div>
        </div>
      </div>
    </div>
  </Dialog>
</template>
