<script setup lang="ts">
  import { DownloadIcon } from '@nimiq/vue3-components';

  async function getAddress() {
    store.validator.address = await getAddressFromHubAPI();
  }
</script>

<template>
  <div
    class="flex h-full !min-h-[calc(100vh-140px)] w-full items-center justify-center"
  >
    <div class="nq-card w-full !p-6">
      <div class="staqe-bg-blue rounded-xl p-0 text-white md:p-12">
        <div class="nq-card-header stq-card-header-large-font !text-start">
          Manage your Validator
        </div>
        <div class="nq-card-body">
          <div class="flex">
            <div id="input-container" class="md:w-3/5">
              <input-text
                :value="store.validator.address?.toUserFriendlyAddress()"
                label="Validator address"
                background-color="#4B4E71"
                readonly
              />
            </div>
            <SmallButton
              class="inverse !mb-0 !ml-4 self-end md:!ml-auto"
              @click="getAddress"
            >
              <DownloadIcon />
              <span class="ml-2 hidden md:block">{{
                store.validator.address ? 'Change' : 'Import'
              }}</span>
            </SmallButton>
          </div>
        </div>
        <div class="nq-card-footer flex !pt-12">
          <NuxtLink
            class="!mb-12 !mr-4 ml-auto no-underline md:!mr-24"
            :to="`/manage/${store.validator.address?.toPlain()}`"
          >
            <NextButton
              :disabled="!store.validator.address"
              class="light-blue"
              :class="{ inverse: !store.validator.address }"
            >
              Manage
            </NextButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  #input-container {
    /* prevent container from growing out of bounds. Subtract button width. */
    max-width: calc(100% - 40px);
  }
</style>
