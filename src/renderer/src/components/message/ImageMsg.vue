<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'
import MsgImage from './basic/MsgImage.vue'
import { checkImgFace } from '@renderer/functions/message/check_img_face'

const { msg } = defineProps<{
  msg: MessageTypes['Image'] | MessageTypes['MFace']
}>()

const imageUrl = computed(
  () => msg.data.url //.replace('https://multimedia.nt.qq.com.cn', '/api/qq_image')
)

const isFace = computed(() => checkImgFace(msg))

const imageClass = computed(() => (isFace.value ? 'max-w-30 max-h-30' : 'max-w-80 max-h-80'))
</script>

<template>
  <Suspense>
    <MsgImage :class="imageClass" :src="imageUrl" :show-menu="!isFace" :preview="!isFace" />
  </Suspense>
</template>
