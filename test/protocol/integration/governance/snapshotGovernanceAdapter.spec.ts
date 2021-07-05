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

  describe("#getRevokeCalldata", async () => {
    async function subject(): Promise<any> {
      return await snapshotGovernanceAdapter.getRevokeCalldata();
    }

    it("should return the correct revoke call data", async () => {
      const calldata = await subject();

      const expectedCalldata = delegateRegistry.interface.encodeFunctionData("clearDelegate", [
        ZERO_BYTES,
      ]);

      expect(JSON.stringify(calldata)).to.eq(
        JSON.stringify([delegateRegistry.address, ZERO, expectedCalldata]),
      );
    });
  });
});
