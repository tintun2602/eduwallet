#!/usr/bin/env node

import { Wallet } from "ethers";
import * as eduwallet from "../sdk/dist/index.js";

// Student data from your request
const students = [
  {
    name: "Lars",
    surname: "Hansen",
    birthDate: "2001-03-15",
    birthPlace: "Oslo",
    country: "Norway",
    university: "University of Oslo",
    universityShort: "UiO",
    note: "Common Norwegian name from capital city",
  },
  {
    name: "Ingrid",
    surname: "Johansen",
    birthDate: "2000-07-22",
    birthPlace: "Bergen",
    country: "Norway",
    university: "University of Bergen",
    universityShort: "UiB",
    note: "Traditional name from Norway's second largest city",
  },
  {
    name: "Erik",
    surname: "Andersen",
    birthDate: "1999-11-08",
    birthPlace: "Trondheim",
    country: "Norway",
    university: "Norwegian University of Science and Technology",
    universityShort: "NTNU",
    note: "From university city in central Norway",
  },
  {
    name: "Sofie",
    surname: "Olsen",
    birthDate: "2002-01-30",
    birthPlace: "Stavanger",
    country: "Norway",
    university: "University of Stavanger",
    universityShort: "UiS",
    note: "Modern spelling, from oil capital of Norway",
  },
  {
    name: "Magnus",
    surname: "Pedersen",
    birthDate: "2001-09-14",
    birthPlace: "Tromsø",
    country: "Norway",
    university: "UiT The Arctic University of Norway",
    universityShort: "UiT",
    note: "Popular name from northern Norway",
  },
  {
    name: "Emilie",
    surname: "Kristiansen",
    birthDate: "2000-05-03",
    birthPlace: "Drammen",
    country: "Norway",
    university: "University of South-Eastern Norway",
    universityShort: "USN",
    note: "Common modern name from Buskerud county",
  },
  {
    name: "Henrik",
    surname: "Larsen",
    birthDate: "1999-12-19",
    birthPlace: "Fredrikstad",
    country: "Norway",
    university: "Norwegian University of Life Sciences",
    universityShort: "NMBU",
    note: "Traditional name from Østfold region",
  },
  {
    name: "Nora",
    surname: "Eriksen",
    birthDate: "2001-06-25",
    birthPlace: "Kristiansand",
    country: "Norway",
    university: "University of Agder",
    universityShort: "UiA",
    note: "Very popular Norwegian name from southern Norway",
  },
  {
    name: "Bjørn",
    surname: "Nielsen",
    birthDate: "2000-04-11",
    birthPlace: "Bodø",
    country: "Norway",
    university: "Nord University",
    universityShort: "Nord",
    note: "Classic Norwegian name with ø character, from Nordland",
  },
  {
    name: "Thea",
    surname: "Halvorsen",
    birthDate: "2002-08-07",
    birthPlace: "Ålesund",
    country: "Norway",
    university: "Norwegian University of Science and Technology",
    universityShort: "NTNU",
    note: "Modern popular name from coastal city with å character",
  },
];

async function registerAllStudents() {
  console.log("Student EduWallet Student Registration Script");
  console.log("==========================================\n");

  // You'll need to provide a university wallet private key
  // This should be from a university that has already been subscribed
  const universityPrivateKey = process.env.UNIVERSITY_PRIVATE_KEY;

  if (!universityPrivateKey) {
    console.error(
      "Error Error: UNIVERSITY_PRIVATE_KEY environment variable is required"
    );
    console.log(
      "Please set it to a university wallet private key that has been subscribed"
    );
    console.log(
      "Example: export UNIVERSITY_PRIVATE_KEY=0x264d209d39106077f75e99cecf615c625298b0e53dac2bb5a68678b480c6fa1d"
    );
    process.exit(1);
  }

  try {
    // Create university wallet
    const universityWallet = new Wallet(universityPrivateKey);
    console.log(`University  Using university wallet: ${universityWallet.address}\n`);

    const results = [];

    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      console.log(
        `Deploying Registering student ${i + 1}/${students.length}: ${student.name} ${
          student.surname
        }`
      );

      try {
        // Register student using SDK
        const studentData = {
          name: student.name,
          surname: student.surname,
          birthDate: student.birthDate,
          birthPlace: student.birthPlace,
          country: student.country,
        };

        const credentials = await eduwallet.registerStudent(
          universityWallet,
          studentData
        );

        console.log(
          `Success Successfully registered ${student.name} ${student.surname}`
        );
        console.log(`   Student ID: ${credentials.id}`);
        console.log(`   Password: ${credentials.password}`);
        console.log(`   Academic Wallet: ${credentials.academicWalletAddress}`);
        console.log(`   ETH Wallet: ${credentials.ethWallet.address}`);
        console.log(
          `   University: ${student.university} (${student.universityShort})`
        );
        console.log(`   Note: ${student.note}\n`);

        results.push({
          student: student,
          credentials: credentials,
          success: true,
        });
      } catch (error) {
        console.log(`Error Failed to register ${student.name} ${student.surname}`);
        console.log(`   Error: ${error.message}\n`);

        results.push({
          student: student,
          error: error.message,
          success: false,
        });
      }
    }

    // Summary
    console.log("Stats Registration Summary");
    console.log("=====================");
    const successful = results.filter((r) => r.success).length;
    const failed = results.filter((r) => !r.success).length;

    console.log(
      `Success Successfully registered: ${successful}/${students.length} students`
    );
    console.log(
      `Error Failed registrations: ${failed}/${students.length} students\n`
    );

    if (successful > 0) {
      console.log("Success Successfully registered students:");
      results
        .filter((r) => r.success)
        .forEach((result, index) => {
          const student = result.student;
          const creds = result.credentials;
          console.log(
            `${index + 1}. ${student.name} ${student.surname} (ID: ${creds.id})`
          );
        });
    }

    if (failed > 0) {
      console.log("\n💥 Failed registrations:");
      results
        .filter((r) => !r.success)
        .forEach((result, index) => {
          const student = result.student;
          console.log(
            `${index + 1}. ${student.name} ${student.surname} - ${result.error}`
          );
        });
    }
  } catch (error) {
    console.error("💥 Fatal error:", error.message);
    process.exit(1);
  }
}

// Run the script
registerAllStudents().catch(console.error);
