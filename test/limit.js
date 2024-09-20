const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('minting limit', async () => {
  it('only allows admin role control minting limit', async () => {
    [owner, admin, non_admin] = await ethers.getSigners();
    let USDs = await upgrades.deployProxy(await ethers.getContractFactory('USDsArbitrumL2'), ['The Standard USD', 'USDs', ethers.constants.AddressZero, ethers.constants.AddressZero], {kind: 'uups'});
    USDs = await upgrades.upgradeProxy(USDs.address, await ethers.getContractFactory('USDsSupplyLimit'));
    await USDs.grantRole(await USDs.DEFAULT_ADMIN_ROLE(), admin.address);
    await USDs.grantRole(await USDs.MINTER_ROLE(), admin.address);

    const limit = ethers.utils.parseEther('100000');
    
    await expect(USDs.connect(admin).mint(admin.address, 1)).to.be.revertedWith('err-limit');

    await expect(USDs.connect(non_admin).setSupplyLimit(limit)).to.be.revertedWith('AccessControl');
    await expect(USDs.connect(owner).setSupplyLimit(1)).not.to.be.reverted;
    await expect(USDs.connect(admin).setSupplyLimit(limit)).not.to.be.reverted;

    await expect(USDs.connect(admin).mint(admin.address, limit)).not.to.be.reverted;
    await expect(USDs.connect(admin).mint(admin.address, 1)).to.be.revertedWith('err-limit');
  });
});