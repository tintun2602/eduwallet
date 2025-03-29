import { ethers, Wallet } from 'ethers';
import { derivePrivateKey } from './utils';
import { StudentsRegister__factory } from "../../../typechain-types/factories/contracts/StudentsRegister__factory"
import { Student__factory } from "../../../typechain-types/factories/contracts/Student__factory"
import { Credentials, StudentModel } from "../models/student"
import { StudentsRegister } from '../../../typechain-types/contracts/StudentsRegister';
import UniversityModel from '../models/university';
import { University__factory } from "../../../typechain-types/factories/contracts/University__factory"
import { blockchainConfig, roleCodes } from './conf';
import { Student } from '../../../typechain-types/contracts/Student';
import { ContractTransactionResponse } from 'ethers';
import { Permission, PermissionType } from '../models/permissions';

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
 * Gets a connected instance of a Student contract for interaction.
 * @author Diego Da Giau
 * @param {StudentModel} student - Student model containing contract address
 * @returns {Student} Connected student contract instance
 */
export function getStudentContract(student: StudentModel): Student {
    return Student__factory.connect(student.contractAddress, provider);
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
        const contract = getStudentContract(student);

        // Fetch student info
        const {
            basicInfo,
            results
        } = await contract.connect(student.wallet).getStudentInfo();

        // Update student model
        student.name = basicInfo.name;
        student.surname = basicInfo.surname;
        student.birthPlace = basicInfo.birthPlace;
        student.birthDate = new Date(Number(basicInfo.birthDate) * 1000).toLocaleDateString();
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

/**
 * Retrieves all permission records for a student from the blockchain.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @returns {Promise<Permission[]>} Array of all permissions (both requests and granted)
 * @throws {Error} If permissions cannot be retrieved from the blockchain
 */
export async function getRawPermissions(student: StudentModel): Promise<Permission[]> {
    try {
        // Connect contract with student's wallet for auth
        const studentContract = getStudentContract(student).connect(student.wallet);

        // Get actual permissions in parallel using the retrieved types
        const [
            readRequests,
            writeRequests,
            reads,
            writes
        ] = await Promise.all([
            studentContract.getPermissions(roleCodes.readRequest),
            studentContract.getPermissions(roleCodes.writeRequest),
            studentContract.getPermissions(roleCodes.read),
            studentContract.getPermissions(roleCodes.write)
        ]);

        // Map string arrays to Permission objects arrays
        const readRequestPermissions: Permission[] = readRequests.map(universityAddress => ({
            university: universityAddress,
            type: PermissionType.Read,
            request: true
        }));

        const writeRequestPermissions: Permission[] = writeRequests.map(universityAddress => ({
            university: universityAddress,
            type: PermissionType.Write,
            request: true
        }));

        const readPermissions: Permission[] = reads.map(universityAddress => ({
            university: universityAddress,
            type: PermissionType.Read,
            request: false
        }));

        const writePermissions: Permission[] = writes.map(universityAddress => ({
            university: universityAddress,
            type: PermissionType.Write,
            request: false
        }));

        return [...readRequestPermissions, ...writeRequestPermissions, ...readPermissions, ...writePermissions];
    } catch (error) {
        console.error('Failed to fetch permissions:', error);
        throw new Error('Could not retrieve permission information');
    }
}

/**
 * Revokes a university's permission to access student data.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @param {string} universityAddress - The address of the university to revoke
 * @returns {Promise<ContractTransactionResponse>} Transaction response from the blockchain
 */
export async function revokePermission(student: StudentModel, universityAddress: string): Promise<ContractTransactionResponse> {
    const contract = getStudentContract(student).connect(student.wallet);
    return contract.revokePermission(universityAddress);
}

/**
 * Grants permission to a university to access student data.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @param {Permission} permission - The permission to grant, including university and type
 * @returns {Promise<ContractTransactionResponse>} Transaction response from the blockchain
 */
export async function grantPermission(student: StudentModel, permission: Permission): Promise<ContractTransactionResponse> {
    const contract = getStudentContract(student).connect(student.wallet);
    let permissionType: string = "";
    switch (permission.type) {
        case PermissionType.Read:
            permissionType = roleCodes.read;
            break;
        case PermissionType.Write:
            permissionType = roleCodes.write;
            break;
        default:
            // Handle invalid permission type
            throw new Error("Invalid permission type specified");
    }
    return await contract.grantPermission(permissionType, permission.university);
}
