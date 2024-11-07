<script setup lang="ts">
import { ref } from 'vue'
import ContactPanel from '@renderer/components/contact/ContactPanel.vue'
import ContactPageLayout from '@renderer/components/layout/ContactPageLayout.vue'
import ContactInfo from '@renderer/components/contact/ContactInfo.vue'

const selectedContact = ref<{
  type: 'friend' | 'group'
  id: number
} | null>(null)
</script>

<template>
  <ContactPageLayout>
    <template #contacts>
      <ContactPanel v-model:selected-contact="selectedContact" />
    </template>
    <template #info>
      <ContactInfo v-if="selectedContact" :contact="selectedContact" />
    </template>
  </ContactPageLayout>
</template>
