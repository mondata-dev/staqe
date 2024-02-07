import type { Client, PublicKey } from '@nimiq/core-web';
import {
  Address,
  BLSKeyPair,
  KeyPair,
  TransactionBuilder,
} from '@nimiq/core-web';
import { nimToLuna } from './currency';
import { getHubAPI } from './hub';

const DEPOSIT = nimToLuna(101 * 1000); /* 101.000 NIM */
export const SERVICE_PRICE_USD = 10;

/**
 * Opens the Hub API with a prefilled transaction to fund the given address with enough validator funds.
 * @param address
 * @returns
 */

export async function sendDepositToAddress(address: Address) {
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  const account = await nimiqClient.getAccount(address);
  if (account.balance >= DEPOSIT) {
    return;
  }
  const hubApi = getHubAPI();
  const options = {
    appName: 'Staqe',
    recipient: address.toPlain(),
    value: DEPOSIT - account.balance,
  };
  const signedTx = await hubApi.checkout(options);
  await nimiqClient.waitForConsensusEstablished();
  return await nimiqClient.sendTransaction(signedTx.serializedTx);
}

export async function payForValidator(
  validatorAddress: Address,
  amount: number,
) {
  const hubApi = getHubAPI();
  const staqeData = `Staqe,${validatorAddress.toPlain()}`;
  return await hubApi.checkout({
    appName: 'Staqe Pay',
    recipient: 'NQ70 HA7G 4TYD TUVA QH6J 7R4A KRES 6NMB 958J',
    value: nimToLuna(amount),
    extraData: staqeData,
  });
}

/**
 * Registeres a validator or updated the details if already exists
 * Hub is opened to sign the transaction
 * @param validatorAddress
 * @param rewardAddress
 * @param warmKey
 * @param hotKey
 */
export async function registerValidator(
  validatorAddress: Address,
  rewardAddress: Address,
  warmKey: KeyPair,
  hotKey: BLSKeyPair,
) {
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  const networkID = await nimiqClient.getNetworkId();
  const update =
    (await nimiqClient.getValidator(validatorAddress)) !== undefined;

  const sender: Address = Address.fromUserFriendlyAddress(
    validatorAddress.toUserFriendlyAddress(),
  );
  const reward_address: Address = Address.fromUserFriendlyAddress(
    rewardAddress.toUserFriendlyAddress(),
  );
  const signing_key: PublicKey = KeyPair.unserialize(
    warmKey.serialize(),
  ).publicKey;
  const voting_key_pair: BLSKeyPair = BLSKeyPair.unserialize(
    hotKey.serialize(),
  );

  await nimiqClient.waitForConsensusEstablished();

  const validity_start_height = (await nimiqClient.getHeadHeight()) + 1;
  let validator_transaction;
  if (update) {
    console.log('updating existing validator');
    validator_transaction = TransactionBuilder.newUpdateValidator(
      sender,
      reward_address,
      signing_key,
      voting_key_pair,
      undefined,
      BigInt(0),
      validity_start_height,
      networkID,
    );
  } else {
    console.log('registering new validator');
    validator_transaction = TransactionBuilder.newCreateValidator(
      sender,
      reward_address,
      signing_key,
      voting_key_pair,
      undefined,
      BigInt(0),
      validity_start_height,
      networkID,
    );
  }
  /* await getHubAPI().signMessage({
    appName: 'Staqe',
    message: `MOCK:Please sign this message to configure your Validator:
    Address ${validatorAddress.toUserFriendlyAddress()}
    Reward  ${rewardAddress.toUserFriendlyAddress()}
    SKey    ${warmKey.toHex()}
    VKey    ${hotKey.publicKey.toHex()}`,
    signer: validatorAddress.toUserFriendlyAddress(),
  }); */

  const signed_validator_transaction = await getHubAPI().signStaking({
    appName: 'Staqe',
    transaction: validator_transaction.serialize(),
  });

  return await nimiqClient.sendTransaction(
    signed_validator_transaction.serializedTx,
  );
}

export async function hasEnoughFundsForValidatorDeposit(
  validatorAddress: Address,
): Promise<boolean> {
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  const account = await nimiqClient.getAccount(validatorAddress);
  return account.balance >= DEPOSIT;
}

