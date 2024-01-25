<script setup lang="ts">
  import { LoadingSpinner } from '@nimiq/vue3-components';

  import { useNuxtApp } from '#app';
  import type { Client } from '@nimiq/core-web';
  import { Address } from '@nimiq/core-web';
  import type { Validator } from '~/utils/store';

  const {
    validatorAddress,
    validatorRewardAddress,
    votingPublicKey,
    signingPublicKey,
  } = defineProps<{
    validatorAddress: Address;
    validatorRewardAddress: Address;
    votingPublicKey: string;
    signingPublicKey: string;
  }>();
  const emit = defineEmits<{
    (e: 'validatorUpdated', validator: Validator): void;
  }>();

  const rewardAddress = ref(validatorRewardAddress);

  const canUpdate = computed(
    () => !!(rewardAddress.value && votingPublicKey && signingPublicKey),
  );

  const signing = ref(false);
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  const requireConsensus = inject(INJECTION_KEYS.requireConsensus);
  const sign = async function () {
    // should never happen because the sign button is disabled in those cases
    if (!rewardAddress.value || !votingPublicKey || !signingPublicKey)
      throw new Error('reward wallet or keys not set');

    if (!requireConsensus) {
      // throw error cannot wait for consensus
    } else {
      // additionally await this before proceeding to sign
      await requireConsensus();
    }

    try {
      signing.value = true;
      await updateValidatorPayoutAddress(validatorAddress, rewardAddress.value);

      // --- check validator has correct reward address ---
      let comparable_reward_address, comparable_reward_address2, newValidator;
      async function _checkValidator() {
        newValidator = await nimiqClient.getValidator(validatorAddress);
        comparable_reward_address = Address.fromAny(
          newValidator.rewardAddress,
        ).toPlain();
        comparable_reward_address2 = rewardAddress.value.toPlain();
      }
      await _checkValidator();
      while (comparable_reward_address !== comparable_reward_address2) {
        await sleep();
        await _checkValidator();
      }

      emit('validatorUpdated', newValidator!);
    } finally {
      signing.value = false;
    }
  };
</script>

<template>
  <div class="flex flex-col justify-center lg:flex-row">
    <sign-up-card class="lg:w-2/6">
      <template #header>Update your validator</template>
      <template #body>
        <p>
          Here you can change your reward address which is the destination of
          your staking rewards.
        </p>
      </template>
    </sign-up-card>
    <div class="nq-card lg:w-full">
      <div class="nq-card-body !p-6">
        <ConfigureValidator
          v-model:reward-address="rewardAddress"
          :hot-key="votingPublicKey"
          :warm-key="signingPublicKey"
          :address="validatorAddress"
          :disabled="signing"
          header="Update Validator"
        />
      </div>
      <div class="nq-card-footer flex !p-6">
        <div v-if="signing" class="!mb-12 !ml-24 !mr-16">
          Please wait while we update your reward address.
          <br />
          This might take a few minutes.
        </div>
        <LoadingSpinner v-if="signing" class="!mb-12 !ml-auto !mr-16" />
        <NextButton
          v-else
          class="!mb-12 !ml-auto md:!mr-16"
          :disabled="!canUpdate"
          @click="sign"
        >
          Update
        </NextButton>
      </div>
    </div>
  </div>
</template>
