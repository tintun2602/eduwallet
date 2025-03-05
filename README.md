# EduWallet

## Table of contents

- [EduWallet](#eduwallet)
  - [Table of contents](#table-of-contents)
  - [Purpose](#purpose)
  - [Scenarios](#scenarios)
    - [Scenario 1](#scenario-1)
    - [Scenario 2](#scenario-2)
  - [GUI prototype](#gui-prototype)
  - [Future](#future)

## Purpose

The project aims to revolutionize university credit management by storing students' academic information on the blockchain. Through EduWallet APIs, universities can easily synchronize grades and credits, simplifying the transfer of academic records between institutions. EduWallet ensures secure, efficient record-keeping and easy credit transferability across institutions.

## Scenarios

### Scenario 1

**Title:** Exchange Student Academic Certification with EduWallet

**Actors:**

- **Student**: Participates to an exchange project (ex. Erasmus+ project). At the beginning of the project she must send to the host university her previous academic career. At the end of the project she has to certificate her results at the host university with her home university.
- **Home university**: When the project starts it provides the student with the data about her career. At the end, it needs her academic results (grades and credits).
- **Host university**: When the project starts it needs the student's data and her career. During the project it evaluates the student's performances, providing grades and credits. At the end, it certificates the results.

**Preconditions:**

- The students apply for the first time in a university.
- Both universities are registered and authorized entities in the EduWallet system.

**Scenario**:

1. The home university approves the student's enrolment request and create an EduWallet for her, inserting the student's validated data. The first university has by default the permission to write and read the student's wallet.
2. During the student's career, her home university records grades and credits on EduWallet.
3. The student decides to participate in an exchange program. The host university requests the permission to access her EduWallet data.
4. The student grants the permissions to the host university.
5. The host university retrieves the student's academic records and approve her exchange request.
6. The host university asks the student for the permission to modify her data.
7. The student grants the writing access.
8. During the exchange program, the host university records the student's academic performance, including grades and credits, on EduWallet.
9. At the end of the program, the student removes the host university's access to her EduWallet data.
10. The home university retrieves the student’s academic results from the host university via EduWallet.

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

## GUI prototype

[Figma GUI prototype](https://www.figma.com/design/aZrmR2thWfRGKQWDQbZE9C/EduWallet?node-id=125-95&t=gQwA5a4uDzRy8jBl-1)

## Future

- Integration of PDF documents and other file formats within the student's wallet
- Enhanced privacy mechanisms for blockchain data protection
- Implementation of Gas Station Network (GSN) or alternative methods to eliminate user gas fees
- Authentication system upgrades for improved security
