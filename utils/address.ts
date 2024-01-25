import { Address } from '@nimiq/core-web';
import { getHubAPI } from './hub';

/**
 * Checks if the given address is valid.
 * @param address The address to check.
 * @returns True if the address is valid, false otherwise.
 * @example
 * isAddressValid('NQ07 0000 0000 0000 0000 0000 0000 0000 0000')
 * // => true
 */
export function isAddressValid(address: string) {
  try {
    Address.fromUserFriendlyAddress(address);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 *  Opens the Nimiq Hub address chooser and returns the selected address.
 * @returns The selected address.
 * @example
 * getAddressFromHubAPI()
 * // => 'NQ07 0000 0000 0000 0000 0000 0000 0000 0000'
 */

export async function getAddressFromHubAPI(): Promise<Address> {
  const hubApi = getHubAPI();
  return Address.fromUserFriendlyAddress(
    (await hubApi.chooseAddress({ appName: 'Staqe' })).address,
  );
}

export async function newAddressFromHubAPI(): Promise<Address> {
  const hubApi = getHubAPI();
  return Address.fromUserFriendlyAddress(
    (await hubApi.chooseAddress({ appName: 'Staqe' })).address,
  );
  // return (await hubApi.signup({ appName: 'Staqe' }))[0].addresses[0].address; // API restricted to wallet
}
