const { ethers } = require("hardhat");

/**
 * EduWallet Contract Deployment Script
 * Deploys all necessary contracts for the EduWallet system
 * @author Diego Da Giau
 * @co-author Tin Tun Naing
 */

async function main() {
  console.log("Deploying EduWallet Contracts");
  console.log("==================================\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log(
    "Account balance:",
    (await ethers.provider.getBalance(deployer.address)).toString()
  );

  // Deploy StudentDeployer
  console.log("\nDeploying StudentDeployer...");
  const StudentDeployer = await ethers.getContractFactory("StudentDeployer");
  const studentDeployer = await StudentDeployer.deploy();
  await studentDeployer.waitForDeployment();
  const studentDeployerAddress = await studentDeployer.getAddress();
  console.log("StudentDeployer deployed to:", studentDeployerAddress);

  // Deploy UniversityDeployer
  console.log("\nDeploying UniversityDeployer...");
  const UniversityDeployer = await ethers.getContractFactory(
    "UniversityDeployer"
  );
  const universityDeployer = await UniversityDeployer.deploy();
  await universityDeployer.waitForDeployment();
  const universityDeployerAddress = await universityDeployer.getAddress();
  console.log("UniversityDeployer deployed to:", universityDeployerAddress);

  // Deploy StudentsRegister
  console.log("\nDeploying StudentsRegister...");
  const StudentsRegister = await ethers.getContractFactory("StudentsRegister");
  const studentsRegister = await StudentsRegister.deploy(
    studentDeployerAddress,
    universityDeployerAddress
  );
  await studentsRegister.waitForDeployment();
  const studentsRegisterAddress = await studentsRegister.getAddress();
  console.log("StudentsRegister deployed to:", studentsRegisterAddress);

  console.log("\nAll contracts deployed successfully!");
  console.log("\nContract Addresses:");
  console.log(`   StudentsRegister: ${studentsRegisterAddress}`);
  console.log(`   StudentDeployer: ${studentDeployerAddress}`);
  console.log(`   UniversityDeployer: ${universityDeployerAddress}`);

  console.log("\nUpdate your .env file with:");
  console.log(`   REGISTER_ADDRESS=${studentsRegisterAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
