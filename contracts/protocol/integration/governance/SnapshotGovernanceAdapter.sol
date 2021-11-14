/*
    Copyright 2021 Set Labs Inc.

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
 * @author teddy
 *
 * Governance adapter for Snapshot governance that returns data for delegating
 */
contract SnapshotGovernanceAdapter {

    /* ============ Constants ============ */

    // Signature of delegate function
    string public constant DELEGATE_SIGNATURE = "setDelegate(bytes32,address)";
    
    // Signature of revoke function
    string public constant REVOKE_SIGNATURE = "clearDelegate(bytes32)";

    /* ============ State Variables ============ */

    // Address of Delegate Registry
    address public immutable delegateRegistry;

    /* ============ Constructor ============ */

    /**
     * Set state variables
     *
     * @param _delegateRegistry    Address of Delegate Registry
     */
    constructor(address _delegateRegistry) public {
        delegateRegistry = _delegateRegistry;
    }

    /* ============ External Getter Functions ============ */

    /**
     * Reverts as Snapshot currently does not have a vote mechanism in governance
     */
    function getVoteCalldata(uint256 /* _proposalId */, bool /*_support */, bytes memory /* _data */) external view returns (address, uint256, bytes memory) {
        revert("No vote available in Snapshot governance");
    }

    /**
     * Generates the calldata to delegate all votes of msg.sender to delegatee
     *
     * @param _delegatee            Address of the delegatee
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                Propose calldata
     */
    function getDelegateCalldata(address _delegatee) external view returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(DELEGATE_SIGNATURE, bytes32(0), _delegatee);

        return (delegateRegistry, 0, callData);
    }

    /**
     * Reverts as Snapshot currently does not have a register mechanism in governance
     */
    function getRegisterCalldata(address /* _setToken */) external view returns (address, uint256, bytes memory) {
        revert("No register available in Snapshot governance");
    }

    /**
     * Generates the calldata to revokes all delegation from msg.sender
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                Propose calldata
     */
    function getRevokeCalldata() external view returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(REVOKE_SIGNATURE, bytes32(0));

        return (delegateRegistry, 0, callData);
    }

    /**
     * Reverts as Snapshot currently does not have a propose mechanism in governance
     */
    function getProposeCalldata(bytes memory /* _proposalData */) external view returns (address, uint256, bytes memory) {
        revert("No propose available in Snapshot governance");
    }
}
