// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2;

import {AccessControlEnumerable} from "@openzeppelin/contracts/access/extensions/AccessControlEnumerable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

error UnauthorizedReading();
error UnauthorizedWriting();
error NotExistingRecord();
error WrongRole();

/**
 * @title Student
 * @author Diego Da Giau
 * @notice Represents a single student in the system
 */
contract Student is AccessControlEnumerable {
    using Strings for string;

    bytes32 private constant READER_ROLE = keccak256("READER_ROLE");
    bytes32 private constant WRITER_ROLE = keccak256("WRITER_ROLE");

    struct Ects {
        uint8 integer;
        uint8 fraction;
    }

    struct Result {
        string code;
        string name;
        address university;
        string degreeCourse;
        Ects ects;
        string grade;
        uint date;
    }

    string private name;
    string private surname;
    uint private birthDate;
    string private birthPlace;
    string private country;

    Result[] private results;

    constructor(address _university, address _student, string memory _name, string memory _surname, uint _birthDate, string memory _birthPlace, string memory _country) {
        name = _name;
        surname = _surname;
        birthDate = _birthDate;
        birthPlace = _birthPlace;
        country = _country;
        _grantRole(DEFAULT_ADMIN_ROLE, _student);
        _grantRole(WRITER_ROLE, _university);
    }

    function getStudent() external view returns (string memory, string memory, uint, string memory, string memory) {
        return (name, surname, birthDate, birthPlace, country);
    }

    function getResults() external view returns (Result[] memory) {
        require(hasRole(READER_ROLE, _msgSender()) || hasRole(WRITER_ROLE, _msgSender()), AccessControlUnauthorizedAccount(_msgSender(), READER_ROLE));
        return results;
    }

    function enroll(string calldata _code, string calldata _name, string calldata _degreeCourse, uint8 _integer, uint8 _fraction) external onlyRole(WRITER_ROLE) {
        Result memory r = Result(_code, _name, _msgSender(), _degreeCourse, Ects(_integer, _fraction), "", 0);
        results.push(r);
    }

    function evaluate(string calldata _code, string calldata _grade, uint _date) external onlyRole(WRITER_ROLE) {
        for (uint i; i < results.length; ++i) {
            if (results[i].code.equal(_code) && results[i].university == _msgSender()) {
                results[i].grade = _grade;
                results[i].date = _date;
            }
        }
        revert NotExistingRecord();
    }

    function grantPermission(uint _permissionType, address _university) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_permissionType == 0 || _permissionType == 1, WrongRole());
        if (_permissionType == 0) {
            grantRole(WRITER_ROLE, _university);
        } else {
            grantRole(READER_ROLE, _university);
        }
    }

    function revokePermission(address _university) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (hasRole(WRITER_ROLE, _university)) {
            revokeRole(WRITER_ROLE, _university);
        } else {
            revokeRole(READER_ROLE, _university);
        }
    }

    function getPermissions(uint _permissionType) external view onlyRole(DEFAULT_ADMIN_ROLE) returns (address[] memory) {
        require(_permissionType == 0 || _permissionType == 1, WrongRole());
        if (_permissionType == 0) {
            return getRoleMembers(WRITER_ROLE);
        } else {
            return getRoleMembers(READER_ROLE);
        }
    }

    function hasRole(address uni) external view returns (bool) {
        return hasRole(WRITER_ROLE, uni);
    }
}
