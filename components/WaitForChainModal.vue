<script setup lang="ts">
  import { LoadingSpinner } from '@nimiq/vue3-components';
</script>

<template>
  <NQModal>
    <div class="px-8">
      <h1 class="text-[4.5rem]">Connecting to Nimiq</h1>
      <div class="!my-24 flex justify-center">
        <LoadingSpinner height="96" width="96" />
      </div>
      <p class="stq-p">
        We're talking to the Nimiq blockchain to get the latest information.
      </p>
      <p class="stq-p">This can take up to a minute.</p>
    </div>
  </NQModal>
</template>
