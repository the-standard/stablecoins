const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SEuro", function () {
  const MR = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'));
  const BR = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('BURNER_ROLE'));
  let owner, address_1, SEuro;

  beforeEach(async () => {
    [owner, address_1] = await ethers.getSigners();
    const SEuroContract = await ethers.getContractFactory("SEuro");
    SEuro = await SEuroContract.connect(owner).deploy("sEURO", "SEUR", [address_1.address]);
    await SEuro.deployed();
  });

  describe('initialisation', async () => {
    it('grants minter and burner role to owner', async () => {
      expect(await SEuro.hasRole(MR, owner.address)).to.eq(true);
      expect(await SEuro.hasRole(BR, owner.address)).to.eq(true);
    });

    it('grants minter and burner role to owner', async () => {
      expect(await SEuro.hasRole(MR, owner.address)).to.eq(true);
      expect(await SEuro.hasRole(BR, owner.address)).to.eq(true);
    });
  });

  // it("initialises token with roles", async function () {

  //   let userBalance = await seuro.balanceOf(address_1.address);
  //   expect(userBalance).to.eq(0);

  //   const value = ethers.utils.parseEther("0.5");

  //   // mint
  //   await seuro.mint(address_1.address, value);

  //   userBalance = await seuro.balanceOf(address_1.address);
  //   expect(userBalance).to.eq(value);

  //   // burn
  //   await seuro.burn(address_1.address, value);

  //   userBalance = await seuro.balanceOf(address_1.address);
  //   expect(userBalance).to.eq(0);
  
  //   expect(await seuro.hasRole(mr, address_1.address)).to.eq(true);
    
  //   expect(await seuro.hasRole(br, owner.address)).to.eq(true);
  //   expect(await seuro.hasRole(br, address_1.address)).to.eq(true);
  // });


  // TODO test ownership and roles
});
