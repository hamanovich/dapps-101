import { ethers } from "hardhat";

async function main() {
  const EtherWallet = await ethers.getContractFactory("EtherWallet");
  const etherWallet = await EtherWallet.deploy(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );

  await etherWallet.deployed();

  console.log(`EtherWallet deployed to ${etherWallet.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
