<!--
    Overview of a validator
    And the options to manage it.
    Update payout address
    Deactivate
-->

<script setup lang="ts">
  import type { Client, ConsensusState, PlainValidator } from '@nimiq/core';
  import { Address } from '@nimiq/core';
  import { CloseButton, LoadingSpinner } from '@nimiq/vue3-components';
  import { SERVICE_PRICE_USD } from '~/utils/nimiq-network';

  const props = defineProps<{
    initialValidatorAddress: string;
  }>();

  const showUpdateModal = ref(false);
  const showDeactivateDeleteModal = ref(false);
  const showDelegateStakeModal = ref(false);
  const paymentStatus = ref('');
  const totalReward = ref('');
  const totalRewardValue = ref('');
  async function updateValidatorPaymentStatus() {
    useFetch(`/api/validator/payment/${props.initialValidatorAddress}`)
      .then((response) => {
        paymentStatus.value = response.data.value.status as string;
      })
      .catch((error) => {
        console.error(error);
        paymentStatus.value = 'Unknown';
      });
  }

  async function updateValidatorTotalRewards() {
    useFetch(`/api/validator/rewards/${props.initialValidatorAddress}`)
      .then(async (response) => {
        totalReward.value = lunaToNim(response.data.value.status).toFixed(2);
        totalRewardValue.value = (
          (totalReward.value as number) * (await getNimPrice())
        ).toFixed(2);
      })
      .catch((error) => {
        console.error(error);
        totalReward.value = 'Unknown';
      });
  }

  async function extend() {
    try {
      const price = new Number(
        (SERVICE_PRICE_USD / (await getNimPrice())).toFixed(2),
      ).valueOf();
      await payForValidator(
        Address.fromAny(props.initialValidatorAddress),
        price,
      );
      updateValidatorPaymentStatus();
    } catch (e) {
      console.log(e);
    }
  }

  const requireConsensus = inject(INJECTION_KEYS.requireConsensus);
  if (!requireConsensus) {
    // throw error cannot wait for consensus
  } else {
    requireConsensus();
  }

  const validator: Ref<PlainValidator | undefined> = ref(undefined);
  const validatorValue = ref('');

  const allDataLoaded = computed(() => {
    return validator.value && paymentStatus.value !== '';
  });

  const nuxtApp = useNuxtApp();
  const nimiqClient = nuxtApp.$nimiqClient as Client;
  const nimiqClientConsensusState = nuxtApp.$nimiqClientConsensusState as Ref<
    undefined | ConsensusState
  >;

  watchEffect(() => {
    if (nimiqClientConsensusState.value === 'established')
      updateValidatorData();
  });

  const errorModal = ref(false);
  async function updateValidatorData() {
    const newValidator = await nimiqClient.getValidator(
      props.initialValidatorAddress,
    );
    if (newValidator) {
      newValidator.totalStake = lunaToNim(newValidator.totalStake);
      validator.value = newValidator;
      validatorValue.value = (
        validator.value.totalStake * (await getNimPrice())
      ).toFixed(2);
    } else {
      // Validator not registered.
      console.log('ERROR: Validator not registered');
      errorModal.value = true;
    }
    updateValidatorTotalRewards();
  }

  updateValidatorPaymentStatus();
</script>

