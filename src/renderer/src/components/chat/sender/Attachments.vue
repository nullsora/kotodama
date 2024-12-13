<script setup lang="ts">
import { useStatusStore } from '@renderer/stores/status_store'
import { useTemplateRef } from 'vue'

const status = useStatusStore()

const popover = useTemplateRef('popover')

const attachments = defineModel<string[]>({ required: true })

const selectImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = false

  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      // push directory to attachments
      attachments.value.push(files[0].path)
      status.sendingText += `[/IA:${attachments.value.length - 1}]`
      // delete input
      input.remove()
    }
  }

  input.click()
}

const selectVideo = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'video/*'
  input.multiple = false

  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      // push directory to attachments
      attachments.value.push(files[0].path)
      status.sendingText += `[/VA:${attachments.value.length - 1}]`
      // delete input
      input.remove()
    }
  }

  input.click()
}

const selectFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '*/*'
  input.multiple = false

  input.onchange = (e) => {
    const files = (e.target as HTMLInputElement).files
    if (files && files.length > 0) {
      // push directory to attachments
      attachments.value.push(files[0].path)
      status.sendingText += `[/FA:${attachments.value.length - 1}]`
    }
  }

  input.click()
}
</script>

<template>
  <div>
    <Button
      icon="i-fluent-add-circle-24-regular w-5 h-5"
      severity="secondary"
      text
      rounded
      @click="(e) => popover?.toggle(e)"
    />
    <Popover ref="popover">
      <div class="flex items-center gap-sm select-none gray-text">
        <div class="selection gray-text" @click="selectImage">
          <i class="i-fluent-image-24-regular w-7 h-7" />
          <div class="text-sm">图片</div>
        </div>
        <div class="selection gray-text" @click="selectVideo">
          <i class="i-fluent-video-24-regular w-7 h-7" />
          <div class="text-sm">视频</div>
        </div>
        <div class="selection gray-text" @click="selectFile">
          <i class="i-fluent-folder-24-regular w-7 h-7" />
          <div class="text-sm">文件</div>
        </div>
      </div>
    </Popover>
  </div>
</template>

<style scoped>
.selection {
  width: 4rem;
  height: 4rem;
  border-radius: 0.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  gap: 0.5rem;
}

.selection:hover {
  background-color: var(--p-gray-100);
}

.dark-mode .selection:hover {
  background-color: var(--p-gray-600);
}
</style>
