import type {
  Student as StudentInterface,
  University,
  AcademicResult,
  StudentEthWalletInfo,
} from "./types";
import { blockchainConfig, ipfsConfig, provider } from "./conf";
import type { StudentsRegister } from "@typechain/contracts/StudentsRegister";
import { StudentsRegister__factory } from "@typechain/factories/contracts/StudentsRegister__factory";
import type { Student } from "@typechain/contracts/Student";
import { Student__factory } from "@typechain/factories/contracts/Student__factory";
import { University__factory } from "@typechain/factories/contracts/University__factory";
// AWS SDK import removed to avoid Node.js module issues in browser
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { Wallet } from "ethers";

/**
 * Creates a new wallet for a student with random credentials.
 * Generates a random ID and password, then derives a private key for blockchain interaction.
 * @author Diego Da Giau
 * @returns {Promise<StudentEthWalletInfo>} Object containing student ID, password and Ethereum wallet
 */
export async function createStudentWallet(): Promise<StudentEthWalletInfo> {
  const studentId = generateRandomString(10);
  const randomString = generateRandomString(16);
  const privateKey = await derivePrivateKey(randomString, studentId);
  const wallet = new Wallet(privateKey);
  return {
    password: randomString,
    id: studentId,
    ethWallet: wallet,
  };
}

/**
 * Generates a cryptographically secure random string of specified length.
 * Used for creating student credentials.
 * Uses Web Crypto API for browser compatibility
 * @author Diego Da Giau
 * @param {number} length - Desired length of the random string
 * @returns {string} Hexadecimal random string
 */
function generateRandomString(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Derives a private key from a password and student ID using PBKDF2.
 * Creates a deterministic key that can be reconstructed with the same inputs.
 * Uses Web Crypto API for browser compatibility
 * @author Diego Da Giau
 * @param {string} password - User password for key derivation
 * @param {string} studentId - Student ID used as salt
 * @returns {Promise<string>} Ethereum-compatible private key with 0x prefix
 */
async function derivePrivateKey(
  password: string,
  studentId: string
): Promise<string> {
  const iterations = 100000;
  const keyLength = 32;

  // Convert password and salt to ArrayBuffer
  const passwordBuffer = new TextEncoder().encode(password);
  const saltBuffer = new TextEncoder().encode(studentId);

  // Import the password as a key
  const key = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  // Derive the key using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: iterations,
      hash: "SHA-256",
    },
    key,
    keyLength * 8 // Convert bytes to bits
  );

  // Convert to hex string
  const derivedArray = new Uint8Array(derivedBits);
  const hexString = Array.from(derivedArray, (byte) =>
    byte.toString(16).padStart(2, "0")
  ).join("");

  return "0x" + hexString;
}

/**
 * Retrieves the StudentsRegister contract instance.
 * Central registry that manages student and university registrations.
 * @author Diego Da Giau
 * @returns {StudentsRegister} Connected contract instance
 */
export function getStudentsRegister(): StudentsRegister {
  return StudentsRegister__factory.connect(
    blockchainConfig.registerAddress,
    provider
  );
}

/**
 * Gets a connected instance of a Student contract for interaction.
 * Used to interact with a specific student's academic record.
 * @author Diego Da Giau
 * @param {string} contractAddress - Student contract address
 * @returns {Student} Connected student contract instance
 */
export function getStudentContract(contractAddress: string): Student {
  return Student__factory.connect(contractAddress, provider);
}

/**
 * Converts a blockchain timestamp to a human-readable ISO date string.
 * Handles the conversion from Unix epoch seconds to JavaScript milliseconds.
 * @author Diego Da Giau
 * @param {bigint} date - Unix timestamp as BigInt
 * @returns {string} ISO formatted date string
 */
export function computeDate(date: bigint): string {
  dayjs.extend(utc);
  return dayjs.utc(Number(date) * 1000).toISOString();
}

/**
 * Uploads a certificate to IPFS via S3 compatible storage.
 * Note: This function is not available in browser environments.
 * @author Diego Da Giau
 * @param {Buffer | string} certificate - Certificate as a Buffer or file path
 * @returns {Promise<string>} The IPFS content identifier (CID)
 */
