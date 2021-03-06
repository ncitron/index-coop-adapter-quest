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
pragma experimental ABIEncoderV2;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Minimal 0x Exchange Proxy contract interface.
contract ZeroExMock {

    struct Transformation {
        uint32 deploymentNonce;
        bytes data;
    }

    struct BatchFillData {
        address inputToken;
        address outputToken;
        uint256 sellAmount;
        WrappedBatchCall[] calls;
    }

    struct WrappedBatchCall {
        bytes4 selector;
        uint256 sellAmount;
        bytes data;
    }

    struct MultiHopFillData {
        address[] tokens;
        uint256 sellAmount;
        WrappedMultiHopCall[] calls;
    }

    struct WrappedMultiHopCall {
        bytes4 selector;
        bytes data;
    }

    address public mockReceiveToken;
    address public mockSendToken;
    uint256 public mockReceiveAmount;
    uint256 public mockSendAmount;
    // Address of SetToken which will send/receive token
    address public setTokenAddress;

    constructor(
        address _mockSendToken,
        address _mockReceiveToken,
        uint256 _mockSendAmount,
        uint256 _mockReceiveAmount
    ) public {
        mockSendToken = _mockSendToken;
        mockReceiveToken = _mockReceiveToken;
        mockSendAmount = _mockSendAmount;
        mockReceiveAmount = _mockReceiveAmount;
    }

    // Initialize SetToken address which will send/receive tokens for the trade
    function addSetTokenAddress(address _setTokenAddress) external {
        setTokenAddress = _setTokenAddress;
    }

    function transformERC20(
        address /* inputToken */,
        address /* outputToken */,
        uint256 /* inputTokenAmount */,
        uint256 /* minOutputTokenAmount */,
        Transformation[] calldata /* transformations */
    )
        external
        payable
        returns (uint256)
    {
        _transferTokens();
    }

    function sellToUniswap(
        address[] calldata /* tokens */,
        uint256 /* sellAmount */,
        uint256 /* minBuyAmount */,
        bool /* isSushi */
    )
        external
        payable
        returns (uint256)
    {
        _transferTokens();
    }

    function sellToLiquidityProvider(
        address /* inputToken */,
        address /* outputToken */,
        address payable /* provider */,
        address /* recipient */,
        uint256 /* sellAmount */,
        uint256 /* minBuyAmount */,
        bytes calldata /* auxiliaryData */
    )
        external
        payable
        returns (uint256)
    {
        _transferTokens();
    }

    function batchFill(
        BatchFillData memory /* fillData */,
        uint256 /* minBuyAmount */
    )
        external
        payable
        returns (uint256)
    {
        _transferTokens();
    }

    function multiHopFill(
        MultiHopFillData memory /* fillData */,
        uint256 /* minBuyAmount */
    )
        external
        payable
        returns (uint256)
    {
        _transferTokens();
    }

    function sellEthForTokenToUniswapV3(
        bytes memory /* encodedPath */,
        uint256 /* minBuyAmount */,
        address /* recipient */
    )
        external
        payable
        returns (uint256)
    {
        _transferTokens();
    }

    function sellTokenForEthToUniswapV3(
        bytes memory /* encodedPath */,
        uint256 /* sellAmount */,
        uint256 /* minBuyAmount */,
        address payable /* recipient */
    )
        external
        returns (uint256)
    {
        _transferTokens();
    }

    function sellTokenForTokenToUniswapV3(
        bytes memory /* encodedPath */,
        uint256 /* sellAmount */,
        uint256 /* minBuyAmount */,
        address /* recipient */
    )
        external
        returns (uint256)
    {
        _transferTokens();
    }

    function _transferTokens()
        private
    {
        require(ERC20(mockSendToken).transferFrom(setTokenAddress, address(this), mockSendAmount), "ERC20 TransferFrom failed");
        require(ERC20(mockReceiveToken).transfer(setTokenAddress, mockReceiveAmount), "ERC20 transfer failed");
    }
}
