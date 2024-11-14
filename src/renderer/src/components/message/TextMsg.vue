<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'

defineProps<{
  msg: MessageTypes['Text']
}>()
</script>

<template>
  <span class="max-w-100 text-sm whitespace-pre-wrap">{{ msg.data.text }}</span>
</template>