export async function publishCertificate(
  certificate: Buffer | string
): Promise<string> {
  // Check if we're in a browser environment
  const isBrowser = typeof (globalThis as any).window !== "undefined";
  if (isBrowser) {
    throw new Error(
      "Certificate publishing is not supported in browser environments. This feature requires a Node.js environment."
    );
  }

  // For now, return a placeholder CID since AWS SDK is not available
  // This function would need to be implemented with proper AWS SDK integration
  throw new Error(
    "Certificate publishing functionality is not implemented. AWS SDK integration is required."
  );
}

/**
 * Generates a complete student object with academic results.
 * Fetches university information for each result and formats data.
 * @author Diego Da Giau
 * @param {Wallet} universityWallet - University wallet with read permissions
 * @param {Student.StudentBasicInfoStructOutput} student - Basic student information from contract
 * @param {Student.ResultStructOutput[]} results - Array of raw result data from contract
 * @returns {Promise<StudentInterface>} Complete student object with formatted results
 * @throws {Error} If a university cannot be found for a result
 */
export async function generateStudent(
  universityWallet: Wallet,
  student: Student.StudentBasicInfoStructOutput,
  results: Student.ResultStructOutput[]
): Promise<StudentInterface> {
  // Get universities information for all results
  const universities = await getUniversities(
    universityWallet,
    new Set(results.map((r) => r.university))
  );

  // Process each result with its university information
  const resultsDef = results.map((r) => {
    const university = universities.get(r.university);
    if (!university) {
      throw new Error(`University not found for address: ${r.university}`);
    }
    return generateResult(r, university);
  });

  // Return complete student object
  return {
    name: student.name,
    surname: student.surname,
    birthDate: computeDate(student.birthDate),
    birthPlace: student.birthPlace,
    country: student.country,
    results: resultsDef,
  };
}

/**
 * Formats a raw academic result from the blockchain into a human-readable format.
 * Converts numerical values, dates, and adds readable URLs for certificates.
 * @author Diego Da Giau
 * @param {Student.ResultStructOutput} result - Raw result data from contract
 * @param {University} university - University information for this result
 * @returns {AcademicResult} Formatted academic result
 */
function generateResult(
  result: Student.ResultStructOutput,
  university: University
): AcademicResult {
  return {
    name: result.name,
    code: result.code,
    university,
    degreeCourse: result.degreeCourse,
    ects: Number(result.ects) / 100, // Convert ECTS from stored integer (x100) to decimal
    grade: result.grade || undefined, // Use undefined for empty grades
    evaluationDate: result.date ? computeDate(result.date) : undefined,
    certificate: result.certificateHash
      ? `${ipfsConfig.gatewayUrl}${result.certificateHash}`
      : undefined,
  };
}

/**
 * Retrieves information about multiple universities by their blockchain addresses.
 * Maps university addresses to their detailed information.
 * @author Diego Da Giau
 * @param {Wallet} universityWallet - Wallet with permissions to read university data
 * @param {Set<string>} universitiesAddresses - Set of university blockchain addresses
 * @returns {Promise<Map<string, University>>} Map of university addresses to university details
 */
async function getUniversities(
  universityWallet: Wallet,
  universitiesAddresses: Set<string>
): Promise<Map<string, University>> {
  // Get contract instance
  const studentsRegister = getStudentsRegister();

  // Convert set to array for contract call
  const universitiesArray = Array.from(universitiesAddresses);

  // Get university wallet addresses from the registry
  const universitiesContract = await studentsRegister
    .connect(universityWallet)
    .getUniversitiesWallets(universitiesArray);

  // Create a map to store university details by address
  const universities = new Map<string, University>();

  // Fetch details for each university
  for (let i = 0; i < universitiesContract.length; i++) {
    universities.set(
      universitiesArray[i],
      await getUniversity(universityWallet, universitiesContract[i])
    );
  }

  return universities;
}

/**
 * Retrieves information about a single university.
 * Connects to the university's contract and fetches its details.
 * @author Diego Da Giau
 * @param {Wallet} universityWallet - Wallet with permissions to read university data
 * @param {string} universityContractAddress - Address of the university's contract
 * @returns {Promise<University>} University details
 */
async function getUniversity(
  universityWallet: Wallet,
  universityContractAddress: string
): Promise<University> {
  // Connect to university contract
  const contract = University__factory.connect(
    universityContractAddress,
    provider
  );

  // Fetch university information
  const { name, country, shortName } = await contract
    .connect(universityWallet)
    .getUniversityInfo();

  // Return formatted university object
  return {
    name,
    country,
    shortName,
  };
}
