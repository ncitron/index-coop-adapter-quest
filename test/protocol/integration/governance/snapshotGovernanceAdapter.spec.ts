import "module-alias/register";

import { Address } from "@utils/types";
import { Account } from "@utils/test/types";
import { DelegateRegistry, SnapshotGovernanceAdapter } from "@utils/contracts";
import DeployHelper from "@utils/deploys";
import { ZERO, ZERO_BYTES } from "@utils/constants";
import { addSnapshotBeforeRestoreAfterEach, getAccounts, getWaffleExpect } from "@utils/test/index";

const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
  let delegatee: Account;
  let owner: Account;
  let delegateRegistry: DelegateRegistry;
  let deployer: DeployHelper;
  let snapshotGovernanceAdapter: SnapshotGovernanceAdapter;

  before(async () => {
    [delegatee, owner] = await getAccounts();
    deployer = new DeployHelper(owner.wallet);
  });

  beforeEach(async () => {
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

    it("should set the correct delegate registry address", async () => {
      const deployedAdapter = await subject();
      const actualDelegateAddress = await deployedAdapter.delegateRegistry();
      expect(actualDelegateAddress).to.eq(delegateRegistry.address);
    });
  });

  describe("#getDelegateCalldata", async () => {
    async function subject(): Promise<any> {
      return await snapshotGovernanceAdapter.getDelegateCalldata(delegatee.address);
    }

    it("should return the correct call data", async () => {
      const callData = await subject();
      const expectedCallData = delegateRegistry.interface.encodeFunctionData("setDelegate", [
        ZERO_BYTES,
        delegatee.address,
      ]);
      expect(JSON.stringify(callData)).to.eq(
        JSON.stringify([delegateRegistry.address, ZERO, expectedCallData]),
      );
    });
  });

  describe("#getRevokeCalldata", async () => {
    async function subject(): Promise<any> {
      return await snapshotGovernanceAdapter.getRevokeCalldata();
    }

    it("should return the correct call data", async () => {
      const callData = await subject();
      const expectedCallData = delegateRegistry.interface.encodeFunctionData("clearDelegate", [
        ZERO_BYTES,
      ]);
      expect(JSON.stringify(callData)).to.eq(
        JSON.stringify([delegateRegistry.address, ZERO, expectedCallData]),
      );
    });
  });
});
