require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');

const { 
  INFURA_API_KEY, GOERLI_PRIVATE_KEY, MAINNET_PRIVATE_KEY, ETHERSCAN_KEY, ARBISCAN_KEY, ALCHEMY_ARBITRUM_KEY
} = process.env;

module.exports = {
  solidity: '0.8.15',
  networks: {
    hardhat: {},
    // goerli: {
    //   url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
    //   accounts: [`${GOERLI_PRIVATE_KEY}`],
    //   // gasMultiplier: 2,
    // },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [`${MAINNET_PRIVATE_KEY}`]
    },
    arbitrum: {
      url: `https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_ARBITRUM_KEY}`,
      accounts: [MAINNET_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_KEY,
      arbitrumOne: ARBISCAN_KEY
    }
  }
};
