import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "solidity-coverage";
import * as dotenv from "dotenv";

dotenv.config();

const ALCHEMY_URL = process.env.ALCHEMY_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: {
    artifacts: "../client/public",
  },

  networks: {
    goerli: {
      url: ALCHEMY_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};

export default config;
