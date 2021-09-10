import "module-alias/register";
import { Account } from "@utils/test/types";
import { Address } from "@utils/types";
import DeployHelper from "@utils/deploys";
import {
    addSnapshotBeforeRestoreAfterEach,
    getAccounts,
    getRandomAddress,
    getSnapshotFixture,
    getWaffleExpect,
} from "@utils/test/index";
import { SnapshotGovernanceAdapter } from "@utils/contracts";
import { SnapshotFixture } from "@utils/fixtures";
import { ZERO_BYTES, ZERO } from "@utils/constants";

const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", async () => {
    let owner: Account;
    let deployer: DeployHelper;
    let snapshotSetup: SnapshotFixture;

    let snapshotGovernanceAdapter: SnapshotGovernanceAdapter;

    before(async () => {
        [
            owner,
        ] = await getAccounts();

        deployer = new DeployHelper(owner.wallet);

        snapshotSetup = getSnapshotFixture(owner.address);
        await snapshotSetup.initialize();

        snapshotGovernanceAdapter = await deployer.adapters.deploySnapshotGovernanceAdapter(snapshotSetup.snapshotDelegateRegistry.address);
    });

    addSnapshotBeforeRestoreAfterEach();

    describe("constructor", async () => {
        let subjectDelegateRegistryAddress: Address;

        beforeEach(async () => {
            subjectDelegateRegistryAddress = snapshotSetup.snapshotDelegateRegistry.address;
        });

        async function subject(): Promise<any> {
            return deployer.adapters.deploySnapshotGovernanceAdapter(
                subjectDelegateRegistryAddress
            );
        }

        it("should have the correct delegate registry address", async () => {
            const deployedSnapshotGovernanceAdapter = await subject();

            const actualAddress = await deployedSnapshotGovernanceAdapter.delegateRegistry();
            expect(actualAddress).to.eq(subjectDelegateRegistryAddress);
        });
    });

    describe("#getDelegateCalldata", async () => {
        let subjectDelegatee: Address;

        beforeEach(async () => {
            subjectDelegatee = await getRandomAddress();
        });

        async function subject(): Promise<any> {
            return snapshotGovernanceAdapter.getDelegateCalldata(subjectDelegatee);
        }

        it("should return the correct data for delegating", async () => {
            const [targetAddress, ethValue, callData] = await subject();

            const expectedCallData = snapshotSetup.snapshotDelegateRegistry.interface.encodeFunctionData("setDelegate",
                [ZERO_BYTES, subjectDelegatee]
            );

            expect(targetAddress).to.eq(snapshotSetup.snapshotDelegateRegistry.address);
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

            const expectedCallData = snapshotSetup.snapshotDelegateRegistry.interface.encodeFunctionData("clearDelegate",
                [ZERO_BYTES]
            );

            expect(targetAddress).to.eq(snapshotSetup.snapshotDelegateRegistry.address);
            expect(ethValue).to.eq(ZERO);
            expect(callData).to.eq(expectedCallData);
        });
    });
});
