import "module-alias/register";
import { Address } from "@utils/types";
import { Account } from "@utils/test/types";
import { ZERO, ZERO_BYTES } from "@utils/constants";
import {
    DelegateRegistry,
    SnapshotGovernanceAdapter
} from "@utils/contracts";
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

    before(async () => {
        [owner] = await getAccounts();
        deployer = new DeployHelper(owner.wallet);

        delegateRegistry = await deployer.external.deployDelegateRegistry();
        snapshotGovernanceAdapter = await deployer.adapters.deploySnapshotGovernanceAdapter(delegateRegistry.address);
    });

    addSnapshotBeforeRestoreAfterEach();

    describe("#constructor", async () => {
        let subjectDelegateRegistry: Address;

        before(async() => {
            subjectDelegateRegistry = delegateRegistry.address;
        });

        async function subject(): Promise<any> {
            return await deployer.adapters.deploySnapshotGovernanceAdapter(subjectDelegateRegistry);
        }

        it("should have the correct delegateRegistry address", async () => {
            const deployedSnapshotGovernanceAdapter = await subject();
            const actualDelegateRegistry = await deployedSnapshotGovernanceAdapter.delegateRegistryAddress();

            expect(actualDelegateRegistry).to.eq(subjectDelegateRegistry);
        });
    });

    describe("#getDelegateCallData", async () => {
        let subjectDelegatee: Address;

        before(async() => {
            subjectDelegatee = await getRandomAddress();
        });

        async function subject(): Promise<any> {
            return snapshotGovernanceAdapter.getDelegateCalldata(subjectDelegatee);
        }

        it("should return correct data for delegating", async () => {
            const [targetAddress, ethValue, callData] = await subject();
            const expectedCallData = delegateRegistry.interface.encodeFunctionData("setDelegate", [ZERO_BYTES, subjectDelegatee]);

            expect(targetAddress).to.eq(delegateRegistry.address);
            expect(ethValue).to.eq(ZERO);
            expect(callData).to.eq(expectedCallData);
        });
    });

    describe("#getRevokeCallData", async () => {
        async function subject(): Promise<any> {
            return snapshotGovernanceAdapter.getRevokeCalldata();
        }

        it("shoud return correct data for revoking", async () => {
            const [targetAddress, ethValue, callData] = await subject();
            const expectedCallData = delegateRegistry.interface.encodeFunctionData("clearDelegate", [ZERO_BYTES]);

            expect(targetAddress).to.eq(delegateRegistry.address);
            expect(ethValue).to.eq(ZERO);
            expect(callData).to.eq(expectedCallData);
        });
    });
});