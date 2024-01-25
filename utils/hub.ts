import HubApi from '@nimiq/hub-api';

/**
 * Get the default Hub API.
 * @returns The Hub API.
 */
export function getHubAPI(): HubApi {
  return new HubApi('https://hub.pos.nimiq-testnet.com');
}
