export default defineEventHandler(async (event) => {
  const address = decodeURIComponent(event.context.params.address);
  console.log(`Returning payment status for node ${address}`);
  return {
    status: await paymentStatusNode(address),
  };
});

/**
 * Sends a POST request to the backend to get the payment status of a node
 */
async function paymentStatusNode(address: string) {
  // post address to backend
  const response = await fetch(BACKEND_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'paymentStatus',
      argobj: {
        validator_address: address,
      },
    }),
  });
  return new Date(Number.parseInt(await response.text())).toDateString();
}
