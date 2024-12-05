<script setup lang="ts">
import { getTransitionOrigin as _getOrigin } from '@renderer/functions/misc'
import { inject, ref, Ref } from 'vue'

const sendText = inject('sendText') as Ref<string>
const faceList = inject('faceList') as Ref<{ category: string; faces: string[] }[]>

const emit = defineEmits<{
  select: [event: Event]
}>()

const currentCategory = ref(0)

const selectFace = (categoryIndex: number, faceIndex: number) => {
  sendText.value += `[/LF:${categoryIndex},${faceIndex}]`
}

const getTransformOrigin = (index: number) =>
  _getOrigin(index, 5, faceList.value[currentCategory.value].faces.length)
</script>

<template>
  <div class="flex flex-row justify-between gap-2 h-full">
    <div class="primary-border h-full p-2 scrollbar scrollbar-w-1 scrollbar-rounded">
      <div
        v-for="(category, index) in faceList"
        :key="index"
        v-ripple
        v-tooltip.right="category.category"
        class="h-8 w-8 mb-1 rd-2"
        @click="currentCategory = index"
      >
        <img class="max-h-8 max-w-8" :src="`k-file://static?path=${category.faces[0]}`" />
      </div>
    </div>
    <div class="flex-1 h-80 scrollbar scrollbar-w-1 scrollbar-rounded">
      <div class="grid grid-cols-5 gap-2">
        <div
          v-for="(url, index) in faceList[currentCategory].faces"
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
          <img class="max-h-18 max-w-18" :src="`k-file://static?path=${url}`" />
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
