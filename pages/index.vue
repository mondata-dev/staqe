<script setup lang="ts">
  import { CaretRightSmallIcon } from '@nimiq/vue3-components';
</script>

<template>
  <div id="home" class="nq-card !m-0 !max-w-[100%] p-5">
    <div class="staqe-bg flex h-full flex-col px-12">
      <div class="my-auto flex max-w-[130rem] flex-col md:ml-44 md:items-start">
        <h1 class="mb-4 md:mb-24">Your personal staking service</h1>
        <p class="mb-12 max-w-[68rem] md:mb-24">
          Welcome to Staqe &ndash; the easy to use staking service for Nimiq.
          Have your own validator without the technical difficulties and start
          earning rewards.
        </p>
        <NuxtLink
          to="/get-started#get"
          class="nq-button !m-0 !h-[7.5rem] !normal-case !text-white"
        >
          <span class="nq-h1 !mr-6">Get started</span>
          <div class="!flex flex-col justify-center">
            <CaretRightSmallIcon class="-ml-1 !h-[3.5rem] !w-[3.5rem]" />
          </div>
        </NuxtLink>
      </div>
      <a href="#values" class="self-center">
        <CircularArrowButton arrow-classes="rotate-90" />
      </a>
    </div>
  </div>
  <div id="values" class="mt-40 flex min-h-[100vh] flex-col">
    <CoreValues />
    <a href="#how-it-works" class="mt-auto self-center">
      <CircularArrowButton arrow-classes="rotate-90" />
    </a>
  </div>
  <div id="how-it-works" class="mt-40 flex min-h-[100vh] flex-col">
    <SignUpSteps />
    <a href="#about-us" class="mt-auto hidden self-center">
      <CircularArrowButton arrow-classes="rotate-90" />
    </a>
  </div>
  <div id="about-us" class="hidden">
    <div style="display: flex; flex-direction: column; align-items: center">
      <h1>About Us</h1>
      <div style="display: flex">
        <div class="nq-card" style="margin-right: 4rem">
          <div class="nq-card-header">Open Source</div>
          <div class="nq-card-body">
            All of the code to run and operate Staqe is open source and can be
            used by anyone. Want to run your own staking service? No problem if
            you have the technical knowledge.
          </div>
          <div class="nq-card-footer">
            <a href="" class="nq-button-s">See team</a>
          </div>
        </div>
        <div class="nq-card">
          <div class="nq-card-header">Technology</div>
          <div class="nq-card-body">
            The project uses different languages and tools. Each suited best for
            its use. A detailed overview can be found on github.
            <p>
              Tools:<br />
              TS, Kubernetes, Nimiq, Docker, Rust
            </p>
          </div>
          <div class="nq-card-footer">
            <a href="" class="nq-button-s">Github</a>
          </div>
        </div>
      </div>
    </div>
    <a href="#home" class="nq-button-s anchor-button">
      <CaretRightSmallIcon style="transform: rotate(-90deg)" />
    </a>
  </div>
</template>

<style scoped>
  #home {
    height: calc(
      var(--staqe-full-height-with-header) - 2rem
    ); /* full height with some room for header and for bottom margin*/
  }

  .nq-button :deep(.nq-icon) path {
    stroke-width: 1;
  }
</style>
