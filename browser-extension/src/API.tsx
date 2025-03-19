import { Credentials, StudentModel } from "./models/student";
import UniversityModel from "./models/university";
import { getStudent, getStudentsRegister, getStudentWallet, getUniversity } from "./utils/contractsUtils";

/**
 * Authenticates a student and retrieves their information.
 * @author Diego Da Giau
 * @param {Credentials} credentials - The student's login credentials (ID and password)
 * @returns {Promise<StudentModel>} A promise that resolves to the authenticated student's data
 * @throws {Error} If authentication fails or student data cannot be retrieved
 * 
 * TODO: change from Promise.all to async call without await
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
        console.log("Student login failed: ", error);
        throw new Error('Authentication failed. Please check your credentials.');
    }
}

/**
 * Retrieves all universities associated with a student's academic results.
 * @author Diego Da Giau
 * @param {StudentModel} student - The student whose universities need to be retrieved
 * @returns {Promise<UniversityModel[]>} Array of university models with their details
 * @throws {Error} If universities cannot be retrieved or connection fails
 * 
 * TODO: change from Promise.all to async call without await
 */
export async function getUniversities(student: StudentModel): Promise<UniversityModel[]> {
    try {
        // Get contract instance and university addresses in parallel
        const [studentsRegister, universitiesAddresses] = await Promise.all([
            getStudentsRegister(),
            Array.from(student.getResultsUniversities())
        ]);

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
