// store.js

import type { Address, BLSKeyPair, KeyPair } from '@nimiq/core-web';

export interface Validator {
  address?: Address;
  rewardAddress?: Address;
  hotKey?: BLSKeyPair;
  warmKey?: KeyPair;
  funds?: number;
  signed?: boolean;
  paid?: boolean;
}

export const store: {
  validator: Validator;
} = reactive({
  validator: {},
});
