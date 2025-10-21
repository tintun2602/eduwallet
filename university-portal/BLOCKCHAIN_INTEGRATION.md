# Environment Configuration

## Blockchain Configuration

Set these environment variables in your `.env` file:

```bash
# University wallet private key (for blockchain transactions)
REACT_APP_UNIVERSITY_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Blockchain RPC URL (local development)
REACT_APP_BLOCKCHAIN_RPC_URL=http://localhost:8545
```

## Getting Started

1. **Start your local blockchain** (Hardhat, Ganache, etc.)
2. **Deploy the contracts** using the CLI:

   ```bash
   cd cli
   npm run deploy
   ```

3. **Register a university**:

   ```bash
   npm run subscribe-university
   ```

4. **Register some students**:

   ```bash
   npm run register-student
   ```

5. **Start the university portal**:
   ```bash
   cd university-portal
   npm start
   ```

## Important Notes

- The university portal now connects to real blockchain data
- Student IDs are derived from wallet addresses (first 8 characters)
- All student registration and academic result management goes through smart contracts
- Make sure your blockchain is running before using the portal
- The university wallet needs to have permissions to access student data
