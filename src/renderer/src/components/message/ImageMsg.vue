<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'
import MsgImage from './basic/MsgImage.vue'

const props = defineProps<{
  msg: MessageTypes['Image']
}>()

const imageUrl = computed(
  () => props.msg.data.url //.replace('https://multimedia.nt.qq.com.cn', '/api/qq_image')
)
const imageClass = computed(() => {
  if (props.msg.data.file === 'marketface' || props.msg.data.sub_type === 1) {
    return 'max-w-30 max-h-30'
  } else return 'max-w-80 max-h-80'
})
</script>

<template>
  <Suspense>
    <MsgImage :class="imageClass" :src="imageUrl" />
  </Suspense>
</template>
