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


contract UniswapV2ExchangeAdapter {

    /* ============= State Variable ============= */
    
    /** 
    * Address of Uniswap Exchange V2 Router Contract
    **/
    address public immutable router;

    /* ============= Constructor ============= */

    /** 
    * Set state variable
    * @param _router Address of Uniswap Exchange V2 Rounter Contract
    **/
    constructor(address _router) public {
        router = _router;
    }

    /* ============ External Getter Functions ============ */
  
    /**
     * Calculate UniSwap trade encoded calldata. To be invoked on the SetToken.
     *
     * @param  _sourceToken              Address of source token to be sold
     * @param  _destinationToken         Address of destination token to buy
     * @param  _destinationAddress       Address to receive traded tokens
     * @param  _sourceQuantity           Amount of source token to sell
     * @param _minDestinationQuantity    Minimum amount destinaton token to be recieved for the transaction not to revert
     * @param _data                      Call data
     *
     * @return address                   Target address
     * @return uint256                   Call value
     * @return bytes                     Trade calldata
     */
    function getTradeCalldata(
        address _sourceToken, 
        address _destinationToken, 
        address _destinationAddress, 
        uint256 _sourceQuantity, 
        uint256 _minDestinationQuantity, 
        bytes calldata _data
    ) 
        external 
        view 
        returns (address, uint256, bytes memory) 
    {
        require(
            _sourceToken != _destinationToken,
            "Source token cannot be same as destination token"
        );

        /* 
        * We have created a path for the address' of _sourceToken and _destinationToken 
        * to be used in the function call to the uniswap contract.
        */
        address[] memory path;

        if (_data.length == 0) {
            path = new address[](2);
            path[0] = _sourceToken;
            path[1] = _destinationToken;
        } else {
            path = abi.decode(_data, (address[]));
        }

        /* 
        * Create a bytes memory variable called 'callData' to store the abi.encodedWithSignature data from Uniswap function swapExactTokensForTokens.  
        * Please see README.md resources for more details on the Uniswap function swapExactTokensForTokens.
        */
        bytes memory tradeCalldata = abi.encodeWithSignature(
            "swapExactTokensForTokens(uint256,uint256,address[],address,uint256)",
            _sourceQuantity,
            _minDestinationQuantity,
            path,
            _destinationAddress,
            block.timestamp // solhint-disable-line not-rely-on-time 
        );

        return (router, 0, tradeCalldata);
    }

    /**
    *
    * Returns the UniSwap contract address.
    * @return address
    *
    */
    function getSpender() 
        external 
        view 
        returns(address) 
    {
            return router;
    }
}
