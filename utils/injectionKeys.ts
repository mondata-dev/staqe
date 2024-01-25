// https://vuejs.org/guide/typescript/composition-api.html#typing-provide-inject

import type { InjectionKey } from 'vue';

export const INJECTION_KEYS = {
  nimiqClient: 'nimiqClient',
  nimiqClientConsensusState: 'nimiqClientConsensusState',
  // Awaiting this function is optional. Awaiting in setup might stop rendering and might even stop the wait-dialog
  // from appearing.
  requireConsensus: Symbol(
    'register nimiq consensus requirement',
  ) as InjectionKey<() => Promise<void>>,
  displayConsensus: 'displayConsensus',
  nimiqFatalError: 'nimiqError',
};
