const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('SEuro', function () {
  const MR = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'));
  const BR = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('BURNER_ROLE'));
  let owner, address_1, address_2, SEuro;

  beforeEach(async () => {
    [owner, address_1, address_2] = await ethers.getSigners();
    const SEuroContract = await ethers.getContractFactory('SEuro');
    SEuro = await SEuroContract.connect(owner).deploy('sEURO', 'SEUR', [address_1.address]);
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
      expect(await SEuro.hasRole(MR, address_2.address)).to.eq(false);
      expect(await SEuro.hasRole(BR, address_2.address)).to.eq(false);
    });
  });

  describe('minting', async () => {
    it('reverts when minted by non-admin', async () => {
      const value = ethers.utils.parseEther('0.5');
      const mint = SEuro.connect(address_2).mint(address_1.address, value);

      await expect(mint).to.be.revertedWith('invalid-minter');
      expect(await SEuro.balanceOf(address_1.address)).to.eq(0);
    });

    it('mints when performed by admin', async () => {
      const value = ethers.utils.parseEther('0.5');
      const mint = SEuro.connect(address_1).mint(address_1.address, value);

      await expect(mint).not.to.be.revertedWith('invalid-minter');
      expect(await SEuro.balanceOf(address_1.address)).to.eq(value);
    });
  });

  describe('burning', async () => {
    it('reverts when burned by non-admin', async () => {
      const value = ethers.utils.parseEther('0.5');
      await SEuro.connect(address_1).mint(address_1.address, value);

      const burn = SEuro.connect(address_2).burn(address_1.address, value);

      await expect(burn).to.be.revertedWith('invalid-burner');
      expect(await SEuro.balanceOf(address_1.address)).to.eq(value);
    });

    it('burns when performed by admin', async () => {
      const value = ethers.utils.parseEther('0.5');
      await SEuro.connect(address_1).mint(address_1.address, value);

      const burn = SEuro.connect(address_1).burn(address_1.address, value);

      await expect(burn).not.to.be.revertedWith('invalid-burner');
      expect(await SEuro.balanceOf(address_1.address)).to.eq(0);
    });
  });

  describe('granting roles', async () => {
    it('allows contract owner to add roles', async () => {
      await SEuro.connect(owner).grantRole(MR, address_2.address);

      expect(await SEuro.hasRole(MR, address_2.address)).to.eq(true);
    });

    it('does not allow non-owner to add roles', async () => {
      const grant = SEuro.connect(address_1).grantRole(MR, address_2.address);

      await expect(grant).to.be.reverted;
      expect(await SEuro.hasRole(MR, address_2.address)).to.eq(false);
    });
  });
});
