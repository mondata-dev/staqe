import type { ConsensusState } from '@nimiq/core';
import { establishConsensus, initClient } from '~/plugins/nimiq/nFunctions';

export default defineNuxtPlugin({
  name: 'nimiq',
  // there should be no reason for other plugins to wait for the nimiq plugin to be initialized
  parallel: true,
  async setup(nuxtApp) {
    const nimiqClient = await initClient();
    establishConsensus(nimiqClient);

    const consensusState: Ref<undefined | ConsensusState> = ref(undefined);
    void nimiqClient.addConsensusChangedListener((state: ConsensusState) => {
      consensusState.value = state;
    });

    nuxtApp.provide(INJECTION_KEYS.nimiqClient, nimiqClient);
    nuxtApp.provide(INJECTION_KEYS.nimiqClientConsensusState, consensusState);

    const nimiqFatalError: Ref<boolean> = ref(false);
    nuxtApp.vueApp.provide(INJECTION_KEYS.nimiqFatalError, nimiqFatalError);

    const { displayConsensus, requireConsensus } = useConsensus();
    nuxtApp.vueApp.provide(INJECTION_KEYS.requireConsensus, requireConsensus);
    nuxtApp.vueApp.provide(INJECTION_KEYS.displayConsensus, displayConsensus);
    // TODO get rid of this
    window.NimiqClient = nimiqClient;
  },
});
