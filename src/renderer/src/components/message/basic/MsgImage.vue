<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue'
import { DataManager } from '@renderer/functions/data_manager'

const runtimeData = inject('runtimeData') as DataManager

const props = withDefaults(
  defineProps<{
    src: string
    showMenu?: boolean
  }>(),
  {
    showMenu: true
  }
)

const res = ref('')
const menu = ref()

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
  if (props.showMenu) menu.value.show(e)
}

const getImg = async () => {
  // if (
  //   props.src.startsWith('https://multimedia.nt.qq.com.cn') ||
  //   props.src.startsWith('https://gchat.qpic.cn') ||
  //   props.src.startsWith('https://gxh.vip.qq.com')
  // ) {
  //   return props.src
  // }
  blob.value = await runtimeData.getImgBlob(props.src)
  return URL.createObjectURL(blob.value)
}

onMounted(async () => {
  res.value = await getImg()
})
watch(props, async () => {
  URL.revokeObjectURL(res.value)
  res.value = ''
  res.value = await getImg()
})
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
    />
    <Skeleton v-else v-bind="$attrs" size="15rem" />
    <ContextMenu v-if="showMenu" ref="menu" :model="menuItems" />
  </div>
</template>
