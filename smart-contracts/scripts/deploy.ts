import { ethers } from "hardhat";

async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  const AdvancedStorage = await ethers.getContractFactory("AdvancedStorage");
  const advancedStorage = await AdvancedStorage.deploy();

  console.log(`SimpleStorage deployed to ${simpleStorage.address}`);
  console.log(`AdvancedStorage deployed to ${advancedStorage.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
