import type { Wallet } from "ethers";
import type { CourseInfo, Evaluation, Student, StudentCredentials, StudentData } from "./types";
import { computeDate, createStudentWallet, generateStudent, getStudentContract, getStudentsRegister, publishCertificate } from "./utils";
import { provider } from "./conf";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';
import type { Student as StudentContract } from '@typechain/contracts/Student';

/**
 * Re-export types for SDK consumers
 */
export type { StudentCredentials, StudentData, CourseInfo, Evaluation, Student };
export { getStudentsRegister };

// Configure dayjs to use UTC for consistent date handling across timezones
dayjs.extend(utc);

/**
 * Registers a new student in the academic blockchain system.
 * Creates both a student Ethereum wallet and academic record.
 * @author Diego Da Giau
 * @param {Wallet} universityWallet - The university wallet with registration permissions
 * @param {StudentData} student - The student information to register
 * @returns {Promise<StudentCredentials>} The created student credentials and wallet information
 */
export async function registerStudent(universityWallet: Wallet, student: StudentData): Promise<StudentCredentials> {
    // Get contract instance
    const studentsRegister = getStudentsRegister();

    // Create a new Ethereum wallet for the student
    const studentEthWallet = createStudentWallet();

    // Connect university wallet to provider
    const connectedUniversity = universityWallet.connect(provider);

    // Format student data for the contract
    const basinInfo: StudentContract.StudentBasicInfoStruct = {
        name: student.name,
        surname: student.surname,
        birthDate: dayjs.utc(student.birthDate).unix(),
        birthPlace: student.birthPlace,
        country: student.country
    }

    // Register student on the blockchain
    const registerTx = await studentsRegister.connect(connectedUniversity).registerStudent(
        studentEthWallet.ethWallet?.address,
        basinInfo
    );
    await registerTx.wait();

    // Get the academic wallet address created for the student
    const studentAcademicWalletAddress = await studentsRegister.connect(universityWallet).getStudentWallet(studentEthWallet.ethWallet.address);

    // Return complete student credentials
    return {
        id: studentEthWallet.id,
        password: studentEthWallet.password,
        academicWalletAddress: studentAcademicWalletAddress,
        ethWallet: studentEthWallet.ethWallet,
    }
}

/**
 * Enrolls a student in one or more academic courses.
 * Adds course records to the student's academic wallet.
 * @author Diego Da Giau
 * @param {Wallet} universityWallet - The university wallet with enrollment permissions
 * @param {string} studentWalletAddress - The student's academic wallet address
 * @param {CourseInfo[]} courses - Array of courses to enroll the student in
 * @returns {Promise<void>} Promise that resolves when enrollment is complete
 */
export async function enrollStudent(universityWallet: Wallet, studentWalletAddress: string, courses: CourseInfo[]): Promise<void> {
    // Get student contract instance
    const studentWallet = getStudentContract(studentWalletAddress);

    // Enroll student in each provided course
    for (const course of courses) {
        await studentWallet.connect(universityWallet).enroll(
            course.code,
            course.name,
            course.degreeCourse,
            BigInt(course.ects * 100)
        );
    }
}

/**
 * Records academic evaluations for a student's enrolled courses.
 * Publishes certificates to IPFS when provided.
 * @author Diego Da Giau
 * @param {Wallet} universityWallet - The university wallet with evaluation permissions
 * @param {string} studentWalletAddress - The student's academic wallet address
 * @param {Evaluation[]} evaluations - Array of academic evaluations to record
 * @returns {Promise<void>} Promise that resolves when evaluations are recorded
 */
export async function evaluateStudent(universityWallet: Wallet, studentWalletAddress: string, evaluations: Evaluation[]): Promise<void> {
    // Get student contract instance
    const studentWallet = getStudentContract(studentWalletAddress);

    // Process each evaluation
    for (const evaluation of evaluations) {
        // Publish certificate to IPFS if provided
        const certificate = evaluation.certificate ? await publishCertificate(evaluation.certificate) : "";

        // Record evaluation on the blockchain
        await studentWallet.connect(universityWallet).evaluate(
            evaluation.code,
            evaluation.grade,
            dayjs.utc(evaluation.evaluationDate).unix(),
            certificate
        );
    }
}

/**
 * Retrieves basic student information from the blockchain.
 * Only fetches personal data without academic results.
 * @author Diego Da Giau
 * @param {Wallet} universityWallet - The university wallet with read permissions
 * @param {string} studentWalletAddress - The student's academic wallet address
 * @returns {Promise<Student>} The student's basic information
 */
export async function getStudentInfo(universityWallet: Wallet, studentWalletAddress: string): Promise<Student> {
    // Get student contract instance
    const studentWallet = getStudentContract(studentWalletAddress);

    // Fetch student's basic information
    const student = await studentWallet.connect(universityWallet).getStudentBasicInfo();

    // Format and return student data
    return {
        name: student.name,
        surname: student.surname,
        birthDate: computeDate(student.birthDate),
        birthPlace: student.birthPlace,
        country: student.country,
    }
}

/**
 * Retrieves student information including academic results.
 * Provides a complete academic profile with course outcomes.
 * @author Diego Da Giau
 * @param {Wallet} universityWallet - The university wallet with read permissions
 * @param {string} studentWalletAddress - The student's academic wallet address
 * @returns {Promise<Student>} The student's complete information with academic results
 */
export async function getStudentWithResult(universityWallet: Wallet, studentWalletAddress: string): Promise<Student> {
    // Get student contract instance
    const studentWallet = getStudentContract(studentWalletAddress);

    // Fetch student data and results in parallel for efficiency
    const [student, results] = await Promise.all([
        studentWallet.connect(universityWallet).getStudentBasicInfo(),
        studentWallet.connect(universityWallet).getResults(),
    ]);

    // Generate complete student object with processed results
    return await generateStudent(universityWallet, student, results);
}
