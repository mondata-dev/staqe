export default defineEventHandler(async (event) => {
  const address = decodeURIComponent(event.context.params.address);
  console.log(`Returning status for node ${address}`);
  // const states = ['creating', 'running', 'down'];
  return {
    status: await statusNode(address),
  };
});

/**
 * Sends a POST request to the backend to get the status of a node
 */
async function statusNode(address: string) {
  // post address to backend
  const response = await fetch(BACKEND_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'status',
      argobj: {
        validator_address: address,
      },
    }),
  });
  return await response.text();
}
