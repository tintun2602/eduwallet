import { Wallet, JsonRpcProvider } from "ethers";
import { derivePrivateKey, formatDate } from "./utils";
import { StudentsRegister__factory } from "../../../typechain-types/factories/contracts/StudentsRegister__factory";
import { Student__factory } from "../../../typechain-types/factories/contracts/Student__factory";
import { Credentials, StudentModel } from "../models/student";
import type { StudentsRegister } from "../../../typechain-types/contracts/StudentsRegister";
import UniversityModel from "../models/university";
import { University__factory } from "../../../typechain-types/factories/contracts/University__factory";
import { blockchainConfig, roleCodes, logError } from "./conf";
import type { Student } from "../../../typechain-types/contracts/Student";
import { Permission, PermissionType } from "../models/permissions";

// Initialize provider once for reuse
const provider = new JsonRpcProvider(blockchainConfig.url);

/**
 * Retrieves the StudentsRegister contract instance.
 * @author Diego Da Giau
 * @returns {StudentsRegister} Connected contract instance
 * @throws {Error} If contract connection fails
 */
export function getStudentsRegister(): StudentsRegister {
  try {
    return StudentsRegister__factory.connect(
      blockchainConfig.registerAddress,
      provider as any
    );
  } catch (error) {
    logError("Failed to connect to StudentsRegister contract:", error);
    throw new Error(
      "Could not establish connection to StudentsRegister contract"
    );
  }
}

/**
 * Gets a connected instance of a Student contract for interaction.
 * @author Diego Da Giau
 * @param {StudentModel} student - Student model containing contract address
 * @returns {Student} Connected student contract instance
 * @throws {Error} If contract connection fails or address is invalid
 */
export function getStudentContract(student: StudentModel): Student {
  try {
    if (!student.contractAddress) {
      throw new Error("Student contract address is missing");
    }
    return Student__factory.connect(student.contractAddress, provider as any);
  } catch (error) {
    logError("Failed to connect to Student contract:", error);
    throw new Error("Could not establish connection to Student contract");
  }
}

/**
 * Creates a student wallet from credentials.
 * @author Diego Da Giau
 * @param {Credentials} credentials - Student's login credentials
 * @returns {Promise<Wallet>} Connected wallet instance
 * @throws {Error} If wallet creation fails or credentials are invalid
 */
export async function getStudentWallet(
  credentials: Credentials
): Promise<Wallet> {
  try {
    if (!credentials.password || !credentials.id) {
      throw new Error("Invalid credentials: Missing password or ID");
    }
    const privateKey = await derivePrivateKey(
      credentials.password,
      credentials.id
    );
    return new Wallet(privateKey, provider);
  } catch (error) {
    logError("Failed to create student wallet:", error);
    throw new Error("Could not create student wallet from credentials");
  }
}

/**
 * Fetches and updates student information from the blockchain.
 * @author Diego Da Giau
 * @param {StudentModel} student - Student model to update
 * @throws {Error} If contract connection fails or data retrieval fails
 */
