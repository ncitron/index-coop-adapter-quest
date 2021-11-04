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

import { IGovernanceAdapter } from "../../../interfaces/IGovernanceAdapter.sol";


contract SnapshotGovernanceAdapter is IGovernanceAdapter {

    /* ============= State Variable ============= */

    /**
    * Address of the DelegateRegistry
    **/
    address public immutable delegateRegistry;

    /* ============= Constructor ============= */

    /**
    * Set state variable
    * @param _delegateRegistry Address of the DelegateRegistry
    **/
    constructor(address _delegateRegistry) public {
        delegateRegistry = _delegateRegistry;
    }

    /* ============ External Getter Functions ============ */

    /**
     * Sets delegate for all Snapshot votes.
     *
     * @param _delegatee Address to delegate Snapshot votes to.
     *
     * @return address Address of the DelegateRegistry
     * @return uint256 Total quantity of ETH (Set to 0)
     * @return bytes Call data
     */
    function getDelegateCalldata(address _delegatee) external view override returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(
            "setDelegate(bytes32,address)",
            bytes32(0),
            _delegatee
        );

        return (delegateRegistry, 0, callData);
    }

    /**
     * Revokes all Snapshot votes for delegate.
     *
     * @return address Address of the DelegateRegistry
     * @return uint256 Total quantity of ETH (Set to 0)
     * @return bytes Call data
     */
    function getRevokeCalldata() external view override returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(
            "clearDelegate(bytes32)",
            bytes32(0)
        );

        return (delegateRegistry, 0, callData);
    }

    /**
     * Reverts as n/a for Snapshot.
     */
    function getVoteCalldata(uint256, bool, bytes memory) external view override returns (address, uint256, bytes memory) {
        revert("Not suppored by Snapshot");
    }

    /**
     * Reverts as n/a for Snapshot.
     */
    function getRegisterCalldata(address /* _setToken */) external view override returns (address, uint256, bytes memory) {
        revert("Not suppored by Snapshot");
    }

    /**
     * Reverts as n/a for Snapshot.
     */
    function getProposeCalldata(bytes memory /* _proposalData */) external view override returns (address, uint256, bytes memory) {
        revert("Not suppored by Snapshot");
    }
}
