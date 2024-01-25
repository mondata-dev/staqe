<script setup lang="ts">
  import { AddressDisplay } from '@nimiq/vue3-components';
  import { SERVICE_PRICE_USD } from '~/utils/nimiq-network';

  definePageMeta({
    middleware: defineNuxtRouteMiddleware(async (to, from) => {
      if (from.name === to.name) return navigateTo('/sign-up');

      const { data } = await useFetch(
        `/api/validator/payment/${store.validator.address!.toUserFriendlyAddress()}`,
      );
      const paidTil = data.value ? new Date(data.value.status) : 0;
      if (paidTil > new Date()) {
        store.validator.paid = true;
        return navigateTo('/sign-up/configure');
      }
    }),
  });

  const showPlaceOrderWarning = ref(false);
  const price = Number.parseFloat(
    (SERVICE_PRICE_USD / (await getNimPrice())).toFixed(2),
  );

  async function buy() {
    try {
      await payForValidator(store.validator.address!, price);
      store.validator.paid = true;
      navigateTo('configure');
    } catch (e) {
      console.log(`Error while paying for validator: ${e}`);
    }
  }
</script>

<template>
  <div class="flex flex-col justify-center lg:flex-row">
    <sign-up-card class="lg:w-2/6">
      <template #header>Pay for your validator</template>
      <template #body>
        <p>
          Hosting your validator at Staqe costs $10 per month. You pay in NIM
          for one month in advance.
        </p>
      </template>
    </sign-up-card>
    <div v-if="!showPlaceOrderWarning" class="nq-card lg:w-full">
      <div class="nq-card-body !p-6">
        <div
          class="staqe-bg-light-blue flex flex-col rounded-xl p-6 text-white md:py-12 md:pl-24 md:pr-12"
        >
          <div class="flex items-center self-end">
            <span class="info-caption mr-10">Order validator</span>
            <info-balloon>
              <h4>Order validator</h4>
              <p class="w-[44rem]">
                After you paid for the first month you can extend the service
                via our management dashboard.
              </p>
            </info-balloon>
          </div>
          <div class="my-6 flex max-w-xl flex-col space-y-4 pl-[1.4375rem]">
            <label for="amount"> Costs for one month </label>
            <span id="amount" class="stq-card-header-large-font">
              {{ price }} NIM
            </span>
          </div>
          <InputText
            :value="store.validator.address?.toUserFriendlyAddress()"
            label="Address of your validator"
            readonly
            class="mb-12 mt-6 max-w-xl"
          />
        </div>
      </div>
      <div class="nq-card-footer !p-6">
        <NextButton
          class="!mb-12 !ml-auto md:!mr-16"
          @click="showPlaceOrderWarning = true"
        >
          Order validator
        </NextButton>
      </div>
    </div>
    <div v-else class="nq-card w-full !p-6">
      <div class="nq-card-body staqe-bg-orange rounded-xl !px-0 !pt-12">
        <div class="flex flex-col space-y-4 pl-24 pr-12 text-white">
          <div class="flex items-center self-end">
            <span class="info-caption mr-10">Order validator</span>
            <info-balloon>
              <h4>Confirm Validator</h4>
              <p class="w-[44rem]">
                Confirm this is the correct address for your validator before
                buying it.
              </p>
            </info-balloon>
          </div>
          <span id="amount" class="stq-card-header-large-font !text-white">
            Confirm your validator's address!
          </span>
          <AddressDisplay
            :address="
              store.validator.address
                ? store.validator.address.toUserFriendlyAddress()
                : ''
            "
          />
          <NextButton class="light-blue !ml-auto !mt-8" @click="buy">
            Pay now
          </NextButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  :deep(span.chunk) {
    color: white;
    opacity: 0.7;
  }
</style>
