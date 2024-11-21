<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'

const { src } = defineProps<{
  src: string
}>()

const showPreview = defineModel<boolean>({ required: true })

const scale = ref(1)

const image = useTemplateRef('image')

const onWheel = (event: WheelEvent) => {
  const delta = event.deltaY > 0 ? -0.1 : 0.1
  scale.value = Math.min(Math.max(scale.value + delta, 0.1), 10)
}

const close = () => {
  showPreview.value = false
}
</script>

<template>
  <Teleport to="body">
    <div v-if="showPreview" class="modal" @click.self="close" @wheel.prevent="onWheel">
      <img
        ref="image"
        class="image select-none"
        :src="src"
        :style="{
          transform: `scale(${scale})`
        }"
      />
      <div class="flex flex-row items-center justify-center glassmorphism p-2 gap-sm toolbar">
        <Button
          icon="i-fluent-zoom-in-24-regular w-6 h-6"
          severity="secondary"
          rounded
          text
          @click="scale = Math.min(scale + 0.1, 10)"
        />
        <Tag :value="Math.floor(scale * 100) + '%'" severity="secondary" rounded />
        <Button
          icon="i-fluent-zoom-out-24-regular w-6 h-6"
          severity="secondary"
          rounded
          text
          @click="scale = Math.max(scale - 0.1, 0.1)"
        />
        <Button
          v-tooltip.top="'缩放为100%'"
          icon="i-fluent-resize-image-24-regular w-6 h-6"
          severity="secondary"
          rounded
          text
          @click="scale = 1"
        />
        <Button
          icon="i-fluent-dismiss-24-regular w-6 h-6"
          severity="danger"
          rounded
          text
          @click="close"
        />
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal {
  position: fixed;
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
  cursor: grab;
  max-width: 80%;
  max-height: 80%;
}

.toolbar {
  position: absolute;
  bottom: 0.875rem;
}
</style>
