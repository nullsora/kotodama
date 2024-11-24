<script setup lang="ts">
import SettingItem from '@renderer/components/misc/SettingItem.vue'
import { useConfigStore } from '@renderer/stores/ConfigStore'

const config = useConfigStore()
</script>

<template>
  <div class="scrollbar scrollbar-w-1 scrollbar-rounded">
    <SettingItem title="启用图片合并" description="启用后，消息中连续的图片会合并为多图的排版展示">
      <ToggleSwitch v-model="config.customSettings.message.useImageGallery" />
    </SettingItem>
  </div>
</template>
