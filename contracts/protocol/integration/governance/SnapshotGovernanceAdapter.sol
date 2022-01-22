/*
    Copyright 2020 Set Labs Inc.

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    SPDX-License-Identifier: Apache License, Version 2.0
*/

pragma solidity 0.6.10;
pragma experimental "ABIEncoderV2";


/**
 * @title SnapshotGovernanceAdapter
 * @author Set Protocol
 * Governance adapter for Snapshot governance that allows a Set to delegate all of its voting power
 */
contract SnapshotGovernanceAdapter {

    // Address of DelegateRegistry Contract
    address public immutable delegateRegistryAddress;

    /* ============ Constructor ============ */

    /**
     * Set state variables
     *
     * @param _delegateRegistryAddress Address of delegate registry
     */
    constructor(address _delegateRegistryAddress) public {
        delegateRegistryAddress = _delegateRegistryAddress;
    }

    /* ============ External Getter Functions ============ */

    /**
     * Generates the calldata to vote on a proposal. If byte data is empty, then vote using AAVE token, otherwise, vote using the asset passed
     * into the function
     *
     * @param _proposalId           ID of the proposal to vote on
     * @param _support              Boolean indicating whether to support proposal
     * @param _data                 Byte data containing the asset to vote with
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                Propose calldata
     */

    /**
     * Reverts as snapshot has no way to obtain vote call data w smart contract currently
     */
    function getVoteCalldata(uint256 _proposalId, bool _support, bytes memory _data) external view returns (address, uint256, bytes memory) {
        revert("No way to obtain vote call data from snapshot smart contract currently");
    }

    /**
     * Generates the calldata to delegate all votes to another ETH address. Equivalent to calling setDelegate from snapshot smart contract.
     *
     * @param _delegatee            Address of the delegatee
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                Propose calldata
     */
    function getDelegateCalldata(address _delegatee) external view returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(
            "setDelegate(bytes32,address)",
            bytes32(0),
            _delegatee);

        return (delegateRegistryAddress, 0, callData);
    }

    /**
     * Reverts as snapshot currently does not have a register mechanism in smart contract
     */
    function getRegisterCalldata(address /* _setToken */) external view returns (address, uint256, bytes memory) {
        revert("No register available in snapshot smart contract");
    }

    /**
     * Generates the calldata to revoke voting. This is equivalent to calling clearDelegate function from snapshot smart contract.
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                Propose calldata
     */
    function getRevokeCalldata() external view returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(
            "clearDelegate(bytes32)",
            bytes32(0));

        return (delegateRegistryAddress, 0, callData);
    }

    /**
     * Reverts as creating a proposal is not available in snapshot smart contract
     */
    function getProposeCalldata(bytes memory /* _proposalData */) external view returns (address, uint256, bytes memory) {
        revert("Creation of new proposal not available in snapshot governance");
    }
}
