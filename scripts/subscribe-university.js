const { ethers } = require("hardhat");

async function main() {
  console.log("University  Subscribing University");
  console.log("==========================\n");

  // Get the university wallet (first account from Hardhat)
  const [universityWallet] = await ethers.getSigners();
  console.log(`University  University wallet: ${universityWallet.address}\n`);

  try {
    // Get the StudentsRegister contract
    const studentsRegisterAddress =
      "0xDe09E74d4888Bc4e65F589e8c13Bce9F71DdF4c7";
    const studentsRegister = await ethers.getContractAt(
      "StudentsRegister",
      studentsRegisterAddress
    );

    // Subscribe the university
    console.log("Deploying Subscribing university to the system...");
    const subscribeTx = await studentsRegister.subscribe(
      "Norwegian University of Science and Technology", // name
      "Norway", // country
      "NTNU" // shortName
    );

    console.log(`Deploying Transaction hash: ${subscribeTx.hash}`);
    console.log(`Waiting for confirmation...`);

    const receipt = await subscribeTx.wait();
    console.log(`Success University subscribed successfully!`);
    console.log(
      `University  University wallet address: ${
        receipt.logs[0]?.address || "Address not found in logs"
      }\n`
    );

    console.log(
      "Success University is now subscribed and ready to register students!"
    );
  } catch (error) {
    console.error("Error subscribing university:", error.message);
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
