<template>
  <div class="flex flex-col justify-center lg:flex-row">
    <sign-up-card class="lg:w-2/6">
      <template #header>
        <div class="flex items-center">
          You are done!
          <img
            class="ml-12"
            src="/img/done_hands.png"
            alt="A pair of hands rubbing each other"
          />
        </div>
      </template>
      <template #body>
        <p>
          Now your new validator is up and running. You can check the state of
          your validator by logging in with it's address. It may need some time
          for it to produce its first blocks.
        </p>
      </template>
    </sign-up-card>
    <div class="nq-card !p-6 lg:w-full">
      <div class="staqe-bg-blue rounded-xl p-0 text-white md:p-12">
        <div class="nq-card-header stq-card-header-large-font !text-start">
          Login with your validator
        </div>
        <div class="nq-card-body md:mr-6">
          <input-text
            label="Validator address"
            :value="store.validator.address?.toUserFriendlyAddress()"
            background-color="#4B4E71"
            readonly
          />
        </div>
        <div class="nq-card-footer flex">
          <NuxtLink
            class="!mb-12 !ml-auto !mr-6 no-underline md:!mr-16"
            :to="`/manage/${store.validator.address?.toPlain()}`"
          >
            <NextButton class="light-blue"> Login </NextButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
