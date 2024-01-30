import * as k8s from '@kubernetes/client-node';
import * as yaml from 'js-yaml';
import { Client } from 'nimiq-rpc-client-ts';
import * as crypto from 'node:crypto';
import { promises as fs } from 'node:fs';

const namespace = process.env.NODE_NAMESPACE;
if (!namespace) throw new Error('NODE_NAMESPACE env variable not set');

const baseDomain = process.env.NODE_BASE_DOMAIN;
if (!baseDomain) throw new Error('NODE_BASE_DOMAIN env variable not set');

console.log(`Using namespace ${namespace} and base domain ${baseDomain}.`);

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const client = kc.makeApiClient(k8s.KubernetesObjectApi);
const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

async function replaceAddress(configStringFile: string, address: string) {
  const configString = await fs.readFile(configStringFile, 'utf8');
  return configString
    .replace(/{{VALIDATOR_NAME}}/g, kubernetizeAddress(address))
    .replace(/{{VALIDATOR_BASE_DOMAIN}}/g, baseDomain);
}

/**
 * Makes sure the address is in the correct format for kubernetes
 * @param address
 * @returns
 */
function kubernetizeAddress(address: string) {
  return address.replace(/ /g, '').toLowerCase();
}

/**
 * Builds valid kubernetes configs for a validator using the templates in the templates/base folder
 * @param address
 * @param warmkey
 * @param hotkey
 * @returns
 */
async function buildConfigs(
  address: string,
  warmkey: string = '',
  hotkey: string = '',
): Promise<any> {
  let ConfigmapString = await replaceAddress(
    './templates/base/configmap.yaml',
    address,
  );
  const DeploymentString = await replaceAddress(
    './templates/base/statefulset.yaml',
    address,
  );
  const ServiceString = await replaceAddress(
    './templates/base/service.yaml',
    address,
  );
  const IngressString = await replaceAddress(
    './templates/base/ingress.yaml',
    address,
  );

  // replace keys
  ConfigmapString = ConfigmapString.replace(/nqhot/g, hotkey);
  ConfigmapString = ConfigmapString.replace(/nqwarm/g, warmkey);

  // correct validator address in configmap

  ConfigmapString = ConfigmapString.replace(
    /nqvadd/g,
    kubernetizeAddress(address).toUpperCase(),
  );

  const specs: any[] = yaml.loadAll(ConfigmapString);
  specs[0].metadata.labels['template-hash'] = await getTemplatesHash();
  specs.push(...yaml.loadAll(DeploymentString));
  specs.push(...yaml.loadAll(ServiceString));
  specs.push(...yaml.loadAll(IngressString));
  for (const spec of specs) spec.metadata.namespace = namespace;

  return specs;
}

/**
 * Creates a new validator on the cluster or updates an existing one
 * @param address
 * @param warmkey
 * @param hotkey
 */
export async function createOrUpdateValidator(
  address: string,
  warmkey: string,
  hotkey: string,
) {
  const specs = await buildConfigs(address, warmkey, hotkey);
  for (const spec of specs) {
    try {
      // decide if update or create

      await client.read(spec);

      const response = await client.patch(spec);
      console.log(response);
    } catch (e) {
      // we did not get the resource, so it does not exist, so create it
      const response = await client.create(spec);
      console.log(response);
    }
  }
}

/**
 * Deletes a validator from the cluster
 * @param address
 */
export async function removeValidator(address: string) {
  const specs = await buildConfigs(address);
  for (const spec of specs) {
    try {
      // delete if exists

      await client.read(spec);

      const response = await client.delete(spec);
      console.log(response);
    } catch (e) {
      console.log('Already deleted');
    }
  }
}

/**
 * Pings the validator to see if it is running and if it has consensus
 * @param address
 * @returns
 */
export async function getConsensusStatus(address: string) {
  const url = new URL(`http://staqe-node-${kubernetizeAddress(address)}:8648`);
  const client = new Client(url);
  const response = await client.consensus.isConsensusEstablished();
  if (response.data !== undefined) {
    return response.data ? 'running' : 'creating';
  } else {
    return 'down';
  }
}

/** Extracts and updates the Node Configuration */

export async function upgradeNode(address: string) {
  console.log(`Upgrading Node  ${address}`);
  const specs = await buildConfigs(address);
  for (const spec of specs) {
    try {
      const config = await client.read(spec);
      if (config.body.kind === 'ConfigMap') {
        const data = (config.body as any).data['client.toml'];
        const regexWarmKey = /signing_key = "([0-9a-z]*)"/;
        const regexHotKey = /voting_key = "([0-9a-z]*)"/;
        const warmKey = regexWarmKey.exec(data)[1];
        const hotKey = regexHotKey.exec(data)[1];
        await removeValidator(address); // required for changes on statefulset
        await createOrUpdateValidator(address, warmKey, hotKey);
        console.log(`Upgraded Node  ${address}`);
        break;
      }
    } catch (e) {
      console.log(`Upgrade Failed: Missing Node Configs${e}`);
    }
  }
}

/**
 * Gets All Validators from the cluster
 */

export async function getAllValidators(differentHash: boolean = false) {
  console.log(`Current template hash: ${await getTemplatesHash()}`);
  const response = await k8sApi.listNamespacedConfigMap(namespace);
  const validators: any[] = [];
  for (const pod of response.body.items) {
    if (
      pod.metadata?.labels &&
      pod.metadata?.labels['app.kubernetes.io/component'] === 'validator-node'
    ) {
      if (
        differentHash &&
        pod.metadata?.labels['template-hash'] === (await getTemplatesHash())
      )
        continue;
      validators.push(pod.metadata.name.replace('staqe-node-', ''));
    }
  }
  return validators;
}

/**
 * Gets the Hash of the files in the templates/base folder
 *
 */
let templateHash = '';
export async function getTemplatesHash() {
  if (templateHash === '') {
    // loop through all files in the base folder and hash them
    const files = await fs.readdir('./templates/base');
    const hash = crypto.createHash('sha256');
    for (const file of files.sort()) {
      const data = await fs.readFile(`./templates/base/${file}`);
      hash.update(data);
    }
    templateHash = hash.digest('hex').substring(0, 32); // sha to long for label
  }
  return templateHash;
}

/**
 * Upgrades all validators after another
 */
export async function upgradeAllValidators() {
  const validators = await getAllValidators(true);
  for (const validator of validators) {
    await upgradeNode(validator);
    while ((await getConsensusStatus(validator)) !== 'running') {
      console.log(
        `Waiting for consensus on ${validator} status: ${await getConsensusStatus(
          validator,
        )}`,
      );
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
