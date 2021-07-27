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
* Allows a Set to delegate all of its voting power on Snapshot.org. 
 */

contract SnapshotGovernanceAdapter {


    /* ============ State Variables ============ */

    // delegate registry address
    address public delegateRegistry;

    /* ============ Constructor ============ */

    /**
     * Set state variables
     *
     * @param _delegateRegistry   delegate registry address
     * 
     */


    constructor (address _delegateRegistry) public {
    delegateRegistry = _delegateRegistry;
    }


    /* ============ External Getter Functions ============ */

    /**
     *  Get the call data from delegatee
     *
     * @param  _delegatee              Address of delegatee
     *
     * @return address                   Target contract address
     * @return uint256                   Eth - 0
     * @return bytes                     delegates calldata
     */

    function getDelegateCalldata(address _delegatee) external view returns (address, uint256, bytes memory){

        bytes memory callData = abi.encodeWithSignature("setDelegate(bytes32,address)", bytes32(0), _delegatee);

        return (delegateRegistry, 0, callData);
    }


    /**
     *  revokes delegation of delegatee
     *
     * @return address                   Target contract address
     * @return uint256                   Eth - 0
     * @return bytes                     delegates calldata
     */


    function getRevokeCalldata() external view returns (address, uint256, bytes memory)
    {
        bytes memory callData = abi.encodeWithSignature("clearDelegate(bytes32)", bytes32(0));

        return (delegateRegistry, 0, callData);

    }
}

