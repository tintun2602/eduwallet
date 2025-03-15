import { ethers } from 'hardhat';
import * as fs from 'fs';
import { StudentsRegister } from '../typechain-types';

const FILE = ".env";

/**
 * Writes or updates the contract address in the .env file
 * @param contractAddress - The deployed contract address
 */
function writeEnvVariable(contractAddress: string): void {
    const envVar = `CONTRACT_ADDRESS=${contractAddress}`;
    
    // Ensure .env file exists, create it if missing
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE, '');
    }
    
    // Append or update the variable
    const envContent = fs.readFileSync(FILE, 'utf8');
    
    // Check if the variable already exists and update it
    const regex = new RegExp(`^CONTRACT_ADDRESS=.*$`, 'm');
    if (regex.test(envContent)) {
        // Replace existing value
        const updatedContent = envContent.replace(regex, envVar);
        fs.writeFileSync(FILE, updatedContent);
    } else {
        // Append new value
        fs.appendFileSync(FILE, `\n${envVar}`);
    }
}

interface DeploymentResult {
    studentsRegister: StudentsRegister;
    address: string;
}

/**
 * Deploys the StudentsRegister contract
 * @returns Object containing the deployed contract instance and its address
 */
async function main(): Promise<DeploymentResult> {
    console.log("Deploying StudentsRegister contract...");

    const StudentsRegister = await ethers.getContractFactory("StudentsRegister");
    const studentsRegister = await StudentsRegister.deploy();

    await studentsRegister.waitForDeployment();

    const address = await studentsRegister.getAddress();
    console.log(`StudentsRegister deployed to: ${address}`);
    writeEnvVariable(address);

    return { 
        studentsRegister: studentsRegister,
        address
    };
}

// Execute standalone deployment
if (require.main === module) {
    main()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
}

// Export for importing in other scripts
export default main;