<template>
  <ErrorModal
    v-if="errorModal"
    message="Sorry! This address is not a NIM validator"
    button-text="Back to Login"
    button-target="/manage"
  />
  <div class="nq-card flex !max-w-full flex-col !bg-[#F9F9F9] p-6 md:p-16">
    <template v-if="allDataLoaded">
      <div
        class="my-6 flex flex-wrap space-y-10 sm:my-0 md:flex-nowrap md:space-y-0"
      >
        <div class="flex flex-col space-y-10 md:w-7/12 md:p-16">
          <div class="flex items-center space-x-8">
            <h4>Validator</h4>
            <div v-if="validator.retired">
              <text style="color: darkred">Retired</text>
              <info-balloon :icon-props="{ class: 'opacity-60' }" class="ml-3">
                <p class="w-[46rem]">
                  This validator has been retired. It already has or will stop
                  producing blocks soon. After this, you can completely delete
                  it from the network.
                </p>
              </info-balloon>
            </div>
            <button
              class="nq-button-s"
              @click="showDeactivateDeleteModal = true"
            >
              Delete
            </button>
          </div>

          <ManageValidatorPageAddressSlip
            :address="props.initialValidatorAddress"
            info="This is the unique identifier for the validator"
          />

          <manage-validator-page-blue-box class="flex flex-wrap md:flex-nowrap">
            <div class="flex grow flex-col">
              <h6>Total Stake</h6>
              <ManageValidatorPageBoxHeader>
                {{ validator.totalStake.toFixed(2) }}
              </ManageValidatorPageBoxHeader>
              <ManageValidatorPageBoxLabel
                >${{ validatorValue }}
              </ManageValidatorPageBoxLabel>
            </div>
            <div class="flex grow flex-col">
              <div class="flex items-center justify-between">
                <h6>Total Stakers</h6>
                <info-balloon :icon-props="{ class: 'opacity-60' }">
                  <p class="w-[46rem]">
                    The number of addresses that have delegated their stake to
                    the validator and the total stake.
                  </p>
                  <p>
                    You can increase the total stake by clicking "Add your
                    stake" and delegating your NIMs to the validator.
                  </p>
                </info-balloon>
              </div>
              <ManageValidatorPageBoxHeader>{{
                validator.numStakers
              }}</ManageValidatorPageBoxHeader>
              <div>
                <!-- TODO impl, see https://gitlab.mondata.de/mondata/nimiq/staqe-app-nuxt/-/issues/33 -->
                <button
                  class="nq-button-pill"
                  @click="showDelegateStakeModal = true"
                >
                  Add your stake
                </button>
              </div>
            </div>
          </manage-validator-page-blue-box>
        </div>
        <div class="flex flex-col space-y-10 md:grow md:p-16">
          <div class="flex items-center space-x-8">
            <h4>Payout Address</h4>

            <!-- TODO fix update, see -->
            <button class="nq-button-s" @click="showUpdateModal = true">
              Update
            </button>
          </div>
          <ManageValidatorPageAddressSlip
            :address="validator.rewardAddress"
            info="The destination of the staking rewards"
          />

          <manage-validator-page-blue-box class="grow">
            <div class="flex flex-col">
              <div class="flex items-center justify-between">
                <h6>Total NIM payed out</h6>
                <info-balloon :icon-props="{ class: 'opacity-60' }">
                  <p class="w-[46rem]">
                    Total staking rewards sent to the current reward address.
                  </p>
                  <p>
                    <i
                      >Note: Does not account for reward address changes or
                      multiple validators with the same reward address.</i
                    >
                  </p>
                </info-balloon>
              </div>
              <ManageValidatorPageBoxHeader>{{
                totalReward
              }}</ManageValidatorPageBoxHeader>
              <ManageValidatorPageBoxLabel
                >${{ totalRewardValue }}</ManageValidatorPageBoxLabel
              >
            </div>
          </manage-validator-page-blue-box>
        </div>
      </div>
      <div
        class="my-6 flex flex-wrap space-y-10 sm:my-0 md:flex-nowrap md:space-y-0"
      >
        <div class="flex flex-col space-y-10 md:w-7/12 md:p-16">
          <div class="flex items-center space-x-10">
            <h4>Staking Keys</h4>
            <info-balloon :icon-props="{ class: 'opacity-60' }">
              <p class="w-[40rem]">
                These are the public keys that are used by the validator to
                produce blocks.
              </p>
              <p>
                The corresponding private keys where shown during the setup
                process of the validator.
              </p>
            </info-balloon>
          </div>
          <div class="mr-12 flex max-w-[60rem] flex-col space-y-12">
            <input-text
              :value="validator.votingPublicKey"
              label="Voting key"
              background-color="var(--nimiq-card-bg)"
              input-color="rgba(31, 35, 72, 0.55)"
              readonly
            />
            <input-text
              :value="validator.signingPublicKey"
              label="Signing key"
              background-color="var(--nimiq-card-bg)"
              input-color="rgba(31, 35, 72, 0.55)"
              readonly
            />
          </div>
        </div>
        <div class="flex flex-col space-y-10 md:grow md:p-16">
          <div class="flex items-center space-x-8">
            <h4>Status</h4>

            <button class="nq-button-s" @click="extend()">
              Extend one month
            </button>
            <info-balloon :icon-props="{ class: 'opacity-60' }">
              <p class="w-[40rem]">
                The status of the validator and the prepaid period if it runs at
                Staqe.
              </p>
              <p>
                By clicking "Extend one month" you can pay for another month of
                hosting the validator at Staqe. The price is $10 per month.
              </p>
            </info-balloon>
          </div>

          <manage-validator-page-blue-box dark-bg class="grow py-10">
            <div class="flex flex-col">
              <h6>Paid Till</h6>
              <ManageValidatorPageBoxHeader>{{
                paymentStatus
              }}</ManageValidatorPageBoxHeader>
            </div>
          </manage-validator-page-blue-box>
        </div>
      </div>
    </template>
    <div
      v-else
      class="flex h-[83rem] max-h-[70vh] flex-col items-center justify-center"
    >
      <LoadingSpinner height="200" width="200" />
      <p>Loading Validator...</p>
    </div>
  </div>
  <NQModal v-if="showUpdateModal" @close-modal="showUpdateModal = false">
    <CloseButton class="self-end" @click="showUpdateModal = false" />
    <UpdateValidator
      :validator-address="
        Address.fromUserFriendlyAddress(initialValidatorAddress)
      "
      :validator-reward-address="
        Address.fromUserFriendlyAddress(validator.rewardAddress)
      "
      :voting-public-key="validator.votingPublicKey"
      :signing-public-key="validator.signingPublicKey"
      @validator-updated="
        () => {
          validator = null;
          updateValidatorData();
          showUpdateModal = false;
        }
      "
    />
  </NQModal>

  <NQModal
    v-if="showDeactivateDeleteModal && !validator.retired"
    @close-modal="showDeactivateDeleteModal = false"
  >
    <CloseButton class="self-end" @click="showDeactivateDeleteModal = false" />
    <DeleteRetireValidator
      :validator-address="
        Address.fromUserFriendlyAddress(initialValidatorAddress)
      "
      @validator-retired="
        () => {
          validator = null;
          updateValidatorData();
          showDeactivateDeleteModal = false;
        }
      "
    />
  </NQModal>

  <NQModal
    v-if="showDeactivateDeleteModal && validator.retired"
    @close-modal="showDeactivateDeleteModal = false"
  >
    <CloseButton class="self-end" @click="showDeactivateDeleteModal = false" />
    <DeleteValidator
      :validator-address="
        Address.fromUserFriendlyAddress(initialValidatorAddress)
      "
      @validator-deleted="
        () => {
          validator = null;
          updateValidatorData();
          showDeactivateDeleteModal = false;
        }
      "
    />
  </NQModal>

  <NQModal
    v-if="showDelegateStakeModal"
    @close-modal="
      showDelegateStakeModal = false;
      updateValidatorData();
    "
  >
    <CloseButton class="self-end" @click="showDelegateStakeModal = false" />
    <ManageValidatorPageHowToStake
      :validator-address="
        Address.fromUserFriendlyAddress(initialValidatorAddress)
      "
    />
  </NQModal>

  <!--  <SmallPage v-if="false"> -->
  <!--    <div class="flex-hz-container"> -->
  <!--      <PageHeader> -->
  <!--        <h1>Staqe</h1> -->
  <!--      </PageHeader> -->

  <!--      <p>Validator Overview</p> -->
  <!--      <p>This is the validator overview</p> -->

  <!--      <div class="flex-hz-row"> -->
  <!--        <div> -->
  <!--          <p>Validator Address</p> -->

  <!--          <Account -->
  <!--            :label="props.initialValidatorAddress" -->
  <!--            :address="props.initialValidatorAddress" -->
  <!--          /> -->

  <!--          This is the unique identifier for the Validator -->
  <!--        </div> -->
  <!--        <div> -->
  <!--          <p> -->
  <!--            Payout Address -->
  <!--            <button class="nq-button-s" @click="showUpdateModal = true"> -->
  <!--              Update -->
  <!--            </button> -->
  <!--            <UpdateModal -->
  <!--              v-if="showUpdateModal" -->
  <!--              :address="props.initialValidatorAddress" -->
  <!--              @close-modal="showUpdateModal = false" -->
  <!--              @configure-getting-ready=" -->
  <!--                (addressp, payoutp) => { -->
  <!--                  showUpdateGettingReadyModal = true; -->
  <!--                  address = addressp; -->
  <!--                  payout = payoutp; -->
  <!--                } -->
  <!--              " -->
  <!--            /> -->
  <!--            <UpdateGettingReadyModal -->
  <!--              v-if="showUpdateGettingReadyModal" -->
  <!--              :address="address" -->
  <!--              :payout="payout" -->
  <!--              @close-modal=" -->
  <!--                showUpdateGettingReadyModal = false; -->
  <!--                updateValidatorData(); -->
  <!--              " -->
  <!--            /> -->
  <!--          </p> -->
  <!--          <Account -->
  <!--            :label="validator.rewardAddress" -->
  <!--            :address="validator.rewardAddress" -->
  <!--          /> -->

  <!--          The destination of the staking rewards -->
  <!--        </div> -->
  <!--      </div> -->
  <!--      <div class="flex-hz-row-border" /> -->
  <!--      <div class="flex-hz-row"> -->
  <!--        <div> -->
  <!--          <p>Staking Keys</p> -->
  <!--          <p> -->
  <!--            <b>Hot</b> {{ `${validator.signingPublicKey.substring(0, 10)}...` }} -->
  <!--          </p> -->
  <!--          <p> -->
  <!--            <b>Warm</b> {{ `${validator.votingPublicKey.substring(0, 10)}...` }} -->
  <!--          </p> -->
  <!--        </div> -->
  <!--        <div> -->
  <!--          <p>These keys are used by the</p> -->
  <!--          <p>validator to produce blocks.</p> -->
  <!--        </div> -->
  <!--      </div> -->
  <!--      <div class="flex-hz-row-border" /> -->
  <!--      <div class="flex-hz-row"> -->
  <!--        <div> -->
  <!--          <p>Staking Stats</p> -->
  <!--          Stakers {{ validator.numStakers }} -->
  <!--        </div> -->
  <!--        <p>Total Stake <Amount :amount="validator.totalStake" /></p> -->
  <!--      </div> -->
  <!--      The number of Addresses that have delegated their stake to the validator -->
  <!--      and the total stake -->
  <!--      <div class="flex-hz-row-border" /> -->
  <!--      <div class="flex-hz-row"> -->
  <!--        <div> -->
  <!--          <p>Status</p> -->
  <!--          {{ validator.retired ? 'Retired' : 'Active' }} -->
  <!--          <button class="nq-button-s" @click="showDeactivateModal = true"> -->
  <!--            Delete -->
  <!--          </button> -->
  <!--          <DeleteDeactivateModal -->
  <!--            v-if="showDeactivateModal" -->
  <!--            :address="props.initialValidatorAddress" -->
  <!--            @deactivate-getting-ready="showDeactivateGettingReadyModal = true" -->
  <!--            @close-modal="showDeactivateModal = false" -->
  <!--          /> -->
  <!--          <DeleteDeactivateGettingReadyModal -->
  <!--            v-if="showDeactivateGettingReadyModal" -->
  <!--            :address="props.initialValidatorAddress" -->
  <!--            @close-modal="showDeactivateGettingReadyModal = false" -->
  <!--            @deactivate-success="showDeleteModal = true" -->
  <!--          /> -->

  <!--          <DeleteModal -->
  <!--            v-if="showDeleteModal" -->
  <!--            :address="props.initialValidatorAddress" -->
  <!--            @delete-getting-ready="showDeleteGettingReadyModal = true" -->
  <!--            @close-modal="showDeleteModal = false" -->
  <!--          /> -->
  <!--          <DeleteGettingReadyModal -->
  <!--            v-if="showDeleteGettingReadyModal" -->
  <!--            :address="props.initialValidatorAddress" -->
  <!--            @close-modal="showDeleteGettingReadyModal = false" -->
  <!--          /> -->
  <!--        </div> -->
  <!--        <p>Paid til: {{ 'DUMMY MARCH 2023' }}</p> -->
  <!--      </div> -->
  <!--      The status of the validator and the prepaid period if it runs at Staqe. -->
  <!--    </div> -->
  <!--  </SmallPage> -->
</template>

<style scoped>
  h4 {
    margin: 0;
  }

  h6 {
    margin: 1.5rem 0;
  }

  .text-white .nq-button-pill {
    @apply bg-[--nimiq-white] bg-none text-[--nimiq-light-blue];
  }
</style>
