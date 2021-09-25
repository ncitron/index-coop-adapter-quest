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

pragma solidity ^0.6.10;
pragma experimental "ABIEncoderV2";


contract SnapshotGovernanceAdapter {

    address public immutable router;



    /* ============= Constructor ============= */
    /** 
    * Set state variable
    * @param _router Address of DelegateRegistry Contract
    **/

    constructor(address _router) public {
        router = _router;
    }
    

    /* ============ External Getter Functions ============ */
  
    /**
    * Calculate setDelegate encoded calldata. To be invoked on the SetToken.
    *
    * @param  _delegate                 Address to delegate votes
    *
    * @return address                   Target address
    * @return uint256                   Call value
    * @return bytes                     delegate calldata
    */


    function getDelegateCalldata(address _delegate) external view returns (address, uint256, bytes memory) {

        bytes memory callData = abi.encodeWithSignature(
            "setDelegate(bytes32,address)",
            bytes32(0),
            _delegate
        );

        return (router, 0, callData);

    }


    /**
    * Calculate clearDelegate encoded calldata. To be invoked on the SetToken.
    *
    * @return address                   Target address
    * @return uint256                   Call value
    * @return bytes                     revoke calldata
    */

    function getRevokeCalldata() external view returns (address, uint256, bytes memory) {

        bytes memory callData = abi.encodeWithSignature(
            "clearDelegate(bytes32)",
            bytes32(0)
        );

        return (router, 0, callData);

    }

}

