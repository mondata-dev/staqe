<script setup lang="ts">
  import { ArrowLeftIcon } from '@nimiq/vue3-components';

  const displayConsensus = inject(INJECTION_KEYS.displayConsensus);
  const nimiqFatalError = inject(INJECTION_KEYS.nimiqFatalError);
  const appContainer = ref(null);
  watchEffect(() => {
    globalRefs.appContainer = appContainer.value;
  });
</script>

<template>
  <header class="flex flex-nowrap items-center">
    <div class="flex flex-nowrap items-center">
      <ArrowLeftIcon
        :class="{ invisible: $route.path === '/' }"
        class="mr-5 cursor-pointer opacity-30"
        @click="$router.back"
      />
      <NuxtLink to="/" class="hidden md:block">
        <img src="/img/logo.svg" alt="Staqe Logo" />
      </NuxtLink>
      <NuxtLink to="/" class="md:hidden">
        <img src="/img/staqe-small.svg" alt="Staqe Logo" />
      </NuxtLink>
    </div>
    <div v-if="$route.path === '/'" class="ml-auto">
      <NuxtLink to="/manage">
        <button class="nq-button-s light-blue">Login</button>
      </NuxtLink>
      <NuxtLink to="/get-started#get">
        <button class="nq-button-pill light-blue ml-5">Get Validator</button>
      </NuxtLink>
    </div>
  </header>
  <main
    ref="appContainer"
    class="w-full self-center"
    :class="{ 'max-w-screen-xl': $route.path !== '/' }"
  >
    <WaitForChainModal v-if="displayConsensus" />
    <ErrorModal
      v-if="nimiqFatalError"
      message="Sorry! Something went wrong. Please refresh the page to try again."
      button-text="Refresh"
      button-target=""
      @close="reloadNuxtApp()"
    />
    <slot />
  </main>
  <footer class="hidden items-center justify-between px-20 py-16 sm:flex">
    <img src="/img/logo.svg" alt="Staqe Logo" />
    <div class="flex flex-col items-center">
      <span>© 2023 MONDATA GmbH</span>
      <a href="https://mondata.de">mondata.de</a>
    </div>
    <div class="flex flex-col">
      <NuxtLink to="/terms">Terms of Service</NuxtLink>
      <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
      <NuxtLink to="/impressum">Impressum</NuxtLink>
    </div>
  </footer>
  <footer class="flex flex-col px-10 py-8 sm:hidden">
    <div class="flex justify-center space-x-12">
      <img src="/img/logo.svg" alt="Staqe Logo" />
      <div class="flex flex-col">
        <NuxtLink to="/terms">Terms of Service</NuxtLink>
        <NuxtLink to="/privacy">Privacy Policy</NuxtLink>
        <NuxtLink to="/impressum">Impressum</NuxtLink>
      </div>
    </div>
    <div class="mt-12 flex flex-col items-center">
      <span>© 2023 MONDATA GmbH</span>
      <a href="https://mondata.de">mondata.de</a>
    </div>
  </footer>
</template>
