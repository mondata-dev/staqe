<script setup lang="ts">
  import CircularArrowButton from '~/components/CircularArrowButton.vue';

  const entries = [
    {
      title: 'Create an address',
      ps: [
        'To start staking, you need a validator. To register this validator on the blockchain, it needs a Nimiq address. ',
        'You can choose one of your existing addresses, but we highly recommend to create a new address. ',
      ],
      img: '/img/create_wallet.png',
    },
    {
      title: 'Fund the validator',
      ps: [
        'To register your validator, you need to have at least 101,000 NIM on its address. Once you stop staking, you can withdraw these funds again. Only a negligible amount will be used to pay for transaction fees.',
      ],
      img: '/img/fund_wallet.png',
    },
    {
      title: 'Pay for your validator',
      ps: [
        'Hosting your validator at Staqe costs $10 per month. You pay in NIM for one month in advance. ',
      ],
      img: '/img/pay_for_validator.png',
    },
    {
      title: 'Configure the Validator',
      ps: [
        'Your final step is to configure your validator with your desired payout address. This will be the destination of the staking rewards.',
        'Also, you will generate signing and voting keys that are used by the validator to produce blocks. These keys belong to the validator. No money can be accessed with these keys.',
      ],
      img: '/img/configure_validator.png',
    },
    {
      title: 'Check Validator',
      ps: [
        "Once your new validator is up and running you can check the state by logging in with it's address.",
      ],
      img: '/img/manage_validator.png',
    },
  ];

  const selectedIndex = ref(0);
  const selected = computed(() => entries[selectedIndex.value]);
</script>

<template>
  <div class="flex flex-col items-center">
    <h3 class="my-6">How it works</h3>
    <h4 class="my-0 text-center">
      To get your validator up and running, there are a few steps to take
    </h4>
    <div class="nq-card !mt-20 !max-w-[150rem] p-8 md:p-20">
      <div class="nq-card-body flex">
        <div class="flex flex-col md:mx-24">
          <div class="nq-card-header !px-0 !text-start">
            {{ selected.title }}
          </div>
          <div class="nq-card-body !px-0">
            <p v-for="p in selected.ps" :key="p">{{ p }}</p>
          </div>
          <div class="nq-card-footer mt-auto flex justify-between !px-0 !py-12">
            <div class="flex space-x-8">
              <CircularArrowButton
                arrow-classes="rotate-180"
                class="nq-light-blue-bg"
                :disabled="selectedIndex === 0"
                @click="selectedIndex--"
              />
              <CircularArrowButton
                class="nq-light-blue-bg"
                :disabled="selectedIndex === entries.length - 1"
                @click="selectedIndex++"
              />
            </div>
            <span class="stq-p">
              {{ selectedIndex + 1 }}/{{ entries.length }}
            </span>
          </div>
        </div>
        <div class="-mr-24 hidden md:block">
          <img
            class="mt-32 w-[44rem] rounded-2xl shadow-lg lg:w-[62rem] xl:w-[78rem]"
            :src="selected.img"
            alt="example picture"
          />
        </div>
      </div>
    </div>
  </div>
</template>
