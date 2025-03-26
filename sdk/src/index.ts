import { Wallet } from "ethers";
import type { CourseInfo, Evaluation, Student, StudentCredentials, StudentData } from "./types";
import { computeDate, createStudentWallet, generateStudent, getStudentContract, getStudentsRegister, publishCertificate } from "./utils";
import { provider } from "./conf";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc.js';
import type { Student as StudentContract } from '@typechain/contracts/Student';

export type { StudentCredentials, StudentData, CourseInfo, Evaluation, Student };
export { getStudentsRegister };

dayjs.extend(utc);

export async function registerStudent(universityWallet: Wallet, student: StudentData): Promise<StudentCredentials> {
    const studentsRegister = getStudentsRegister();
    const studentEthWallet = createStudentWallet();
    const connectedUniversity = universityWallet.connect(provider);
    const basinInfo: StudentContract.StudentBasicInfoStruct = {
        name: student.name,
        surname: student.surname,
        birthDate: dayjs.utc(student.birthDate).unix(),
        birthPlace: student.birthPlace,
        country: student.country
    }

    const registerTx = await studentsRegister.connect(connectedUniversity).registerStudent(
        studentEthWallet.ethWallet?.address,
        basinInfo
    );
    await registerTx.wait();

    const studentAcademicWalletAddress = await studentsRegister.connect(universityWallet).getStudentWallet(studentEthWallet.ethWallet.address);

    return {
        id: studentEthWallet.id,
        password: studentEthWallet.password,
        academicWalletAddress: studentAcademicWalletAddress,
        ethWallet: studentEthWallet.ethWallet,
    }
}

export async function enrollStudent(universityWallet: Wallet, studentWalletAddress: string, courses: CourseInfo[]): Promise<void> {
    const studentWallet = getStudentContract(studentWalletAddress);
    for (const course of courses) {
        await studentWallet.connect(universityWallet).enroll(
            course.code,
            course.name,
            course.degreeCourse,
            BigInt(course.ects * 100)
        );
    }
}

export async function evaluateStudent(universityWallet: Wallet, studentWalletAddress: string, evaluations: Evaluation[]): Promise<void> {
    const studentWallet = getStudentContract(studentWalletAddress);
    for (const evaluation of evaluations) {
        const certificate = evaluation.certificate ? await publishCertificate(evaluation.certificate) : "";
        await studentWallet.connect(universityWallet).evaluate(
            evaluation.code,
            evaluation.grade,
            dayjs.utc(evaluation.evaluationDate).unix(),
            certificate
        );
    }
}

export async function getStudentInfo(universityWallet: Wallet, studentWalletAddress: string): Promise<Student> {
    const studentWallet = getStudentContract(studentWalletAddress);
    const student = await studentWallet.connect(universityWallet).getStudentBasicInfo();
    return {
        name: student.name,
        surname: student.surname,
        birthDate: computeDate(student.birthDate),
        birthPlace: student.birthPlace,
        country: student.country,
    }
}

export async function getStudentWithResult(universityWallet: Wallet, studentWalletAddress: string): Promise<Student> {
    const studentWallet = getStudentContract(studentWalletAddress);
    const [student, results] = await Promise.all([
        studentWallet.connect(universityWallet).getStudentBasicInfo(),
        studentWallet.connect(universityWallet).getResults(),
    ]);
    return await generateStudent(universityWallet, student, results);
}
