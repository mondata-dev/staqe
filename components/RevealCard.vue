<script setup lang="ts">
  import { CloseButton } from '@nimiq/vue3-components';

  const { modelValue } = defineProps<{
    modelValue: boolean;
  }>();
  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void;
  }>();

  function reveal(doReveal: boolean) {
    emit('update:modelValue', doReveal);
  }
</script>

<template>
  <div class="nq-card">
    <div v-show="!modelValue" @click="reveal(true)">
      <slot name="cover" />
    </div>
    <div v-show="modelValue" class="p-10">
      <CloseButton class="top-left" @click="reveal(false)" />
      <slot name="content" />
    </div>
  </div>
</template>
