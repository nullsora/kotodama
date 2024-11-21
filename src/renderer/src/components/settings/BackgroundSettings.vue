<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/ConfigStore'
import SettingItem from '../misc/SettingItem.vue'

const config = useConfigStore()
</script>

<template>
  <SettingItem class="mt-sm" title="背景设置" description="设置background css">
    <div class="flex flex-col justify-start items-end gap-sm">
      <div class="flex justify-end items-center gap-sm">
        <InputText v-model="config.themeSettings.backgroundImage.light" class="w-80" />
        <Tag class="text-lg">亮色模式背景</Tag>
      </div>
      <div class="flex justify-end items-center gap-sm">
        <InputText v-model="config.themeSettings.backgroundImage.dark" class="w-80" />
        <Tag class="text-lg">深色模式背景</Tag>
      </div>
      <Button label="更新" @click="config.updateTheme" />
    </div>
  </SettingItem>
</template>
