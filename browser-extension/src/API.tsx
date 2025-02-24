import { Credentials, StudentModel } from "./models/student";
import { getStudent, getStudentsRegister, getStudentWallet } from "./utils/contractsUtils";

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
        const [studentsRegister, studentWallet] = await Promise.all([
            getStudentsRegister(),
            getStudentWallet(credentials)
        ]);

        // Get student's smart contract address
        const contractAddress = await studentsRegister
            .connect(studentWallet)
            .getStudentWallet(studentWallet.address);

        // Create and populate student model
        const student = new StudentModel(credentials.id, studentWallet, contractAddress);
        await getStudent(student);

        return student;
    } catch (error) {
        throw new Error('Authentication failed. Please check your credentials.');
    }
}
