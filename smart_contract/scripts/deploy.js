const main = async () => {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  
  // Deploy the contract
  const transactions = await Transactions.deploy();

  // Wait for the contract to be deployed and mined
  const receipt = await transactions.waitForDeployment();

  // Log the contract address
  console.log("Transactions contract address: ", transactions.target);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
