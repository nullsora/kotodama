<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'
import MarkdownIt from 'markdown-it'
import { computed } from 'vue'

const md = new MarkdownIt({ breaks: true })

const { msg } = defineProps<{
  msg: MessageTypes['Markdown']
}>()

const parsedContent = computed(() => {
  let parsed = msg.data.content.replace('https://', 'k-web-img://')
  if (parsed.startsWith('[]')) parsed = parsed.slice(parsed.indexOf('\n'))
  return parsed
})
</script>

<template>
  <div class="text-sm line-height-loose pointer-events-none markdown">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="md.render(parsedContent)" />
  </div>
</template>
