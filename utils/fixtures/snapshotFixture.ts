import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
import { SnapshotDelegateRegistry } from "@typechain/SnapshotDelegateRegistry";
import DeployHelper from "@utils/deploys";
import { Signer } from "ethers";
import { Address } from "hardhat-deploy/dist/types";

export class SnapshotFixture {
  private _deployer: DeployHelper;
  private _ownerSigner: Signer;

  public snapshotDelegateRegistry: SnapshotDelegateRegistry;

  constructor(provider: Web3Provider | JsonRpcProvider, ownerAddress: Address) {
    this._ownerSigner = provider.getSigner(ownerAddress);
    this._deployer = new DeployHelper(this._ownerSigner);
  }

  public async initalize(registryAddress: Address) {
    this.snapshotDelegateRegistry = await this._deployer.external.deploySnapshotDelegateRegistry(
      registryAddress,
    );
  }
}
