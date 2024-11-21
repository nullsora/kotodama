<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { packagedGetter } from '@renderer/functions/packaged_api'
import ImgPreview from '@renderer/components/misc/ImgPreview.vue'

const {
  src,
  showMenu = true,
  preview = false
} = defineProps<{
  src: string
  showMenu?: boolean
  preview?: boolean
}>()

const res = ref('')
const menu = ref()
const showPreview = ref(false)

const blob = ref<Blob>()

const menuItems = ref([
  {
    label: '复制图片',
    icon: 'i-fluent-copy-24-regular',
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
  if (showMenu) menu.value.show(e)
}

const getImg = async () => {
  // if (
  //   src.startsWith('https://multimedia.nt.qq.com.cn') ||
  //   src.startsWith('https://gchat.qpic.cn') ||
  //   src.startsWith('https://gxh.vip.qq.com')
  // ) {
  //   return src
  // }
  blob.value = await packagedGetter.getImgBlob(src)
  return URL.createObjectURL(blob.value)
}

onMounted(async () => {
  res.value = await getImg()
})
watch(
  () => src,
  async () => {
    URL.revokeObjectURL(res.value)
    res.value = ''
    res.value = await getImg()
  }
)
</script>

<template>
  <div class="w-full">
    <img
      v-if="res !== ''"
      v-bind="$attrs"
      :src="res"
      class="rd-2"
      aria-haspopup="true"
      @contextmenu="onImgRightClick"
      @dblclick="showPreview = preview"
    />
    <Skeleton v-else v-bind="$attrs" size="15rem" />
    <ContextMenu v-if="showMenu" ref="menu" :model="menuItems" />
    <ImgPreview v-if="preview" v-model="showPreview" :src="res" />
  </div>
</template>
