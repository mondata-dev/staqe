<script setup lang="ts">
  import { GearIcon, InfoCircleIcon } from '@nimiq/vue3-components';
  import { SvgStaqe } from '#components';
</script>

<template>
  <div class="flex flex-col text-center">
    <h2>Getting Started</h2>
    <div class="nq-card !max-w-full">
      <div
        class="nq-card-body flex h-full flex-col justify-around !p-5 md:flex-row"
      >
        <template
          v-for="{ to, svgComponent, h3, span, cssClass } in [
            {
              to: '/sign-up',
              svgComponent: SvgStaqe,
              h3: 'Start staking with Staqe',
              span: 'Rely on our technical expertise and start earning rewards today.',
              cssClass: 'hover:staqe-bg-plain-light-blue',
            },
            {
              to: '/how-it-works',
              svgComponent: GearIcon,
              h3: 'How it works',
              span: 'Understand the process of purchasing your validator at Staqe.',
              cssClass: 'hover:staqe-bg-plain-green',
            },
            {
              to: '/values',
              svgComponent: InfoCircleIcon,
              h3: 'More about Staqe',
              span: 'Learn about our core values and how we differ from other services.',
              cssClass: 'hover:staqe-bg-plain-blue',
            },
          ]"
          :key="to"
        >
          <NuxtLink :to="to" class="text-inherit no-underline md:w-1/3">
            <GetStartedOption
              :svg-component="svgComponent"
              class="py-16 transition-colors duration-500 hover:text-white md:py-32"
              :class="cssClass"
            >
              <h3 class="tile-button-header">{{ h3 }}</h3>
              <span class="tile-button-text">{{ span }}</span>
            </GetStartedOption>
          </NuxtLink>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
  :deep(a div svg) {
    transition: opacity 600ms;
  }

  :deep(a:hover div svg) {
    opacity: 1;
  }
</style>
