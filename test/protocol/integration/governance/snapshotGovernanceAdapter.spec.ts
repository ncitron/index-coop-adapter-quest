import "module-alias/register";

import { Address } from "@utils/types";
import { Account } from "@utils/test/types";
import { DelegateRegistry, SnapshotGovernanceAdapter } from "@utils/contracts";
import DeployHelper from "@utils/deploys";
import { addSnapshotBeforeRestoreAfterEach, getAccounts, getWaffleExpect } from "@utils/test/index";
import { ZERO_BYTES, ZERO } from "@utils/constants";

const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
  let owner: Account;
  let delegatee: Account;
  let deployer: DeployHelper;
  let delegateRegistry: DelegateRegistry;

  let snapshotGovernanceAdapter: SnapshotGovernanceAdapter;

  before(async () => {
    [owner, delegatee] = await getAccounts();
    deployer = new DeployHelper(owner.wallet);

    delegateRegistry = await deployer.external.deployDelegateRegistry();
    snapshotGovernanceAdapter = await deployer.adapters.deploySnapshotGovernanceAdapter(
      delegateRegistry.address,
    );
  });

  addSnapshotBeforeRestoreAfterEach();

  describe("#constructor", async () => {
    let subjectDelegateRegistry: Address;

    beforeEach(async () => {
      subjectDelegateRegistry = delegateRegistry.address;
    });

    async function subject(): Promise<any> {
      return await deployer.adapters.deploySnapshotGovernanceAdapter(subjectDelegateRegistry);
    }

    it("should have the correct delegateRegistry address", async () => {
      const deployedSnapshotAdapter = await subject();

      const actualRouterAddress = await deployedSnapshotAdapter.delegateRegistry();
      expect(actualRouterAddress).to.eq(delegateRegistry.address);
    });
  });

  describe("#getDelegateCalldata", async () => {
    async function subject(): Promise<any> {
      return await snapshotGovernanceAdapter.getDelegateCalldata(delegatee.address);
    }

    it("should return the correct delegate call data", async () => {
      const calldata = await subject();

      const expectedCalldata = delegateRegistry.interface.encodeFunctionData("setDelegate", [
        ZERO_BYTES,
        delegatee.address,
      ]);

      expect(JSON.stringify(calldata)).to.eq(
        JSON.stringify([delegateRegistry.address, ZERO, expectedCalldata]),
      );
    });
  });

  //   describe("getTradeCalldata", async () => {
  //     let sourceAddress: Address;
  //     let destinationAddress: Address;
  //     let sourceQuantity: BigNumber;
  //     let destinationQuantity: BigNumber;

  //     let subjectMockSetToken: Address;
  //     let subjectSourceToken: Address;
  //     let subjectDestinationToken: Address;
  //     let subjectSourceQuantity: BigNumber;
  //     let subjectMinDestinationQuantity: BigNumber;
  //     let subjectData: Bytes;

  //     beforeEach(async () => {
  //       sourceAddress = setup.wbtc.address; // WBTC Address
  //       sourceQuantity = BigNumber.from(100000000); // Trade 1 WBTC
  //       destinationAddress = setup.dai.address; // DAI Address
  //       destinationQuantity = ether(30000); // Receive at least 30k DAI

  //       subjectSourceToken = sourceAddress;
  //       subjectDestinationToken = destinationAddress;
  //       subjectMockSetToken = mockSetToken.address;
  //       subjectSourceQuantity = sourceQuantity;
  //       subjectMinDestinationQuantity = destinationQuantity;
  //       subjectData = EMPTY_BYTES;
  //     });

  //     async function subject(): Promise<any> {
  //       return await uniswapV2ExchangeAdapter.getTradeCalldata(
  //         subjectSourceToken,
  //         subjectDestinationToken,
  //         subjectMockSetToken,
  //         subjectSourceQuantity,
  //         subjectMinDestinationQuantity,
  //         subjectData,
  //       );
  //     }

  //     it("should return the correct trade calldata", async () => {
  //       const calldata = await subject();
  //       const callTimestamp = await getLastBlockTimestamp();
  //       const expectedCallData = uniswapSetup.router.interface.encodeFunctionData(
  //         "swapExactTokensForTokens",
  //         [
  //           sourceQuantity,
  //           destinationQuantity,
  //           [sourceAddress, destinationAddress],
  //           subjectMockSetToken,
  //           callTimestamp,
  //         ],
  //       );
  //       expect(JSON.stringify(calldata)).to.eq(
  //         JSON.stringify([uniswapSetup.router.address, ZERO, expectedCallData]),
  //       );
  //     });

  //     describe("when passed in custom path to trade data", async () => {
  //       beforeEach(async () => {
  //         const path = [sourceAddress, setup.weth.address, destinationAddress];
  //         subjectData = defaultAbiCoder.encode(["address[]"], [path]);
  //       });

  //       it("should return the correct trade calldata", async () => {
  //         const calldata = await subject();
  //         const callTimestamp = await getLastBlockTimestamp();
  //         const expectedCallData = uniswapSetup.router.interface.encodeFunctionData(
  //           "swapExactTokensForTokens",
  //           [
  //             sourceQuantity,
  //             destinationQuantity,
  //             [sourceAddress, setup.weth.address, destinationAddress],
  //             subjectMockSetToken,
  //             callTimestamp,
  //           ],
  //         );
  //         expect(JSON.stringify(calldata)).to.eq(
  //           JSON.stringify([uniswapSetup.router.address, ZERO, expectedCallData]),
  //         );
  //       });
  //     });
  //   });
});
