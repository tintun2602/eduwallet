// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import "./Student.sol";
import "./University.sol";

// Custom errors for better clarity
error AlreadyExistingUniversity();
error UniversityNotAccessible();
error UniversityNotPresent();
error AlreadyExistingStudent();
error StudentNotAccessible();
error StudentNotPresent();

/**
 * @title StudentsRegister
 * @author Diego Da Giau
 * @notice This contract manages student registrations and university verifications
 * @dev Implements OpenZeppelin's AccessControl for role-based permissions
 *
 * TODO: Add input validation. Add events if necessary. Change require with if statements, revert and custom errors.
 * ? Is it better to save universities wallets addresses directly in the student's wallet?
 */
contract StudentsRegister is AccessControl {
    // Role definitions for access control
    bytes32 private constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");
    bytes32 private constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    // State variables
    mapping(address university => address universityWallet)
        private universityWallets;
    mapping(address student => address studentWallet) private studentWallets;

    /**
     * @notice Registers a new university in the system
     * @param _name University's full name
     * @param _country University's country code (ISO 3166-1 alpha-2)
     * @param _shortName University's abbreviation
     */
    function subscribe(
        string calldata _name,
        string calldata _country,
        string calldata _shortName
    ) external returns (address) {
        require(
            !hasRole(UNIVERSITY_ROLE, _msgSender()),
            AlreadyExistingUniversity()
        );

        University newUniversity = new University(_name, _country, _shortName);
        address addr = address(newUniversity);
        universityWallets[_msgSender()] = addr;
        _grantRole(UNIVERSITY_ROLE, _msgSender());
        return addr;
    }

    /**
     * @notice Retrieves multiple university wallet addresses in a single call
     * @dev Only accessible by registered universities and students
     * @param _universities Array of university addresses to query
     * @return addresses Array of corresponding wallet addresses
     * @custom:throws UniversityNotAccessible if caller is not authorized
     * @custom:throws UniversityNotPresent if address not correspond to any universities
     */
    function getUniversitiesWallets(
        address[] calldata _universities
    ) external view returns (address[] memory addresses) {
        // Access control
        if (
            !hasRole(UNIVERSITY_ROLE, _msgSender()) &&
            !hasRole(STUDENT_ROLE, _msgSender())
        ) {
            revert UniversityNotAccessible();
        }

        // Initialize return array in memory
        addresses = new address[](_universities.length);

        // Fetch all wallet addresses
        for (uint i = 0; i < _universities.length; i++) {
            address wallet = universityWallets[_universities[i]];
            if (wallet == address(0)) {
                revert UniversityNotPresent();
            }
            addresses[i] = wallet;
        }
        return addresses;
    }

    /**
     * @notice Registers a new student in the system
     * @dev Only callable by addresses with UNIVERSITY_ROLE
     * @param _student Address of the student to register
     * @param _basicInfo Struct containing core biographical student's info
     * @custom:throws AlreadyExistingStudent if student is already registered
     */
    function registerStudent(
        address _student,
        Student.StudentBasicInfo calldata _basicInfo
    ) external onlyRole(UNIVERSITY_ROLE) {
        // Check if student is not already registered
        require(!hasRole(STUDENT_ROLE, _student), AlreadyExistingStudent());

        // Deploy new Student contract for this student
        Student newStudent = new Student(_msgSender(), _student, _basicInfo);

        // Store student's contract address and grant student role
        studentWallets[_student] = address(newStudent);
        _grantRole(STUDENT_ROLE, _student);
    }

    /**
     * @notice Retrieves the wallet address for a specific student
     * @dev Only callable by universities or the student themselves
     * @param student Address of the student whose wallet is being queried
     * @return address The address of the student's Smart Contract
     * @custom:throws StudentNotAccessible if caller is not authorized
     * @custom:throws StudentNotPresent if student is not registered
     */
    function getStudentWallet(address student) external view returns (address) {
        // Check if caller is authorized
        require(
            hasRole(UNIVERSITY_ROLE, _msgSender()) || _msgSender() == student,
            StudentNotAccessible()
        );

        // Get and verify student wallet exists
        address studentWallet = studentWallets[student];
        if (studentWallet != address(0)) {
            return studentWallet;
        }
        revert StudentNotPresent();
    }
}
