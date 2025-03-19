import { Wallet } from "ethers";
import { Student } from '../../../typechain-types/contracts/Student';

/**
 * Represents a student in the system with their personal information and academic results.
 * @author Diego Da Giau
 */
export class StudentModel {
    // Immutable properties
    public readonly id: number;
    public readonly wallet: Wallet;
    public readonly contractAddress: string;

    // Mutable properties
    public name: string = '';
    public surname: string = '';
    public birthDate: string = '';
    public birthPlace: string = '';
    public country: string = '';
    private results: Result[] = [];

    /**
     * Creates a new StudentModel instance.
     * @param id - The student's ID
     * @param wallet - The student's Ethereum wallet
     * @param contractAddress - The student's smart contract address
     */
    constructor(id: number, wallet: Wallet, contractAddress: string) {
        this.id = id;
        this.wallet = wallet;
        this.contractAddress = contractAddress;
    }

    /**
     * Creates an empty StudentModel instance with default values.
     * @returns {StudentModel} An empty student instance with default values
     */
    static createEmpty(): StudentModel {
        const hdWallet = Wallet.createRandom();
        return new this(-1, new Wallet(hdWallet.privateKey), '');
    }

    /**
     * Gets all academic results.
     * @returns {Result[]} A copy of all the student's academic results
     */
    getResults(): Result[] {
        return [...this.results]; // Return a copy to prevent direct modification
    }

    /**
     * Gets results grouped by degree course for a specific university.
     * @param universityId - The ID of the university
     * @returns {{ [key: string]: Result[] }} An object mapping degree courses to their results
     */
    getResultsByUniversityGroupedByCourseDegree(universityAddress: string): { [key: string]: Result[] } {
        return this.getResultsByUniversity(universityAddress).reduce((acc, result) => {
            if (!acc[result.degreeCourse]) {
                acc[result.degreeCourse] = [];
            }
            acc[result.degreeCourse].push(result);
            return acc;
        }, {} as { [key: string]: Result[] });
    }

    /**
     * Gets results for a specific university.
     * @param universityId - The ID of the university
     * @returns {Result[]} Array of results for the specified university
     */
    getResultsByUniversity(universityAddress: string): Result[] {
        return this.results.filter(result => result.university === universityAddress);
    }

    /**
     * Retrieves a unique set of university addresses from student's results.
     * @returns {Set<string>} A Set containing unique university addresses
     * @remarks
     * - Returns an empty Set if student has no results
     * - Uses Set to automatically handle duplicates
     * - Returns university addresses, not university names
     */
    getResultsUniversities(): Set<string> {
        // Extract unique university addresses from results
        return new Set(this.results.map(r => r.university));
    }

    /**
     * Updates the student's academic results.
     * @param results - The new results from the smart contract
     * @returns {void}
     */
    updateResults(results: Student.ResultStructOutput[]): void {
        this.results = results.map(r => ({
            name: r.name,
            code: r.code,
            university: r.university,
            degreeCourse: r.degreeCourse,
            grade: r.grade === "" ? "N/D" : r.grade,
            date: r.date,
            ects: parseFloat(`${r.ects[0]}.${r.ects[1]}`),
            certificateCid: r.certificateHash,
        }));
    }

    /**
     * Converts the student to a plain object for serialization.
     * @returns {Object} A plain object containing the student's basic information
     */
    toObject(): Object {
        return {
            id: this.id,
            name: this.name,
            surname: this.surname,
            birthDate: this.birthDate,
            birthPlace: this.birthPlace,
            country: this.country,
        };
    }
}

/**
 * Represents an academic result.
 * @author Diego Da Giau
 */
export interface Result {
    readonly name: string;
    readonly code: string;
    readonly university: string;
    readonly degreeCourse: string;
    readonly grade: string;
    readonly date: bigint;
    readonly ects: number;
    readonly certificateCid: string;
}

/**
 * Represents student authentication credentials.
 * @author Diego Da Giau
 */
export interface Credentials {
    id: number;
    password: string;
}