import { ethers, hardhatArguments } from 'hardhat';
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const contractName = 'DrawNFT';
  const Lock = await ethers.getContractFactory(contractName);
  const lock = await Lock.deploy();

  await lock.deployed();

  const networkName = hardhatArguments.network;
  if (!networkName) {
    console.error(
      'undefined `networkName`! Please define a network name. One option is `goerli`!'
    );
    return;
  }

  // save to frontend
  const contractsDir = path.join(
    __dirname,
    '..',
    'contracts',
    'abi',
    networkName
  );
  const artifactsFile = path.join(
    __dirname,
    '..',
    'artifacts',
    'contracts',
    `${contractName}.sol`,
    `${contractName}.json`
  );

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir);
  }

  fs.writeFileSync(
    path.join(contractsDir, `${contractName}-address.json`),
    JSON.stringify({ address: lock.address }, undefined, 2)
  );

  fs.copyFile(
    artifactsFile,
    path.join(contractsDir, `${contractName}.json`),
    () => {}
  );

  console.log('Deployment Is Finished!');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
