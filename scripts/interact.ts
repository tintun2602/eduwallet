import { ethers, Wallet } from 'ethers';
import * as crypto from 'crypto';
import { StudentsRegister } from '../typechain-types';
import * as eduwallet from 'eduwallet-sdk'
import * as hre from 'hardhat';
import * as dotenv from 'dotenv'
import * as fs from 'fs';
import * as path from 'path';

const PROVIDER = hre.ethers.provider;
dotenv.config();

async function deployStudentsRegister(): Promise<StudentsRegister> {
    const StudentsRegister = await hre.ethers.getContractFactory("StudentsRegister");
    const studentsRegister = await StudentsRegister.deploy();

    await studentsRegister.waitForDeployment();

    const address = await studentsRegister.getAddress();
    console.log(`\n---------------------------------------------------`);
    console.log(`STUDENT REGISTER:`);
    console.log(`Address: ${address}`);
    console.log(`---------------------------------------------------\n`);

    return studentsRegister;
}

async function getUniversityWallet(): Promise<Wallet> {
    const privateKey = crypto.randomBytes(32).toString('hex');
    const universityPrivateKey = `0x${privateKey}`;
    const wallet = new Wallet(universityPrivateKey);

    const balance = ethers.parseEther("10000000.0")
    await hre.network.provider.send("hardhat_setBalance", [
        wallet.address,
        `0x${balance.toString(16)}`,
    ]);
    console.log(`---------------------------------------------------`);
    console.log(`UNIVERSITY:`);
    console.log(`Address: ${wallet.address}`)
    console.log(`Balance: ${ethers.formatEther(balance)}`);
    console.log(`---------------------------------------------------`);

    return wallet.connect(PROVIDER);
}

async function getDeployer() {
    const [deployer] = await hre.ethers.getSigners();
    console.log(`---------------------------------------------------`);
    console.log(`DEPLOYER:`);
    console.log(`Address: ${await deployer.getAddress()}`)
    console.log(`---------------------------------------------------`);

    return deployer;
}



async function main(): Promise<void> {
    let studentsRegister: StudentsRegister;
    if (!process.env.DEPLOYED) {
        studentsRegister = await deployStudentsRegister();
    } else {
        studentsRegister = eduwallet.getStudentsRegister();
        console.log(`\n---------------------------------------------------`);
        console.log(`STUDENT REGISTER (OLD):`);
        console.log(`Address: ${process.env.DEPLOYED}`);
        console.log(`---------------------------------------------------\n`);
    }
    const [deployer, university] = await Promise.all([
        getDeployer(),
        getUniversityWallet()
    ]);

    // Register university
    console.log("\nRegistering university...");
    const universityTx = await studentsRegister.connect(university).subscribe(
        "Politecnico di Torino",
        "Italy",
        "PoliTo"
    );
    await universityTx.wait();
    console.log(`University registered`);

    // Create a student wallet from password
    console.log("\nCreating student wallet...");
    const student = await eduwallet.registerStudent(
        university,
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
    await eduwallet.enrollStudent(university, student.academicWalletAddress, courses);

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
    await eduwallet.evaluateStudent(university, student.academicWalletAddress, evaluations);

    console.log("\nFetching student info...");
    const studentNew = await eduwallet.getStudentInfo(university, student.academicWalletAddress);
    console.log(`---------------------------------------------------`);
    console.log(`STUDENT:`);
    console.log(`Name: ${studentNew.name}`);
    console.log(`Surname: ${studentNew.surname}`);
    console.log(`Birth date: ${studentNew.birthDate}`);
    console.log(`Birth place: ${studentNew.birthPlace}`);
    console.log(`Country: ${studentNew.country}`);
    console.log(`---------------------------------------------------`);

    console.log("\nFetching complete student info with results...");
    const studentComplete = await eduwallet.getStudentWithResult(university, student.academicWalletAddress);
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

    console.log("\nInteraction script completed successfully!");
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error: Error) => {
        console.error(error);
        process.exit(1);
    });
