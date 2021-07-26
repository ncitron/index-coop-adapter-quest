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
In this first quest, you will write an adapter that allows a Set to trade on Uniswap via the TradeModule. Tests will be provided to you only for this first quest. In order to complete this quest, your adapter will need to be able to encode the trade data to execute a Uniswap trade using Uniswap's `swapExactTokensForTokens` method. Being that this is the first quest, we will be providing most of the framework for this adapter. Please review the Resources at the bottom of this file and follow all the steps. Good Luck and have fun! 

### Steps
1. Fork this repository and create a new branch for this quest'
2. copy `.env.default` to a new `.env` file
3. Run `yarn` to install dependencies
4. Navigate to `contracts/protocol/integration/exchange/UniswapV2ExchangeAdapter.sol` to create your smart contract adapter.
5. Write the `getTradeCalldata` and `getSpender` methods for the adapter
    - getTradeCalldata will be used to interact with the Uniswap swapExactTokensForTokens function. 
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

## Quest 2: Writing SnapshotGovernanceAdapter
### Overview
In this quest, you will be writing a Governance adapter that allows a Set to delegate all of its voting power on Snapshot.org. You will be responsible for writing the entire smart contract and all associated tests.

`GovernanceModule` uses governance adapters to interact with on-chain governance such as Compound and Uniswap. Governance adapters usually encode calldata for proposing, voting, and delegating votes. To see the full list of functions that a governance adapter can use look at `contracts/interfaces/IGovernanceAdapter.sol`. Snapshot is an off chain voting solution, but does have two on-chain functions that allow users to delegate and undelegate their votes to different addresses. Because the Snapshot smart contract only allows delegating/undelegating, you will only need to implement the `getDelegateCalldata` and `getRevokeCalldata` functions.

Here is an overview of Snapshot's governance contract, called DelegateRegistry:
| function | parameters | description |
|----------|------------|-------------|
| setDelegate | bytes32 id, address delegate | Delegates all votes of msg.sender to delegate. If id is left as ZERO_BYTES, then delegate all votes |
| clearDelegate | bytes32 id | Revokes previous delegation from msg.sender. If id is left as ZERO_BYTES, then undelegate all votes |

Note: for this governance adapter we want to use ZERO_BYTES for the id. In solidity, this can be done as `bytes32(0)`. In our tests, we have a helper constant exported from @utils/constants called `ZERO_BYTES`

### Steps
1. Create a new branch off of master for this quest
2. Add the DelegateRegistry contract to `external/abi/snapshot/DelegateRegistry.json`
    - Go to https://etherscan.io/address/0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446#code
    - Fetch the contract ABI and creation code from that page
    - Take a look at how the other json file are formatted in `external/abi` to see how to fill it in
    - Run `yarn build` so that you can import the typechain contract and factory
3. Add deployment for `DelegateRegistry` in `utils/deploys/deployExternal.ts`
    - Follow the same process as quest 1 to do this
4. Add `contracts/protocol/integration/governance/SnapshotGovernanceAdapter.sol`
    - Constructor should take delegate registry address and save it
    - Add getDelegateCalldata and getRevokeCalldata functions. Remember to use `bytes32(0)` for the id when interacting with DelegateRegistry
    - Remember to follow the comment conventions used in other adapters
5. Add deployment for `SnapshotGovernanceAdapter` to `utils/deploys/deployAdapters.ts`
    - Again, follow same process as quest 1
6. Add test in `test/protocol/integration/governance/snapshotGovernanceAdapter.spec.ts`
    - Test that delegate registry state variable is being properly stored in the constructor
    - Test that getDelegateCalldata produces the correct result
    - Test that getRevokeCalldata produces the correct result
    - Look to the tests from quest 1 to get an understanding of how to do things
7. Run your tests using `npx hardhat test test/protocol/integration/governance/snapshotGovernanceAdapter.spec.ts`
8. If your tests pass, congratulations! You can open a PR at https://github.com/ncitron/index-coop-adapter-quest to get a quick code review from myself.
