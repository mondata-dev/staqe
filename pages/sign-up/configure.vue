<script setup lang="ts">
  import { LoadingSpinner } from '@nimiq/vue3-components';

  import { useNuxtApp } from '#app';
  import type { Client } from '@nimiq/core';

  definePageMeta({
    middleware: defineNuxtRouteMiddleware(async (to, from) => {
      if (from.name === to.name) return navigateTo('/sign-up');
    }),
  });

  const canCreate = computed(
    () =>
      !!(
        store.validator.rewardAddress &&
        store.validator.hotKey &&
        store.validator.warmKey
      ),
  );

  const signing = ref(false);
  const errorModal = ref(false);
  const errorModalNotEnoughFunds = ref(false);
  const requireConsensus = inject(INJECTION_KEYS.requireConsensus);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  let nimiqFatalError = inject(INJECTION_KEYS.nimiqFatalError);
  const sign = async function () {
    // should never happen because the sign button is disabled in those cases
    if (
      !store.validator.rewardAddress ||
      !store.validator.warmKey ||
      !store.validator.hotKey
    )
      throw new Error('reward wallet or keys not set');

    const nimiqClient = useNuxtApp().$nimiqClient as Client;
    const sender = store.validator.address!;

    if (!requireConsensus) {
      // throw error cannot wait for consensus
    } else {
      // additionally await this before proceeding to sign
      await requireConsensus();
    }
    let tx;
    try {
      signing.value = true;

      if (!(await isRegisteredValidator(store.validator.address!))) {
        if (
          !(await hasEnoughFundsForValidatorDeposit(
            store.validator.address!,
          ).catch(() => {
            nimiqFatalError = true;
            throw new Error('fatal error');
          }))
        ) {
          errorModalNotEnoughFunds.value = true;
          signing.value = false;
          return;
        }
      }

      tx = await registerValidator(
        store.validator.address!,
        store.validator.rewardAddress!,
        store.validator.warmKey!,
        store.validator.hotKey!,
      );
      console.log(`Register Transaction: ${tx.transactionHash}`);
    } catch (e) {
      console.log(e);
      console.log('registration failed');
      signing.value = false;
      errorModal.value = true;
      return;
    }

    console.log('checking registration');
    // check validator registration
    let validator = await nimiqClient.getValidator(sender);
    while (!validator) {
      await sleep();
      validator = await nimiqClient.getValidator(sender);
    }

    console.log('spinning up validator');
    // spin up validator
    await useFetch(
      `/api/validator/create/${sender.toUserFriendlyAddress()}?signing_key=${store.validator.warmKey!.toHex()}&voting_key=${store.validator.hotKey!.toHex()}&transaction_hash=${
        tx.transactionHash
      }`,
    );

    console.log('checking validator up');
    // check validator up
    let resp = await useFetch(
      `/api/validator/status/${sender.toUserFriendlyAddress()}`,
    );
    while (resp.data.value?.status !== 'running') {
      await sleep();
      resp = await useFetch(
        `/api/validator/status/${sender.toUserFriendlyAddress()}`,
      );
    }
    console.log('done');
    store.validator!.signed = true;
    navigateTo('done');
  };
</script>

<template>
  <ErrorModal
    v-if="errorModal"
    message="Sorry! Something went wrong. Please try again later or contact our support at support@staqe.io"
    button-text="Close"
    button-target=""
    button-close="true"
    @close="errorModal = false"
  />
  <ErrorModal
    v-if="errorModalNotEnoughFunds"
    message="Sorry, this address does not have a sufficient amount for registering a validator. Please ensure that your wallet contains at least 101000 NIM"
    button-text="Back to Fund Validator"
    button-target="/sign-up/fund"
  />
  <div class="flex flex-col justify-center lg:flex-row">
    <sign-up-card class="lg:w-2/6">
      <template #header>Configure your validator</template>
      <template #body>
        <p>
          Congratulations, you now own a validator. Your final step is to
          configure it with your desired payout address. This will be the
          destination of the staking rewards.
        </p>
        <p>
          Signing and voting keys are used by the validator to produce blocks.
          These keys belong to the validator. No money can be accessed with
          these keys.
        </p>
      </template>
    </sign-up-card>
    <div class="nq-card lg:w-full">
      <div class="nq-card-body !p-6">
        <ConfigureValidator
          v-model:reward-address="store.validator.rewardAddress"
          v-model:hot-key="store.validator.hotKey"
          v-model:warm-key="store.validator.warmKey"
          :address="store.validator.address"
          :disabled="signing"
          header="Create Validator"
        />
      </div>
      <div class="nq-card-footer flex !p-6">
        <div v-if="signing" class="!mb-12 !ml-24 !mr-16">
          Please wait while we deploy your validator.
          <br />
          This might take a few minutes.
        </div>
        <LoadingSpinner v-if="signing" class="!mb-12 !ml-auto !mr-16" />
        <NextButton
          v-else
          class="!mb-12 !ml-auto md:!mr-16"
          :disabled="!canCreate"
          @click="sign"
        >
          Create
        </NextButton>
      </div>
    </div>
  </div>
</template>
