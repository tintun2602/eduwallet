import { ethers, JsonRpcProvider, Wallet } from 'ethers';
import * as crypto from 'crypto';
import { StudentsRegister } from '@typechain/contracts';
import { StudentsRegister__factory } from "@typechain/factories/contracts/StudentsRegister__factory"
//import { StudentDeployer } from '@typechain/contracts';
import { StudentDeployer__factory } from '@typechain/factories/contracts/StudentDeployer__factory';
//import { UniversityDeployer } from '@typechain/contracts';
import { UniversityDeployer__factory } from '@typechain/factories/contracts/UniversityDeployer__factory';
//import * as eduwallet from 'eduwallet-sdk'
import * as dotenv from 'dotenv'
//import * as fs from 'fs';
import * as path from 'path';

dotenv.config();
const VERBOSE = process.env.VERBOSE || false;

const PROVIDER = new JsonRpcProvider(process.env.RPC_URL || "http://localhost:8545");
const studentsRegisterPromise = deployStudentsRegister();



function getDeployer(): Wallet {
    const deployerPrivateKey = process.env.DEPLOYER_PRIVATE_KEY;
    if (!deployerPrivateKey) {
        throw new Error("Deployer private key not found in environment variables");
    }
    const deployer = new Wallet(deployerPrivateKey, PROVIDER);

    if (VERBOSE) {
        console.log(`---------------------------------------------------`);
        console.log(`DEPLOYER:`);
        console.log(`Address: ${deployer.address}`)
        console.log(`---------------------------------------------------`);
    }

    return deployer;
}

async function deployStudentsRegister(): Promise<StudentsRegister> {
    const deployer = getDeployer();

    // Deploy StudentDeployer contract using TypeChain factory
    const studentDeployerFactory = new StudentDeployer__factory(deployer);
    const studentDeployer = await studentDeployerFactory.deploy();
    await studentDeployer.waitForDeployment();
    const studentDeployerAddress = await studentDeployer.getAddress();

    // Deploy UniversityDeployer contract using TypeChain factory
    const universityDeployerFactory = new UniversityDeployer__factory(deployer);
    const universityDeployer = await universityDeployerFactory.deploy();
    await universityDeployer.waitForDeployment();
    const universityDeployerAddress = await universityDeployer.getAddress();

    // Deploy StudentsRegister contract using TypeChain factory
    const studentsRegisterFactory = new StudentsRegister__factory(deployer);
    const studentsRegister = await studentsRegisterFactory.deploy(
        studentDeployerAddress,
        universityDeployerAddress
    );
    await studentsRegister.waitForDeployment();
    const address = await studentsRegister.getAddress();

    if (VERBOSE) {
        console.log(`\n---------------------------------------------------`);
        console.log(`STUDENT DEPLOYER:`);
        console.log(`Address: ${studentDeployerAddress}`);
        console.log(`---------------------------------------------------`);
        console.log(`---------------------------------------------------`);
        console.log(`UNIVERSITY DEPLOYER:`);
        console.log(`Address: ${universityDeployerAddress}`);
        console.log(`---------------------------------------------------`);
        console.log(`---------------------------------------------------`);
        console.log(`STUDENT REGISTER:`);
        console.log(`Address: ${address}`);
        console.log(`---------------------------------------------------\n`);
    }

    return studentsRegister;
}


async function getUniversityWallet(): Promise<string> {
    const privateKey = crypto.randomBytes(32).toString('hex');
    const universityPrivateKey = `0x${privateKey}`;
    const wallet = new Wallet(universityPrivateKey);

    const balance = ethers.parseEther("10000000.0")
    const deployer = getDeployer();

    const tx = await deployer.sendTransaction({
        to: wallet.address,
        value: balance,
    })

    await tx.wait();

    return universityPrivateKey;
}

export async function subscribeUniversity(name: string, country: string, shortName: string): Promise<void> {
    const studentsRegister = await studentsRegisterPromise;

    const universityPrivateKey = await getUniversityWallet();
    const university = new Wallet(universityPrivateKey, PROVIDER);

    const universityTx = await studentsRegister.connect(university).subscribe(
        name,
        country,
        shortName
    );
    await universityTx.wait();
    console.log(`---------------------------------------------------`);
    console.log(`UNIVERSITY:`);
    console.log(`Private key: ${universityPrivateKey}`);
    console.log(`Address: ${university.address}`)
    console.log(`---------------------------------------------------`);
}

