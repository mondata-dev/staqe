<script setup lang="ts">
  defineProps<{
    message: string;
    buttonText: string;
    buttonTarget: string;
  }>();
  const emit = defineEmits(['close']);
</script>

<template>
  <NQModal>
    <div class="px-8">
      <h1 class="text-[4.5rem]">Error</h1>
      <p class="stq-p">
        {{ message }}
      </p>
      <p class="stq-p">
        <NuxtLink
          :to="buttonTarget"
          class="nq-button !m-0 !h-[7.5rem] !normal-case !text-white"
          @click="emit('close')"
        >
          <span class="nq-h1 !mr-6">{{ buttonText }}</span>
        </NuxtLink>
      </p>
    </div>
  </NQModal>
</template>
