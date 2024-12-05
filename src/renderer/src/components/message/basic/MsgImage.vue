<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
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
const menu = useTemplateRef('menu')

const showPreview = ref(false)
const loaded = ref(false)

const menuItems = ref([
  {
    label: '复制图片',
    icon: 'i-fluent-copy-24-regular w-4 h-4',
    command: async () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.src = imageUrl.value
        img.onload = () => {
          canvas.width = img.width
          canvas.height = img.height
          ctx?.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (!blob) return
            navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ])
          })
        }
      } catch (error) {
        console.error(error)
      }
    }
  }
])

const imageUrl = computed(() => {
  try {
    const url = new URL(src)

    if (url.protocol === 'file:') return 'k-file://static?path=' + url.toString().slice(8)

    const parsed = 'k-web-img:' + src.slice(url.protocol.length)
    return parsed
  } catch (e) {
    return ''
  }
})

const onImgRightClick = (e: MouseEvent) => {
  if (showMenu) menu.value!.show(e)
}
</script>

<template>
  <div>
    <img
      v-show="loaded"
      v-bind="$attrs"
      :src="imageUrl"
      :class="{ pointer: preview, 'rd-2': rounded }"
      aria-haspopup="true"
      @load="loaded = true"
      @contextmenu="onImgRightClick"
      @click="showPreview = preview"
    />
    <Skeleton
      v-if="!loaded"
      v-bind="$attrs"
      :width="skeletonSize / 4 + 'rem'"
      :height="skeletonSize / 4 + 'rem'"
    />
    <ContextMenu v-if="showMenu" ref="menu" :model="menuItems" />
    <ImgPreview v-if="preview" v-model="showPreview" :images="[imageUrl]" />
  </div>
</template>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>
