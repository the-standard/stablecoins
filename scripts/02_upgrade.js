const { hre, ethers, upgrades } = require("hardhat");

async function main() {
  const SEuroContract = await ethers.getContractFactory('SEuroV2');
  const SEuro = await upgrades.upgradeProxy(process.env.SEURO_ADDRESS, SEuroContract);
  await SEuro.deployed();
  console.log('SEURO Upgraded', SEuro.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

