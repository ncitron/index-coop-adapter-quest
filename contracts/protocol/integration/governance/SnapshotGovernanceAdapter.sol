pragma solidity 0.6.10;
pragma experimental "ABIEncoderV2";


/**
 * @title AaveGovernanceAdapter
 * @author Christian Koopmann
 *
 * Governance adapter for Snapshot
 */
contract SnapshotGovernanceAdapter {
    address public delegateRegistry;

    // Signature of delegate function
    string public constant DELEGATE_SIGNATURE = "setDelegate(bytes32,address)";

    /* ============ Constructor ============ */

    constructor(address _delegateRegistry) public {
        delegateRegistry = _delegateRegistry;
    }

    /**
     * Generates the calldata to delegate votes to another ETH address. Self and zero address allowed, which is equivalent to registering and revoking in Aave.
     *
     * @param _delegatee            Address of the delegatee
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                setDelegate calldata
     */
    function getDelegateCalldata(address _delegatee) external view returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(DELEGATE_SIGNATURE, bytes32(0), _delegatee);
        return (delegateRegistry, 0, callData);
    }
}

