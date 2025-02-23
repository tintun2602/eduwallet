// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2;

import {AccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

// Custom errors for better clarity
error UnauthorizedReading();
error UnauthorizedWriting();
error NotExistingRecord();
error WrongRole();

/**
 * @title Student Smart Contract
 * @author Diego Da Giau
 * @notice Manages a student's academic records and university permissions
 * @dev Implements role-based access control for universities to manage student records
 */
contract Student is AccessControlEnumerable {
    using Strings for string;

    // Role definitions for access control
    bytes32 private constant READER_ROLE = keccak256("READER_ROLE");
    bytes32 private constant WRITER_ROLE = keccak256("WRITER_ROLE");

    /**
     * @dev Represents ECTS credits with integer and fractional parts
     * @param integer The whole number part of the ECTS credits
     * @param fraction The decimal part of the ECTS credits
     */
    struct Ects {
        uint8 integer;
        uint8 fraction;
    }

    /**
     * @dev Represents an academic result/course enrollment
     * @param code Course code
     * @param name Course name
     * @param university Address of the university that created the record
     * @param degreeCourse Name of the degree program
     * @param ects ECTS credits for the course
     * @param grade Final grade (empty if not evaluated)
     * @param date Date when the grade was assigned
     */
    struct Result {
        string code;
        string name;
        address university;
        string degreeCourse;
        Ects ects;
        string grade;
        uint date;
    }

    // Student's personal information
    string private name;
    string private surname;
    uint private birthDate;
    string private birthPlace;
    string private country;

    // Array of academic results
    Result[] private results;

    /**
     * @notice Initializes a new Student contract
     * @dev Sets up initial student data and grants roles
     * @param _university Address of the initial university with write access
     * @param _student Address of the student (admin role)
     * @param _name Student's first name
     * @param _surname Student's last name
     * @param _birthDate Student's birth date as Unix timestamp
     * @param _birthPlace Student's place of birth
     * @param _country Student's country of birth
     */
    constructor(
        address _university,
        address _student,
        string memory _name,
        string memory _surname,
        uint _birthDate,
        string memory _birthPlace,
        string memory _country
    ) {
        name = _name;
        surname = _surname;
        birthDate = _birthDate;
        birthPlace = _birthPlace;
        country = _country;
        _grantRole(DEFAULT_ADMIN_ROLE, _student);
        _grantRole(WRITER_ROLE, _university);
    }

    /**
     * @notice Retrieves student's personal information
     * @return name Student's first name
     * @return surname Student's last name
     * @return birthDate Student's birth date
     * @return birthPlace Student's place of birth
     * @return country Student's country of birth
     */
    function getStudent()
        external
        view
        returns (
            string memory,
            string memory,
            uint,
            string memory,
            string memory
        )
    {
        return (name, surname, birthDate, birthPlace, country);
    }

    /**
     * @notice Retrieves all academic results
     * @dev Caller must have READER_ROLE, WRITER_ROLE, or be the student
     * @return Array of Result structs containing academic records
     */
    function getResults() external view returns (Result[] memory) {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()) ||
                hasRole(READER_ROLE, _msgSender()) ||
                hasRole(WRITER_ROLE, _msgSender()),
            AccessControlUnauthorizedAccount(_msgSender(), READER_ROLE)
        );
        return results;
    }

    /**
     * @notice Enrolls student in a new course
     * @dev Only universities with WRITER_ROLE can call this
     * @param _code Course code
     * @param _name Course name
     * @param _degreeCourse Degree program name
     * @param _integer Whole number part of ECTS credits
     * @param _fraction Decimal part of ECTS credits
     */
    function enroll(
        string calldata _code,
        string calldata _name,
        string calldata _degreeCourse,
        uint8 _integer,
        uint8 _fraction
    ) external onlyRole(WRITER_ROLE) {
        Result memory r = Result(
            _code,
            _name,
            _msgSender(),
            _degreeCourse,
            Ects(_integer, _fraction),
            "",
            0
        );
        results.push(r);
    }

    /**
     * @notice Assigns a grade to an enrolled course
     * @dev Only the university that created the enrollment can grade it
     * @param _code Course code to evaluate
     * @param _grade Grade to assign
     * @param _date Date of evaluation
     */
    function evaluate(
        string calldata _code,
        string calldata _grade,
        uint _date
    ) external onlyRole(WRITER_ROLE) {
        for (uint i; i < results.length; ++i) {
            if (
                results[i].code.equal(_code) &&
                results[i].university == _msgSender()
            ) {
                results[i].grade = _grade;
                results[i].date = _date;
                return;
            }
        }
        revert NotExistingRecord();
    }

    /**
     * @notice Grants read or write permission to a university
     * @param _permissionType 0 for write, 1 for read access
     * @param _university Address of the university to grant permission to
     */
    function grantPermission(
        uint _permissionType,
        address _university
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_permissionType == 0 || _permissionType == 1, WrongRole());
        if (_permissionType == 0) {
            grantRole(WRITER_ROLE, _university);
        } else {
            grantRole(READER_ROLE, _university);
        }
    }

    /**
     * @notice Revokes all permissions from a university
     * @param _university Address of the university
     */
    function revokePermission(
        address _university
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasRole(WRITER_ROLE, _university)) {
            revokeRole(WRITER_ROLE, _university);
        } else {
            revokeRole(READER_ROLE, _university);
        }
    }

    /**
     * @notice Gets all universities with a specific permission type
     * @param _permissionType 0 for writers, 1 for readers
     * @return Array of university addresses with the specified permission
     */
    function getPermissions(
        uint _permissionType
    ) external view onlyRole(DEFAULT_ADMIN_ROLE) returns (address[] memory) {
        require(_permissionType == 0 || _permissionType == 1, WrongRole());
        if (_permissionType == 0) {
            return getRoleMembers(WRITER_ROLE);
        } else {
            return getRoleMembers(READER_ROLE);
        }
    }

    /**
     * @notice Checks if a university has write permission
     * @param uni Address of the university to check
     * @return bool True if the university has write permission
     */
    function hasRole(address uni) external view returns (bool) {
        return hasRole(WRITER_ROLE, uni);
    }
}
