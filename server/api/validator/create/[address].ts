export default defineEventHandler((event) => {
  const address = decodeURIComponent(event.context.params.address);
  const query = getQuery(event);
  console.log(query);
  console.log(`Backend starting node for ${address}`);
  createNode(address, query.signing_key, query.voting_key)
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });

  return { status: 'creating' };
});

/**
 * Sends a POST request to the backend to start a new node
 * @param address the validator address
 * @param signing_key the signing key
 * @param votingKey  the voting key
 * @returns
 */

async function createNode(
  address: string,
  signing_key: string,
  votingKey: string,
) {
  // post address to backend
  const response = await fetch(BACKEND_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'newValidator',
      argobj: {
        validator_address: address,
        signingSecret: signing_key,
        votingSecret: votingKey,
      },
    }),
  });
  return await response.text();
}
