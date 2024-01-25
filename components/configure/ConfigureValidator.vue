<script setup lang="ts">
  import type { Address } from '@nimiq/core-web';
  import { BLSKeyPair, KeyPair } from '@nimiq/core-web';
  import { DownloadIcon, KeysIcon } from '@nimiq/vue3-components';

  const { address, rewardAddress, hotKey, warmKey, disabled } = defineProps<{
    address?: Address;
    rewardAddress?: Address;
    hotKey?: BLSKeyPair | string;
    warmKey?: KeyPair | string;
    disabled: boolean;
    header: string;
  }>();
  const emit = defineEmits<{
    (e: 'update:rewardAddress', value: Address): void;
    (e: 'update:hotKey', value: BLSKeyPair): void;
    (e: 'update:warmKey', value: KeyPair): void;
  }>();

  const updateRewardAddress = async function () {
    emit('update:rewardAddress', await getAddressFromHubAPI());
  };
  const updateHotKey = function () {
    emit('update:hotKey', BLSKeyPair.generate());
  };
  const updateWarmKey = function () {
    emit('update:warmKey', KeyPair.generate());
  };
</script>

<template>
  <div
    class="staqe-bg-light-blue bg-left flex flex-col space-y-6 rounded-xl pb-24 pl-6 pr-6 pt-6 text-white md:pl-24 md:pr-12 md:pt-12"
  >
    <div class="flex items-center self-end">
      <span class="info-caption mr-10">{{ header }}</span>
      <info-balloon>
        <h4>Validator address</h4>
        <p class="w-[44rem]">
          This is the address of the validator you just created
        </p>
        <h4>Payout address</h4>
        <p class="w-[44rem]">The destination of the staking rewards</p>
        <h4>Signing/voting keys</h4>
        <p class="w-[44rem]">
          These keys are used by the validator to produce blocks
        </p>
      </info-balloon>
    </div>
    <div class="flex">
      <div class="w-3/5">
        <input-text
          :value="address?.toUserFriendlyAddress()"
          label="Validator address"
          readonly
        />
      </div>
      <SvgCheckCircle
        class="mt-20 !w-2/5"
        width="21"
        height="21"
        fill="white"
        inner-stroke="black"
        outer-stroke="white"
      />
    </div>
    <div class="flex">
      <div class="w-3/5">
        <input-text
          :value="rewardAddress?.toUserFriendlyAddress()"
          label="Payout address"
          readonly
        />
      </div>
      <SmallButton
        :disabled="disabled"
        class="inverse !mb-0 self-end md:w-[17rem]"
        @click="updateRewardAddress"
      >
        <DownloadIcon />
        <span class="ml-2 hidden md:block">{{
          rewardAddress ? 'Change' : 'Import'
        }}</span>
      </SmallButton>
    </div>
    <div class="flex">
      <div class="w-3/5">
        <input-text
          :value="hotKey?.toHex ? hotKey.toHex() : hotKey"
          label="Voting Keys"
          readonly
        />
      </div>
      <SvgCheckCircle
        v-if="hotKey"
        class="mt-20 !w-2/5"
        width="21"
        height="21"
        fill="white"
        inner-stroke="black"
        outer-stroke="white"
      />
      <SmallButton
        v-else
        :disabled="disabled"
        class="inverse !mb-0 self-end"
        @click="updateHotKey"
      >
        <KeysIcon />
        <span class="ml-2 hidden md:block">Generate</span>
      </SmallButton>
    </div>
    <div class="flex">
      <div class="w-3/5">
        <input-text
          :value="warmKey?.toHex ? warmKey.toHex() : warmKey"
          label="Signing Keys"
          readonly
        />
      </div>
      <SvgCheckCircle
        v-if="warmKey"
        class="mt-20 !w-2/5"
        width="21"
        height="21"
        fill="white"
        inner-stroke="black"
        outer-stroke="white"
      />
      <SmallButton
        v-else
        :disabled="disabled"
        class="inverse !mb-0 self-end"
        @click="updateWarmKey"
      >
        <KeysIcon />
        <span class="ml-2 hidden md:block">Generate</span>
      </SmallButton>
    </div>
  </div>
</template>
