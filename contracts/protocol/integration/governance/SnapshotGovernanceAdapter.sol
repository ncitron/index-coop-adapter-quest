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
 * @author controtie
 *
 * Governance adapter to delegate/revoke Snapshot votes.
 */
contract SnapshotGovernanceAdapter {
    // Address of Snapshot DelegateRegistry contract.
    address public immutable delegateRegistry;

    /* ============ Constructor ============ */

    /**
     * Set state variables
     *
     * @param _delegateRegistry    Address of Snapshot DelegateRegistry contract
     */
    constructor(address _delegateRegistry) public {
	delegateRegistry = _delegateRegistry;
    }

    /* ============ External Getter Functions ============ */

    /**
     * Reverts as Snapshot does not support on-chain governance proposals
     */
    function getVoteCalldata(uint256, bool, bytes memory) external view returns (address, uint256, bytes memory) {
	      revert("Snapshot does not support on-chain voting");
    }

    /**
     * Delegate all Snapshot votes in a Set to a target address.
     *
     * @param _delegatee          Address to delegate snapshot votes to.
     *
     * @return address            DelegateRegistry contract address
     * @return uint256            Total quantity of ETH to send (0)
     * @return bytes              Calldata to execute delegation
     */
    function getDelegateCalldata(address _delegatee) external view returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(
          "setDelegate(bytes32,address)",
          bytes32(0),
          _delegatee
        );

        return (
          delegateRegistry,
          0,
          callData
        );
    }

    /**
     * Reverts as Snapshot currently does not have a register mechanism in governance
     */
    function getRegisterCalldata(address /* _setToken */) external view returns (address, uint256, bytes memory) {
        revert("No register available in Snapshot governance");
    }

    /**
     * Revokes all delegated Snapshot votes from a Set.
     *
     * @return address            DelegateRegistry contract address
     * @return uint256            Total quantity of ETH to send (0)
     * @return bytes              Calldata to revoke delegated votes
     */
    function getRevokeCalldata() external view returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(
          "clearDelegate(bytes32)",
          bytes32(0)
        );

        return (
          delegateRegistry,
          0,
          callData
        );
    }

    /**
     * Reverts as creating a proposal is only available to Snapshot genesis team
     */
    function getProposeCalldata(bytes memory /* _proposalData */) external view returns (address, uint256, bytes memory) {
        revert("Creation of new proposal only available to AAVE genesis team");
    }
}
