import type { Client, ConsensusState } from '@nimiq/core-web';
import { useNuxtApp } from '#app';

export function useConsensus() {
  const nuxtApp = useNuxtApp();
  const nimiqClient = nuxtApp.$nimiqClient as Client;
  const nimiqClientConsensusState = nuxtApp.$nimiqClientConsensusState as Ref<
    undefined | ConsensusState
  >;
  const consensusRequired = ref(false);
  // Awaiting this function is optional. Awaiting in setup might stop rendering and might even stop the wait-dialog
  // from appearing.
  async function requireConsensus() {
    consensusRequired.value = true;
    await nimiqClient.waitForConsensusEstablished();
  }

  const displayConsensus = computed(() => {
    return (
      consensusRequired.value &&
      nimiqClientConsensusState.value !== 'established'
    );
  });
  return { displayConsensus, requireConsensus };
}
