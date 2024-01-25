<script setup lang="ts">
  import { InfoCircleSmallIcon, Tooltip } from '@nimiq/vue3-components';

  const { iconProps } = defineProps<{ iconProps?: object }>();
</script>

<template>
  <Tooltip :container="globalRefs.appContainer" :auto-width="false">
    <template #trigger>
      <InfoCircleSmallIcon class="outline-none" v-bind="iconProps" />
    </template>

    <slot />
  </Tooltip>
</template>

<style scoped>
  :deep(.tooltip-box h4) {
    font-weight: 500;
    font-size: 2rem;
    margin: 0 0 1rem;
  }

  :deep(.tooltip-box p) {
    font-weight: 600;
    font-size: 2rem;
    opacity: 0.7;
    margin: 0 0 1rem;
  }
</style>
