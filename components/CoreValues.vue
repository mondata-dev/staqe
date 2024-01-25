<script setup lang="ts">
  import { KeysIcon } from '@nimiq/vue3-components';
  import SvgHexagonFractured from '~/components/svg/SvgHexagonFractured.vue';
  import SvgHexagonCircle from '~/components/svg/SvgHexagonCircle.vue';

  const values = [
    {
      color: 'staqe-bg-plain-blue',
      cover: {
        icon: SvgHexagonFractured,
        text: 'Is Staqe a pool?',
      },
      content: {
        firstParagraph: {
          title: 'Is Staqe a pool?',
          text: 'Staqe is not a pool but allows you to have your own validator without technical knowledge or having to run your computer 24/7.',
        },
        secondParagraph: {
          title: 'Decentralized benefits',
          text: 'There are plenty of benefits for the network when having more validators such as better decentralization which means better security and reliability as if one node fails there are enough others to handle the task.',
        },
      },
    },
    {
      color: 'staqe-bg-plain-green',
      cover: { icon: KeysIcon, text: 'How is Staqe secure?' },
      content: {
        firstParagraph: {
          title: 'How is Staqe secure?',
          text: 'Staqe only operates the software on your behalf. We never have access to your funds or the rewards. To produce the blocks for you we only need you to sign off the rights to us to produce blocks. Nothing else.',
        },
        secondParagraph: {
          title: 'German Regulations',
          text: 'We comply with German crypto regulations. Because we do not have access to your funds, there is no need for us to have a crypto storage license.',
        },
      },
    },
    {
      color: 'staqe-bg-plain-light-blue',
      cover: { icon: SvgHexagonCircle, text: 'Additional benefits' },
      content: {
        firstParagraph: {
          title: 'User benefits',
          text: 'When staking, a fee of 5% (estimated pool fee) seems small but when owning larger amounts of NIM the fees will be a substantial amount of money.',
        },
        secondParagraph: {
          title: 'Financial benefits',
          text: 'Instead of taking a cut of the rewards we take a fixed fee for operating the validator nodes. This means for the user that our service is financially beneficial for the user once an amount of ~$35k is staked (in comparison to the average pool fees; based on $10 validator, 7% reward, 5% pool fee).',
        },
      },
    },
  ];

  const revealedCards = ref([false, false, false]);
</script>

<template>
  <div class="flex flex-col items-center">
    <h3 class="my-6">Decentralization is our core value</h3>
    <h4 class="my-0">Click on one of the icons below to see information</h4>
    <div
      class="mt-8 flex w-full grow flex-col items-center justify-center lg:flex-row lg:items-start"
    >
      <div
        v-for="(v, i) in values"
        :key="i"
        :class="`nq-card w-full p-4 lg:w-1/3 ${
          revealedCards[i] ? '' : 'h-fit'
        }`"
      >
        <RevealCard
          v-model="revealedCards[i]"
          :class="`m-0 !shadow-none transition-colors duration-500 ${
            revealedCards[i] ? `${v.color} h-full` : ``
          }`"
        >
          <template #cover>
            <div
              :class="`cover flex cursor-pointer flex-col items-center justify-center space-y-16 p-2 transition-colors duration-500 lg:space-y-44 hover:${v.color} h-[30rem] rounded-xl hover:text-white lg:h-[50rem]`"
            >
              <component :is="v.cover.icon" class="icon opacity-30" />

              <button class="nq-button-s h-[5rem] !min-w-[50%] !rounded-full">
                {{ v.cover.text }}
              </button>
            </div>
          </template>
          <template #content>
            <div class="text-white">
              <p class="stq-p-title">
                {{ v.content.firstParagraph.title }}
              </p>
              <p class="stq-p">{{ v.content.firstParagraph.text }}</p>
              <p class="stq-p-title">{{ v.content.secondParagraph.title }}</p>
              <p class="stq-p">{{ v.content.secondParagraph.text }}</p>
            </div>
          </template>
        </RevealCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
  /* fight tailwind's class stripping as it does not understand our conditional class in the template */
  .hover-staqe-bg-plain-blue {
    @apply hover:staqe-bg-plain-blue;
  }
  .hover-staqe-bg-plain-green {
    @apply hover:staqe-bg-plain-green;
  }
  .hover-staqe-bg-plain-light-blue {
    @apply hover:staqe-bg-plain-light-blue;
  }

  /* nq-button-s .inverse */
  .cover:hover .nq-button-s {
    background: rgba(255, 255, 255, 0.2);
    color: var(--nimiq-white);
  }

  :deep(.close-button) {
    color: var(--nimiq-white);
  }

  .icon {
    height: 18rem;
    width: 18rem;
  }
</style>
