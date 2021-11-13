import "module-alias/register";
import { Address } from "@utils/types";
import { Account } from "@utils/test/types";
import { ZERO, ZERO_BYTES } from "@utils/constants";
import { SnapshotGovernanceAdapter } from "@utils/contracts";
import DeployHelper from "@utils/deploys";
import {
  addSnapshotBeforeRestoreAfterEach,
  getAccounts,
  getWaffleExpect,
  getRandomAddress
} from "@utils/test/index";

import { DelegateRegistry } from "@typechain/DelegateRegistry";


const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
  let owner: Account;
  let deployer: DeployHelper;
  let snapshotGovernanceAdapter: SnapshotGovernanceAdapter;
  let delegateRegistry: DelegateRegistry;

  before(async () => {
    [
      owner,
    ] = await getAccounts();

    deployer = new DeployHelper(owner.wallet);

    delegateRegistry = await deployer.external.deployDelegateRegistry();
    snapshotGovernanceAdapter = await deployer.adapters.deploySnapshotGovernanceAdapter(
      delegateRegistry.address,
    );
  });

  addSnapshotBeforeRestoreAfterEach();

  describe("#constructor", async () => {
    let subjectDelegateRegistryRouter: Address;

    before(async () => {
      subjectDelegateRegistryRouter = delegateRegistry.address;
    });

    async function subject(): Promise<any> {
      return deployer.adapters.deploySnapshotGovernanceAdapter(subjectDelegateRegistryRouter);
    }

    it("should have the correct router address", async () => {
      const deployedSnapshotGovernanceAdapter = await subject();

      const actualRouterAddress = await deployedSnapshotGovernanceAdapter.router();
      expect(actualRouterAddress).to.eq(subjectDelegateRegistryRouter);
    });
  });

  describe("#getDelegateCalldata", async () => {
    let subjectDelegate: Address;

    before(async () => {
      subjectDelegate = await getRandomAddress();
    });

    async function subject(): Promise<any> {
      return snapshotGovernanceAdapter.getDelegateCalldata(subjectDelegate);
    }

    it("should return correct data for delegating", async () => {
      const [targetAddress, ethValue, callData] = await subject();
      const expectedCallData = delegateRegistry.interface.encodeFunctionData("setDelegate", [ZERO_BYTES, subjectDelegate]);

      expect(targetAddress).to.eq(delegateRegistry.address);
      expect(ethValue).to.eq(ZERO);
      expect(callData).to.eq(expectedCallData);
    });
  });

  describe("#getRevokeCalldata", async () => {
    async function subject(): Promise<any> {
      return snapshotGovernanceAdapter.getRevokeCalldata();
    }

    it("should return correct data for revoking", async () => {
      const [targetAddress, ethValue, callData] = await subject();
      const expectedCallData = delegateRegistry.interface.encodeFunctionData("clearDelegate", [ZERO_BYTES]);

      expect(targetAddress).to.eq(delegateRegistry.address);
      expect(ethValue).to.eq(ZERO);
      expect(callData).to.eq(expectedCallData);
    });
  });
});
