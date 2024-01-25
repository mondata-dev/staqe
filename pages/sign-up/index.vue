<script setup lang="ts">
  const createWallet = async function () {
    store.validator.address = await newAddressFromHubAPI();
    navigateTo('sign-up/fund');
  };
</script>

<template>
  <sign-up-cta-image-card
    img-path="/img/create_wallet.png"
    @cta-clicked="createWallet"
  >
    <template #header>Create an address</template>
    <template #body>
      <p>
        To start staking, you need a validator. To register this validator on
        the blockchain, it needs a Nimiq address.
      </p>
      <p>
        You can choose one of your existing addresses, but we highly recommend
        to create a new address.
      </p>
    </template>
    <template #buttonCaption>Choose Address</template>
  </sign-up-cta-image-card>
</template>
