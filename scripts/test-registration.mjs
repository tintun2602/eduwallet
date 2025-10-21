#!/usr/bin/env node

import { Wallet, JsonRpcProvider } from "ethers";
import * as eduwallet from "../sdk/dist/index.js";

async function testStudentRegistration() {
  console.log("Testing Testing Student Registration");
  console.log("================================\n");

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

    // Test student data
    const studentData = {
      name: "Test",
      surname: "Student",
      birthDate: "2000-01-01",
      birthPlace: "Oslo",
      country: "Norway",
    };

    console.log("Deploying Attempting to register test student...");

    // Register student using SDK
    const credentials = await eduwallet.registerStudent(
      connectedUniversity,
      studentData
    );

    console.log(`Success Successfully registered test student!`);
    console.log(`   Student ID: ${credentials.id}`);
    console.log(`   Password: ${credentials.password}`);
    console.log(`   Academic Wallet: ${credentials.academicWalletAddress}`);
    console.log(`   ETH Wallet: ${credentials.ethWallet.address}\n`);
  } catch (error) {
    console.error("💥 Error registering test student:", error.message);
    console.error("Full error:", error);
  }
}

// Run the script
testStudentRegistration().catch(console.error);
