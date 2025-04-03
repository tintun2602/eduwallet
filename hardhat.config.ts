import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    hardhat: {
      // mining: {
      //   auto: true,
      //   interval: 20000
      // },
      accounts: [
        {
          balance: "10000000000000000000000000000000",
          privateKey: "0x0000000000000000000000000000000000000000000000000000000000000001"
        }
      ]
    },
    localhost: {
      // mining: {
      //   auto: true,
      //   interval: 20000
      // },
      url: "http://127.0.0.1:8545"
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};

export default config;
