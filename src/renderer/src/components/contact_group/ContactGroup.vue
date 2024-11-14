<script setup lang="ts">
defineProps<{ groupName: string; iconClass: string; selected: boolean }>()
</script>

<template>
  <div>
    <Avatar
      v-ripple
      v-tooltip="groupName"
      size="large"
      :class="{ selected: selected }"
      class="contact-group"
      :icon="iconClass"
    />
  </div>
</template>

<style scoped>
.contact-group {
  background-color: transparent;
}
.contact-group:hover {
  background-color: var(--p-primary-50);
}

.dark-mode .contact-group:hover {
  background-color: var(--p-primary-300);
}

.contact-group.selected {
  background-color: var(--p-primary-100);
}
.contact-group.selected:hover {
  background-color: var(--p-primary-200);
}

.dark-mode .contact-group.selected {
  background-color: var(--p-primary-500);
}
.dark-mode .contact-group.selected:hover {
  background-color: var(--p-primary-600);
}
</style>
