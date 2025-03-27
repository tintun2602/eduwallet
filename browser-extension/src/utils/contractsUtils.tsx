import { ethers, Wallet } from 'ethers';
import { derivePrivateKey } from './utils';
import { StudentsRegister__factory } from "../../../typechain-types/factories/contracts/StudentsRegister__factory"
import { Student__factory } from "../../../typechain-types/factories/contracts/Student__factory"
import { Credentials, StudentModel } from "../models/student"
import { StudentsRegister } from '../../../typechain-types/contracts/StudentsRegister';
import UniversityModel from '../models/university';
import { University__factory } from "../../../typechain-types/factories/contracts/University__factory"
import { blockchainConfig } from './conf';

// Initialize provider once for reuse
const provider = new ethers.JsonRpcProvider(blockchainConfig.url);

/**
 * Retrieves the StudentsRegister contract instance.
 * @author Diego Da Giau
 * @returns {StudentsRegister} Connected contract instance
 */
export function getStudentsRegister(): StudentsRegister {
    return StudentsRegister__factory.connect(blockchainConfig.registerAddress, provider);
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
            basicInfo,
            results
        } = await contract.connect(student.wallet).getStudentInfo();

        // Update student model
        student.name = basicInfo.name;
        student.surname = basicInfo.surname;
        student.birthPlace = basicInfo.birthPlace;
        student.birthDate = new Date(Number(basicInfo.birthDate)).toLocaleDateString("en-US");
        student.country = basicInfo.country;

        // Update academic results
        student.updateResults(results);
    } catch (error) {
        console.error('Failed to fetch student data:', error);
        throw new Error('Could not retrieve student information');
    }
}

/**
 * Fetches university information from the blockchain and creates a UniversityModel instance.
 * @param {StudentModel} student - The authenticated student making the request
 * @param {string} universityAddress - The university's blockchain address
 * @param {string} universityWallet - The university's wallet contract address
 * @returns {Promise<UniversityModel>} A promise that resolves to the university model
 * @throws {Error} If university data cannot be retrieved or connection fails
 */
export async function getUniversity(student: StudentModel, universityAddress: string, universityWallet: string): Promise<UniversityModel> {
    try {
        // Connect to university's smart contract using its wallet address
        const contract = University__factory.connect(universityWallet, provider);

        // Fetch university information using student's credentials
        const {
            name,
            country,
            shortName
        } = await contract.connect(student.wallet).getUniversityInfo();

        // Create and return new university model with fetched data
        return new UniversityModel(
            name,
            country,
            shortName,
            universityAddress,
            universityWallet
        );
    } catch (error) {
        console.error('Failed to fetch university data:', error);
        throw new Error('Could not retrieve university information');
    }
}
