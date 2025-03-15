import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { ethers, Wallet, Contract, ContractTransaction } from 'ethers';
import * as crypto from 'crypto';
import * as deployScript from './deploy';
import { StudentsRegister, Student } from '../typechain-types';

// Define interfaces for better type safety
interface StudentWalletInfo {
    password: string;
    studentId: number;
    wallet: Wallet;
}

/**
 * Generates a random hexadecimal string.
 * @param length - Number of random bytes (default: 16).
 * @returns Random string in hex.
 */
function generateRandomString(length: number = 16): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * Derives a 256-bit private key from a password using PBKDF2.
 * @param password - The student's password (random string).
 * @param studentId - The student's unique ID number.
 * @returns A private key formatted as a hex string with '0x' prefix.
 */
function derivePrivateKey(password: string, studentId: number): string {
    const iterations = 100000;
    const keyLength = 32; // 32 bytes = 256 bits
    const salt = `student-${studentId}`;
    const derivedKey = crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256').toString('hex');
    return '0x' + derivedKey;
}

/**
 * Creates a new student wallet using student ID as salt.
 * @param studentId - The student's unique ID number.
 * @returns An object containing the student's password and wallet.
 */
function createStudentWallet(studentId: number): StudentWalletInfo {
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

async function main(): Promise<void> {
    const hre = require('hardhat') as HardhatRuntimeEnvironment;

    // Deploy contract if address not provided, otherwise connect to existing deployment
    let studentsRegister: StudentsRegister;
    let studentsRegisterAddress = process.env.CONTRACT_ADDRESS;

    if (!studentsRegisterAddress) {
        console.log("No contract address provided, deploying new contract...");
        const deployment = await deployScript.default();
        studentsRegister = deployment.studentsRegister as StudentsRegister;
        studentsRegisterAddress = deployment.address;
    } else {
        console.log(`Connecting to existing contract at ${studentsRegisterAddress}`);
        const StudentsRegister = await hre.ethers.getContractFactory("StudentsRegister");
        studentsRegister = StudentsRegister.attach(studentsRegisterAddress) as StudentsRegister;
    }

    // Get signers
    const [deployer, university] = await hre.ethers.getSigners();
    const provider = hre.ethers.provider;

    console.log("Using accounts:");
    console.log(`- Deployer: ${deployer.address}`);
    console.log(`- University: ${university.address}`);

    // Register university
    console.log("\nRegistering university...");
    const universityTx = await studentsRegister.connect(university).subscribe(
        "Politecnico di Torino",
        "Italy",
        "PoliTo"
    );
    await universityTx.wait();
    console.log(`University registered: ${university.address}`);

    // Create a student wallet from password
    console.log("\nCreating student wallet from password...");
    const studentWalletInfo = createStudentWallet(1);
    console.log(`Generated student password: ${studentWalletInfo.password}`);
    console.log(`Derived student wallet address: ${studentWalletInfo.wallet.address}`);

    // Fund the wallet
    console.log("\nFunding the password-derived wallet...");
    const fundTx = await deployer.sendTransaction({
        to: studentWalletInfo.wallet.address,
        value: ethers.parseEther("100.0")
    });
    await fundTx.wait();
    console.log(`Wallet funded with 100 ETH: ${studentWalletInfo.wallet.address}`);

    // Connect wallet to provider
    const connectedWallet = studentWalletInfo.wallet.connect(provider);

    // Register student
    console.log("\nRegistering student...");
    const birthDate = Math.floor(new Date("2000-01-01").getTime() / 1000);

    const registerTx = await studentsRegister.connect(university).registerStudent(
        studentWalletInfo.wallet.address,
        "John",
        "Doe",
        birthDate,
        "Milan",
        "Italy"
    );
    await registerTx.wait();

    // Get student wallet from contract
    const contractStudentWallet = await studentsRegister.connect(university).getStudentWallet(
        studentWalletInfo.wallet.address
    );
    console.log(`\nStudent smart wallet address from contract: ${contractStudentWallet}`);

    // Enroll student
    console.log("\nEnrolling student...");
    const Student = await hre.ethers.getContractFactory("Student");
    const studentContract = Student.attach(contractStudentWallet) as Student;

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

    // Evaluate student
    console.log("\nEvaluating student...");
    await studentContract.connect(university).evaluate(
        "14BHDOA",
        "30L/30",
        new Date().getTime(),
        "bafkreihayzzaoar5utwjileeljsib32oq5axxoutoglfrcbkvvkivm2uhq"
    );

    // Simulate authentication
    console.log("\nSimulating student authentication...");
    const recoveredWallet = new Wallet(
        derivePrivateKey(studentWalletInfo.password, 1)
    ).connect(provider);
    console.log(`Authenticated with wallet address: ${recoveredWallet.address}`);

    // Test authentication
    console.log("\nTesting authentication...");
    try {
        const studentWallet = await studentsRegister.connect(recoveredWallet).getStudentWallet(
            recoveredWallet.address
        );
        console.log(`Student successfully retrieved their wallet: ${studentWallet}`);
        console.log("Authentication successful!");
    } catch (error) {
        console.error("Authentication failed:", error instanceof Error ? error.message : String(error));
    }

    console.log("\nInteraction script completed successfully!");
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });