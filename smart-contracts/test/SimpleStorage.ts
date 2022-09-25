import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("SimpleStorage", () => {
  const deployContract = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
    const simpleStorage = await SimpleStorage.deploy();

    return { simpleStorage, owner, otherAccount };
  };

  describe("Deployment", () => {
    it("Should get the data", async () => {
      const { simpleStorage } = await loadFixture(deployContract);

      expect(await simpleStorage.getData()).to.equal("");
    });

    it("Should set the data", async () => {
      const { simpleStorage } = await loadFixture(deployContract);
      await simpleStorage.setData("Hello");
      expect(await simpleStorage.getData()).to.equal("Hello");
    });
  });
});
