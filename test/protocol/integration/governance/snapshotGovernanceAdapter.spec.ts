import "module-alias/register";
import { getAccounts, getWaffleExpect, getRandomAddress, getSnapshotFixture } from "@utils/test";
import DeployHelper from "@utils/deploys";
import { Account } from "@utils/test/types";
import { SnapshotGovernanceAdapter } from "@typechain/SnapshotGovernanceAdapter";
import { SnapshotFixture } from "@utils/fixtures";
import { BigNumber } from "ethers";
import { ZERO_BYTES } from "@utils/constants";

const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
  let owner: Account;
  let deployer: DeployHelper;
  let registryAddress: string;
  let snapshotFixture: SnapshotFixture;

  before(async () => {
    [owner] = await getAccounts();
    registryAddress = await getRandomAddress();
    snapshotFixture = getSnapshotFixture(owner.address);
    await snapshotFixture.initalize(registryAddress);
    deployer = new DeployHelper(owner.wallet);
  });

  describe("#constructor", async () => {
    async function subject(): Promise<SnapshotGovernanceAdapter> {
      return await deployer.adapters.deploySnapshotGovernanceAdapter(registryAddress);
    }
    it("correctly sets delegate address", async () => {
      const deployment = await subject();
      expect(await deployment.delegateRegistry()).to.eq(registryAddress);
    });
  });

  describe("#getDelegateCalldata", async () => {
    async function subject(_delegateAddress: string): Promise<[string, BigNumber, string]> {
      const deployment = await deployer.adapters.deploySnapshotGovernanceAdapter(registryAddress);
      return await deployment.getDelegateCalldata(_delegateAddress);
    }

    it("blocks delegating to the registry", async () => {
      expect(subject(registryAddress)).to.be.revertedWith("can't delegate to registry");
    });

    it("returns correct delegate data", async () => {
      const targetDelegate = await getRandomAddress();
      const [targetAddress, ethValue, callData] = await subject(targetDelegate);
      const expectedCallData = snapshotFixture.snapshotDelegateRegistry.interface.encodeFunctionData(
        "setDelegate",
        [ZERO_BYTES, targetDelegate],
      );

      expect(callData).to.eq(expectedCallData);
      expect(targetAddress).to.eq(registryAddress);
      expect(ethValue).to.eq(0);
    });
  });

  describe("#getRevokeCalldata", async () => {
    async function subject(): Promise<[string, BigNumber, string]> {
      const deployment = await deployer.adapters.deploySnapshotGovernanceAdapter(registryAddress);
      return await deployment.getRevokeCalldata();
    }

    it("returns correct revoke data", async () => {
      const [targetAddress, ethValue, callData] = await subject();
      const expectedCallData = snapshotFixture.snapshotDelegateRegistry.interface.encodeFunctionData(
        "clearDelegate",
        [ZERO_BYTES],
      );

      expect(callData).to.eq(expectedCallData);
      expect(targetAddress).to.eq(registryAddress);
      expect(ethValue).to.eq(0);
    });
  });
});
