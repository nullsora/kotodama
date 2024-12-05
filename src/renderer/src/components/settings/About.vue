<script setup lang="ts">
const icon = new URL('../../assets/icon.png', import.meta.url).href

const openUrl = (url: string) => {
  window.open(url, '_blank')
}

const openGithub = () => openUrl('https://github.com/nullsora/kotodama')
</script>

<template>
  <div class="lxgw black-text glassmorphism p-xl gap-sm flex flex-col items-center h-full">
    <div class="flex justify-between items-center gap-12">
      <img
        v-tooltip.bottom="'查看仓库'"
        class="w-20 h-20 cursor-pointer"
        :src="icon"
        @click="openGithub"
      />
      <div>
        <div class="text-xl">Kotodama / 言靈</div>
        <div class="text-sm mt-1">Version 0.9.0</div>
        <div class="text-sm mt-1">AGPL-3.0 license</div>
      </div>
    </div>
    <div class="divider w-full" />
    <div class="flex justify-between items-center w-full">
      <div class="text-lg">作者 / Author</div>
      <div class="flex items-center gap-2">
        <Button
          icon="i-cib-github w-6 h-6"
          label="@nullsora"
          text
          rounded
          @click="openUrl('https://github.com/nullsora')"
        />
      </div>
    </div>
    <div class="w-full">
      <div class="text-lg">鸣谢 / Acknowledgment</div>
      <div class="m-sm">
        <div class="flex justify-between items-center gap-2">
          <div>图标绘制</div>
          <div>@柴油动力轮椅</div>
        </div>
        <div class="flex justify-between items-center gap-2 mt-2">
          <div>字体</div>
          <div
            class="primary-text cursor-pointer"
            @click="openUrl('https://github.com/lxgw/LxgwWenKai')"
          >
            霞鹜文楷
          </div>
        </div>
        <div class="flex justify-between items-center gap-2 mt-2">
          <div>CSS动画</div>
          <div class="primary-text cursor-pointer" @click="openUrl('http://animista.net')">
            Animista
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
