<template>
  <div class="contact-container h-full grid gap-sm">
    <div>
      <slot name="contacts" />
    </div>
    <div>
      <slot name="info" />
    </div>
  </div>
</template>

<style scoped>
.contact-container {
  grid-template-columns: 20rem 3fr;
}
</style>
