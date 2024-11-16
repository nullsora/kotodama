<script setup lang="ts">
import { ref } from 'vue'
import ContactPanel from '@renderer/components/contact/ContactPanel.vue'
import ContactPageLayout from '@renderer/components/layout/ContactPageLayout.vue'
import ContactInfo from '@renderer/components/contact/ContactInfo.vue'
import FadeTransition from '@renderer/components/misc/FadeTransition.vue'

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
      <FadeTransition>
        <ContactInfo v-if="selectedContact" :contact="selectedContact" />
      </FadeTransition>
    </template>
  </ContactPageLayout>
</template>
