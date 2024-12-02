<script setup lang="ts">
import { faceMap } from '@renderer/functions/face_map'
import { inject, Ref, ref, useTemplateRef } from 'vue'

const sendText = inject('sendText') as Ref<string>

const panel = useTemplateRef('panel')

const currentPage = ref(0)

const toggle = (event: Event) => {
  if (panel.value) panel.value.toggle(event)
}

const getFaceImg = (id: number) => {
  return new URL(`../../../assets/faces/${id}.png`, import.meta.url).href
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
  <Popover ref="panel" class="w-80">
    <div v-if="currentPage === 0" class="h-50 scrollbar scrollbar-w-1 scrollbar-rounded">
      <div class="grid grid-cols-6 gap-1">
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
          <img class="w-6 h-6" :src="getFaceImg(index)" :alt="face" />
        </Button>
      </div>
    </div>
    <div v-else-if="currentPage === 1" class="h-50 scrollbar scrollbar-w-1 scrollbar-rounded">
      <div class="grid grid-cols-6 gap-1">
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
      </div>
    </div>
    <div class="flex items-center gap-1 p-1 mt-2 primary-border">
      <Button
        v-tooltip.top="'官方'"
        icon="i-fluent-emoji-24-regular w-5 h-5"
        severity="secondary"
        size="small"
        text
        @click="currentPage = 0"
      />
      <Button
        v-tooltip.top="'魔法表情'"
        icon="i-fluent-magic-wand-20-regular w-5 h-5"
        severity="secondary"
        size="small"
        text
        @click="currentPage = 1"
      />
    </div>
  </Popover>
</template>
