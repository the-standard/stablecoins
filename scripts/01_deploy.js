const { hre, ethers, upgrades } = require("hardhat");

async function main() {
  const SEuroContract = await ethers.getContractFactory('SEuro');
  SEuro = await upgrades.deployProxy(SEuroContract, ['sEURO', 'SEURO'], {kind: 'uups'});
  await SEuro.deployed();
  console.log('SEURO addr', SEuro.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

