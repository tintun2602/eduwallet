import { ContractTransactionResponse } from "ethers";
import type { Credentials } from "./models/student";
import { StudentModel } from "./models/student";
import type UniversityModel from "./models/university";
import { getRawPermissions, getStudent, getStudentsRegister, getStudentWallet, getUniversity, grantPermission, revokePermission } from "./utils/contractsUtils";
import { Permission } from "./models/permissions";

/**
 * Authenticates a student and retrieves their information.
 * @author Diego Da Giau
 * @param {Credentials} credentials - The student's login credentials (ID and password)
 * @returns {Promise<StudentModel>} A promise that resolves to the authenticated student's data
 * @throws {Error} If authentication fails or student data cannot be retrieved
 */
export async function logIn(credentials: Credentials): Promise<StudentModel> {
    try {
        // Get contract instance and create student wallet
        const studentWalletPromise = getStudentWallet(credentials);
        const studentsRegister = getStudentsRegister();

        const studentWallet = await studentWalletPromise;

        // Get student's smart contract address
        const contractAddress = await studentsRegister
            .connect(studentWallet)
            .getStudentWallet(studentWallet.address);

        // Create and populate student model
        const student = new StudentModel(credentials.id, studentWallet, contractAddress);
        await getStudent(student);

        return student;
    } catch (error) {
        console.log("Student login failed: ", error);
        throw new Error('Authentication failed. Please check your credentials.');
    }
}

/**
 * Retrieves all universities associated with a student's academic results.
 * @author Diego Da Giau
 * @param {StudentModel} student - The student whose universities need to be retrieved
 * @param {string[]} universitiesAddresses - Ethereum addresses of universities to fetch
 * @returns {Promise<UniversityModel[]>} Array of university models with their details
 * @throws {Error} If universities cannot be retrieved or connection fails
 */
export async function getUniversities(student: StudentModel, universitiesAddresses: string[]): Promise<UniversityModel[]> {
    if (universitiesAddresses.length === 0) {
        return [];
    }

    try {
        // Get contract instance and university addresses
        const studentsRegister = getStudentsRegister();

        // Get wallet addresses for all universities
        const universitiesWallets = await studentsRegister
            .connect(student.wallet)
            .getUniversitiesWallets(universitiesAddresses);

        // Create university models with full information
        const universities: UniversityModel[] = [];
        for (let i = 0; i < universitiesWallets.length; ++i) {
            const university = await getUniversity(
                student,
                universitiesAddresses[i],
                universitiesWallets[i]
            );
            universities.push(university);
        }

        return universities;
    } catch (error) {
        console.error('Universities retrieval failed:', error);
        throw new Error('Failed to retrieve universities. Please try again later.');
    }
}

/**
 * Retrieves all permissions for a student from the blockchain.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @returns {Promise<Permission[]>} Array of all permissions (both requests and granted)
 */
export async function getPermissions(student: StudentModel): Promise<Permission[]> {
    return getRawPermissions(student);
}

/**
 * Performs the appropriate action on a permission based on its type.
 * For permission requests, grants the permission.
 * For existing permissions, revokes the permission.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @param {Permission} permission - The permission to process
 * @returns {Promise<ContractTransactionResponse>} Transaction response from the blockchain
 */
export async function performAction(student: StudentModel, permission: Permission): Promise<ContractTransactionResponse> {
    if (permission.request) {
        return grantPermission(student, permission);
    }
    return revokePermission(student, permission.university);
}
