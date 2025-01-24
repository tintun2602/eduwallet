# EduWallet

## Table of contents

- [EduWallet](#eduwallet)
  - [Table of contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Scenarios](#scenarios)
    - [Scenario 1](#scenario-1)
    - [Scenario 2](#scenario-2)

## Purpose

The project aims to revolutionize university credit management by integrating blockchain with existing educational systems using Blackboard and Inspera APIs. EduWallet ensures secure, efficient record-keeping and easy credit transferability across institutions.

## Scenarios

### Scenario 1

**Title:** Exchange Student Academic Certification with EduWallet

**Actors:**

- **Student**: Participates to an exchange project (ex. Erasmus+ project). At the beginning of the project she must send to the host university her previous academic career. At the end of the project she has to certificate her results at the host university with her home university.
- **Home university**: When the project starts it provides the student with the data about her career. At the end, it needs her academic results (grades and credits).
- **Host university**: When the project starts it needs the student's data and her career. During the project it evaluates the student's performances, providing grades and credits. At the end, it certificates the results.

**Preconditions:**

- The students is enrolled in a university.
- The home university provides a Metamask wallet with some ETH to the student. The student needs it to pay the transaction fees required to write her data in the blockchain.
- Both universities are registered and authorized entities in the EduWallet system.

**Scenario**:

1. The student creates an account on EduWallet, entering her personal information (e.g., name, surname, date of birth, and ID) and linking her Metamask wallet.
2. The students manually gives to her university the permission to access and modify her EduWallet data.
3. The home university approves the student's enrolment request and updates her EduWallet with her academic data, including her new study plan.
4. During the student's career, her home university records grades and credits on EduWallet.
5. The student decides to participate in an exchange program and the host university permission to access (and modify) her EduWallet data.
6. The host university retrieves the student's academic records, verifies them, and approve her exchange request. The host university updates her new study plan.
7. During the exchange program, the host university records the student's academic performance, including grades and credits, on EduWallet.
8. At the end of the program, the student removes the host university's access to her EduWallet data.
9. The home university retrieves the student’s academic results from the host university via EduWallet.

**Postconditions:**

- The student has all her academic result recorded in EduWallet.
- The home university can automatically retrieve the student's data from EduWallet.
- The student's data in EduWallet are verified and certified by both the home and host university.

### Scenario 2

**Title:** Job interview

**Actors:**

- **Employer**: Searches for a worker with specific skills and a verified academic background.
- **Candidate**:  Applies for a job and needs to demonstrate her academic qualifications.

**Preconditions:**

- The candidate and the university she attended are registered and authorized in EduWallet.
- The candidate's academic record, including grades, certifications, and degrees, are securely stored in EduWallet.

**Scenario**:

1. The employer requests the candidate's academic background during the job application process.
2. The candidate logs into her EduWallet account and retrieves her academic data from the blockchain.
3. The candidate grants the employer temporary access to her EduWallet academic results.

**Postconditions:**

- The employer has verified and certified access to the candidate's academic records through EduWallet.
- The candidate academic data are certified, secure and immutable without authorization.
- The permission granted to the employer expires.
