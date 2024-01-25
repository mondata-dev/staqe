<script setup lang="ts">
  import type { Address } from '@nimiq/core-web';

  const props = defineProps<{
    validatorAddress: Address;
  }>();
  function openAddStakeInWallet() {
    window.open(
      `https://wallet.pos.nimiq-testnet.com/staking?notworkingyet=${props.validatorAddress.toPlain()}`,
      '_blank',
      'noreferrer',
    );
  }
</script>

<template>
  <div class="flex flex-col justify-center lg:flex-row">
    <sign-up-card>
      <template #header>Delegate Stake</template>
      <template #body>
        <p>To delegate more funds to your validator select</p>
        <p>{{ validatorAddress.toUserFriendlyAddress() }}</p>
        <p>
          in the "Choose a validator" window in the wallet, select the amount
          and click "CONFIRM STAKE".
        </p>
        <div class="nq-card-footer flex !p-6">
          <NextButton
            class="!mb-12 !ml-auto md:!mr-16"
            @click="openAddStakeInWallet()"
          >
            Delegate stake
          </NextButton>
        </div>
      </template>
    </sign-up-card>
  </div>
</template>
