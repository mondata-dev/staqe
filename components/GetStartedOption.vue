<script setup lang="ts">
  const { svgComponent } = defineProps<{
    svgComponent: object;
  }>();
</script>

<template>
  <div class="flex h-full flex-col items-center space-y-12 rounded-lg">
    <component
      :is="svgComponent"
      class="!h-[12.5rem] !w-[12.5rem] opacity-30"
      fill="currentColor"
    />
    <div class="flex w-[80%] flex-col">
      <slot />
    </div>
  </div>
</template>
