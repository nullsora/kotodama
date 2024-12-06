<script setup lang="ts">
import MsgImage from '@renderer/components/message/basic/MsgImage.vue'
import { DataManager } from '@renderer/functions/data_manager'
import { faceMap } from '@renderer/functions/face_map'
import { inject, Ref, ref, useTemplateRef } from 'vue'
import LocalFaceSelect from './LocalFaceSelect.vue'
import { getTransitionOrigin as _getOrigin } from '@renderer/functions/misc'

const runtimeData = inject('runtimeData') as DataManager
const sendText = inject('sendText') as Ref<string>

const panel = useTemplateRef('panel')

const currentPage = ref(0)

const toggle = (event: Event) => {
  if (panel.value) panel.value.toggle(event)
}

const getFaceImg = (id: number) => {
  return new URL(`../../../assets/faces/${id}.png`, import.meta.url).href
}

const getTransformOrigin = (index: number) =>
  _getOrigin(index, 6, runtimeData.userInfo.value.faces.length)

const openLocalFaceFolder = async () => {
  // @ts-ignore - window is defined in preload
  const kotodama = window.kotodama
  const path = await kotodama.file.getFacePath()
  await kotodama.window.openExternal(path)
}
</script>

<template>
  <Button
    icon="i-fluent-emoji-24-regular w-5 h-5"
    severity="secondary"
    text
    rounded
    @click="toggle"
  />
  <Popover ref="panel" class="w-120">
    <div v-if="currentPage === 0" class="h-80 scrollbar scrollbar-w-1 scrollbar-rounded">
      <div class="grid grid-cols-10 gap-1">
        <Button
          v-tooltip.top="'猜拳'"
          icon="i-fluent-emoji-raised-fist-light w-6 h-6"
          severity="secondary"
          text
          @click="
            (event) => {
              sendText += '[/rps]'
              toggle(event)
            }
          "
        />
        <Button
          v-tooltip.top="'骰子'"
          icon="i-fluent-emoji-game-die w-6 h-6"
          severity="secondary"
          text
          @click="
            (event) => {
              sendText += '[/dice]'
              toggle(event)
            }
          "
        />
        <Button
          v-for="(face, index) in faceMap"
          :key="index"
          v-tooltip.top="face"
          severity="secondary"
          text
          @click="
            (event) => {
              sendText += `[/${face}]`
              toggle(event)
            }
          "
        >
          <img class="w-6 h-6 drag-none" :src="getFaceImg(index)" :alt="face" />
        </Button>
      </div>
    </div>
    <div v-else-if="currentPage === 1" class="h-80 scrollbar scrollbar-w-1 scrollbar-rounded">
      <div class="grid grid-cols-6 gap-1">
        <div
          v-for="(url, index) in runtimeData.userInfo.value.faces"
          :key="index"
          :style="getTransformOrigin(index)"
          class="custom-face flex justify-center items-center"
          @click="
            (event) => {
              sendText += '[/CF:' + index + ']'
              toggle(event)
            }
          "
        >
          <MsgImage
            class="max-h-18 max-w-18 drag-none"
            :src="url"
            :show-menu="false"
            :rounded="false"
          />
        </div>
      </div>
    </div>
    <div v-show="currentPage === 2" class="h-80">
      <Suspense>
        <LocalFaceSelect @select="toggle" />
      </Suspense>
    </div>
    <div class="p-1 mt-2 primary-border flex justify-between">
      <div class="flex items-center gap-1">
        <Button
          v-tooltip.top="'官方'"
          icon="i-fluent-emoji-24-regular w-5 h-5"
          severity="secondary"
          size="small"
          text
          @click="currentPage = 0"
        />
        <Button
          v-tooltip.top="'收藏表情'"
          icon="i-fluent-heart-pulse-24-regular w-5 h-5"
          severity="secondary"
          size="small"
          text
          @click="currentPage = 1"
        />
        <Button
          v-tooltip.top="'本地表情'"
          icon="i-fluent-apps-24-regular w-5 h-5"
          severity="secondary"
          size="small"
          text
          @click="currentPage = 2"
        />
      </div>
      <Button
        v-tooltip.top="'打开本地表情文件夹'"
        icon="i-fluent-folder-24-regular w-5 h-5"
        severity="secondary"
        size="small"
        text
        @click="openLocalFaceFolder"
      />
    </div>
  </Popover>
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
