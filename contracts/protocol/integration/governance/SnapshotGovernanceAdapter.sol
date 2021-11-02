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
 * @author Omnifient
 *
 * Governance adapter for Snapshot.
 */ 
contract SnapshotGovernanceAdapter {

    /* ============ State Variables ============ */

    // Address of Snapshot's governance contract
    address public immutable delegateRegistry;

    /* ============ Constructor ============ */

    /**
     * Set state variable
     * 
     * @param _delegateRegistry     Address of governance contract
     */
    constructor(address _delegateRegistry) public {
        delegateRegistry = _delegateRegistry;
    }

    /* ============ External Getter Functions ============ */

    /**
     * Generates the calldata to delegate votes to another ETH address. 
     *
     * @param _delegatee            Address of the delegatee
     *
     * @return _target        Target contract address
     * @return _value         Total quantity of ETH (Set to 0)
     * @return _calldata      Propose calldata
     */
    function getDelegateCalldata(address _delegatee) external view returns (address _target, uint256 _value, bytes memory _calldata) {
        bytes memory callData = abi.encodeWithSignature(
            "setDelegate(bytes32,address)",
            bytes32(0),
            _delegatee
        );

        return (delegateRegistry, 0, callData);
    }

   /**
     * Generates the calldata to revoke voting.
     *
     * @return _target      Target contract address
     * @return _value       Total quantity of ETH (Set to 0)
     * @return _calldata    Propose calldata
    */
    function getRevokeCalldata() external view returns (address _target, uint256 _value, bytes memory _calldata) {
        bytes memory callData = abi.encodeWithSignature(
            "clearDelegate(bytes32)", 
            bytes32(0)
        );

        return (delegateRegistry, 0, callData);
    }
}