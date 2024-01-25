<script setup lang="ts">
  import { CircleSpinner } from '@nimiq/vue3-components';
  import { SvgCheckCircle, SvgEllipse } from '#components';

  const steps = computed(() => {
    return [
      {
        id: 'create-wallet',
        text: 'Create Address',
        route: 'sign-up',
      },
      {
        id: 'fund',
        text: 'Fund Validator',
        route: 'sign-up-fund',
      },
      {
        id: 'buy',
        text: 'Buy Validator at Staqe',
        route: 'sign-up-buy',
      },
      {
        id: 'configure',
        text: 'Configure the Validator',
        route: 'sign-up-configure',
      },
      {
        id: 'login',
        text: 'Check Validator',
        route: 'sign-up-done',
      },
    ];
  });

  const currentStep = computed(() => {
    const { name } = useRoute();
    return steps.value.findIndex((s) => s.route === name);
  });

  const progress = computed(() => {
    const stepsWithoutLogin = steps.value.slice(0, -1);

    return Math.min(
      Math.floor(((currentStep.value + 1) / stepsWithoutLogin.length) * 100),
      100,
    );
  });
</script>

<template>
  <div class="w-[96rem] max-w-full">
    <span class="progress-text">
      Progress... <b class="mx-6">{{ progress }}%</b>
    </span>

    <div class="my-8 flex justify-between">
      <div
        v-for="(step, i) in steps"
        :key="step.id"
        class="flex w-[12.5rem] flex-col items-center justify-start text-center"
        :class="{ 'opacity-50': i > currentStep }"
      >
        <div class="mb-2 h-[4rem]">
          <component
            :is="
              i < currentStep
                ? SvgCheckCircle
                : i === currentStep
                  ? CircleSpinner
                  : SvgEllipse
            "
            :color="i > currentStep ? 'grey' : 'var(--nimiq-green)'"
          />
        </div>
        <span class="progress-caption my-4">{{ step.text }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  :deep(.nq-icon) {
    height: 4rem;
    width: 4rem;
  }

  :deep(.circle-spinner) {
    height: 4rem;
    width: 4rem;
    animation-duration: 5s;
  }

  :deep(.circle-spinner path) {
    stroke: var(--nimiq-green);
  }
</style>
