<script setup lang="ts">
import { faceMap } from '@renderer/functions/face_map'
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['QQFace']
}>()

const faceUrl = computed(
  () => new URL(`../../assets/faces/${msg.data.id}.png`, import.meta.url).href
)

const faceName = computed(() => {
  const name = faceMap[msg.data.id]
  if (name) return `[/${name}]`
  else return `[表情/${msg.data.id}]`
})
</script>

<template>
  <img class="w-5 h-5 align-mid" :src="faceUrl" :alt="faceName" />
</template>
