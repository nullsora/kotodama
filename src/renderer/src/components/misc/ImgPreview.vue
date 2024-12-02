<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watchEffect } from 'vue'
import FadeTransition from './FadeTransition.vue'

const { images, index = 0 } = defineProps<{
  images: string[]
  index?: number
}>()

const showPreview = defineModel<boolean>({ required: true })

const showCaution = ref(false)
const cautionMsg = ref('')

const curIndex = ref(index)
const scale = ref(1)
const isDragging = ref(false)
const dragStart = ref({ x: 0, y: 0 })
const translate = ref({ x: 0, y: 0 })

const imgStyle = computed(() => ({
  transform: `scale(${scale.value}) translate(${translate.value.x}px, ${translate.value.y}px)`
}))

const showCautionMsg = (head: boolean) => {
  showCaution.value = true
  cautionMsg.value = head ? '已经是第一张了' : '已经是最后一张了'
  setTimeout(() => {
    showCaution.value = false
  }, 1000)
}

const switchImg = (delta: number) => {
  const newIndex = curIndex.value + delta
  if (newIndex < 0) {
    showCautionMsg(true)
  } else if (newIndex >= images.length) {
    showCautionMsg(false)
  } else {
    curIndex.value = newIndex
  }
}

const onWheel = (event: WheelEvent) => {
  // 若正常滚动，则切换图片
  if (event.ctrlKey) {
    event.preventDefault()
    const delta = event.deltaY > 0 ? -0.1 : 0.1
    scale.value = Math.min(Math.max(scale.value + delta, 0.1), 5)
  } else {
    switchImg(event.deltaY > 0 ? 1 : -1)
  }
}

const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  dragStart.value.x = event.clientX - translate.value.x * scale.value
  dragStart.value.y = event.clientY - translate.value.y * scale.value
}

const doDrag = (event: MouseEvent) => {
  if (!isDragging.value) return
  translate.value.x = (event.clientX - dragStart.value.x) / scale.value
  translate.value.y = (event.clientY - dragStart.value.y) / scale.value
}

const stopDrag = () => {
  isDragging.value = false
}

const resetImg = () => {
  curIndex.value = index
  scale.value = 1
  translate.value = { x: 0, y: 0 }
}

const close = () => {
  showPreview.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', doDrag)
  window.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', doDrag)
  window.removeEventListener('mouseup', stopDrag)
})

watchEffect(() => {
  if (showPreview.value) {
    resetImg()
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="showPreview" class="modal" @click.self="close" @wheel.prevent="onWheel">
      <img
        ref="image"
        draggable="false"
        class="image select-none"
        :src="images[curIndex]"
        :style="imgStyle"
        @mousedown="startDrag"
      />
      <div class="flex items-center justify-center glassmorphism p-2 gap-sm toolbar">
        <Button
          v-if="images.length > 1"
          icon="i-fluent-chevron-left-24-regular w-6 h-6"
          severity="secondary"
          rounded
          text
          @click="switchImg(-1)"
        />
        <Button
          icon="i-fluent-zoom-in-24-regular w-6 h-6"
          severity="secondary"
          rounded
          text
          @click="scale = Math.min(scale + 0.1, 5)"
        />
        <Tag
          class="select-none"
          :value="Math.floor(scale * 100) + '%'"
          severity="secondary"
          rounded
        />
        <Button
          icon="i-fluent-zoom-out-24-regular w-6 h-6"
          severity="secondary"
          rounded
          text
          @click="scale = Math.max(scale - 0.1, 0.1)"
        />
        <Button
          v-tooltip.top="'重置'"
          icon="i-fluent-resize-image-24-regular w-6 h-6"
          severity="secondary"
          rounded
          text
          @click="resetImg"
        />
        <Button
          icon="i-fluent-dismiss-24-regular w-6 h-6"
          severity="danger"
          rounded
          text
          @click="close"
        />
        <Button
          v-if="images.length > 1"
          icon="i-fluent-chevron-right-24-regular w-6 h-6"
          severity="secondary"
          rounded
          text
          @click="switchImg(1)"
        />
      </div>
      <FadeTransition>
        <Tag v-if="showCaution" class="caution text-xl" severity="secondary" :value="cautionMsg" />
      </FadeTransition>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.image {
  position: absolute;
  margin: auto;
  cursor: grab;
  max-width: 80%;
  max-height: 80%;
}

.toolbar {
  position: absolute;
  bottom: 0.875rem;
}

.caution {
  position: absolute;
}
</style>
