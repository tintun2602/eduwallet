// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2;

import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import "./Student.sol";

error AlreadyExistingStudent();
error StudentNotAccessible();

/**
 * @title StudentRegister
 * @author Diego Da Giau
 * @notice Connects each student with her wallet and records the verified universities.
 */
contract StudentsRegister is AccessControl {
    bytes32 private constant UNIVERSITY_ROLE = keccak256("UNIVERSITY_ROLE");
    bytes32 private constant STUDENT_ROLE = keccak256("STUDENT_ROLE");

    mapping(address student => address studentWallet) private studentWallets;

    function subscribe() external {
        _grantRole(UNIVERSITY_ROLE, _msgSender());
    }

    function registerStudent(address _student, string calldata _name, string calldata _surname, uint _birthDate, string calldata _birthPlace, string calldata _country) external onlyRole(UNIVERSITY_ROLE) {
        require(!hasRole(STUDENT_ROLE, _student), AlreadyExistingStudent());
        Student newStudent = new Student(_msgSender(), _student, _name, _surname, _birthDate, _birthPlace, _country);
        studentWallets[_student] = address(newStudent);
        _grantRole(STUDENT_ROLE, _student);
    }

    function getStudentWallet(address student) external view returns (address) {
        require(hasRole(UNIVERSITY_ROLE, _msgSender()) || _msgSender() == student, StudentNotAccessible());
        return studentWallets[student];
    }
}
