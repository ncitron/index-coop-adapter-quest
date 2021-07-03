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

    /*
    * Write a state varable to store the address of the Uniswap Exchange V2 Router Contract
    */
   
   
    address public uniswapV2RouterAddress;
                    // YOUR CODE HERE



    /* ============= Constructor ============= */
    /** 
    * Set state variable
    * @param _router Address of Uniswap Exchange V2 Rounter Contract
    **/

    /*
    * Write a the constructor that sets the router address
    */


    constructor(address _router) {
        uniswapV2RouterAddress = _router;
    }
    


    /* ============ External Getter Functions ============ */
  
      /**
     * Calculate UniSwap trade encoded calldata. To be invoked on the SetToken.
     *
     * @param  _sourceToken              Address of source token to be sold
     * @param  _destinationToken         Address of destination token to buy
     * @param  _destinationAddress       Address to receive traded tokens
     * @param  _sourceQuantity           Amount of source token to sell
     * @param _minDestinationQuantity    Minimum amount destinaton token to be recieved for the transacction not to revert
     * @param _data                      Call data
     *
     * @return address                   Target address
     * @return uint256                   Call value
     * @return bytes                     Trade calldata
     */


     /* 
     * Write getTradeCalldata function with the parameters / return values listed above. 
     * The function will return 3 values: address of the uniswap router, 0 for Call value, trade calldata
     */

    function getTradeCalldata(/*YOUR CODE HERE*/) external view returns (/*YOUR CODE HERE*/) {


    /* 
    * We have created a path for the address' of _sourceToken and _destinationToken 
    * to be used in the function call to the uniswap contract.
    */

         address[] memory path;

        if (_data.length == 0){
            path = new address[](2);
            path[0] = _sourceToken;
            path[1] = _destinationToken;
        }else {
            path = abi.decode(_data, (address[]));
        }
        

    /* 
    * Create a bytes memory variable called 'callData' to store the abi.encodedWithSignature data from Uniswap function swapExactTokensForTokens.  
    * Please see README.md resources for more details on the Uniswap function swapExactTokensForTokens.
    */   

                    // YOUR CODE HERE


          return (/*YOUR CODE HERE*/);

     }



/*
* Write the getSpender() function that will return the address of our set Uniswap router. 
* make sure the function is external view
*/

/** 
*
* Returns the UniSwap contract address.
* @return address
*
*/

function getSpender() external view {
    return uniswapV2RouterAddress;
}

}

