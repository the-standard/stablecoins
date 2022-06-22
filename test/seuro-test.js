const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SEuro', function () {
  const MR = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'));
  const BR = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('BURNER_ROLE'));
  let owner, admin, non_admin, SEuro;

  beforeEach(async () => {
    [owner, admin, non_admin] = await ethers.getSigners();
    const SEuroContract = await ethers.getContractFactory('SEuro');
    SEuro = await SEuroContract.connect(owner).deploy('sEURO', 'SEUR', [admin.address]);
    await SEuro.deployed();
  });

  describe('initial roles', async () => {
    it('grants minter and burner role to owner', async () => {
      expect(await SEuro.hasRole(MR, owner.address)).to.eq(true);
      expect(await SEuro.hasRole(BR, owner.address)).to.eq(true);
    });

    it('grants minter and burner role to owner', async () => {
      expect(await SEuro.hasRole(MR, owner.address)).to.eq(true);
      expect(await SEuro.hasRole(BR, owner.address)).to.eq(true);
    });

    it('does not grand minter / burner role for non-admins', async () => {
      expect(await SEuro.hasRole(MR, non_admin.address)).to.eq(false);
      expect(await SEuro.hasRole(BR, non_admin.address)).to.eq(false);
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
      const value = ethers.utils.parseEther('0.5');
      const mint = SEuro.connect(admin).mint(admin.address, value);

      await expect(mint).not.to.be.revertedWith('invalid-minter');
      expect(await SEuro.balanceOf(admin.address)).to.eq(value);
    });
  });

  describe('burning', async () => {
    it('reverts when burned by non-admin', async () => {
      const value = ethers.utils.parseEther('0.5');
      await SEuro.connect(admin).mint(admin.address, value);

      const burn = SEuro.connect(non_admin).burn(admin.address, value);

      await expect(burn).to.be.revertedWith('invalid-burner');
      expect(await SEuro.balanceOf(admin.address)).to.eq(value);
    });

    it('burns when performed by admin', async () => {
      const value = ethers.utils.parseEther('0.5');
      await SEuro.connect(admin).mint(admin.address, value);

      const burn = SEuro.connect(admin).burn(admin.address, value);

      await expect(burn).not.to.be.revertedWith('invalid-burner');
      expect(await SEuro.balanceOf(admin.address)).to.eq(0);
    });
  });

  describe('granting roles', async () => {
    it('allows contract owner to grant roles', async () => {
      await SEuro.connect(owner).grantRole(MR, non_admin.address);

      expect(await SEuro.hasRole(MR, non_admin.address)).to.eq(true);
    });

    it('does not allow non-owner to grant roles', async () => {
      const grant = SEuro.connect(admin).grantRole(MR, non_admin.address);

      await expect(grant).to.be.reverted;
      expect(await SEuro.hasRole(MR, non_admin.address)).to.eq(false);
    });
  });

  describe('revoking roles', async () => {
    it('allows contract owner to revoke roles', async () => {
      await SEuro.connect(owner).revokeRole(MR, admin.address);

      expect(await SEuro.hasRole(MR, admin.address)).to.eq(false);
    });

    it('does not allow non-owner to revoke roles', async () => {
      const revoke = SEuro.connect(non_admin).revokeRole(MR, admin.address);

      await expect(revoke).to.be.reverted;
      expect(await SEuro.hasRole(MR, admin.address)).to.eq(true);
    });
  });
});
