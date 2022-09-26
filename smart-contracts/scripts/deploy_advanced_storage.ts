import { ethers } from "hardhat";

async function main() {
  const AdvancedStorage = await ethers.getContractFactory("AdvancedStorage");
  const advancedStorage = await AdvancedStorage.deploy();

  await advancedStorage.deployed();

  console.log(`AdvancedStorage deployed to ${advancedStorage.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
