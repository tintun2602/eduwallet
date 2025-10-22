#!/usr/bin/env node

import { Wallet, JsonRpcProvider } from "ethers";

async function fundUniversityWallet() {
  console.log("Funding University Wallet");
  console.log("============================\n");

  // Connect to local blockchain
  const provider = new JsonRpcProvider("http://127.0.0.1:8545");

  // Pre-funded account from hardhat config
  const funderPrivateKey =
    "0x0000000000000000000000000000000000000000000000000000000000000001";
  const funderWallet = new Wallet(funderPrivateKey, provider);

  // University wallet that needs funding
  const universityPrivateKey = process.env.UNIVERSITY_PRIVATE_KEY;
  if (!universityPrivateKey) {
    console.error(
      "Error Error: UNIVERSITY_PRIVATE_KEY environment variable is required"
    );
    process.exit(1);
  }

  const universityWallet = new Wallet(universityPrivateKey, provider);

  console.log(`Funder wallet: ${funderWallet.address}`);
  console.log(`University  University wallet: ${universityWallet.address}\n`);

  try {
    // Check balances
    const funderBalance = await provider.getBalance(funderWallet.address);
    const universityBalance = await provider.getBalance(
      universityWallet.address
    );

    console.log(
      `Funder balance: ${funderBalance.toString()} wei (${
        Number(funderBalance) / 1e18
      } ETH)`
    );
    console.log(
      `University  University balance: ${universityBalance.toString()} wei (${
        Number(universityBalance) / 1e18
      } ETH)\n`
    );

    if (funderBalance === 0n) {
      console.error("Error Error: Funder wallet has no balance!");
      process.exit(1);
    }

    if (universityBalance > 0n) {
      console.log("Success University wallet already has funds!");
      return;
    }

    // Send 1 ETH to university wallet (more than enough for 10 students)
    const amount = "1000000000000000000"; // 1 ETH in wei
    console.log(`💸 Sending 1 ETH to university wallet...`);

    const tx = await funderWallet.sendTransaction({
      to: universityWallet.address,
      value: amount,
    });

    console.log(`Deploying Transaction hash: ${tx.hash}`);
    console.log(`⏳ Waiting for confirmation...`);

    await tx.wait();

    const newBalance = await provider.getBalance(universityWallet.address);
    console.log(
      `Success Success! University wallet now has: ${
        Number(newBalance) / 1e18
      } ETH\n`
    );

    console.log(
      "Success University wallet is now funded and ready to register students!"
    );
  } catch (error) {
    console.error("💥 Error funding wallet:", error.message);
    process.exit(1);
  }
}

// Run the script
fundUniversityWallet().catch(console.error);
