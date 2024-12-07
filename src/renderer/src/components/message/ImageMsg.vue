<script setup lang="ts">
import { checkImgFace } from '@renderer/functions/message/check_img_face'
import { FileInfo, MessageTypes } from '@renderer/functions/message/message_types'
import { computed, ref } from 'vue'
import MsgImage from './basic/MsgImage.vue'
import { packagedGetter } from '@renderer/functions/packaged_api'

const { msg, small = false } = defineProps<{
  msg: MessageTypes['Image'] | MessageTypes['MFace']
  small?: boolean
}>()

const imageInfo = ref<FileInfo | null>(null)

const isFace = computed(() => checkImgFace(msg))

const src = computed(() => {
  if (!imageInfo.value) return msg.data.url
  return imageInfo.value.file
})

const imageClass = computed(() => {
  if (!small) return isFace.value ? 'max-w-30 max-h-30' : 'max-w-80 max-h-80'
  else return isFace.value ? 'max-w-20 max-h-20' : 'max-w-50 max-h-50'
})

const size = computed(() => {
  if (!small) return isFace.value ? 30 : 80
  else return isFace.value ? 20 : 50
})

const getImgInfo = async () => {
  if (isFace.value) return
  imageInfo.value = (
    await packagedGetter.getMsg.imgPath((msg as MessageTypes['Image']).data.file)
  ).data
}
</script>

<template>
  <MsgImage
    :class="imageClass"
    :src="src"
    :show-menu="!isFace"
    :preview="!isFace"
    :skeleton-size="size"
    @click="getImgInfo"
  />
</template>
