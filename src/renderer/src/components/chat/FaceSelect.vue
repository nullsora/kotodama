<script setup lang="ts">
import { faceMap } from '@renderer/functions/face_map'
import { ref, useTemplateRef } from 'vue'

const emit = defineEmits<{
  select: [id: number]
}>()

const panel = useTemplateRef('panel')

const currentPage = ref(0)

const toggle = (event: Event) => {
  panel.value!.toggle(event)
}

const getFaceImg = (id: number) => {
  return new URL(`../../assets/faces/${id}.png`, import.meta.url).href
}
</script>

<template>
  <Button icon="i-fluent-emoji-24-regular w-5 h-5" severity="secondary" text @click="toggle" />
  <Popover ref="panel">
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
              toggle(event)
              emit('select', index)
            }
          "
        >
          <img class="w-6 h-6" :src="getFaceImg(index)" :alt="face" />
        </Button>
      </div>
    </div>
    <div class="flex flex-row items-center gap-1 p-1 mt-2 primary-border">
      <Button
        v-tooltip.top="'官方'"
        icon="i-fluent-emoji-24-regular w-5 h-5"
        severity="secondary"
        size="small"
        text
        @click="currentPage = 0"
      />
    </div>
  </Popover>
</template>