export async function getStudent(student: StudentModel): Promise<void> {
  try {
    if (!student.wallet) {
      throw new Error("Student wallet not initialized");
    }

    // Connect to student's contract
    const contract = getStudentContract(student);

    // Fetch student info
    const { basicInfo, results } = await contract
      .connect(student.wallet as any)
      .getStudentInfo();

    // Update student model
    student.name = basicInfo.name;
    student.surname = basicInfo.surname;
    student.birthPlace = basicInfo.birthPlace;
    student.birthDate = formatDate(basicInfo.birthDate);
    student.country = basicInfo.country;

    // Update academic results
    student.updateResults(results);
  } catch (error) {
    logError("Failed to fetch student data:", error);
    throw new Error("Could not retrieve student information");
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
export async function getUniversity(
  student: StudentModel,
  universityAddress: string,
  universityWallet: string
): Promise<UniversityModel> {
  try {
    if (!student.wallet) {
      throw new Error("Student wallet not initialized");
    }

    if (!universityAddress || !universityWallet) {
      throw new Error("University address or wallet address is missing");
    }

    // Connect to university's smart contract using its wallet address
    const contract = University__factory.connect(
      universityWallet,
      provider as any
    );

    // Fetch university information using student's credentials
    const { name, country, shortName } = await contract
      .connect(student.wallet as any)
      .getUniversityInfo();

    // Create and return new university model with fetched data
    return new UniversityModel(
      name,
      country,
      shortName,
      universityAddress,
      universityWallet
    );
  } catch (error) {
    logError("Failed to fetch university data:", error);
    throw new Error("Could not retrieve university information");
  }
}

/**
 * Retrieves all permission records for a student from the blockchain.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @returns {Promise<Permission[]>} Array of all permissions (both requests and granted)
 * @throws {Error} If permissions cannot be retrieved from the blockchain
 */
export async function getRawPermissions(
  student: StudentModel
): Promise<Permission[]> {
  try {
    if (!student.wallet) {
      throw new Error("Student wallet not initialized");
    }

    if (!student.contractAddress) {
      throw new Error("Student contract address is missing");
    }

    // Connect contract with student's wallet for auth
    const studentContract = getStudentContract(student).connect(
      student.wallet as any
    );

    // Get actual permissions in parallel using the retrieved types
    const [readRequests, writeRequests, reads, writes] = await Promise.all([
      studentContract.getPermissions(roleCodes.readRequest),
      studentContract.getPermissions(roleCodes.writeRequest),
      studentContract.getPermissions(roleCodes.read),
      studentContract.getPermissions(roleCodes.write),
    ]);

    // Map string arrays to Permission objects arrays
    const readRequestPermissions: Permission[] = readRequests.map(
      (universityAddress) => ({
        university: universityAddress,
        type: PermissionType.Read,
        request: true,
      })
    );

    const writeRequestPermissions: Permission[] = writeRequests.map(
      (universityAddress) => ({
        university: universityAddress,
        type: PermissionType.Write,
        request: true,
      })
    );

    const readPermissions: Permission[] = reads.map((universityAddress) => ({
      university: universityAddress,
      type: PermissionType.Read,
      request: false,
    }));

    const writePermissions: Permission[] = writes.map((universityAddress) => ({
      university: universityAddress,
      type: PermissionType.Write,
      request: false,
    }));

    return [
      ...readRequestPermissions,
      ...writeRequestPermissions,
      ...readPermissions,
      ...writePermissions,
    ];
  } catch (error) {
    logError("Failed to fetch permissions:", error);
    throw new Error("Could not retrieve permission information");
  }
}

/**
 * Revokes a university's permission to access student data.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @param {string} universityAddress - The address of the university to revoke
 * @returns {Promise<ContractTransactionResponse>} Transaction response from the blockchain
 * @throws {Error} If transaction fails or student wallet is not initialized
 */
export async function revokePermission(
  student: StudentModel,
  universityAddress: string
): Promise<any> {
  try {
    if (!student.wallet) {
      throw new Error("Student wallet not initialized");
    }

    if (!universityAddress) {
      throw new Error("University address is required");
    }

    const contract = getStudentContract(student).connect(student.wallet as any);
    return await contract.revokePermission(universityAddress);
  } catch (error) {
    logError("Failed to revoke permission:", error);
    throw new Error("Could not revoke university permission");
  }
}

/**
 * Grants permission to a university to access student data.
 * @author Diego Da Giau
 * @param {StudentModel} student - The authenticated student model
 * @param {Permission} permission - The permission to grant, including university and type
 * @returns {Promise<ContractTransactionResponse>} Transaction response from the blockchain
 * @throws {Error} If transaction fails, permission type is invalid, or student wallet is not initialized
 */
export async function grantPermission(
  student: StudentModel,
  permission: Permission
): Promise<any> {
  try {
    if (!student.wallet) {
      throw new Error("Student wallet not initialized");
    }

    if (!permission || !permission.university) {
      throw new Error("Valid permission with university address is required");
    }

    const contract = getStudentContract(student).connect(student.wallet as any);
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

    return await contract.grantPermission(
      permissionType,
      permission.university
    );
  } catch (error) {
    logError("Failed to grant permission:", error);
    throw new Error("Could not grant university permission");
  }
}
