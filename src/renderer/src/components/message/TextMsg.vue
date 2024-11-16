<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'

const { msg } = defineProps<{
  msg: MessageTypes['Text']
}>()
</script>

<template>
  <span class="text-sm whitespace-pre-wrap max-w-100 break-words">{{ msg.data.text }}</span>
</template>
