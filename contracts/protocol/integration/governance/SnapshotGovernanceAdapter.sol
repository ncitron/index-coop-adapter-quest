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

    // Signature of revoke function
    string public constant REVOKE_SIGNATURE = "clearDelegate(bytes32)";

    /* ============ Constructor ============ */

    constructor(address _delegateRegistry) public {
        delegateRegistry = _delegateRegistry;
    }

    /* ============ External Getter Functions ============ */

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

    /**
     * Reverts as Snapshot currently does not have a register mechanism in governance
     */
    function getRegisterCalldata(address /* _setToken */) external view returns (address, uint256, bytes memory) {
        revert("No register available in Snapshot governance");
    }

    /**
     * Generates the calldata to revoke voting. This is equivalent to calling the clearDelegate function on the Registry.
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                Propose calldata
     */
    function getRevokeCalldata() external view returns (address, uint256, bytes memory) {
        bytes memory callData = abi.encodeWithSignature(REVOKE_SIGNATURE, bytes32(0));
        return (delegateRegistry, 0, callData);
    }
}

