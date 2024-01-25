<script setup lang="ts">
  const { modelValue, label } = defineProps<{
    modelValue?: string;
    label: string;
    backgroundColor?: string;
    inputColor?: string;
  }>();
  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
  }>();

  const id = `__text-input_${Math.random()}`;
</script>

<template>
  <div class="input-wrapper flex flex-col space-y-4">
    <label :for="id" class="pl-[1.4375rem]">{{ label }} </label>
    <input
      :id="id"
      type="text"
      :class="`nq-input-s !rounded-3xl !border-[#008BDA] ${
        inputColor ? '' : '!text-inherit'
      } !shadow-none`"
      :style="`background-color: ${backgroundColor || '#008bda'};${
        inputColor ? `color: ${inputColor};` : ''
      }`"
      :value="modelValue"
      v-bind="$attrs"
      @change="emit('update:modelValue', $event.target?.value)"
    />
  </div>
</template>
