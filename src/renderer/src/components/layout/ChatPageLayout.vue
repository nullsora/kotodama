<template>
  <div class="chat-container h-full grid gap-sm">
    <div>
      <slot name="sidebar" />
    </div>
    <div>
      <slot name="contacts" />
    </div>
    <div>
      <slot name="chat" />
    </div>
  </div>
</template>

<style scoped>
.chat-container {
  grid-template-columns: 4rem 17rem 3fr;
}
</style>
