# Index Coop Adapter Quest

## Getting started
To install the dependencies run:  
`yarn`

To compile your contracts and generate TypeChain bindings run:  
`yarn build`

To test your contract run:  
`npx hardhat test path/to/test/file`

## Quest 1: Write a Uniswap exchange adapter
### Overview
In this first quest, you will write an adapter that allows a Set to trade on Uniswap via the TradeModule. Tests will be provided to you only for this fist quest. In order to complete this quest, your adapter will need to be able to encode the trade data to execute a Uniswap trade using Uniswap's `swapExactTokensForTokens` method.

### Steps
1. Fork this repository and create a new branch for this quest
2. copy `.env.default` to a new `.env` file
3. Create a file at `contracts/protocol/integration/exchange/UniswapV2ExchangeAdapter.sol` for your adapter
4. Write the `getTradeCalldata` and `getSpender` methods for the adapter
5. Export UniswapV2ExchangeAdapter with the other adapters at `utils/contracts/index.ts`. Note: you must run `yarn build` before doing this
6. Add a `deployUniswapV2ExchangeAdapter(router: Address): Promise<UniswapV2ExchangeAdapter>` function to `utils/deploys/deployAdapters.ts`
7. Run tests using `npx hardhat test test/protocol/integration/exchange/uniswapV2ExchangeAdapter.spec.ts`
8. If the tests pass, congratulations! You can open a PR at https://github.com/ncitron/indexcoop-adapter-quest to get a quick code review from myself.

### Resources
- `contracts/interfaces/IExchangeAdapter.sol` is the interface that all exchange adapters must adhere to
- `contracts/protocol/integration/exchange/SynthetixExchangeAdapter.sol` should provide a rough example of how to build an adapter
- https://hackmd.io/@r1OYOYxYSP-6k15CBaosBQ/S1APkTjcO for a overview of how to write an adapter
- https://uniswap.org/docs/v2/smart-contracts/router02/#swapexacttokensfortokens for information on the Uniswap function you need to encode
- Make sure to look at the test at `test/protocol/integration/exchange/uniswapV2ExchangeAdapter.spec.ts` so that you know what you are trying to accomplish

## Quest 2: Coming soon!