<script setup lang="ts">
import { getTransitionOrigin as _getOrigin } from '@renderer/functions/misc'
import { useStatusStore } from '@renderer/stores/status_store'
import { ref } from 'vue'

const status = useStatusStore()

const emit = defineEmits<{
  select: [event: Event]
}>()

const currentCategory = ref(0)

const selectFace = (categoryIndex: number, faceIndex: number) => {
  status.sendingText += `[/LF:${categoryIndex},${faceIndex}]`
}

const getTransformOrigin = (index: number) =>
  _getOrigin(index, 5, status.localFaceList[currentCategory.value].faces.length)
</script>

<template>
  <div class="flex flex-row justify-between gap-2 h-full">
    <div
      class="primary-border h-full p-2 overflow-x-hidden scrollbar scrollbar-w-1 scrollbar-rounded"
    >
      <div
        v-for="(category, index) in status.localFaceList"
        :key="index"
        v-ripple
        v-tooltip.right="category.category"
        class="h-8 w-8 mb-1 rd-2 flex justify-center items-center hover:brightness-80"
        @click="currentCategory = index"
      >
        <img class="max-h-8 max-w-8 drag-none" :src="`k-file://static?path=${category.faces[0]}`" />
      </div>
    </div>
    <div class="flex-1 h-80 overflow-x-hidden scrollbar scrollbar-w-1 scrollbar-rounded">
      <div class="grid grid-cols-5 gap-2">
        <div
          v-for="(url, index) in status.localFaceList[currentCategory].faces"
          :key="index"
          :style="getTransformOrigin(index)"
          class="custom-face flex justify-center items-center"
          @click="
            (event) => {
              selectFace(currentCategory, index)
              emit('select', event)
            }
          "
        >
          <img class="max-h-18 max-w-18 drag-none" :src="`k-file://static?path=${url}`" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-face {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  position: relative;
}

.custom-face:hover {
  transform: scale(1.8);
  z-index: 1;
}
</style>
