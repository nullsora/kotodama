<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['Text']
}>()

const parsedText = computed(() => {
  return msg.data.text.replaceAll('\r', '\n')
})
</script>

<template>
  <span class="text-sm whitespace-pre-wrap max-w-100 break-words">{{ parsedText }}</span>
</template>
