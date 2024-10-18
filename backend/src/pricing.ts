import { ofetch as fetch } from 'ofetch';
import storage from 'node-persist';

export function lunaToNim(amount: number): number {
  return amount * 1e-5;
}
export function nimToLuna(amount: number): number {
  return Math.round(amount * 1e5);
}

function getSecondsTimestamp(timestamp: bigint): number {
  return Number(timestamp / 1000n);
}

/**
 * Returns the price given a timestamp. TODO: INACCURATE as coingecko only returns the price of the day
 * Caches prices in node-persist
 * @param timestamp
 * @returns
 */
export async function getDollarPriceHistory(timestamp: bigint) {
  await storage.init();
  if ((await storage.getItem(timestamp.toString())) !== undefined) {
    console.log('Found price in cache');
    return await storage.getItem(timestamp.toString());
  }

  const date = new Date(getSecondsTimestamp(timestamp));
  const datestring = `${date.getDate()}-${
    date.getMonth() + 1
  }-${date.getFullYear()}`; // 30-12-2022
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/nimiq-2/history?date=${datestring}&localization=false`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
  );
  const price = response.market_data.current_price.usd;
  await storage.setItem(timestamp.toString(), price);
  return price;
}
