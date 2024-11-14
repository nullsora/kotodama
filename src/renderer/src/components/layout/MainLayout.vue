<template>
  <div class="main-layout h-vh p-2 flex flex-col gap-3">
    <div class="h-auto">
      <slot name="header" />
    </div>
    <div class="flex-1">
      <slot name="main" />
    </div>
  </div>
</template>

<style scoped>
.main-container {
  grid-template-rows: auto 1fr;
}

.main-layout {
  background-color: white;
}

.dark-mode .main-layout {
  background-color: var(--p-gray-900);
}
</style>
