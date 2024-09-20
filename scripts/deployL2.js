const { ethers } = require('hardhat');
const { providers, Wallet } = require('ethers');
const { getL2Network } = require('@arbitrum/sdk');
require('dotenv').config();

const walletPrivateKey = process.env.MAINNET_PRIVATE_KEY;
const l2Provider = new providers.JsonRpcProvider(`https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_ARBITRUM_KEY}`);
const l2Wallet = new Wallet(walletPrivateKey, l2Provider);

const l1TokenAddress = '0xF6307025a79b4A8D1cF9436089894fE3951eeBF1';

/**
 * For the purpose of our tests, here we deploy an standard ERC20 token (L2Token) to L2
 */
const main = async () => {
  /**
   * Use l2Network to get the token bridge addresses needed to deploy the token
   */
  // const l2Network = await getL2Network(l2Provider);
  // const l2Gateway = l2Network.tokenBridge.l2CustomGateway;
  // console.log(l2Gateway)

  // const USDs = await upgrades.deployProxy(await ethers.getContractFactory('USDsArbitrumL2'), [
  //   'The Standard USD', 'USDs', '0x096760F208390250649E3e8763348E783AEF5562', l1TokenAddress
  // ], {kind: 'uups'});

  // console.log(USDs.address);

  await run(`verify:verify`, {
    address: '0xd6B580Ffd1D6E5dCC4AA1CF5bb66888e8fbBF1Dd',
    constructorArguments: []
  });

  await run(`verify:verify`, {
    address: '0x2Ea0bE86990E8Dac0D09e4316Bb92086F304622d',
    constructorArguments: []
  });
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });