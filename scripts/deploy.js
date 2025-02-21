const hre = require("hardhat");
const fs = require('fs');

const FILE = ".env";

function write_env_variable(contract_address) {
    const envVar = `CONTRACT_ADDRESS=${contract_address}`;
    
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
    
    console.log('Environment variable written to .env');
}

async function main() {
    console.log("Deploying StudentsRegister contract...");

    const StudentsRegister = await hre.ethers.getContractFactory("StudentsRegister");
    const studentsRegister = await StudentsRegister.deploy();

    await studentsRegister.waitForDeployment();

    const address = await studentsRegister.getAddress();
    console.log(`StudentsRegister deployed to: ${address}`);
    write_env_variable(address);

    return { studentsRegister, address };
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
module.exports = main;