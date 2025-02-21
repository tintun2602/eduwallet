const hre = require("hardhat");
const deployScript = require("./deploy");
const { Wallet } = require('ethers');
const crypto = require('crypto');

/**
 * Generates a random hexadecimal string.
 * @param {number} length - Number of random bytes (default: 16).
 * @returns {string} Random string in hex.
 */
function generateRandomString(length = 16) {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Derives a 256-bit private key from a password using PBKDF2.
 * @param {string} password - The student's password (random string).
 * @param {string} salt - A salt value (should be unique per user in production).
 * @returns {string} A private key formatted as a hex string with '0x' prefix.
 */
function derivePrivateKey(password, salt) {
    const iterations = 100000;
    const keyLength = 32; // 32 bytes = 256 bits
    // Derive key using PBKDF2 with SHA-256.
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256').toString('hex');
    return '0x' + derivedKey;
}

/**
 * Creates a new student wallet.
 * @returns {object} An object containing the student's password, derived private key, and wallet.
 */
function createStudentWallet() {
    // Generate a random string to act as the student's password.
    const randomString = generateRandomString();
    // For demonstration, we use a fixed salt. In production, use a unique salt for each user.
    const salt = 'unique-university-salt';
    // Derive the private key from the random string.
    const privateKey = derivePrivateKey(randomString, salt);
    // Create an Ethereum wallet using ethers.js.
    const wallet = new Wallet(privateKey);
    return {
        password: randomString,
        privateKey: privateKey,
        wallet: wallet
    };
}

/**
 * Simulates student login by deriving the wallet from the provided password.
 * @param {string} inputPassword - The password provided by the student.
 * @param {string} salt - The salt used during wallet creation.
 * @returns {Wallet} The wallet instance created from the derived private key.
 */
function loginStudent(inputPassword, salt = 'unique-university-salt') {
    const privateKey = derivePrivateKey(inputPassword, salt);
    return new Wallet(privateKey);
}

async function main() {
    // Deploy contract if address not provided, otherwise connect to existing deployment
    let studentsRegister;
    let studentsRegisterAddress = process.env.CONTRACT_ADDRESS;

    if (!studentsRegisterAddress) {
        console.log("No contract address provided, deploying new contract...");
        const deployment = await deployScript();
        studentsRegister = deployment.studentsRegister;
        studentsRegisterAddress = deployment.address;
    } else {
        console.log(`Connecting to existing contract at ${studentsRegisterAddress}`);
        const StudentsRegister = await hre.ethers.getContractFactory("StudentsRegister");
        studentsRegister = StudentsRegister.attach(studentsRegisterAddress);
    }

    // Get signers
    const [deployer, university] = await hre.ethers.getSigners();
    const provider = hre.ethers.provider;

    console.log("Using accounts:");
    console.log(`- Deployer: ${deployer.address}`);
    console.log(`- University: ${university.address}`);

    // Register university
    console.log("\nRegistering university...");
    const subscribeTx = await studentsRegister.connect(university).subscribe();
    await subscribeTx.wait();
    console.log(`University registered: ${university.address}`);

    // Create a student wallet from password
    console.log("\nCreating student wallet from password...");
    const studentWalletInfo = createStudentWallet();
    console.log(`Generated student password: ${studentWalletInfo.password}`);
    console.log(`Derived student wallet address: ${studentWalletInfo.wallet.address}`);

    // Fund the password-derived wallet to enable transactions
    // This is for testing purposes - in production you'd need a proper onboarding flow
    console.log("\nFunding the password-derived wallet so it can perform transactions...");
    const fundTx = await deployer.sendTransaction({
        to: studentWalletInfo.wallet.address,
        value: hre.ethers.parseEther("100.0")
    });
    await fundTx.wait();
    console.log(`Wallet funded with 1 ETH: ${studentWalletInfo.wallet.address}`);

    // Connect the wallet to the provider so it can make transactions
    const connectedWallet = studentWalletInfo.wallet.connect(provider);

    // Register the student using the password-derived wallet as their identity
    console.log("\nRegistering student using password-derived wallet as identity...");
    const birthDate = Math.floor(new Date("2000-01-01").getTime() / 1000);

    const registerTx = await studentsRegister.connect(university).registerStudent(
        studentWalletInfo.wallet.address, // Using derived wallet as student identity
        "John",
        "Doe",
        birthDate,
        "Milan",
        "Italy"
    );
    await registerTx.wait();
    console.log(`Student registered with password-derived wallet: ${studentWalletInfo.wallet.address}`);

    // Get student wallet from the contract
    const contractStudentWallet = await studentsRegister.connect(university).getStudentWallet(studentWalletInfo.wallet.address);
    console.log(`\nStudent smart wallet address from contract: ${contractStudentWallet}`);

    // Simulate student authentication by recovering wallet from password
    console.log("\nSimulating student authentication with password...");
    const recoveredWallet = new Wallet(derivePrivateKey(studentWalletInfo.password, 'unique-university-salt')).connect(provider);
    console.log(`Authenticated with wallet address: ${recoveredWallet.address}`);

    // Have the student check their own wallet using the recovered wallet
    console.log("\nStudent accessing their information with recovered wallet...");
    try {
        const studentWallet = await studentsRegister.connect(recoveredWallet).getStudentWallet(recoveredWallet.address);
        console.log(`Student successfully retrieved their wallet: ${studentWallet}`);
        console.log("Authentication successful!");
    } catch (error) {
        console.error("Authentication failed:", error.message);
    }

    console.log("\nInteraction script completed successfully!");
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
