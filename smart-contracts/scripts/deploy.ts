import { ethers } from "hardhat";

async function main() {
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();

  const AdvancedStorage = await ethers.getContractFactory("AdvancedStorage");
  const advancedStorage = await AdvancedStorage.deploy();

  const CRUD = await ethers.getContractFactory("CRUD");
  const crud = await CRUD.deploy();

  const EtherWallet = await ethers.getContractFactory("EtherWallet");
  const etherWallet = await EtherWallet.deploy(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );

  console.log(`SimpleStorage deployed to ${simpleStorage.address}`);
  console.log(`AdvancedStorage deployed to ${advancedStorage.address}`);
  console.log(`CRUD deployed to ${crud.address}`);
  console.log(`EtherWallet deployed to ${etherWallet.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
