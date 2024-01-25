export default defineEventHandler((event) => {
  const address = decodeURIComponent(event.context.params.address);
  console.log(`Backend deleting node for ${address}`);
  deleteNode(address)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

  return { status: 'deleting' };
});

/**
 * Sends a POST request to the backend to delete a node
 * @param address the validator address
 * @returns
 */

async function deleteNode(address: string) {
  // post address to backend
  const response = await fetch(BACKEND_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'deleteValidator',
      argobj: {
        validator_address: address,
      },
    }),
  });
  return await response.text();
}
