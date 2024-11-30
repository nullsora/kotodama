<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'
import MsgImage from './basic/MsgImage.vue'

const { msg } = defineProps<{
  msg: MessageTypes['Image'] | MessageTypes['MFace']
}>()

const imageUrl = computed(
  () => msg.data.url //.replace('https://multimedia.nt.qq.com.cn', '/api/qq_image')
)

const isFace = computed(() => {
  if (msg.type === 'mface') return true

  if (msg.data.file === 'marketface') return true
  else if (msg.data.sub_type) return true
  else if (msg.data.subType) return true
  else return false
})

const imageClass = computed(() => (isFace.value ? 'max-w-30 max-h-30' : 'max-w-80 max-h-80'))
</script>

<template>
  <Suspense>
    <MsgImage :class="imageClass" :src="imageUrl" :show-menu="!isFace" :preview="!isFace" />
  </Suspense>
</template>
