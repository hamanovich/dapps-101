import { ethers } from "hardhat";

async function deploy() {
  const contract = await ethers.getContractFactory(
    "RockPaperScissors"
  );
  const rockPaperScissors = await contract.deploy();

  await rockPaperScissors.deployed();

  console.log(`contract deployed to ${rockPaperScissors.address}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
