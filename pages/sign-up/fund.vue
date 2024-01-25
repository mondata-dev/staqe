<script setup lang="ts">
  definePageMeta({
    middleware: defineNuxtRouteMiddleware(async (to, from) => {
      if (from.name === to.name) return navigateTo('/sign-up');

      const requireConsensus = inject(INJECTION_KEYS.requireConsensus);
      const nimiqFatalError = inject(INJECTION_KEYS.nimiqFatalError);
      if (!requireConsensus) {
        // throw error cannot wait for consensus
        console.error('Cannot inject(INJECTION_KEYS.requireConsensus)');
      } else {
        await requireConsensus();
        const hasFunds = await hasEnoughFundsForValidatorDeposit(
          store.validator.address!,
        ).catch(() => {
          nimiqFatalError.value = true;
          return false;
        });
        if (
          hasFunds ||
          (await isRegisteredValidator(store.validator.address!))
        ) {
          store.validator.funds = 1;
          return navigateTo('/sign-up/buy');
        }
      }
    }),
  });
  const fundWallet = async function () {
    try {
      await sendDepositToAddress(store.validator.address!);
      store.validator.funds = 1;
      navigateTo('buy');
    } catch (e) {
      console.log(`Error while funding validator: ${e}`);
    }
  };
</script>

<template>
  <sign-up-cta-image-card
    img-path="/img/fund_wallet.png"
    @cta-clicked="fundWallet"
  >
    <template #header>Fund the validator</template>
    <template #body>
      <p>
        To register your validator, you need to have at least 101,000 NIM on its
        address. Once you stop staking, you can withdraw these funds again. Only
        a negligible amount will be used to pay for transaction fees.
      </p>
    </template>
    <template #buttonCaption>Fund address</template>
  </sign-up-cta-image-card>
</template>
