import "module-alias/register";
import { Address } from "@utils/types";
import { Account } from "@utils/test/types";
import { ZERO, ZERO_BYTES } from "@utils/constants";
import { SnapshotGovernanceAdapter } from "@utils/contracts";
import { DelegateRegistry } from "@typechain/DelegateRegistry";
import DeployHelper from "@utils/deploys";
import {
  addSnapshotBeforeRestoreAfterEach,
  getAccounts,
  getWaffleExpect,
  getRandomAddress,
  getSystemFixture
} from "@utils/test/index";

import { SystemFixture } from "@utils/fixtures";

const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
    let owner: Account;
    let deployer: DeployHelper;
    let setup: SystemFixture;

    let snapshotGovernanceAdapter: SnapshotGovernanceAdapter;
    let delegateRegistry: DelegateRegistry;

    before(async () => {
        [owner] = await getAccounts();

        deployer = new DeployHelper(owner.wallet);
        setup = getSystemFixture(owner.address);
        await setup.initialize();

    });

    beforeEach(async () => {
        delegateRegistry = await deployer.external.deployDelegateRegistry();
        snapshotGovernanceAdapter = await deployer.adapters.deploySnapshotGovernanceAdapter(delegateRegistry.address);
    });

    addSnapshotBeforeRestoreAfterEach();

    describe("Constructor", async () => {
        let subjectDelegate: Address;

        beforeEach(async () => {
            subjectDelegate = await getRandomAddress();
        });

        async function subject(): Promise<any> {
            return deployer.adapters.deploySnapshotGovernanceAdapter(subjectDelegate);
        }

        it("should have returned the correct constructor address", async () => {
            const deployedSnapshotGovernanceAdapter = await subject();

            const actualDelegateeAddress = await deployedSnapshotGovernanceAdapter.delegateRegistry();
            expect(actualDelegateeAddress).to.eq(subjectDelegate);
        });

    });

    describe("getDelegateCalldata", async () => {
        let subjectDelegate: Address;

        beforeEach(async () => {
            subjectDelegate = await getRandomAddress();
        });

        async function subject(): Promise<any> {
            return snapshotGovernanceAdapter.getDelegateCalldata(subjectDelegate);
        }

        it("should return correct call data", async () => {
            const [targetAddress, Eth, delegate_calldata] = await subject();
            const exptectedCallData = delegateRegistry.interface.encodeFunctionData("setDelegate", [ZERO_BYTES, subjectDelegate]);

            expect(targetAddress).to.eq(delegateRegistry.address);
            expect(Eth).to.eq(ZERO);
            expect(delegate_calldata).to.eq(exptectedCallData);

        });

    });

    describe("getRevokeCalldata", async () => {

        async function subject(): Promise<any> {
            return snapshotGovernanceAdapter.getRevokeCalldata();
        }

        it("should clear call data", async () => {
            const [targetAddress, Eth, delegate_calldata] = await subject();
            const exptectedCallData = delegateRegistry.interface.encodeFunctionData("clearDelegate", [ZERO_BYTES]);

            expect(targetAddress).to.eq(delegateRegistry.address);
            expect(Eth).to.eq(ZERO);
            expect(delegate_calldata).to.eq(exptectedCallData);
        });
    });

});

