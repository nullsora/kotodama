<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'

const props = defineProps<{
  msg: MessageTypes['QQFace']
}>()

const faceUrl = computed(
  () => new URL(`../../assets/faces/${props.msg.data.id}.png`, import.meta.url).href
)
</script>

<template>
  <img class="w-5 h-5" :src="faceUrl" alt="[表情]" />
</template>
