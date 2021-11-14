import "module-alias/register";
import { BigNumber } from "@ethersproject/bignumber";

import { Address, Bytes } from "@utils/types";
import { Account } from "@utils/test/types";
import { EMPTY_BYTES, ZERO, ZERO_BYTES } from "@utils/constants";
import { DelegateRegistry, SnapshotGovernanceAdapter } from "@utils/contracts";
import DeployHelper from "@utils/deploys";
import {
  addSnapshotBeforeRestoreAfterEach,
  getAccounts,
  getWaffleExpect,
  getRandomAddress,
} from "@utils/test/index";

const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
  let owner: Account;
  let mockSetToken: Account;
  let deployer: DeployHelper;
  let delegateRegistry: DelegateRegistry;

  let snapshotGovernanceAdapter: SnapshotGovernanceAdapter;

  before(async () => {
    [owner, mockSetToken] = await getAccounts();

    deployer = new DeployHelper(owner.wallet);

    delegateRegistry = await deployer.external.deployDelegateRegistry();

    snapshotGovernanceAdapter = await deployer.adapters.deploySnapshotGovernanceAdapter(
      delegateRegistry.address,
    );
  });

  addSnapshotBeforeRestoreAfterEach();

  describe("#constructor", async () => {
    let delegateRegistryAddress: Address;

    beforeEach(() => {
      delegateRegistryAddress = delegateRegistry.address;
    });

    async function subject() {
      return deployer.adapters.deploySnapshotGovernanceAdapter(delegateRegistryAddress);
    }

    it("should have the correct delegate registry address", async () => {
      const deployedSnapshotGovernanceAdapter = await subject();

      const actualDelegateRegistryAddress = await deployedSnapshotGovernanceAdapter.delegateRegistry();

      expect(actualDelegateRegistryAddress).to.eq(delegateRegistryAddress);
    });
  });

  describe("#getVoteCalldata", async () => {
    let proposalId: BigNumber;
    let support: boolean;
    let data: Bytes;

    beforeEach(() => {
      proposalId = ZERO;
      support = true;
      data = EMPTY_BYTES;
    });

    async function subject() {
      return snapshotGovernanceAdapter.getVoteCalldata(proposalId, support, data);
    }

    it("should revert", async () => {
      await expect(subject()).to.be.revertedWith("No vote available in Snapshot governance");
    });
  });

  describe("#getDelegateCalldata", async () => {
    let subjectDelegatee: Address;

    beforeEach(async () => {
      subjectDelegatee = await getRandomAddress();
    });

    async function subject() {
      return snapshotGovernanceAdapter.getDelegateCalldata(subjectDelegatee);
    }

    it("should return correct data to delegate all votes", async () => {
      const [targetAddress, ethValue, callData] = await subject();

      const expectedCallData = delegateRegistry.interface.encodeFunctionData("setDelegate", [
        ZERO_BYTES,
        subjectDelegatee,
      ]);

      expect(targetAddress).to.eq(delegateRegistry.address);
      expect(ethValue).to.eq(ZERO);
      expect(callData).to.eq(expectedCallData);
    });
  });

  describe("#getRegisterCalldata", async () => {
    let subjectSetToken: Address;

    beforeEach(() => {
      subjectSetToken = mockSetToken.address;
    });

    async function subject() {
      return snapshotGovernanceAdapter.getRegisterCalldata(subjectSetToken);
    }

    it("should revert", async () => {
      await expect(subject()).to.be.revertedWith("No register available in Snapshot governance");
    });
  });

  describe("#getRevokeCalldata", async () => {
    async function subject() {
      return snapshotGovernanceAdapter.getRevokeCalldata();
    }

    it("should return correct data to revoke delegations", async () => {
      const [targetAddress, ethValue, callData] = await subject();

      const expectedCallData = delegateRegistry.interface.encodeFunctionData("clearDelegate", [
        ZERO_BYTES,
      ]);

      expect(targetAddress).to.eq(delegateRegistry.address);
      expect(ethValue).to.eq(ZERO);
      expect(callData).to.eq(expectedCallData);
    });
  });

  describe("#getProposeCalldata", async () => {
    let subjectProposalData: Bytes;

    beforeEach(() => {
      subjectProposalData = EMPTY_BYTES;
    });

    async function subject() {
      return snapshotGovernanceAdapter.getProposeCalldata(subjectProposalData);
    }

    it("should revert", async () => {
      await expect(subject()).to.be.revertedWith("No propose available in Snapshot governance");
    });
  });
});
