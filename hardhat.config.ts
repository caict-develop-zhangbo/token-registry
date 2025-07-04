import "@nomicfoundation/hardhat-toolbox";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import { randomBytes } from "crypto";
import dotenv from "dotenv";
import "hardhat-watcher";
import { HardhatUserConfig, HttpNetworkUserConfig } from "hardhat/types";
import "./tasks";

dotenv.config();

const {
  INFURA_APP_ID,
  MNEMONIC,
  DEPLOYER_PK,
  COINMARKETCAP_API_KEY,
  ETHERSCAN_API_KEY,
  POLYGONSCAN_API_KEY,
  STABILITY_API_KEY,
  STABILITY_TESTNET_API_KEY,
  ASTRON_API_KEY,
  ASTRON_TESTNET_API_KEY,
} = process.env;
const IS_CI_ENV = process.env.NODE_ENV === "ci";

if (!IS_CI_ENV && !INFURA_APP_ID) {
  throw new Error("Infura key is not provided in env");
}

if (!IS_CI_ENV && !DEPLOYER_PK && !MNEMONIC) {
  throw new Error("Provide at least either deployer private key or mnemonic in env");
}

const networkConfig: HttpNetworkUserConfig = {};
if (IS_CI_ENV) {
  networkConfig.accounts = [`0x${randomBytes(32).toString("hex")}`];
} else if (DEPLOYER_PK) {
  networkConfig.accounts = [DEPLOYER_PK];
} else {
  networkConfig.accounts = {
    mnemonic: MNEMONIC!,
  };
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.22" }],

    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        "*": {
          "*": ["storageLayout"],
        },
      },
    },
  },
  typechain: {
    outDir: "src/contracts",
    // alwaysGenerateOverloads: true,
  },
  watcher: {
    test: {
      tasks: ["compile", "test"],
      files: ["./contracts", "./test"],
    },
  },
  gasReporter: {
    coinmarketcap: COINMARKETCAP_API_KEY,
    currency: "USD",
    enabled: true,
  },
  etherscan: {
    apiKey: {
      /**
       * Ethereum
       */
      mainnet: ETHERSCAN_API_KEY!,
      /**
       * Polygon
       */
      polygon: POLYGONSCAN_API_KEY!,
      /**
       * polygon amoy
       */
      polygonAmoy: POLYGONSCAN_API_KEY!,
      /**
       * Astron
       */
      astron: ASTRON_API_KEY!,
      /**
       * Astron testnet
       */
      astrontestnet: ASTRON_TESTNET_API_KEY!,
    },
    customChains: [
      {
        /**
         * Astron
         */
        network: "astron",
        chainId: 1338,
        urls: {
          apiURL: "https://astronscanl2.bitfactory.cn/api",
          browserURL: "https://astronscanl2.bitfactory.cn",
        },
      },
      {
        /**
         * Astron testnet
         */
        network: "astrontestnet",
        chainId: 21002,
        urls: {
          apiURL: "https://dev-astronscanl2.bitfactory.cn/api",
          browserURL: "https://dev-astronscanl2.bitfactory.cn",
        },
      },
    ],
  },
  networks: {
    /**
     * Ethereum
     */
    mainnet: {
      ...networkConfig,
      url: `https://mainnet.infura.io/v3/${INFURA_APP_ID}`,
    },
    sepolia: {
      ...networkConfig,
      url: "https://rpc.sepolia.org",
    },
    xdc: {
      ...networkConfig,
      url: "https://rpc.ankr.com/xdc",
    },
    xdcapothem: {
      ...networkConfig,
      url: "https://rpc.ankr.com/xdc_testnet",
    },
    stabilitytestnet: {
      ...networkConfig,
      url: `https://rpc.testnet.stabilityprotocol.com/zgt/${STABILITY_TESTNET_API_KEY}`,
    },
    stability: {
      ...networkConfig,
      // To get a API key, visit https://portal.stabilityprotocol.com
      url: `https://rpc.stabilityprotocol.com/zgt/${STABILITY_API_KEY}`,
    },
    /**
     * Polygon
     */
    polygon: {
      ...networkConfig,
      url: "https://polygon-rpc.com",
      // Comment line above and Uncomment line below if using Infura
      // url: `https://polygon-mainnet.infura.io/v3/${INFURA_APP_ID}`,
    },
    amoy: {
      ...networkConfig,
      url: "https://rpc-amoy.polygon.technology",
      // url: `https://polygon-amoy.infura.io/v3/${INFURA_APP_ID}`,
    },
    /**
     * Astron
     */
    astron: {
      ...networkConfig,
      url: `https://astronlayer2.bitfactory.cn/auth/${ASTRON_API_KEY}`,
    },
    /**
     * Astron testnet
     */
    astrontestnet: {
      ...networkConfig,
      url: `https://dev-astronlayer2.bitfactory.cn/auth/${ASTRON_TESTNET_API_KEY}`,
    },
    /**
     * Development
     */
    hardhat: {
      allowUnlimitedContractSize: true,
    },
    localhost: {
      ...networkConfig,
      accounts: "remote",
      url: "http://127.0.0.1:8545",
    },
  },
};

export default config;
