<script setup lang="ts">
  const { imgPath } = defineProps<{ imgPath: string }>();

  const emit = defineEmits<{
    (e: 'ctaClicked'): void;
  }>();
</script>

<template>
  <div class="flex w-full justify-center">
    <div class="nq-card !m-0 !max-w-full p-8 md:!w-3/5 md:p-20">
      <div class="flex h-full flex-col md:w-3/5">
        <div class="nq-card-header !py-6 !text-start">
          <slot name="header" />
        </div>
        <div class="nq-card-body">
          <slot name="body" />
        </div>
        <div class="nq-card-footer my-auto !px-12">
          <NextButton @click="emit('ctaClicked')">
            <slot name="buttonCaption" />
          </NextButton>
        </div>
      </div>
    </div>
    <div class="hidden md:block md:w-1/5">
      <img
        class="-ml-[40rem] w-[78rem] pt-32"
        :src="imgPath"
        alt="example picture"
      />
    </div>
  </div>
</template>
