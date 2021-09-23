import "module-alias/register";
import { Account } from "@utils/test/types";
import DeployHelper from "@utils/deploys";
import {
  addSnapshotBeforeRestoreAfterEach,
  getAccounts,
  getWaffleExpect,
} from "@utils/test/index";


const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
  let owner: Account;
  let deployer: DeployHelper;

  before(async () => {
    [
      owner,
    ] = await getAccounts();

    deployer = new DeployHelper(owner.wallet);
  });

  addSnapshotBeforeRestoreAfterEach();

  describe("#constructor", async () => {

    async function subject(): Promise<any> {
      return deployer.adapters.deploySnapshotGovernanceAdapter(
        owner.address,
      );
    }

    it("should have the correct delegatee", async () => {
      const deployedSnapashotGovernanceAdapter = await subject();

      const actualDelegatee = await deployedSnapashotGovernanceAdapter.delegatee();
      expect(actualDelegatee).to.eq(owner.address);
    });

  });

});
