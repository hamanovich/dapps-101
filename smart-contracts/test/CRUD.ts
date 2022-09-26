import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("CRUD", () => {
  const deployContract = async () => {
    const [owner, otherAccount] = await ethers.getSigners();

    const CRUD = await ethers.getContractFactory("CRUD");
    const contract = await CRUD.deploy();

    return { contract, owner, otherAccount };
  };

  describe("Deployment", () => {
    it("Create and Read", async () => {
      const { contract } = await loadFixture(deployContract);
      await contract.create("Max");
      const [, name] = await contract.read(1);
      expect(name).to.equal("Max");
    });

    it("Update", async () => {
      const { contract } = await loadFixture(deployContract);
      await contract.create("Max");
      await contract.update(1, "Kate");
      const [, name] = await contract.read(1);
      expect(name).to.equal("Kate");
    });

    it("Destroy", async () => {
      const { contract } = await loadFixture(deployContract);
      await contract.create("Max");
      await contract.create("Kate");
      const [, name1] = await contract.read(1);
      const [, name2] = await contract.read(2);
      expect(name1).to.equal("Max");
      expect(name2).to.equal("Kate");
      await contract.destroy(1);
      await expect(contract.read(1)).to.be.revertedWith("User doesn't exist!");
    });
  });
});
