# EduWallet SDK

## Constants

- **blockchainConfig**  
  Blockchain network configuration.
  Uses environment variables when available, falls back to development defaults.

- **ipfsConfig**  
  IPFS storage configuration via S3-compatible service.
  Uses environment variables when available, falls back to development defaults.

- **provider**  
  Ethereum JSON-RPC provider instance.
  Pre-configured with the URL from blockchain configuration.

- **s3Client**  
  S3 client for IPFS storage.
  Pre-configured with the settings from IPFS configuration.

## Functions

### registerStudent(universityWallet, student) → `Promise<StudentCredentials>`

Registers a new student in the academic blockchain system.
Creates both a student Ethereum wallet and academic record.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| universityWallet | `Wallet` | The university wallet with registration permissions |
| student | `StudentData` | The student information to register |

**Returns**: `Promise<StudentCredentials>` - The created student credentials and wallet information

### enrollStudent(universityWallet, studentWalletAddress, courses) → `Promise<void>`

Enrolls a student in one or more academic courses.
Adds course records to the student's academic wallet.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| universityWallet | `Wallet` | The university wallet with enrollment permissions |
| studentWalletAddress | `string` | The student's academic wallet address |
| courses | `CourseInfo[]` | Array of courses to enroll the student in |

**Returns**: `Promise<void>` - Promise that resolves when enrollment is complete

### evaluateStudent(universityWallet, studentWalletAddress, evaluations) → `Promise<void>`

Records academic evaluations for a student's enrolled courses.
Publishes certificates to IPFS when provided.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| universityWallet | `Wallet` | The university wallet with evaluation permissions |
| studentWalletAddress | `string` | The student's academic wallet address |
| evaluations | `Evaluation[]` | Array of academic evaluations to record |

**Returns**: `Promise<void>` - Promise that resolves when evaluations are recorded

### getStudentInfo(universityWallet, studentWalletAddress) → `Promise<Student>`

Retrieves basic student information from the blockchain.
Only fetches personal data without academic results.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| universityWallet | `Wallet` | The university wallet with read permissions |
| studentWalletAddress | `string` | The student's academic wallet address |

**Returns**: `Promise<Student>` - The student's basic information

### getStudentWithResult(universityWallet, studentWalletAddress) → `Promise<Student>`

Retrieves student information including academic results.
Provides a complete academic profile with course outcomes.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| universityWallet | `Wallet` | The university wallet with read permissions |
| studentWalletAddress | `string` | The student's academic wallet address |

**Returns**: `Promise<Student>` - The student's complete information with academic results

### createStudentWallet() → `StudentEthWalletInfo`

Creates a new wallet for a student with random credentials.
Generates a random ID and password, then derives a private key for blockchain interaction.

**Author**: Diego Da Giau  

**Returns**: `StudentEthWalletInfo` - Object containing student ID, password and Ethereum wallet

### generateRandomString(length) → `string`

Generates a cryptographically secure random string of specified length.
Used for creating student credentials.
TODO: substitute crypto with ethers

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| length | `number` | Desired length of the random string |

**Returns**: `string` - Hexadecimal random string

### derivePrivateKey(password, studentId) → `string`

Derives a private key from a password and student ID using PBKDF2.
Creates a deterministic key that can be reconstructed with the same inputs.
TODO: substitute crypto with ethers

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| password | `string` | User password for key derivation |
| studentId | `string` | Student ID used as salt |

**Returns**: `string` - Ethereum-compatible private key with 0x prefix

### getStudentsRegister() → `StudentsRegister`

Retrieves the StudentsRegister contract instance.
Central registry that manages student and university registrations.

**Author**: Diego Da Giau  

**Returns**: `StudentsRegister` - Connected contract instance

### getStudentContract(contractAddress) → `Student`

Gets a connected instance of a Student contract for interaction.
Used to interact with a specific student's academic record.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| contractAddress | `string` | Student contract address |

**Returns**: `Student` - Connected student contract instance

### computeDate(date) → `string`

Converts a blockchain timestamp to a human-readable ISO date string.
Handles the conversion from Unix epoch seconds to JavaScript milliseconds.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| date | `bigint` | Unix timestamp as BigInt |

**Returns**: `string` - ISO formatted date string

### publishCertificate(certificate) → `Promise<string>`

Uploads a certificate to IPFS via S3 compatible storage.
Handles both file paths and direct buffer uploads.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| certificate | `Buffer \| string` | Certificate as a Buffer or file path |

**Returns**: `Promise<string>` - The IPFS content identifier (CID)

### generateStudent(universityWallet, student, results) → `Promise<StudentInterface>`

Generates a complete student object with academic results.
Fetches university information for each result and formats data.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| universityWallet | `Wallet` | University wallet with read permissions |
| student | `Student.StudentBasicInfoStructOutput` | Basic student information from contract |
| results | `Student.ResultStructOutput[]` | Array of raw result data from contract |

**Returns**: `Promise<StudentInterface>` - Complete student object with formatted results  
**Throws**: `Error` - If a university cannot be found for a result

### generateResult(result, university) → `AcademicResult`

Formats a raw academic result from the blockchain into a human-readable format.
Converts numerical values, dates, and adds readable URLs for certificates.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| result | `Student.ResultStructOutput` | Raw result data from contract |
| university | `University` | University information for this result |

**Returns**: `AcademicResult` - Formatted academic result

### getUniversities(universityWallet, universitiesAddresses) → `Promise<Map<string, University>>`

Retrieves information about multiple universities by their blockchain addresses.
Maps university addresses to their detailed information.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| universityWallet | `Wallet` | Wallet with permissions to read university data |
| universitiesAddresses | `Set<string>` | Set of university blockchain addresses |

**Returns**: `Promise<Map<string, University>>` - Map of university addresses to university details

### getUniversity(universityWallet, universityContractAddress) → `Promise<University>`

Retrieves information about a single university.
Connects to the university's contract and fetches its details.

**Author**: Diego Da Giau  

| Parameter | Type | Description |
| --- | --- | --- |
| universityWallet | `Wallet` | Wallet with permissions to read university data |
| universityContractAddress | `string` | Address of the university's contract |

**Returns**: `Promise<University>` - University details

## Configuration Details

### blockchainConfig

- **url** - Network endpoint - configure via NETWORK_URL env var.
- **registerAddress** - StudentsRegister contract address - configure via REGISTER_ADDRESS env var.

### ipfsConfig

- **gatewayUrl** - IPFS gateway url - configure via IPFS_GATEWAY env var.
- **bucketName** - S3 bucket name - configure via S3_BUCKET env var.
- **s3Config** - S3 client configuration object.
  - **apiVersion** - S3 API version.
  - **credentials** - Authentication credentials.
    - **accessKeyId** - Access key ID - configure via S3_ACCESS_KEY env var.
    - **secretAccessKey** - Secret access key - configure via S3_SECRET_KEY env var.
  - **endpoint** - S3 endpoint URL - configure via S3_ENDPOINT env var.
  - **region** - AWS region - configure via S3_REGION env var.
  - **forcePathStyle** - Use path-style addressing.
