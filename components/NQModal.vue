<!--
    Wrapper for the Small Pages that are used as Overlay or Info Cards
-->
<script setup lang="ts">
  defineEmits(['closeModal']);
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-[#000000da] p-10"
    @click="$emit('closeModal')"
  >
    <div
      class="nq-card flex h-fit max-h-full w-fit !max-w-[90vw] flex-col items-center overflow-auto p-10"
      @click.stop
    >
      <slot />
    </div>
  </div>
</template>
