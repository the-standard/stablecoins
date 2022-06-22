const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SEuro", function () {
  it("Should return the new vault ID once it's deployed", async function () {
    const [owner, address_1] = await ethers.getSigners();

    const SEURO = await ethers.getContractFactory("SEuro");
    const seuro = await SEURO.deploy("SEURO", "SEUR", [address_1.address]);
    await seuro.deployed();

    let userBalance = await seuro.balanceOf(address_1.address);
    expect(userBalance).to.eq(0);

    const value = ethers.utils.parseEther("0.5");

    // mint
    await seuro.mint(address_1.address, value);

    userBalance = await seuro.balanceOf(address_1.address);
    expect(userBalance).to.eq(value);

    // burn
    await seuro.burn(address_1.address, value);

    userBalance = await seuro.balanceOf(address_1.address);
    expect(userBalance).to.eq(0);
  
    const mr = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('MINTER_ROLE'));
    expect(await seuro.hasRole(mr, owner.address)).to.eq(true);
    expect(await seuro.hasRole(mr, address_1.address)).to.eq(true);
    
    const br = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('BURNER_ROLE'));
    expect(await seuro.hasRole(br, owner.address)).to.eq(true);
    expect(await seuro.hasRole(br, address_1.address)).to.eq(true);
  });


  // TODO test ownership and roles
});
