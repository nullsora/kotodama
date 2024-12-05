<script setup lang="ts">
import { checkImgFace } from '@renderer/functions/message/check_img_face'
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'
import MsgImage from './basic/MsgImage.vue'

const { msg } = defineProps<{
  msg: MessageTypes['Image'] | MessageTypes['MFace']
}>()

const isFace = computed(() => checkImgFace(msg))

const imageClass = computed(() => (isFace.value ? 'max-w-30 max-h-30' : 'max-w-80 max-h-80'))
</script>

<template>
  <MsgImage
    :class="imageClass"
    :src="msg.data.url"
    :show-menu="!isFace"
    :preview="!isFace"
    :skeleton-size="isFace ? 30 : 80"
  />
</template>
