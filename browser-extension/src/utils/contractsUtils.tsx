import { ethers, Wallet } from 'ethers';
import { derivePrivateKey } from './utils';
import { StudentsRegister__factory } from "../../../typechain-types/factories/contracts/StudentsRegister__factory"
import { Student__factory } from "../../../typechain-types/factories/contracts/Student__factory"
import { Credentials, StudentModel } from "../models/student"
import { StudentsRegister } from '../../../typechain-types/contracts/StudentsRegister';

/**
 * Network configuration
 * @dev Update these values based on your environment
 */
const NETWORK_CONFIG = {
    url: "http://127.0.0.1:8545",
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3"
} as const;

// Initialize provider once for reuse
const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.url);

/**
 * Retrieves the StudentsRegister contract instance.
 * @author Diego Da Giau
 * @throws {Error} If contract address or network URL is not configured
 * @returns {Promise<StudentsRegister>} Connected contract instance
 */
export async function getStudentsRegister(): Promise<StudentsRegister> {
    return StudentsRegister__factory.connect(NETWORK_CONFIG.contractAddress, provider);
}

/**
 * Creates a student wallet from credentials.
 * @author Diego Da Giau
 * @param {Credentials} credentials - Student's login credentials
 * @returns {Promise<Wallet>} Connected wallet instance
 */
export async function getStudentWallet(credentials: Credentials): Promise<Wallet> {
    const privateKey = await derivePrivateKey(credentials.password, credentials.id);
    return new Wallet(privateKey, provider);
}

/**
 * Fetches and updates student information from the blockchain.
 * @author Diego Da Giau
 * @param {StudentModel} student - Student model to update
 * @throws {Error} If contract connection fails
 */
export async function getStudent(student: StudentModel): Promise<void> {
    try {
        // Connect to student's contract
        const contract = Student__factory.connect(student.contractAddress, provider);

        // Fetch student info
        const {
            name,
            surname,
            birthDate,
            birthPlace,
            country,
            results
        } = await contract.connect(student.wallet).getStudentInfo();

        // Update student model
        student.name = name;
        student.surname = surname;
        student.birthPlace = birthPlace;
        student.birthDate =  new Date(Number(birthDate)).toLocaleDateString("en-US");
        student.country = country; 

        // Update academic results
        student.updateResults(results);
    } catch (error) {
        console.error('Failed to fetch student data:', error);
        throw new Error('Could not retrieve student information');
    }
}
