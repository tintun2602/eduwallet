// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import "./Student.sol";

// Custom errors for better clarity
error AlreadyExistingStudent();
error StudentNotAccessible();
error StudentNotPresent();

/**
 * @title StudentsRegister
 * @author Diego Da Giau
 * @notice This contract manages student registrations and university verifications
 * @dev Implements OpenZeppelin's AccessControl for role-based permissions
 */
contract StudentsRegister is AccessControl {
    // Role definitions for access control
    bytes32 private constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");
    bytes32 private constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    // Maps student addresses to their corresponding Student contract addresses
    mapping(address student => address studentWallet) private studentWallets;

    /**
     * @notice Allows a university to subscribe to the system
     * @dev Grants UNIVERSITY_ROLE to the caller
     */
    function subscribe() external {
        _grantRole(UNIVERSITY_ROLE, _msgSender());
    }

    /**
     * @notice Registers a new student in the system
     * @dev Only callable by addresses with UNIVERSITY_ROLE
     * @param _student Address of the student to register
     * @param _name Student's first name
     * @param _surname Student's last name
     * @param _birthDate Student's birth date as Unix timestamp
     * @param _birthPlace Student's place of birth
     * @param _country Student's country of birth
     * @custom:throws AlreadyExistingStudent if student is already registered
     */
    function registerStudent(
        address _student,
        string calldata _name,
        string calldata _surname,
        uint _birthDate,
        string calldata _birthPlace,
        string calldata _country
    ) external onlyRole(UNIVERSITY_ROLE) {
        // Check if student is not already registered
        require(!hasRole(STUDENT_ROLE, _student), AlreadyExistingStudent());

        // Deploy new Student contract for this student
        Student newStudent = new Student(
            _msgSender(),
            _student,
            _name,
            _surname,
            _birthDate,
            _birthPlace,
            _country
        );

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
