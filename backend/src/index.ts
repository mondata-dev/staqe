import bodyParser from 'body-parser';
import express from 'express';
import morgan from 'morgan';
import {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} from 'node:worker_threads';
import {
  STAKING_CONTRACT_ADDRESS,
  convertAddressForRPC,
  getBlockHeight,
  getPaymentStatus,
  getTotalRewards,
  getTransaction,
} from './blockchain.js';
import {
  createOrUpdateValidator,
  getConsensusStatus,
  removeValidator,
  upgradeAllValidators,
  upgradeNode,
} from './nodecontroller.js';

import type { Transaction } from 'nimiq-rpc-client-ts';

const testMode = process.env.NODE_ENV === 'test';

const jsonParser = bodyParser.json();
const app = express();

// request logging
if (!testMode) {
  morgan.token('body-method', function (req: any, res) {
    return req.body.method;
  });
  morgan.token('body-validator-address', function (req: any, res) {
    return req.body.argobj?.validator_address;
  });
  app.use(
    morgan(
      ':method :url #:body-method(:body-validator-address) ":user-agent" -> :status in :response-time ms',
    ),
  );
}

/**
 * Launches new validator on cluster
 * @param argobj
 */
async function newValidator(argobj: any) {
  // Args
  const validatorWalletAddress = argobj.validator_address;
  const signingSecret = argobj.signingSecret;
  const votingSecret = argobj.votingSecret;
  const transactionHash = argobj.transactionHash;

  // Check payment
  const paymentStatus = await getPaymentStatus(validatorWalletAddress);
  if (paymentStatus < new Date().getTime()) {
    console.log(
      `Payment for validator ${validatorWalletAddress} not sufficient.`,
    );
    // return; //curently not enforcing payment as the HUB Api seems to be broken again
  }

  if (!(await checkTransaction(validatorWalletAddress, transactionHash))) {
    console.log(
      `Transaction ${transactionHash} not valid. Supposed to be for ${validatorWalletAddress}`,
    );
    return;
  }
  console.log(`Creating validator ${validatorWalletAddress}`);

  await createOrUpdateValidator(
    validatorWalletAddress,
    signingSecret,
    votingSecret,
  );
}

/**
 * Deletes validator from cluster
 * @param argobj
 */
async function deleteValidator(argobj: any) {
  // Args
  const validatorWalletAddress = argobj.validator_address;

  const transactionHash = argobj.transactionHash;

  if (!(await checkTransaction(validatorWalletAddress, transactionHash))) {
    console.log(
      `Transaction ${transactionHash} not valid. Supposed to be for ${validatorWalletAddress}`,
    );
    return;
  }
  console.log(`Deleting validator ${validatorWalletAddress}`);
  await removeValidator(validatorWalletAddress);
}

/**
 * Used for testing
 * @param argobj
 */
async function test(argobj: any) {
  // Args
  const validatorWalletAddress = convertAddressForRPC(argobj.validator_address);
  const testx = await getPaymentStatus(validatorWalletAddress);
  console.log(testx);
}

/**
 * Gets the consensus status of the node with a given validator address
 * @param argobj
 */
async function status(argobj: any) {
  const validatorWalletAddress = convertAddressForRPC(argobj.validator_address);
  const status = await getConsensusStatus(validatorWalletAddress);
  return status;
}

/**
 * Gets the payment status of a given validator address
 * @param argobj
 */
async function paymentStatus(argobj: any) {
  const validatorWalletAddress = convertAddressForRPC(argobj.validator_address);
  console.log(`Getting payment status for ${validatorWalletAddress}`);
  return await getPaymentStatus(validatorWalletAddress);
}

/**
 * Gets the total reward of a given validator address
 * @param argobj
 */
async function totalRewards(argobj: any) {
  const validatorWalletAddress = convertAddressForRPC(argobj.validator_address);
  console.log(`Getting total reward for ${validatorWalletAddress}`);
  return await getTotalRewards(validatorWalletAddress);
}

async function upgradeValidator(argobj: any) {
  // Args
  const validatorWalletAddress = argobj.validator_address;
  console.log(`Upgrading validator ${validatorWalletAddress}`);
  return await upgradeNode(validatorWalletAddress);
}

async function checkTransaction(
  validatorWalletAddress: string,
  transactionHash: string,
) {
  const transaction: Transaction = await getTransaction(transactionHash);
  if (!transaction) {
    console.log(
      `Transaction ${transactionHash} not found. Supposed to be for ${validatorWalletAddress}`,
    );
    return false;
  } else {
    const blockHeight = await getBlockHeight();
    if (blockHeight - transaction.blockNumber > 180) {
      console.log(
        `Transaction ${transactionHash} too old. Supposed to be for ${validatorWalletAddress}`,
      );
      return false;
    }
    if (
      convertAddressForRPC(transaction.from) !==
      convertAddressForRPC(validatorWalletAddress)
    ) {
      console.log(
        `Transaction ${transactionHash} not from ${validatorWalletAddress}.`,
      );
      return false;
    }
    if (
      convertAddressForRPC(transaction.to) !==
      convertAddressForRPC(STAKING_CONTRACT_ADDRESS)
    ) {
      console.log(
        `Transaction ${transactionHash} not to ${STAKING_CONTRACT_ADDRESS}.`,
      );
      return false;
    }
    return true;
  }
}

interface PostResponse {
  code: number;
  message: string;
}
async function processPost(req: express.Request): Promise<PostResponse> {
  const response: PostResponse = {
    code: 200,
    message: 'Received',
  };

  const method = req.body.method;
  switch (method) {
    case 'newValidator':
      await newValidator(req.body.argobj);
      break;
    case 'deleteValidator':
      await deleteValidator(req.body.argobj);
      break;
    case 'upgradeValidator':
      await upgradeValidator(req.body.argobj);
      break;
    case 'test':
      await test(req.body.argobj);
      break;
    case 'status':
      response.message = await status(req.body.argobj);
      break;
    case 'paymentStatus': {
      const endTS = await paymentStatus(req.body.argobj);
      response.message = endTS.toString();
      break;
    }
    case 'totalRewards': {
      const rewards = await totalRewards(req.body.argobj);
      response.message = rewards.toString();
      break;
    }
    default:
      response.code = 404;
      response.message = `Unknown method ${method}`;
      break;
  }

  return response;
}

/**
 * Parses the commands that are sent to the backend server
 */
app.post('/', jsonParser, (req, res) => {
  processPost(req)
    .then((response) => {
      res.status(response.code).send(response.message);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

if (isMainThread) {
  const worker = new Worker('./dist/index.js', { workerData: 'Upgrade' }); // REQUIRES BULD!!!
  worker.on('message', (msg) => console.log(`Worker message received: ${msg}`));
  worker.on('error', (err) => console.error(err));
  worker.on('exit', (code) => console.log(`Worker exited with code ${code}.`));
  /**
   * Starts the backend server
   */
  app.listen(3300, () => {
    console.log('Backend listening on port 3300!');
  });
} else {
  const data = workerData;
  parentPort.postMessage(`Worker starting "${data}".`);
  void upgradeAllValidators();
}
