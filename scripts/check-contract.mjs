#!/usr/bin/env node

import { JsonRpcProvider } from "ethers";
import * as eduwallet from "../sdk/dist/index.js";

async function checkContractAddress() {
  console.log("Debugging Checking Contract Address");
  console.log("============================\n");

  try {
    // Connect to local blockchain
    const provider = new JsonRpcProvider("http://127.0.0.1:8545");

    // Get the contract address from SDK config
    console.log("Info SDK Configuration:");
    console.log(`   Network URL: http://127.0.0.1:8545`);

    // Get the StudentsRegister contract
    const studentsRegister = eduwallet.getStudentsRegister();
    console.log(`   Contract address: ${studentsRegister.target}`);

    // Check if contract exists at this address
    console.log("\nDebugging Checking contract existence...");
    const code = await provider.getCode(studentsRegister.target);
    console.log(`   Contract code length: ${code.length}`);

    if (code === "0x") {
      console.log("Error No contract found at this address!");
      console.log(
        "Tip The contract might not be deployed or the address is wrong."
      );
    } else {
      console.log("Success Contract found at this address!");
      console.log(`   Code: ${code.substring(0, 100)}...`);
    }

    // Try to call a simple function
    console.log("\nDebugging Testing contract function...");
    try {
      const supportsInterface = await studentsRegister.supportsInterface(
        "0x01ffc9a7"
      ); // ERC165 interface
      console.log(`   Supports ERC165: ${supportsInterface}`);
    } catch (error) {
      console.log(`   Error calling supportsInterface: ${error.message}`);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}

// Run the script
checkContractAddress().catch(console.error);
