<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import { computed } from 'vue'

const { msg } = defineProps<{
  msg: MessageTypes['Rps']
}>()

const msgIcon = computed(() => {
  switch (msg.data.result) {
    case '1':
      return 'i-fluent-emoji-hand-with-fingers-splayed-light'
    case '2':
      return 'i-fluent-emoji-victory-hand-light'
    case '3':
      return 'i-fluent-emoji-raised-fist-light'
    default:
      return ''
  }
})
</script>

<template>
  <div>
    <i :class="msgIcon" class="pi w-15 h-15" />
  </div>
</template>
