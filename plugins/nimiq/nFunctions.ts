// Import the package from the /web path:
import { Client, ClientConfiguration } from '@nimiq/core';

export async function initClient(): Promise<Client> {
  // Load and initialize the WASM file
  // await init(); //OLD
  // Create a configuration builder:
  const config = new ClientConfiguration();

  // Connect to the Albatross Testnet:
  // Optional, default is 'testalbatross'
  config.network('testalbatross');

  // Specify the seed nodes to initially connect to:
  // Optional, default is ['/dns4/seed1.pos.nimiq-testnet.com/tcp/8443/wss']
  config.seedNodes(['/dns4/history.node.staqe.io/tcp/443/wss']);

  // Change the lowest log level that is output to the console:
  // Optional, default is 'info'
  config.logLevel('trace');

  // Instantiate and launch the client.
  // window exists because this is a client plugin

  return await Client.create(config.build());
}

export function establishConsensus(nimiqClient: Client) {
  console.log('Consensus: Waiting for consensus');
  nimiqClient
    .waitForConsensusEstablished()
    .then(() => {
      console.log('Consensus: Consensus established');
    })
    .catch((error) => {
      console.log(error);
    });
}