/**
 * Updates the payout address of a validator on the blockchain
 * @param validatorAddress
 * @param rewardAddress
 */
export async function updateValidatorPayoutAddress(
  validatorAddress: Address,
  rewardAddress: Address,
) {
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  const networkID = await nimiqClient.getNetworkId();
  const sender: Address = Address.fromUserFriendlyAddress(
    validatorAddress.toUserFriendlyAddress(),
  );
  const reward_address: Address = Address.fromUserFriendlyAddress(
    rewardAddress.toUserFriendlyAddress(),
  );

  await nimiqClient.waitForConsensusEstablished();

  const validity_start_height = (await nimiqClient.getHeadHeight()) + 1;

  console.log('updating existing validator');
  const update_validator_transaction = TransactionBuilder.newUpdateValidator(
    sender,
    reward_address,
    undefined, // signing_key,
    undefined, // voting_key_pair,
    undefined,
    BigInt(0),
    validity_start_height,
    networkID,
  );

  /* await getHubAPI().signMessage({
    appName: 'Staqe',
    message: `MOCK:Please sign this message to configure your Validator:
      Address ${validatorAddress.toUserFriendlyAddress()}
      Reward  ${rewardAddress.toUserFriendlyAddress()}`,
    signer: validatorAddress.toUserFriendlyAddress(),
  }); */
  const signed_update_validator_transaction = await getHubAPI().signStaking({
    appName: 'Staqe',
    transaction: update_validator_transaction.serialize(),
  });
  return await nimiqClient.sendTransaction(
    signed_update_validator_transaction.serializedTx,
  );
}

export async function retireValidator(validatorAddress: Address) {
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  const networkID = await nimiqClient.getNetworkId();
  const sender: Address = Address.fromUserFriendlyAddress(
    validatorAddress.toUserFriendlyAddress(),
  );
  await nimiqClient.waitForConsensusEstablished();

  const validity_start_height = (await nimiqClient.getHeadHeight()) + 1;

  console.log('deactivating validator');
  const deactivate_validator_transaction =
    TransactionBuilder.newRetireValidator(
      sender,
      BigInt(0),
      validity_start_height,
      networkID,
    );

  /* await getHubAPI().signMessage({
    appName: 'Staqe',
    message: `MOCK:Please sign this message to retire your Validator:
      Address ${validatorAddress.toUserFriendlyAddress()}`,
    signer: validatorAddress.toUserFriendlyAddress(),
  }); */
  const signed_retire_validator_transaction = await getHubAPI().signStaking({
    appName: 'Staqe',
    transaction: deactivate_validator_transaction.serialize(),
  });

  return await nimiqClient.sendTransaction(
    signed_retire_validator_transaction.serializedTx,
  );
}

export async function deleteValidator(validatorAddress: Address) {
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  const networkID = await nimiqClient.getNetworkId();
  const sender: Address = Address.fromUserFriendlyAddress(
    validatorAddress.toUserFriendlyAddress(),
  );
  await nimiqClient.waitForConsensusEstablished();

  const validity_start_height = (await nimiqClient.getHeadHeight()) + 1;

  console.log('deleting validator');
  const delete_validator_transaction = TransactionBuilder.newDeleteValidator(
    sender,
    BigInt(0),
    validity_start_height,
    networkID,
  );

  /* await getHubAPI().signMessage({
    appName: 'Staqe',
    message: `MOCK:Please sign this message to delete your Validator:
      Address ${validatorAddress.toUserFriendlyAddress()}`,
    signer: validatorAddress.toUserFriendlyAddress(),
  }); */
  const signed_delete_validator_transaction = await getHubAPI().signStaking({
    appName: 'Staqe',
    transaction: delete_validator_transaction.serialize(),
  });

  return await nimiqClient.sendTransaction(
    signed_delete_validator_transaction.serializedTx,
  );
}

/**
 * Checks if a validator is already registered
 * @param validatorAddress
 * @returns
 */

export async function isRegisteredValidator(validatorAddress: Address) {
  const nimiqClient = useNuxtApp().$nimiqClient as Client;
  return (await nimiqClient.getValidator(validatorAddress)) !== undefined;
}
