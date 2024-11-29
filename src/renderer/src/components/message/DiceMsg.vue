<script setup lang="ts">
import { MessageTypes } from '@renderer/functions/message/message_types'

const { msg } = defineProps<{
  msg: MessageTypes['Dice']
}>()
</script>

<template>
  <div class="dice-face">
    <div v-for="i in parseInt(msg.data.result!)" :key="i" class="dot" />
  </div>
</template>

<style scoped>
.dice-face {
  display: grid;
  grid-template-areas:
    'a . c'
    'e g f'
    'd . b';
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);

  flex: 0 0 auto;
  width: 3.5rem;
  height: 3.5rem;
  padding: 0.5rem;
  margin: 0.5rem;

  background-color: var(--p-gray-100);
  border-radius: 0.5rem;
  box-shadow:
    inset 0 0.2rem white,
    inset 0 -0.2rem #bbb,
    inset 0.2rem 0 #d7d7d7,
    inset -0.2rem 0 #d7d7d7;
}

.dark-mode .dice-face {
  background-color: var(--p-gray-600);
  box-shadow:
    inset 0 0.2rem var(--p-gray-400),
    inset 0 -0.2rem var(--p-gray-700),
    inset 0.2rem 0 var(--p-gray-500),
    inset -0.2rem 0 var(--p-gray-500);
}

.dot {
  width: 0.8rem;
  height: 0.8rem;
  border-radius: 50%;
  background-color: var(--p-gray-700);
  box-shadow:
    inset 0 0.15rem #111,
    inset 0 -0.15rem #555;
}

.dark-mode .dot {
  background-color: var(--p-gray-300);
  box-shadow:
    inset 0 0.15rem var(--p-gray-400),
    inset 0 -0.15rem var(--p-gray-200);
}

.dot:nth-child(1) {
  grid-area: a;
}

.dot:nth-child(2) {
  grid-area: b;
}

.dot:nth-child(3) {
  grid-area: c;
}

.dot:nth-child(4) {
  grid-area: d;
}

.dot:nth-child(5) {
  grid-area: e;
}

.dot:nth-child(6) {
  grid-area: f;
}

.dot:nth-child(odd):last-child {
  grid-area: g;
}
</style>
