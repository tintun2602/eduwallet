#!/usr/bin/env node

import { Wallet, JsonRpcProvider } from "ethers";
import * as eduwallet from "../sdk/dist/index.js";

async function addTestGrades() {
  console.log("Adding Test Grades to Student");
  console.log("============================\n");

  const universityPrivateKey = process.env.UNIVERSITY_PRIVATE_KEY;
  if (!universityPrivateKey) {
    console.error(
      "Error: UNIVERSITY_PRIVATE_KEY environment variable is required"
    );
    process.exit(1);
  }

  const universityWallet = new Wallet(universityPrivateKey);
  console.log(`University wallet: ${universityWallet.address}\n`);

  // Student details from the registration
  const studentWalletAddress = "0x4F9DA333DCf4E5A53772791B95c161B2FC041859";
  const studentEthWallet = "0x9A4a9c44CB6EC508D6E3aE8203b07BDD54E5D4c2";

  try {
    // First, enroll the student in some courses
    console.log("Enrolling student in courses...");
    const courses = [
      {
        code: "TDT4120",
        name: "Advanced Programming",
        degreeCourse: "Computer Science",
        ects: 7.5,
      },
      {
        code: "TDT4145",
        name: "Database Systems",
        degreeCourse: "Computer Science",
        ects: 7.5,
      },
      {
        code: "TDT4173",
        name: "Machine Learning",
        degreeCourse: "Computer Science",
        ects: 7.5,
      },
    ];

    const enrollmentErrors = await eduwallet.enrollStudent(
      universityWallet,
      studentWalletAddress,
      courses
    );

    if (enrollmentErrors.length > 0) {
      console.error("Enrollment errors:", enrollmentErrors);
    } else {
      console.log("Successfully enrolled student in all courses!");
    }

    // Now evaluate the student (add grades)
    console.log("\nAdding grades to student...");
    const evaluations = [
      {
        courseCode: "TDT4120",
        grade: "A",
        date: new Date("2023-12-15"),
        certificateCid: "QmTestCert1",
      },
      {
        courseCode: "TDT4145",
        grade: "B",
        date: new Date("2023-12-10"),
        certificateCid: "QmTestCert2",
      },
      {
        courseCode: "TDT4173",
        grade: "A",
        date: new Date("2023-12-20"),
        certificateCid: "QmTestCert3",
      },
    ];

    const evaluationErrors = await eduwallet.evaluateStudent(
      universityWallet,
      studentWalletAddress,
      evaluations
    );

    if (evaluationErrors.length > 0) {
      console.error("Evaluation errors:", evaluationErrors);
    } else {
      console.log("Successfully added all grades!");
    }

    // Get the student info to verify
    console.log("\nRetrieving student information...");
    const studentInfo = await eduwallet.getStudentWithResult(
      universityWallet,
      studentWalletAddress
    );

    console.log("Student Info:");
    console.log(`Name: ${studentInfo.name} ${studentInfo.surname}`);
    console.log(`Birth Date: ${studentInfo.birthDate}`);
    console.log(`Birth Place: ${studentInfo.birthPlace}`);
    console.log(`Country: ${studentInfo.country}`);
    console.log(`Results: ${studentInfo.results?.length || 0} courses`);

    if (studentInfo.results && studentInfo.results.length > 0) {
      console.log("\nAcademic Results:");
      studentInfo.results.forEach((result, index) => {
        console.log(
          `${index + 1}. ${result.name} (${result.code}) - Grade: ${
            result.grade
          }`
        );
      });
    }

    console.log("\nSuccess! Student now has academic records with grades.");
  } catch (error) {
    console.error("Error adding grades:", error.message);
    process.exit(1);
  }
}

// Run the script
addTestGrades().catch(console.error);
