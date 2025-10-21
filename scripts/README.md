# EduWallet Scripts

This directory contains utility scripts for managing the EduWallet blockchain system.

## Scripts Overview

### Deployment Scripts

- **`deploy.js`** - Deploys all smart contracts to the local Hardhat network
  - Deploys `StudentDeployer`, `UniversityDeployer`, and `StudentsRegister` contracts
  - Logs deployed contract addresses

### University Management Scripts

- **`subscribe-university.mjs`** - Subscribes the university to the StudentsRegister contract

  - Grants UNIVERSITY_ROLE to the university wallet
  - Required before registering students

- **`check-university.mjs`** - Checks university subscription status

  - Verifies if university has UNIVERSITY_ROLE
  - Shows registered university wallets

- **`debug-university.mjs`** - Debug university subscription issues
  - Detailed logging of university wallet and contract interactions
  - Helps troubleshoot subscription problems

### Student Management Scripts

- **`register-students.mjs`** - Registers multiple students in bulk

  - Registers 10 students from the provided list
  - Uses proper nonce management for concurrent transactions

- **`register-students.js`** - Alternative student registration script

  - Same functionality as `.mjs` version but in CommonJS format

- **`test-registration.mjs`** - Tests single student registration
  - Registers one test student to verify the system works
  - Useful for debugging registration issues

### Utility Scripts

- **`fund-wallet.mjs`** - Funds the university wallet with ETH

  - Transfers 1 ETH from Hardhat pre-funded account to university wallet
  - Required for paying transaction fees

- **`check-contract.mjs`** - Verifies contract deployment
  - Checks if contracts are deployed at expected addresses
  - Tests basic contract functionality

## Usage

All scripts should be run from the project root directory:

```bash
# Deploy contracts
node scripts/deploy.js

# Fund university wallet
node scripts/fund-wallet.mjs

# Subscribe university
node scripts/subscribe-university.mjs

# Register students
node scripts/register-students.mjs

# Check status
node scripts/check-university.mjs
```

## Prerequisites

1. **Local Blockchain**: Start Hardhat node with `npx hardhat node`
2. **Environment Variables**: Set `UNIVERSITY_PRIVATE_KEY` in your environment
3. **SDK Built**: Ensure SDK is built with `cd sdk && npm run build`

## Environment Variables

- `UNIVERSITY_PRIVATE_KEY` - Private key of the university wallet
- `BLOCKCHAIN_RPC_URL` - RPC URL for blockchain connection (defaults to localhost:8545)

## Script Execution Order

1. `deploy.js` - Deploy contracts
2. `fund-wallet.mjs` - Fund university wallet
3. `subscribe-university.mjs` - Subscribe university
4. `register-students.mjs` - Register students
5. `check-university.mjs` - Verify everything works
