const { expect } = require('chai');
const { ethers, upgrades } = require('hardhat');

describe('SEuro', function () {
  const MR = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'));
  const BR = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('BURNER_ROLE'));
  let owner, admin, non_admin, SEuro;

  beforeEach(async () => {
    [owner, admin, non_admin] = await ethers.getSigners();
    const SEuroContract = await ethers.getContractFactory('SEuro');
    SEuro = await upgrades.deployProxy(SEuroContract, ['sEURO', 'SEUR'], {kind: 'uups'});
    await SEuro.deployed();
  });

  describe('initial roles', async () => {
    it('grants minter and burner role to owner', async () => {
      expect(await SEuro.hasRole(MR, owner.address)).to.eq(true);
      expect(await SEuro.hasRole(BR, owner.address)).to.eq(true);
    });

    it('grants minter and burner role to admin', async () => {
      expect(await SEuro.hasRole(MR, admin.address)).to.eq(false);
      expect(await SEuro.hasRole(BR, admin.address)).to.eq(false);

      await SEuro.addMinter(admin.address);
      await SEuro.addBurner(admin.address);
      expect(await SEuro.hasRole(MR, admin.address)).to.eq(true);
      expect(await SEuro.hasRole(BR, admin.address)).to.eq(true);
    });

    it('does not grant minter / burner role for non-admins', async () => {
      expect(await SEuro.hasRole(MR, non_admin.address)).to.eq(false);
      expect(await SEuro.hasRole(BR, non_admin.address)).to.eq(false);
    });
  });

  describe('upgrading', async () => {
    it('allows the admin account to upgrade the contract', async () => {

      const SEuroContractV2 = await ethers.getContractFactory('SEuroV2')
      const two = await upgrades.upgradeProxy(SEuro.address, SEuroContractV2);
      await two.deployed();

      expect(two.address).to.eq(SEuro.address);
    });

    it('reverts when the admin aint an admin!!', async () => {
      const AR = await SEuro.DEFAULT_ADMIN_ROLE();
      await SEuro.revokeRole(AR, owner.address)

      const SEuroContractV2 = await ethers.getContractFactory('SEuroV2')
      const two = upgrades.upgradeProxy(SEuro.address, SEuroContractV2);
      await expect(two).to.be.revertedWith('invalid-admin');
    });
  });

  describe('minting', async () => {
    it('reverts when minted by non-admin', async () => {
      const value = ethers.utils.parseEther('0.5');
      const mint = SEuro.connect(non_admin).mint(admin.address, value);

      await expect(mint).to.be.revertedWith('invalid-minter');
      expect(await SEuro.balanceOf(admin.address)).to.eq(0);
    });

    it('mints when performed by admin', async () => {
      await SEuro.addMinter(admin.address);
      const value = ethers.utils.parseEther('0.5');
      const mint = SEuro.connect(admin).mint(admin.address, value);

      await expect(mint).not.to.be.revertedWith('invalid-minter');
      expect(await SEuro.balanceOf(admin.address)).to.eq(value);
    });
  });

  describe('burning', async () => {
    it('reverts when burned by non-admin', async () => {
      await SEuro.addMinter(admin.address);
      const value = ethers.utils.parseEther('0.5');
      await SEuro.connect(admin).mint(admin.address, value);

      const burn = SEuro.connect(non_admin).burn(admin.address, value);

      await expect(burn).to.be.revertedWith('invalid-burner');
      expect(await SEuro.balanceOf(admin.address)).to.eq(value);
    });

    it('burns when performed by admin', async () => {
      await SEuro.addMinter(admin.address);
      await SEuro.addBurner(admin.address);

      const value = ethers.utils.parseEther('0.5');
      await SEuro.connect(admin).mint(admin.address, value);

      const burn = SEuro.connect(admin).burn(admin.address, value);

      await expect(burn).not.to.be.revertedWith('invalid-burner');
      expect(await SEuro.balanceOf(admin.address)).to.eq(0);
    });
  });
});
