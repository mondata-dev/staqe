export function lunaToNim(amount: number): number {
  return amount * 1e-5;
}
export function nimToLuna(amount: number): number {
  return Math.round(amount * 1e5);
}

async function getDollarPriceHistory(timestamp: number) {
  const date = new Date(timestamp);
  const datestring = `${date.getDay()}-${date.getMonth()}-${date.getFullYear()}`; // 30-12-2022
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/nimiq-2/history?date=${datestring}&localization=false`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
  );
  return (await response.json()).market_data.current_price.usd;
}

async function getDollarPriceNow() {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=nimiq-2&vs_currencies=usd',
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    },
  );
  return (await response.json())['nimiq-2'].usd;
}

export async function getNimPrice(timestamp?) {
  if (timestamp) {
    return await getDollarPriceHistory(timestamp);
  } else {
    return await getDollarPriceNow();
  }
}
