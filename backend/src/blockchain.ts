import type {
  Address,
  CallResult,
  PartialBlock,
  Transaction,
  Validator,
} from 'nimiq-rpc-client-ts';
import Client from 'nimiq-rpc-client-ts';
import { Buffer } from 'node:buffer';
import { getDollarPriceHistory, lunaToNim } from './pricing.js';

// The address of staqe that receives payments
const paymentReciver: `NQ${number} ${string}` =
  (process.env.PAYMENT_RECEIVER as any) ||
  'NQ70 HA7G 4TYD TUVA QH6J 7R4A KRES 6NMB 958J';
const period = 1000 * 60 * 60 * 24 * 30; // 30 day
const periodCost = 10; // $10
const tolerance = 0.2; // 20% tolerance due to price fluctuations( especially with the coingecko api)

export enum ValidatorStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Gets the RPC client to retrieve data from the blockchain
 * @returns
 */
function getClient() {
  const url = new URL('https://rpc-testnet.nimiqcloud.com/');
  return new Client(url);
}

/**
 * Converts any valid address to the format used by the RPC client
 * @param address
 * @returns
 */
export function convertAddressForRPC(address: string): Address {
  const upper = address.toUpperCase().replace(/ /g, '');
  const checksum = Number.parseInt(upper.substring(2, 4));
  const rest = upper.substring(4);
  return `NQ${checksum} ${rest}`;
}

/**
 * Checks the status of a validator on the blockchain
 * @param address
 * @returns
 */

export async function getValidatorStatus(
  address: Address,
): Promise<ValidatorStatus> {
  const client = getClient();
  const validator: CallResult<Validator> =
    await client.validator.byAddress(address);
  if (validator.error) return ValidatorStatus.UNKNOWN;

  if (validator.data.inactivityFlag) return ValidatorStatus.INACTIVE;

  return ValidatorStatus.ACTIVE;
}

/**
 * Gets the Block at a specific block number
 * @param blockNumber
 * @returns
 */
export async function getBlock(blockNumber: number) {
  const client = getClient();
  const block: CallResult<PartialBlock> =
    await client.block.getByNumber(blockNumber);
  return block.data;
}

/**
 * Gets the amount of paid time for a given payment
 * Currently there is only one payment option. 1 Month for $10
 * @param amount
 * @param timestamp
 * @returns
 */

async function getPaymentTime(amount: number, timestamp: number) {
  const price = await getDollarPriceHistory(timestamp);
  const transactionValue = lunaToNim(amount) * price;
  if (transactionValue > periodCost * (1 - tolerance)) {
    return period;
  } else {
    console.log('Payment not close to tolerance. Not processing. ');
  }

  return 0;
}

/**
 * Checks all past payments and determines how long the validator has been paid for
 * @param address
 * @returns timestamp of when the payment ends
 */
export async function getPaymentStatus(address: Address): Promise<any> {
  // Format extra data: Staqe,NQ61 AE12 FJ43 QNP4 SHBJ F7XJ RH4Y FX3T X2N4
  const client = getClient();
  const payments: CallResult<Transaction[]> =
    (await client.transaction.getByAddress(paymentReciver)) as any;
  const valdatorPayemnts = [];
  for (const payment of payments.data) {
    // Change of .data to .recipientData not yet implemented by the rpc client
    const decodedData = Buffer.from(
      (payment as any).recipientData,
      'hex',
    ).toString('ascii');
    const splitData = decodedData.split(',');
    if (splitData[0] === 'Staqe') {
      const targetAddress = convertAddressForRPC(splitData[1]);
      if (targetAddress === address) {
        console.log('Processing payment');
        valdatorPayemnts.push(payment);
      }
      console.log(splitData[1]);
    }
  }
  valdatorPayemnts.sort((a, b) => (a.timestamp > b.timestamp ? 1 : -1));
  let paymentEndTS = 0;
  for (const payment of valdatorPayemnts) {
    if (payment.timestamp > paymentEndTS) {
      const addedTime = await getPaymentTime(payment.value, payment.timestamp);
      paymentEndTS = payment.timestamp + addedTime;
    } else {
      paymentEndTS =
        paymentEndTS + (await getPaymentTime(payment.value, payment.timestamp));
    }
  }
  return paymentEndTS;
}

/**
 * Returns the total reward for the validator it received on its CURRENT payout address.
 * @param validatorAddress
 * @returns
 */

export async function getTotalRewards(validatorAddress: Address) {
  const client = getClient();
  const validator = await client.validator.byAddress(validatorAddress);
  if (validator.error) {
    console.log(`Failed to get Vlaidator ${validatorAddress}`);
    return 0;
  }
  const transactions: CallResult<Transaction[]> =
    (await client.transaction.getByAddress(
      validator.data.rewardAddress,
    )) as CallResult<Transaction[]>;
  let total = 0;
  for (const transaction of transactions.data) {
    if (
      convertAddressForRPC(transaction.from) ===
      convertAddressForRPC('NQ81 C01N BASE 0000 0000 0000 0000 0000 0000')
    ) {
      total += transaction.value;
    }
  }
  return total;
}
