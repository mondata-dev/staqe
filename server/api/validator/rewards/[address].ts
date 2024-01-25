export default defineEventHandler(async (event) => {
  const address = decodeURIComponent(event.context.params.address);
  console.log(`Returning rewards for validator ${address}`);
  return {
    status: await totalRewards(address),
  };
});

/**
 * Sends a POST request to the backend to get the total rewards for a given validator
 */
async function totalRewards(address: string) {
  // post address to backend
  const response = await fetch(BACKEND_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'totalRewards',
      argobj: {
        validator_address: address,
      },
    }),
  });
  return Number.parseInt(await response.text());
}
