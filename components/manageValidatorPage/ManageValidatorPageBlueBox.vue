<script setup lang="ts">
  const { darkBg } = defineProps<{ darkBg?: boolean }>();
</script>

<template>
  <div
    class="rounded-2xl p-16 text-white"
    :class="{ 'staqe-bg-blue': darkBg, 'default-bg': !darkBg }"
  >
    <slot />
  </div>
</template>

<style scoped>
  .default-bg {
    background: var(--staqe-bg-light-blue);
  }
</style>
