import "module-alias/register";
import { BigNumber } from "@ethersproject/bignumber";
import { Address, Bytes } from "@utils/types";
import { Account } from "@utils/test/types";
import { EMPTY_BYTES, ZERO, ZERO_BYTES } from "@utils/constants";
import { SnapshotGovernanceAdapter, DelegateRegistry } from "@utils/contracts";
import DeployHelper from "@utils/deploys";
import {
  addSnapshotBeforeRestoreAfterEach,
  getAccounts,
  getWaffleExpect,
  getRandomAddress
} from "@utils/test/index";


const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
  let owner: Account;
  let deployer: DeployHelper;
  let snapshotGovernanceAdapter: SnapshotGovernanceAdapter;
  let delegateRegistry: DelegateRegistry;
  let mockSetToken: Account;

  before(async () => {
    [
      owner,
      mockSetToken,
    ] = await getAccounts();

    deployer = new DeployHelper(owner.wallet);
    delegateRegistry = await deployer.external.deployDelegateRegistry();
    snapshotGovernanceAdapter = await deployer.adapters.deploySnapshotGovernanceAdapter(
      delegateRegistry.address,
    );
  });

  addSnapshotBeforeRestoreAfterEach();

  describe("#constructor", async () => {
    async function subject(): Promise<any> {
      return deployer.adapters.deploySnapshotGovernanceAdapter(
        delegateRegistry.address
      );
    }

    it("should have the correct delegate registry address", async () => {
      const deployedSnapshotGovernanceAdapter = await subject();

      const actualDelegateRegistryAddress = await deployedSnapshotGovernanceAdapter.delegateRegistryAddress();
      expect(actualDelegateRegistryAddress).to.eq(delegateRegistry.address);
    });
  });

  describe("#getDelegateCalldata", async () => {
    let delegatee: Address;

    beforeEach(async () => {
      delegatee = await getRandomAddress();
    });

    async function subject(): Promise<any> {
      return snapshotGovernanceAdapter.getDelegateCalldata(delegatee);
    }

    it("should return correct data for delegating all votes", async () => {
      const [targetAddress, ethValue, callData] = await subject();
      const expectedCallData = delegateRegistry.interface.encodeFunctionData(
        "setDelegate",
        [ZERO_BYTES, delegatee]
      );

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

  describe("#getRegisterCalldata", async () => {
    let subjectSetToken: Address;

    beforeEach(async () => {
      subjectSetToken = mockSetToken.address;
    });

    async function subject(): Promise<any> {
      return snapshotGovernanceAdapter.getRegisterCalldata(subjectSetToken);
    }

    it("should revert", async () => {
      await expect(subject()).to.be.revertedWith("No register available in snapshot smart contract");
    });
  });

  describe("#getVoteCalldata", async () => {
    let subjectProposalId: BigNumber;
    let subjectSupport: boolean;
    let subjectData: Bytes;

    beforeEach(async () => {
      subjectProposalId = ZERO;
      subjectSupport = true;
      subjectData = EMPTY_BYTES;
    });

    async function subject(): Promise<any> {
      return snapshotGovernanceAdapter.getVoteCalldata(subjectProposalId, subjectSupport, subjectData);
    }

    it("should revert", async () => {
      await expect(subject()).to.be.revertedWith("No way to obtain vote call data from snapshot smart contract currently");
    });
  });

  describe("#getProposeCalldata", async () => {
    let subjectSetToken: Address;

    beforeEach(async () => {
      subjectSetToken = mockSetToken.address;
    });

    async function subject(): Promise<any> {
      return snapshotGovernanceAdapter.getProposeCalldata(subjectSetToken);
    }

    it("should revert", async () => {
      await expect(subject()).to.be.revertedWith("Creation of new proposal not available in snapshot governance");
    });
  });
});
