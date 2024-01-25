<script setup lang="ts">
  import { CaretRightSmallIcon } from '@nimiq/vue3-components';

  const { arrowClasses } = defineProps<{ arrowClasses?: string }>();
</script>

<template>
  <button
    class="nq-button-s anchor-button mb-5 mt-auto flex h-[4rem] w-[4rem] !rounded-full !p-0"
  >
    <CaretRightSmallIcon class="m-auto" :class="arrowClasses" />
  </button>
</template>
