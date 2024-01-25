<script setup lang="ts">
  import { useNuxtApp } from '#app';
  import type { Address, Client } from '@nimiq/core-web';
  import { LoadingSpinner } from '@nimiq/vue3-components';

  const { validatorAddress } = defineProps<{
    validatorAddress: Address;
  }>();
  const emit = defineEmits<{
    (e: 'validatorDeleted'): void;
  }>();
  const signing = ref(false);
  const deleteFailed = ref(false);
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
      const tx = await deleteValidator(validatorAddress).catch((reason) => {
        deleteFailed.value = true;
        console.log('Delete failed ', reason);
      });
      console.log('Delete tx ', tx!.transactionHash);

      await useFetch(
        `/api/validator/delete/${validatorAddress.toUserFriendlyAddress()}`,
      ).catch(() => {
        console.log('Backend did not delete validator');
      });
      while (await nimiqClient.getValidator(validatorAddress)) {
        await sleep();
      }
      emit('validatorDeleted');
    } finally {
      signing.value = false;
    }
  };
</script>

<template>
  <div class="flex flex-col justify-center lg:flex-row">
    <sign-up-card>
      <template #header>Delete your validator</template>
      <template #body>
        <p>Your validator is retired. You can now proceed with deletion.</p>
        <div v-if="signing" class="!mb-12 !ml-24 !mr-16">
          Please wait while we delete your validator.
          <br />
          This might take a few minutes.
        </div>
        <div class="nq-card-footer flex !p-6">
          <LoadingSpinner v-if="signing" class="!mb-12 !ml-auto !mr-16" />
          <NextButton v-else class="!mb-12 !ml-auto md:!mr-16" @click="sign">
            Delete
          </NextButton>
        </div>
      </template>
    </sign-up-card>
  </div>
</template>
