import { ContractTransactionResponse } from "ethers";
import type { Credentials } from "./models/student";
import { StudentModel } from "./models/student";
import type UniversityModel from "./models/university";
import {
  getRawPermissions,
  getStudent,
  getStudentsRegister,
  getStudentWallet,
  getUniversity,
  grantPermission,
  revokePermission,
} from "./utils/contractsUtils";
import { Permission } from "./models/permissions";
import { logError } from "./utils/conf";

/**
 * Authenticates a student and retrieves their information.
 * @author Diego Da Giau
 * @param {Credentials} credentials - The student's login credentials (ID and password)
 * @returns {Promise<StudentModel>} A promise that resolves to the authenticated student's data
 * @throws {Error} If authentication fails or student data cannot be retrieved
 */
export async function logIn(credentials: Credentials): Promise<StudentModel> {
  try {
    if (!credentials || !credentials.id || !credentials.password) {
      throw new Error("Invalid credentials: Missing ID or password");
    }

    // Get contract instance and create student wallet
    const studentWalletPromise = getStudentWallet(credentials);
    const studentsRegister = getStudentsRegister();

    const studentWallet = await studentWalletPromise;
    if (!studentWallet) {
      throw new Error("Failed to create student wallet");
    }

    // Get student's smart contract address
    const contractAddress = await studentsRegister
      .connect(studentWallet as any)
      .getStudentWallet(studentWallet.address);

    if (!contractAddress) {
      throw new Error("Student contract address not found");
    }

    // Create and populate student model
    const student = new StudentModel(
      credentials.id,
      studentWallet,
      contractAddress
    );
    await getStudent(student);

    return student;
  } catch (error) {
    logError("Student login failed: ", error);
    if (`${error}`.includes("StudentNotPresent")) {
      throw new Error("Authentication failed. Check your credentials.");
    }
    throw new Error("Connection issues. Try again.");
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
export async function getUniversities(
  student: StudentModel,
  universitiesAddresses: string[]
): Promise<UniversityModel[]> {
  try {
    if (!student || !student.wallet) {
      throw new Error("Student not properly authenticated");
    }

    if (!universitiesAddresses || universitiesAddresses.length === 0) {
      return [];
    }

    // Get contract instance and university addresses
    const studentsRegister = getStudentsRegister();

    // Get wallet addresses for all universities
    const universitiesWallets = await studentsRegister
      .connect(student.wallet as any)
      .getUniversitiesWallets(universitiesAddresses);

    if (
      !universitiesWallets ||
      universitiesWallets.length !== universitiesAddresses.length
    ) {
      throw new Error("Failed to retrieve university wallet addresses");
    }

    // Create university models with full information
    const universities: UniversityModel[] = [];
    for (let i = 0; i < universitiesWallets.length; ++i) {
      try {
        const university = await getUniversity(
          student,
          universitiesAddresses[i],
          universitiesWallets[i]
        );
        universities.push(university);
      } catch (universityError) {
        logError(`Failed to fetch university at index ${i}:`, universityError);
      }
    }

    return universities;
  } catch (error) {
    logError("Universities retrieval failed:", error);
    throw new Error("Failed to retrieve universities. Please try again later.");
  }
}

/**
 * Retrieves all permissions for a student from the blockchain.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @returns {Promise<Permission[]>} Array of all permissions (both requests and granted)
 * @throws {Error} If permissions cannot be retrieved from the blockchain
 */
export async function getPermissions(
  student: StudentModel
): Promise<Permission[]> {
  try {
    if (!student || !student.wallet) {
      throw new Error("Student not properly authenticated");
    }

    return await getRawPermissions(student);
  } catch (error) {
    logError("Failed to fetch permissions:", error);
    throw new Error("Could not retrieve permission information");
  }
}

/**
 * Performs the appropriate action on a permission based on its type.
 * For permission requests, grants the permission.
 * For existing permissions, revokes the permission.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @param {Permission} permission - The permission to process
 * @returns {Promise<ContractTransactionResponse>} Transaction response from the blockchain
 * @throws {Error} If permission action cannot be performed
 */
export async function performAction(
  student: StudentModel,
  permission: Permission
): Promise<ContractTransactionResponse> {
  try {
    if (!student || !student.wallet) {
      throw new Error("Student not properly authenticated");
    }

    if (!permission) {
      throw new Error("Permission object is required");
    }

    if (!permission.university) {
      throw new Error("University address is missing in permission");
    }

    if (permission.request) {
      return await grantPermission(student, permission);
    }
    return await revokePermission(student, permission.university);
  } catch (error) {
    logError("Failed to perform permission action:", error);
    const action = permission?.request ? "grant" : "revoke";
    throw new Error(`Could not ${action} permission. Please try again later.`);
  }
}

/**
 * Fetches student data for sharing purposes (without authentication).
 * This function is designed for development when auth is disabled.
 * @author tintun
 * @param {Credentials} credentials - Student credentials (ID and password)
 * @returns {Promise<StudentModel>} Complete student data with academic results
 * @throws {Error} If student data cannot be retrieved
 */
export async function fetchStudentDataForSharing(
  credentials: Credentials
): Promise<StudentModel> {
  try {
    if (!credentials || !credentials.id || !credentials.password) {
      throw new Error("Invalid credentials: Missing ID or password");
    }

    // Use existing login function to get student data
    const student = await logIn(credentials);

    // Return the complete student model with academic results
    return student;
  } catch (error) {
    logError("Failed to fetch student data for sharing:", error);
    throw new Error(
      "Could not retrieve student data for sharing. Please check your credentials."
    );
  }
}

/**
 * Creates shareable data structure from student model.
 * Formats student data for QR code or other sharing methods.
 * @author tintun
 * @param {StudentModel} student - The student model to share
 * @param {string[]} selectedCourseCodes - Optional array of course codes to include (if empty, includes all)
 * @param {Date} expirationTime - Optional expiration time for the shared data
 * @returns {Object} Shareable data structure
 */
export function createShareableData(
  student: StudentModel,
  selectedCourseCodes: string[] = [],
  expirationTime?: Date
): Object {
  try {
    if (!student) {
      throw new Error("Student data is required");
    }

    // Get all results or filter by selected courses
    let results = student.getResults();
    if (selectedCourseCodes.length > 0) {
      results = results.filter((result) =>
        selectedCourseCodes.includes(result.code)
      );
    }

    // Create shareable data structure
    const shareableData = {
      // Basic student information
      student: {
        name: student.name,
        surname: student.surname,
        birthDate: student.birthDate,
        birthPlace: student.birthPlace,
        country: student.country,
        studentId: student.id,
        walletAddress: student.contractAddress,
      },
      // Academic results
      academicResults: results.map((result) => ({
        courseName: result.name,
        courseCode: result.code,
        university: result.university,
        degreeCourse: result.degreeCourse,
        grade: result.grade,
        date: result.date,
        ects: result.ects,
        certificateCid: result.certificateCid,
      })),
      // Verification data
      verification: {
        blockchainAddress: student.contractAddress,
        timestamp: new Date().toISOString(),
        expiresAt: expirationTime ? expirationTime.toISOString() : null,
        dataHash: "TODO: Calculate hash of the data", // TODO: Implement data hashing
        version: "1.0",
      },
    };

    return shareableData;
  } catch (error) {
    logError("Failed to create shareable data:", error);
    throw new Error("Could not create shareable data");
  }
}

/**
 * Creates a verification URL for sharing academic credentials with employers
 * @param shareableData - The shareable data object
 * @returns Object containing the verification URL and credential ID
 */
export function createVerificationUrl(shareableData: Object): {
  url: string;
  credentialId: string;
} {
  try {
    // Generate a unique credential ID
    const credentialId = `cred_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    // Extract blockchain address from shareable data
    const blockchainAddress = (shareableData as any).student?.walletAddress;

    if (!blockchainAddress) {
      throw new Error("Student blockchain address not found");
    }

    // Create a simple verification URL that will generate a PDF download
    // In production, this would be your deployed verification portal URL
    const verificationUrl = `http://localhost:3001/download/${credentialId}?address=${blockchainAddress}`;

    return {
      url: verificationUrl,
      credentialId: credentialId,
    };
  } catch (error) {
    logError("Failed to create verification URL:", error);
    throw new Error("Could not create verification URL");
  }
}
