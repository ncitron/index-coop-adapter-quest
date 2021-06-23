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
In this first quest, you will write an adapter that allows a Set to trade on Uniswap via the TradeModule. Tests will be provided to you only for this fist quest. In order to complete this quest, your adapter will need to be able to encode the trade data to execute a Uniswap trade using Uniswap's `swapExactTokensForTokens` method. Being that this is the first quest, we will be providing most of the framework for this adapter. Please review the Resources at the bottom of this file and follow all the steps. Good Luck and have fun! 

### Steps
1. Fork this repository and create a new branch for this quest'
2. copy `.env.default` to a new `.env` file
3. Run `yarn` to install dependencies
4. Navigate to `contracts/protocol/integration/exchange/UniswapV2ExchangeAdapter.sol` to create your smart contract adapter.
5. Write the `getTradeCalldata` and `getSpender` methods for the adapter
    - getTradeCalldata will use used to interact with the Uniswap swapExactTokensForTokens function. 
    (For more details on swapExactTokensForTokens check out the link to Uniswap’s docs found in README under the resource tab)
    - getSpender will be used to return the address of the Uniswap router contract. 
6. Export UniswapV2ExchangeAdapter with the other adapters at `utils/contracts/index.ts`. Note: you must run `yarn build` before doing this
7. Navigate to `utils/deploys/deployAdapters.ts`
    - Add `UniswapV2ExchangeAdapter` to the end of list in `import {,,,} from "../contracts"`, 
    - Add `import { UniswapV2ExchangeAdapter__factory } from "../../typechain/factories/UniswapV2ExchangeAdapter__factory"` to the factory list 
    - Finally add a `deployUniswapV2ExchangeAdapter(router: Address): Promise<UniswapV2ExchangeAdapter>` function to at the bottom of the file. 
8. Run tests using `npx hardhat test test/protocol/integration/exchange/uniswapV2ExchangeAdapter.spec.ts`
9. If the tests pass, congratulations! You can open a PR at https://github.com/ncitron/index-coop-adapter-quest to get a quick code review from myself.


### Resources
- https://hackmd.io/@r1OYOYxYSP-6k15CBaosBQ/S1APkTjcO for a overview of how to write an adapter
- https://uniswap.org/docs/v2/smart-contracts/router02/#swapexacttokensfortokens for information on the Uniswap function you need to encode
- `contracts/interfaces/IExchangeAdapter.sol` is the interface that all exchange adapters must adhere to
- `contracts/protocol/integration/exchange/SynthetixExchangeAdapter.sol` should provide a rough example of how to build an adapter
- Make sure to look at the test at `test/protocol/integration/exchange/uniswapV2ExchangeAdapter.spec.ts` so that you know what you are trying to accomplish

## Quest 2: Coming soon!
