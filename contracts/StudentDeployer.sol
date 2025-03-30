// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2;

import "./Student.sol";

/**
 * @title StudentDeployer
 * @author Diego Da Giau
 * @notice This contract is responsible for deploying new Student contracts
 * @dev Used by the StudentsRegister to create new Student instances
 */
contract StudentDeployer {
    /**
     * @notice Creates a new Student contract
     * @dev Deploys a new instance of the Student contract with the provided parameters
     * @param university Address of the university that will have WRITER_ROLE
     * @param student Address of the student who will be the admin
     * @param info Struct containing student's basic biographical information
     * @return Address of the newly deployed Student contract
     */
    function createStudent(
        address university,
        address student,
        Student.StudentBasicInfo calldata info
    ) external returns (address) {
        Student newStudent = new Student(university, student, info);
        return address(newStudent);
    }
}
