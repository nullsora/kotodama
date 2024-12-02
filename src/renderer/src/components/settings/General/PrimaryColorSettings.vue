<script setup lang="ts">
import { PrimaryColor } from '@renderer/functions/types'
import { useConfigStore } from '@renderer/stores/ConfigStore'
import { ref } from 'vue'
import SettingItem from '@renderer/components/misc/SettingItem.vue'

const config = useConfigStore()

const primaryColors = ref([
  { name: 'Noir', code: PrimaryColor.Noir },
  { name: 'Emerald', code: PrimaryColor.Emerald },
  { name: 'Green', code: PrimaryColor.Green },
  { name: 'Lime', code: PrimaryColor.Lime },
  { name: 'Red', code: PrimaryColor.Red },
  { name: 'Orange', code: PrimaryColor.Orange },
  { name: 'Amber', code: PrimaryColor.Amber },
  { name: 'Yellow', code: PrimaryColor.Yellow },
  { name: 'Teal', code: PrimaryColor.Teal },
  { name: 'Cyan', code: PrimaryColor.Cyan },
  { name: 'Sky', code: PrimaryColor.Sky },
  { name: 'Blue', code: PrimaryColor.Blue },
  { name: 'Indigo', code: PrimaryColor.Indigo },
  { name: 'Violet', code: PrimaryColor.Violet },
  { name: 'Purple', code: PrimaryColor.Purple },
  { name: 'Fuchsia', code: PrimaryColor.Fuchsia },
  { name: 'Pink', code: PrimaryColor.Pink },
  { name: 'Rose', code: PrimaryColor.Rose }
])

const updatePrimaryColor = () => {
  config.updatePrimaryColor()
}
</script>

<template>
  <SettingItem class="mt-sm" :title="'主题色'" :description="'更改主题色'">
    <div class="flex items-center">
      <Select v-model="config.primaryColor" :options="primaryColors" option-label="name">
        <template #value="{ value }">
          <div class="flex items-center gap-2">
            <div
              class="w-4 h-4 rd-full"
              :style="{ backgroundColor: `var(--p-${value.code}-500)` }"
            />
            <span>{{ value.name }}</span>
          </div>
        </template>
        <template #option="{ option }">
          <div class="flex items-center gap-2">
            <div
              class="w-4 h-4 rd-full"
              :style="{ backgroundColor: `var(--p-${option.code}-500)` }"
            />
            <span>{{ option.name }}</span>
          </div>
        </template>
      </Select>
      <Button class="ml-sm" label="更新" @click="updatePrimaryColor()" />
    </div>
  </SettingItem>
</template>
