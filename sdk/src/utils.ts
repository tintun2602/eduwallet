import type { Student as StudentInterface, University, AcademicResult, StudentEthWalletInfo } from "./types";
import { blockchainConfig, ipfsConfig, provider, s3Client } from "./conf";
import { StudentsRegister } from '@typechain/contracts/StudentsRegister';
import { StudentsRegister__factory } from "@typechain/factories/contracts/StudentsRegister__factory"
import { Student } from '@typechain/contracts/Student';
import { Student__factory } from '@typechain/factories/contracts/Student__factory'
import { University__factory } from '@typechain/factories/contracts/University__factory'
import { PutObjectCommand } from '@aws-sdk/client-s3';
import dayjs from 'dayjs';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { Wallet } from 'ethers';
import utc from 'dayjs/plugin/utc.js';

export function createStudentWallet(): StudentEthWalletInfo {
    const studentId = generateRandomString(10);
    const randomString = generateRandomString(16);
    const privateKey = derivePrivateKey(randomString, studentId);
    const wallet = new Wallet(privateKey);
    return {
        password: randomString,
        id: studentId,
        ethWallet: wallet
    };
}

/**
 * TODO: substitute crypto with ethers
 */
function generateRandomString(length: number): string {
    return crypto.randomBytes(length).toString('hex');
}

/**
 * TODO: substitute crypto with ethers
 */
function derivePrivateKey(password: string, studentId: string): string {
    const iterations = 100000;
    const keyLength = 32;
    const derivedKey = crypto.pbkdf2Sync(password, studentId, iterations, keyLength, 'sha256').toString('hex');
    return '0x' + derivedKey;
}

export function getStudentsRegister(): StudentsRegister {
    return StudentsRegister__factory.connect(blockchainConfig.registerAddress, provider);
}

export function getStudentContract(contractAddress: string): Student {
    return Student__factory.connect(contractAddress, provider);
}


export function computeDate(date: bigint): string {
    dayjs.extend(utc);
    return dayjs.utc(Number(date) * 1000).toISOString();
}

export async function publishCertificate(certificate: Buffer | string): Promise<string> {
    let bufferFile: Buffer;
    if (typeof certificate === "string") {
        bufferFile = fs.readFileSync(certificate);
    } else {
        bufferFile = certificate;
    }
    const uploadParams = {
        Bucket: ipfsConfig.bucketName,
        Key: `${dayjs().valueOf()}`,
        Body: bufferFile,
        ContentType: "application/pdf",
    };
    const command = new PutObjectCommand(uploadParams);
    let cid = "";
    command.middlewareStack.add(
        (next) => async (args) => {
            const response = await next(args);
            if (!response.response || typeof response.response !== 'object') return response;
            const apiResponse = response.response as {
                statusCode?: number;
                headers?: Record<string, string>
            };
            if (apiResponse.headers && "x-amz-meta-cid" in apiResponse.headers) {
                cid = apiResponse.headers["x-amz-meta-cid"];
            }
            return response;
        }, {
        step: "build",
        name: "addCidToOutput",
    },);
    await s3Client.send(command);
    return cid;
}


export async function generateStudent(universityWallet: Wallet, student: Student.StudentBasicInfoStructOutput, results: Student.ResultStructOutput[]): Promise<StudentInterface> {
    const universities = await getUniversities(universityWallet, new Set(results.map(r => r.university)));
    const resultsDef = results.map(r => {
        const university = universities.get(r.university);
        if (!university) {
            throw new Error(`University not found for address: ${r.university}`);
        }
        return generateResult(r, university);
    });
    return {
        name: student.name,
        surname: student.surname,
        birthDate: computeDate(student.birthDate),
        birthPlace: student.birthPlace,
        country: student.country,
        results: resultsDef,
    };
}

function generateResult(result: Student.ResultStructOutput, university: University): AcademicResult {
    return {
        name: result.name,
        code: result.code,
        university,
        degreeCourse: result.degreeCourse,
        ects: parseFloat(`${result.ects[0]}.${result.ects[1]}`),
        grade: result.grade || undefined,
        evaluationDate: result.date ? computeDate(result.date) : undefined,
        certificate: result.certificateHash ? `${ipfsConfig.gatewayUrl}${result.certificateHash}` : undefined,
    }
}

async function getUniversities(universityWallet: Wallet, universitiesAddresses: Set<string>): Promise<Map<string, University>> {
    const studentsRegister = getStudentsRegister();
    const universitiesArray = Array.from(universitiesAddresses);
    const universitiesContract = await studentsRegister
        .connect(universityWallet)
        .getUniversitiesWallets(universitiesArray);

    const universities = new Map<string, University>();
    for (let i = 0; i < universitiesContract.length; i++) {
        universities.set(universitiesArray[i], await getUniversity(universityWallet, universitiesContract[i]))
    }
    return universities;
}

async function getUniversity(universityWallet: Wallet, universityContractAddress: string): Promise<University> {
    const contract = University__factory.connect(universityContractAddress, provider);
    const {
        name,
        country,
        shortName
    } = await contract.connect(universityWallet).getUniversityInfo();
    return {
        name,
        country,
        shortName,
    };
}