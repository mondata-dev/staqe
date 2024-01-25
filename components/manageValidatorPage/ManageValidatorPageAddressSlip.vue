<script setup lang="ts">
  import { Account } from '@nimiq/vue3-components';

  const { address, info } = defineProps<{
    address: string;
    info: string;
  }>();
</script>

<template>
  <div class="flex items-center">
    <div
      class="nq-card !m-0 !max-w-[70vw] !shadow-none md:!max-w-[25rem] md:grow lg:!max-w-[45rem] xl:!max-w-[60rem]"
    >
      <Account :label="address" :address="address" />
    </div>
    <info-balloon :icon-props="{ class: 'opacity-60' }" class="ml-6 md:ml-20">
      <p class="w-[25rem]">{{ info }}</p>
    </info-balloon>
  </div>
</template>

<style scoped>
  :deep(.account.row) {
    padding: 1rem 2rem;
  }

  :deep(.account.row .identicon) {
    width: 3.5rem;
    height: 3.5rem;
    margin-right: 1.4rem;
  }

  :deep(.account.row .identicon img) {
    width: 3.5rem;
    height: 3.5rem;
  }

  :deep(.account.row .label) {
    padding-left: 0;
  }
</style>
