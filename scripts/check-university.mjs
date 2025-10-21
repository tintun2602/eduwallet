#!/usr/bin/env node

import { Wallet, JsonRpcProvider } from "ethers";
import * as eduwallet from "../sdk/dist/index.js";

async function checkUniversityStatus() {
  console.log("Debugging Checking University Status");
  console.log("=============================\n");

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
    // Connect wallet to provider
    const provider = new JsonRpcProvider("http://127.0.0.1:8545");
    const connectedUniversity = universityWallet.connect(provider);

    // Get the StudentsRegister contract
    const studentsRegister = eduwallet.getStudentsRegister();

    // Check if university is subscribed using hasRole
    const UNIVERSITY_ROLE =
      "0x" + Buffer.from("UNIVERSITY_ROLE").toString("hex").padStart(64, "0");
    const isSubscribed = await studentsRegister.hasRole(
      UNIVERSITY_ROLE,
      universityWallet.address
    );
    console.log(`Info University subscribed: ${isSubscribed}`);

    if (!isSubscribed) {
      console.log("Error University is not subscribed! Need to subscribe first.");
      console.log(
        "Tip Run: npx hardhat run scripts/subscribe-university.js --network localhost"
      );
      return;
    }

    // Get university wallet address
    const universityWalletAddress = await studentsRegister.universityWallets(
      universityWallet.address
    );
    console.log(`University  University wallet address: ${universityWalletAddress}\n`);

    // Check how many students are registered
    const studentCount = await studentsRegister.getStudentCount();
    console.log(`👥 Total students registered: ${studentCount}\n`);

    console.log(
      "Success University is properly subscribed and ready to register students!"
    );
  } catch (error) {
    console.error("💥 Error checking university status:", error.message);
    process.exit(1);
  }
}

// Run the script
checkUniversityStatus().catch(console.error);
