require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.0",
  networks: {
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/_z8P3FsxcaqvHI75aR_8cspyuhPiqMN-",
      accounts: ["1b2415500295836918b715970cf0d2613fb8a44adb15329ae135ccaa4b7a2d12"]
    }
  }
};
