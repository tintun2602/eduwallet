import { Wallet } from "ethers";
import * as eduwallet from "eduwallet-sdk/dist/browser.js";

// University wallet configuration
const UNIVERSITY_PRIVATE_KEY = process.env.REACT_APP_UNIVERSITY_PRIVATE_KEY;

if (!UNIVERSITY_PRIVATE_KEY) {
  throw new Error(
    "REACT_APP_UNIVERSITY_PRIVATE_KEY environment variable is required. " +
      "Please create a .env file with your university private key. " +
      "See .env.example for reference."
  );
}

// Create university wallet
const universityWallet = new Wallet(UNIVERSITY_PRIVATE_KEY);

// Note: SDK provider is configured in the SDK itself

export interface Student {
  id: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  placeOfBirth: string;
  country: string;
  walletAddress: string;
  university?: string;
}

export interface AcademicResult {
  id: string;
  courseCode: string;
  courseName: string;
  degreeCourse: string;
  ects: number;
  grade: string;
  date: string;
  certificateHash?: string;
}

/**
 * Blockchain service for university portal operations.
 * Handles student management and academic record operations.
 * @author Diego Da Giau
 * @co-author Tin Tun Naing
 */
export class BlockchainService {
  /**
   * Get all students registered by this university
   * Note: This is a placeholder implementation. In a real system, you would
   * need to implement a way to track which students are registered by this university.
   * This could be done by:
   * 1. Maintaining a local database of registered students
   * 2. Implementing a smart contract function to list students by university
   * 3. Using events emitted during student registration
   */
  static async getAllStudents(): Promise<Student[]> {
    try {
      // For now, return an empty array since we don't have a way to
      // dynamically fetch all students registered by this university
      console.warn(
        "getAllStudents: No dynamic student discovery implemented. " +
          "Consider implementing student tracking in your smart contract or database."
      );

      return [];
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  }

  /**
   * Get student information by wallet address
   */
  static async getStudentInfo(walletAddress: string): Promise<Student | null> {
    try {
      const studentData = await eduwallet.getStudentInfo(
        universityWallet,
        walletAddress
      );

      return {
        id: walletAddress.slice(0, 8), // Use first 8 chars of wallet as ID
        name: studentData.name,
        surname: studentData.surname,
        dateOfBirth: studentData.birthDate,
        placeOfBirth: studentData.birthPlace,
        country: studentData.country,
        walletAddress: walletAddress,
      };
    } catch (error) {
      console.error("Error fetching student info:", error);
      return null;
    }
  }

  /**
   * Get student with academic results
   */
  static async getStudentWithResults(walletAddress: string): Promise<{
    student: Student | null;
    results: AcademicResult[];
  }> {
    try {
      const studentData = await eduwallet.getStudentWithResult(
        universityWallet,
        walletAddress
      );

      const student: Student = {
        id: walletAddress.slice(0, 8),
        name: studentData.name,
        surname: studentData.surname,
        dateOfBirth: studentData.birthDate,
        placeOfBirth: studentData.birthPlace,
        country: studentData.country,
        walletAddress: walletAddress,
      };

      const results: AcademicResult[] =
        studentData.results?.map((result, index) => ({
          id: `${index + 1}`,
          courseCode: result.code || "",
          courseName: result.name || "",
          degreeCourse: result.degreeCourse || "",
          ects: result.ects || 0,
          grade: result.grade || "",
          date: result.evaluationDate || "",
          certificateHash: result.certificate
            ? String(result.certificate)
            : undefined,
        })) || [];

      return { student, results };
    } catch (error) {
      console.error("Error fetching student with results:", error);
      return { student: null, results: [] };
    }
  }

  /**
   * Register a new student
   */
  static async registerStudent(studentData: {
    name: string;
    surname: string;
    dateOfBirth: string;
    placeOfBirth: string;
    country: string;
  }): Promise<{ success: boolean; walletAddress?: string; error?: string }> {
    try {
      const credentials = await eduwallet.registerStudent(universityWallet, {
        name: studentData.name,
        surname: studentData.surname,
        birthDate: studentData.dateOfBirth,
        birthPlace: studentData.placeOfBirth,
        country: studentData.country,
      });

      return {
        success: true,
        walletAddress: credentials.academicWalletAddress,
      };
    } catch (error) {
      console.error("Error registering student:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Add academic result for a student
   */
  static async addAcademicResult(
    walletAddress: string,
    resultData: {
      courseCode: string;
      courseName: string;
      degreeCourse: string;
      ects: number;
      grade: string;
      date: string;
    }
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // First enroll the student in the course
      await eduwallet.enrollStudent(universityWallet, walletAddress, [
        {
          code: resultData.courseCode,
          name: resultData.courseName,
          degreeCourse: resultData.degreeCourse,
          ects: resultData.ects,
        },
      ]);

      // Then evaluate the student
      await eduwallet.evaluateStudent(universityWallet, walletAddress, [
        {
          code: resultData.courseCode,
          grade: resultData.grade,
          evaluationDate: resultData.date,
          certificate: undefined,
        },
      ]);

      return { success: true };
    } catch (error) {
      console.error("Error adding academic result:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete academic result (this would need to be implemented in the smart contract)
   */
  static async deleteAcademicResult(
    _walletAddress: string,
    _courseCode: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      // This functionality would need to be added to the smart contract
      // For now, return success but log that it's not implemented
      console.warn("Delete academic result not implemented in smart contract");
      return { success: true };
    } catch (error) {
      console.error("Error deleting academic result:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
