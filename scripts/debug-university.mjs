#!/usr/bin/env node

/**
 * University Subscription Debug Script
 * Debugs university subscription and role management
 * @author Diego Da Giau
 * @co-author Tin Tun Naing
 */

import { Wallet, JsonRpcProvider } from "ethers";
import * as eduwallet from "../sdk/dist/index.js";

async function debugUniversitySubscription() {
  console.log("Debugging Debugging University Subscription");
  console.log("====================================\n");

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

    // Try to get the university wallet address directly
    console.log("Debugging Checking university wallet mapping...");
    try {
      const universityWalletAddresses =
        await studentsRegister.getUniversitiesWallets([
          universityWallet.address,
        ]);
      console.log(
        `University  University wallet addresses: ${universityWalletAddresses}`
      );

      if (
        universityWalletAddresses[0] ===
        "0x0000000000000000000000000000000000000000"
      ) {
        console.log(
          "Error University wallet address is zero - university not properly subscribed!"
        );
      } else {
        console.log(
          "Success University wallet address found - university is subscribed!"
        );
      }
    } catch (error) {
      console.log(`Error Error getting university wallet: ${error.message}`);
    }

    // Try to check role using a different approach
    console.log("\nDebugging Checking university role...");
    try {
      const UNIVERSITY_ROLE =
        "0x" + Buffer.from("UNIVERSITY_ROLE").toString("hex").padStart(64, "0");
      console.log(`🔑 UNIVERSITY_ROLE hash: ${UNIVERSITY_ROLE}`);
      const hasRole = await studentsRegister.hasRole(
        UNIVERSITY_ROLE,
        universityWallet.address
      );
      console.log(`Info Has UNIVERSITY_ROLE: ${hasRole}`);
    } catch (error) {
      console.log(`Error Error checking role: ${error.message}`);
    }

    // Check if we can call getStudentWallet with a dummy address
    console.log("\nDebugging Testing getStudentWallet with dummy address...");
    try {
      const dummyAddress = "0x0000000000000000000000000000000000000001";
      const studentWallet = await studentsRegister.getStudentWallet(
        dummyAddress
      );
      console.log(`Student Student wallet for dummy address: ${studentWallet}`);
    } catch (error) {
      console.log(`Error Error calling getStudentWallet: ${error.message}`);
    }
  } catch (error) {
    console.error("💥 Error:", error.message);
  }
}

// Run the script
debugUniversitySubscription().catch(console.error);
