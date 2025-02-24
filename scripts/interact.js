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
 * @param {string} studentId - The student's unique ID number.
 * @returns {string} A private key formatted as a hex string with '0x' prefix.
 */
function derivePrivateKey(password, studentId) {
    const iterations = 100000;
    const keyLength = 32; // 32 bytes = 256 bits
    // Use student ID as salt for uniqueness
    const salt = `student-${studentId}`;
    // Derive key using PBKDF2 with SHA-256
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256').toString('hex');
    return '0x' + derivedKey;
}

/**
 * Creates a new student wallet using student ID as salt.
 * @param {string} studentId - The student's unique ID number.
 * @returns {object} An object containing the student's password and wallet.
 */
function createStudentWallet(studentId) {
    if (!studentId) {
        throw new Error('Student ID is required to create wallet');
    }
    const randomString = generateRandomString();
    const privateKey = derivePrivateKey(randomString, studentId);
    const wallet = new Wallet(privateKey);
    return {
        password: randomString,
        studentId: studentId,
        wallet: wallet
    };
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
    const universityWallet = await studentsRegister.connect(university).subscribe("Politecnico di Torino", "Italy", "PoliTo");
    console.log(`University registered: ${university.address}`);

    // Create a student wallet from password
    console.log("\nCreating student wallet from password...");
    const studentWalletInfo = createStudentWallet(1);
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

    console.log("\nEnrolling student using password-derived wallet as identity...");
    const Student = await hre.ethers.getContractFactory("Student");
    studentContract = Student.attach(contractStudentWallet);

    await studentContract.connect(university).enroll(
        "14BHDOA",
        "Computer Science",
        "Bachelor in COMPUTER SCIENCE",
        8,
        0
    );
    await studentContract.connect(university).enroll(
        "14BHDYT",
        "Prova",
        "Master in COMPUTER SCIENCE",
        7,
        5
    );

    console.log("\nEvaluating student using password-derived wallet as identity...");
    await studentContract.connect(university).evaluate("14BHDOA", "30L/30", new Date().getTime());

    // Simulate student authentication by recovering wallet from password
    console.log("\nSimulating student authentication with password...");
    const recoveredWallet = new Wallet(derivePrivateKey(studentWalletInfo.password, 1)).connect(provider);
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
