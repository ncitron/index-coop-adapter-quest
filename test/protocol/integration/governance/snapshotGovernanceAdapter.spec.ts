import "module-alias/register";
import { Address } from "@utils/types";
import { Account } from "@utils/test/types";
import DeployHelper from "@utils/deploys";
import {
    addSnapshotBeforeRestoreAfterEach,
    getAccounts,
    getWaffleExpect,
    getRandomAddress
} from "@utils/test/index";
import { ZERO_BYTES, ZERO } from "@utils/constants";
import { DelegateRegistry, SnapshotGovernanceAdapter } from "@utils/contracts";


const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
    let owner: Account;
    let delegatee: Account;
    let deployer: DeployHelper;
    let snapshotGovernanceAdapter: SnapshotGovernanceAdapter;
    let delegateRegistry: DelegateRegistry;

    before(async () => {
        [
            owner,
            delegatee,
        ] = await getAccounts();

        deployer = new DeployHelper(owner.wallet);

        delegateRegistry = await deployer.external.deployDelegateRegistry();
        snapshotGovernanceAdapter = await deployer.adapters.deploySnapshotGovernanceAdapter(delegateRegistry.address);
    });

    addSnapshotBeforeRestoreAfterEach();

    describe("#constructor", async () => {
        let delegateRegistryAddress: Address;

        beforeEach(async () => {
            delegateRegistryAddress = await getRandomAddress();
        });

        async function subject(): Promise<any> {
            return await deployer.adapters.deploySnapshotGovernanceAdapter(
                delegateRegistryAddress
            );
        }

        it("should have the correct snapshot delegate registry address", async () => {
            const deployedSnapshotGovernanceAdapter = await subject();

            const actualDelegateRegistryAddress = await deployedSnapshotGovernanceAdapter.delegateRegistry();
            expect(actualDelegateRegistryAddress).to.eq(delegateRegistryAddress);
        });
    });

    describe("#getDelegateCalldata", async () => {
        async function subject(): Promise<any> {
            return snapshotGovernanceAdapter.getDelegateCalldata(delegatee.address);
        }

        it("should produce the correct calldata for setDelegate", async () => {
            const [target, value, data] = await subject();
            const expectedCalldata = delegateRegistry.interface.encodeFunctionData("setDelegate", [ZERO_BYTES, delegatee.address]);

            expect(target).to.eq(delegateRegistry.address);
            expect(value).to.eq(ZERO);
            expect(data).to.eq(expectedCalldata);
        });
    });

    describe("#getRevokeCalldata", async () => {
        async function subject(): Promise<any> {
            return snapshotGovernanceAdapter.getRevokeCalldata();
        }

        it("should produce the correct calldata for clearDelegate", async () => {
            const [target, value, data] = await subject();
            const expectedCalldata = delegateRegistry.interface.encodeFunctionData("clearDelegate", [ZERO_BYTES]);

            expect(target).to.eq(delegateRegistry.address);
            expect(value).to.eq(ZERO);
            expect(data).to.eq(expectedCalldata);
        });
    });
});