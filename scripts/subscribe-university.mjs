#!/usr/bin/env node

import { Wallet, JsonRpcProvider } from "ethers";
import * as eduwallet from "../sdk/dist/index.js";

async function subscribeUniversity() {
  console.log("University  Subscribing University");
  console.log("==========================\n");

  const universityPrivateKey = process.env.UNIVERSITY_PRIVATE_KEY;
  if (!universityPrivateKey) {
    console.error(
      "Error Error: UNIVERSITY_PRIVATE_KEY environment variable is required"
    );
    process.exit(1);
  }

  const universityWallet = new Wallet(universityPrivateKey);
  console.log(`University  University wallet: ${universityWallet.address}\n`);

  try {
    // Get the StudentsRegister contract
    const studentsRegister = eduwallet.getStudentsRegister();

    // Connect wallet to provider
    const provider = new JsonRpcProvider("http://127.0.0.1:8545");
    const connectedUniversity = universityWallet.connect(provider);

    // Subscribe the university
    console.log("Deploying Subscribing university to the system...");
    const subscribeTx = await studentsRegister
      .connect(connectedUniversity)
      .subscribe(
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
    console.error("💥 Error subscribing university:", error.message);
    process.exit(1);
  }
}

// Run the script
subscribeUniversity().catch(console.error);
