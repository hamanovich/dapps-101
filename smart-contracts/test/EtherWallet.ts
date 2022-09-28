import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("EtherWallet", () => {
  const deployContract = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const EtherWallet = await ethers.getContractFactory("EtherWallet");
    const contract = await EtherWallet.deploy('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266');

    return { contract, owner, otherAccount };
  };

  describe("Deployment", () => {
    it("Balance is zero", async () => {
      const { contract } = await loadFixture(deployContract);

      expect(await contract.balanceOf()).to.equal(0);
    });

    it("Deposit 10eth", async () => {
      const { contract, owner } = await loadFixture(deployContract);
      
     await contract.connect(owner).deposit({from: owner.address, value: 10});
      expect(await contract.balanceOf()).to.equal(10);
    });
  });
});
