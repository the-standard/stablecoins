const { makeForceImport } = require("@openzeppelin/hardhat-upgrades/dist/force-import");
const { ethers, upgrades } = require("hardhat");

async function main() {
  // const USDs = await upgrades.deployProxy(await ethers.getContractFactory('USDs'), ['0xcEe284F754E854890e311e3280b767F80797180d', '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef'], {kind: 'uups'});
  // await USDs.deployed();
  // console.log('USDs ETH addr', USDs.address);

  // await new Promise(resolve => setTimeout(resolve, 60000));

  await run(`verify:verify`, {
    address: '0x00b49978030f5f05f775eee84f915b79bde8673c',
    constructorArguments: []
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

