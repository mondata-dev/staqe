<script setup lang="ts">
  import { LoadingSpinner } from '@nimiq/vue3-components';
  import { useNuxtApp } from '#app';
  import type { Address, Client } from '@nimiq/core-web';

  const { validatorAddress } = defineProps<{
    validatorAddress: Address;
  }>();
  const emit = defineEmits<{
    (e: 'validatorRetired'): void;
  }>();
  const signing = ref(false);
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  const requireConsensus = inject(INJECTION_KEYS.requireConsensus);
  const sign = async function () {
    if (!requireConsensus) {
      // throw error cannot wait for consensus
    } else {
      // additionally await this before proceeding to sign
      await requireConsensus();
    }

    try {
      signing.value = true;
      await retireValidator(validatorAddress);
      while (!(await nimiqClient.getValidator(validatorAddress)).retired) {
        await sleep();
      }
      emit('validatorRetired');
    } finally {
      signing.value = false;
    }
  };
</script>

<template>
  <div class="flex flex-col justify-center lg:flex-row">
    <sign-up-card>
      <template #header>Retire your validator</template>
      <template #body>
        <p>
          Before a validator can be deleted it needs to be retired for 2 epochs.
          Continue to queue your validator for retirement.
        </p>
        <div v-if="signing" class="!mb-12 !ml-24 !mr-16">
          Please wait while we retire your validator.
          <br />
          This might take a few minutes.
        </div>
        <div class="nq-card-footer flex !p-6">
          <LoadingSpinner v-if="signing" class="!mb-12 !ml-auto !mr-16" />
          <NextButton v-else class="!mb-12 !ml-auto md:!mr-16" @click="sign">
            Retire
          </NextButton>
        </div>
      </template>
    </sign-up-card>
  </div>
</template>
