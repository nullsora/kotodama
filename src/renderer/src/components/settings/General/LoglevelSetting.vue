<script setup lang="ts">
import SettingItem from '@renderer/components/misc/SettingItem.vue'
import { LogLevel } from '@renderer/functions/logger'
import { useConfigStore } from '@renderer/stores/config_store'

const config = useConfigStore()
</script>

<template>
  <SettingItem class="mt-sm" title="开启Debug">
    <ToggleSwitch
      :model-value="config.logLevel === LogLevel.DEBUG"
      @update:model-value="
        (change) => {
          if (change) config.logLevel = LogLevel.DEBUG
          else config.logLevel = LogLevel.INFO
        }
      "
    />
  </SettingItem>
</template>
