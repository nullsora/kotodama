<script setup lang="ts">
import SettingItem from '@renderer/components/misc/SettingItem.vue'
import { useConfigStore } from '@renderer/stores/config_store'

const config = useConfigStore()
</script>

<template>
  <div class="scrollbar scrollbar-w-1 scrollbar-rounded">
    <SettingItem title="始终显示发送时间" description="若为否，则只在鼠标悬停时显示时间">
      <ToggleSwitch v-model="config.customSettings.message.alwaysShowTimestamp" />
    </SettingItem>
    <SettingItem
      class="mt-sm"
      title="启用图片合并"
      description="启用后，消息中连续的图片会合并为多图的排版展示"
    >
      <ToggleSwitch v-model="config.customSettings.message.useImageGallery" />
    </SettingItem>
    <SettingItem class="mt-sm" title="使用霞鹜文楷" description="消息内容将以霞鹜文楷展示">
      <ToggleSwitch v-model="config.customSettings.message.useLxgw" />
    </SettingItem>
  </div>
</template>
