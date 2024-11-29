<script setup lang="ts">
import { onMounted, ref, useTemplateRef, watch } from 'vue'
import { packagedGetter } from '@renderer/functions/packaged_api'
import ImgPreview from '@renderer/components/misc/ImgPreview.vue'

const {
  src,
  showMenu = true,
  preview = false,
  rounded = true,
  skeletonSize = 60
} = defineProps<{
  src: string
  showMenu?: boolean
  preview?: boolean
  rounded?: boolean
  skeletonSize?: number
}>()

const blobUrl = defineModel<string>('blobUrl', { default: '' })
const menu = useTemplateRef('menu')
const showPreview = ref(false)

const blob = ref<Blob>()

const menuItems = ref([
  {
    label: '复制图片',
    icon: 'i-fluent-copy-24-regular w-4 h-4',
    command: async () => {
      try {
        if (!blob.value) return
        const item = new ClipboardItem({ 'image/png': blob.value })
        await navigator.clipboard.write([item])
      } catch (err) {
        console.error('Failed to copy image: ', err)
      }
    }
  }
])

const onImgRightClick = (e: MouseEvent) => {
  if (showMenu) menu.value!.show(e)
}

const getImg = async () => {
  // if (
  //   src.startsWith('https://multimedia.nt.qq.com.cn') ||
  //   src.startsWith('https://gchat.qpic.cn') ||
  //   src.startsWith('https://gxh.vip.qq.com')
  // ) {
  //   return src
  // }
  blob.value = await packagedGetter.cachedFile.imgBlob.get(src)
  return URL.createObjectURL(blob.value)
}

onMounted(async () => {
  blobUrl.value = await getImg()
})
watch(
  () => src,
  async () => {
    URL.revokeObjectURL(blobUrl.value)
    blobUrl.value = ''
    blobUrl.value = await getImg()
  }
)
</script>

<template>
  <div>
    <img
      v-if="blobUrl !== ''"
      v-bind="$attrs"
      :src="blobUrl"
      :class="{ pointer: preview, 'rd-2': rounded }"
      aria-haspopup="true"
      @contextmenu="onImgRightClick"
      @click="showPreview = preview"
    />
    <Skeleton v-else v-bind="$attrs" :size="`${skeletonSize / 4}rem`" />
    <ContextMenu v-if="showMenu" ref="menu" :model="menuItems" />
    <ImgPreview v-if="preview" v-model="showPreview" :images="[blobUrl]" />
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