/*
async function main(): Promise<void> {

    // Register university 1
    console.log("\nRegistering university...");
    const university1Tx = await studentsRegister.connect(university1).subscribe(
        "Politecnico di Torino",
        "Italy",
        "PoliTo"
    );
    await university1Tx.wait();
    console.log(`University registered`);

    // Register university 2
    console.log("\nRegistering university...");
    const university2Tx = await studentsRegister.connect(university2).subscribe(
        "Politecnico di Milano",
        "Italy",
        "PoliMi"
    );
    await university2Tx.wait();
    console.log(`University registered`);

    // Create a student wallet from password
    console.log("\nCreating student wallet...");
    const student = await eduwallet.registerStudent(
        university1,
        {
            name: "Diego",
            surname: "Da Giau",
            birthDate: "2001-05-22",
            birthPlace: "Pieve di Cadore",
            country: "Italy",
        });

    console.log(`---------------------------------------------------`);
    console.log(`STUDENT:`);
    console.log(`Address: ${student.ethWallet.address}`);
    console.log(`Wallet address: ${student.academicWalletAddress}`);
    console.log(`Id: ${student.id}`);
    console.log(`Password: ${student.password}`);
    console.log(`---------------------------------------------------`);


    // Fund the wallet
    console.log("\nFunding the password-derived wallet...");
    const balance = ethers.parseEther("10000.0")
    await hre.network.provider.send("hardhat_setBalance", [
        student.ethWallet.address,
        `0x${balance.toString(16)}`,
    ]);
    console.log(`Balance: ${ethers.formatEther(balance)}`);

    const courses: eduwallet.CourseInfo[] = [
        {
            code: "14BHDOA",
            name: "Computer Science",
            degreeCourse: "Bachelor in COMPUTER SCIENCE",
            ects: 8.0,
        },
        {
            code: "14BHDYT",
            name: "Prova",
            degreeCourse: "Master in COMPUTER SCIENCE",
            ects: 7.5,
        },
    ]
    // Enroll student
    console.log("\nEnrolling student...");
    await eduwallet.enrollStudent(university1, student.academicWalletAddress, courses);

    // Evaluate student
    const pdfPath = "./certificate.pdf"
    const fileBuffer = fs.readFileSync(pdfPath);
    const fileName = path.basename(pdfPath);
    const certificateFile = new File([fileBuffer], fileName, { type: 'application/pdf' });
    const evaluations: eduwallet.Evaluation[] = [{
        code: "14BHDOA",
        evaluationDate: "2025-03-18",
        grade: "30L/30",
        certificate: "./certificate.pdf",
    }];
    console.log("\nEvaluating student...");
    await eduwallet.evaluateStudent(university1, student.academicWalletAddress, evaluations);

    console.log("\nFetching student info...");
    const studentNew = await eduwallet.getStudentInfo(university1, student.academicWalletAddress);
    console.log(`---------------------------------------------------`);
    console.log(`STUDENT:`);
    console.log(`Name: ${studentNew.name}`);
    console.log(`Surname: ${studentNew.surname}`);
    console.log(`Birth date: ${studentNew.birthDate}`);
    console.log(`Birth place: ${studentNew.birthPlace}`);
    console.log(`Country: ${studentNew.country}`);
    console.log(`---------------------------------------------------`);

    console.log("\nFetching complete student info with results...");
    const studentComplete = await eduwallet.getStudentWithResult(university1, student.academicWalletAddress);
    console.log(`---------------------------------------------------`);
    console.log(`STUDENT:`);
    console.log(`Name: ${studentComplete.name}`);
    console.log(`Surname: ${studentComplete.surname}`);
    console.log(`Birth date: ${studentComplete.birthDate}`);
    console.log(`Birth place: ${studentComplete.birthPlace}`);
    console.log(`Country: ${studentComplete.country}`);
    console.log(`Results:`);
    for (const result of studentComplete.results ?? []) {
        console.log(`\tCourse Code: ${result.code}`);
        console.log(`\tCourse Name: ${result.name}`);
        console.log(`\tUniversity: ${result.university.name}`);
        console.log(`\tDegree course: ${result.degreeCourse}`);
        console.log(`\tECTS: ${result.ects || "N/A"}`);
        console.log(`\tDate: ${result.evaluationDate ? result.evaluationDate : "N/A"}`);
        console.log(`\tGrade: ${result.grade || "N/A"}`);
        console.log(`\tCertificate: ${result.certificate || "N/A"}\n`);
    }
    console.log(`---------------------------------------------------`);

    console.log(`\nAsking for read permission...`)
    await eduwallet.askForPermission(university2, student.academicWalletAddress, eduwallet.PermissionType.Read);
    console.log(`Permission asked`);

    console.log(`\nChecking for read permission...`)
    const permission = await eduwallet.verifyPermission(university2, student.academicWalletAddress);
    console.log(`PERMISSION:`);
    console.log(`Type: ${permission ? permission : `null`}`);

    console.log("\nInteraction script completed successfully!");
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });*/
