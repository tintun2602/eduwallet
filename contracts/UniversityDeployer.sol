// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2;

import './University.sol';

/**
 * @title University Deployer Smart Contract
 * @author Diego Da Giau
 * @notice Provides functionality to deploy new University contracts
 * @dev Simple factory contract to create and deploy new University instances
 */
contract UniversityDeployer {
    /**
     * @notice Creates a new University contract with the provided details
     * @dev Deploys a new University instance and returns its address
     * @param name Full name of the university
     * @param country Country where the university is located
     * @param shortName Abbreviated name or acronym of the university
     * @return address The deployed University contract address
     */
    function createUniversity(string calldata name, string calldata country, string calldata shortName) 
        external returns (address) {
        University newUniversity = new University(name, country, shortName);
        return address(newUniversity);
    }
}
