import "module-alias/register";

import { Account } from "@utils/test/types";
import { Address } from "@utils/types";
import DeployHelper from "@utils/deploys";
import { DelegateRegistry, SnapshotGovernanceAdapter } from "@utils/contracts";
import { addSnapshotBeforeRestoreAfterEach, getAccounts, getWaffleExpect } from "@utils/test/index";
import { ZERO, ZERO_BYTES } from "@utils/constants";

const expect = getWaffleExpect();

describe("SnapshotGovernanceAdapter", () => {
    let delegate: Account;
    let owner: Account;
    let delegateRegistry: DelegateRegistry;
    let deployer: DeployHelper;
    let snapshotGovAdapt: SnapshotGovernanceAdapter;

    before(async() => {
        [
            delegate,
            owner,
        ] = await getAccounts();
        deployer = new DeployHelper(owner.wallet);
    });

    beforeEach(async() => {
        delegateRegistry = await deployer.external.deployDelegateRegistry();
        snapshotGovAdapt = await deployer.adapters.deploySnapshotGovernanceAdapter(
            delegateRegistry.address
        );
    });

    addSnapshotBeforeRestoreAfterEach();

    describe("constructor", async() => {
        let subjectDelegateRegistry: Address;
        beforeEach(async() => {
            subjectDelegateRegistry = delegateRegistry.address;
        });

        async function subject(): Promise<any> {
            return await deployer.adapters.deploySnapshotGovernanceAdapter(subjectDelegateRegistry);
        }

        it("should properly store the delegate registry address in the contructor", async() => {
            const deployedAdapter = await subject();
            const delegateAddress = await deployedAdapter.delegateRegistry();
            expect(delegateAddress).to.eq(delegateRegistry.address);
        });
    });

    describe("getDelegateCalldata", async() => {
        async function subject(): Promise<any> {
            return await snapshotGovAdapt.getDelegateCalldata(delegate.address);
        }

        it("should return the right call data", async() => {
            const callData = await subject();
            const expectedCallData = delegateRegistry.interface.encodeFunctionData("setDelegate", [
                ZERO_BYTES,
                delegate.address,
            ]);
            expect(JSON.stringify(callData)).to.eq(JSON.stringify([delegateRegistry.address, ZERO, expectedCallData]));
        });
    });

    describe("getRevokeCalldata", async() => {
        async function subject(): Promise<any> {
            return await snapshotGovAdapt.getRevokeCalldata();
        }

        it("should return the right call data", async() => {
            const callData = await subject();
            const expectedCallData = delegateRegistry.interface.encodeFunctionData("clearDelegate", [
                ZERO_BYTES,
            ]);
            expect(JSON.stringify(callData)).to.eq(JSON.stringify([delegateRegistry.address, ZERO, expectedCallData]));
        });
    });
});