<script setup lang="ts">
import { AnyMessage } from '@renderer/functions/message/message_types'

defineProps<{
  msg: AnyMessage
}>()
</script>

<template>
  <span class="gray-text font-italic">[不支持的消息: {{ msg.type }}]</span>
</template>
