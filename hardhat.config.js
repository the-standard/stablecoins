require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require('@openzeppelin/hardhat-upgrades');

const { INFURA_API_KEY } = process.env;

module.exports = {
  solidity: '0.8.15'
};
