<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/ConfigStore'
import SettingItem from '@renderer/components/misc/SettingItem.vue'

const config = useConfigStore()

const reset = () => {
  config.customSettings.backgroundImage.light = ''
  config.customSettings.backgroundImage.dark = ''
  config.updateTheme()
}
</script>

<template>
  <SettingItem class="mt-sm" title="背景设置" description="设置background css">
    <div class="flex flex-col justify-start items-end gap-sm">
      <div class="flex justify-end items-center gap-sm">
        <InputText v-model="config.customSettings.backgroundImage.light" class="w-80" />
        <Tag class="text-lg">亮色模式背景</Tag>
      </div>
      <div class="flex justify-end items-center gap-sm">
        <InputText v-model="config.customSettings.backgroundImage.dark" class="w-80" />
        <Tag class="text-lg">深色模式背景</Tag>
      </div>
      <div class="flex flex-row justify-end items-center gap-sm">
        <Button label="重置" severity="secondary" @click="reset" />
        <Button label="更新" @click="config.updateTheme" />
      </div>
    </div>
  </SettingItem>
</template>
