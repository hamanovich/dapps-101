import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("AdvancedStorage", () => {
  const deployContract = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const AdvancedStorage = await ethers.getContractFactory("AdvancedStorage");
    const advancedStorage = await AdvancedStorage.deploy();

    return { advancedStorage, owner, otherAccount };
  };

  describe("Deployment", () => {
    it("Should add the id", async () => {
      const { advancedStorage } = await loadFixture(deployContract);
      await advancedStorage.add(0);
      expect(await advancedStorage.getValue(0)).to.equal(0);
      expect(await advancedStorage.getLength()).to.equal(1);
      expect(await advancedStorage.getAll()).to.deep.equal([0]);
    });
  });
});
