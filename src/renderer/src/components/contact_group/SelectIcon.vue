<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'

const iconClass = defineModel<string>('iconClass')
const popover = useTemplateRef('popover')

const iconList = [
  'i-fluent-color-library-24',
  'i-fluent-color-alert-24',
  'i-fluent-color-apps-24',
  'i-fluent-color-arrow-trending-lines-24',
  'i-fluent-color-beach-24',
  'i-fluent-color-building-24',
  'i-fluent-color-building-multiple-24',
  'i-fluent-color-building-people-24',
  'i-fluent-color-building-store-24',
  'i-fluent-color-calendar-24',
  'i-fluent-color-calendar-people-20',
  'i-fluent-color-camera-24',
  'i-fluent-color-chat-bubbles-question-24',
  'i-fluent-color-chat-more-24',
  'i-fluent-color-chat-multiple-24',
  'i-fluent-color-checkbox-24',
  'i-fluent-color-checkbox-person-24',
  'i-fluent-color-clipboard-24',
  'i-fluent-color-clock-alarm-24',
  'i-fluent-color-cloud-24',
  'i-fluent-color-code-block-24',
  'i-fluent-color-data-bar-vertical-ascending-24',
  'i-fluent-color-document-24',
  'i-fluent-color-document-folder-24',
  'i-fluent-color-error-circle-24',
  'i-fluent-color-food-24',
  'i-fluent-color-game-chat-20',
  'i-fluent-color-globe-shield-24',
  'i-fluent-color-headphones-24',
  'i-fluent-color-history-24',
  'i-fluent-color-home-24',
  'i-fluent-color-mail-24',
  'i-fluent-color-mail-multiple-24',
  'i-fluent-color-mic-24',
  'i-fluent-color-org-24',
  'i-fluent-color-people-24',
  'i-fluent-color-people-home-24',
  'i-fluent-color-people-team-24',
  'i-fluent-color-person-24',
  'i-fluent-color-pin-24',
  'i-fluent-color-poll-24',
  'i-fluent-color-question-circle-24',
  'i-fluent-color-receipt-24',
  'i-fluent-color-reward-24',
  'i-fluent-color-shield-24',
  'i-fluent-color-shifts-24',
  'i-fluent-color-vault-24',
  'i-fluent-color-video-24'
]

const showIcon = computed(() => {
  return (iconClass.value ? iconClass.value : 'i-fluent-color-library-24') + ' w-6 h-6'
})

const toggleShowSelect = (event: Event) => {
  popover.value!.toggle(event)
}
</script>

<template>
  <div>
    <Button text rounded severity="secondary" :icon="showIcon" @click="toggleShowSelect" />
    <Popover ref="popover">
      <div class="h-50 scrollbar scrollbar-w-1 scrollbar-rounded">
        <div class="grid grid-cols-6 gap-2">
          <Button
            v-for="(icon, index) in iconList"
            :key="index"
            :icon="icon + ' w-6 h-6'"
            severity="secondary"
            text
            rounded
            @click="
              (event) => {
                iconClass = icon
                toggleShowSelect(event)
              }
            "
          />
        </div>
      </div>
    </Popover>
  </div>
</template>
