pragma solidity 0.6.10;
pragma experimental "ABIEncoderV2";

/**
 * @title SnapshotGovernanceAdapter
 * @author Mridul Ahuja
 *
 * Governance adapter that allows a Set to delegate all of its voting power on Snapshot.org
 */

contract SnapshotGovernanceAdapter {
    /* ============ Constants ============ */

    // Signature of the delegate function in Delegate Registry
    string public constant DELEGATE_SIGNATURE = "setDelegate(bytes32,address)";

    string public constant CLEAR_DELEGATE_SIGNATURE = "clearDelegate(bytes32)";

    /* ============ State Variables ============ */

    // Address of the Delegate Registry
    address public immutable delegateRegistryAddress; 

    /* ============ Constructor ============ */

    /**
     * Set state variables
     *
     * @param _delegateRegistryAddress    Address of Delegate Registry Address
     */

    constructor(address _delegateRegistryAddress) public {
        delegateRegistryAddress = _delegateRegistryAddress;
    }

    /* ============ External Getter Functions ============ */

    /**
     * Delegates all votes of msg.sender to delegate. If id is left as ZERO_BYTES, then delegates all votes
     *
     * @param _delegatee            Address to which votes will be delegated
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                Propose calldata
     */

    function getDelegateCalldata(address _delegatee) external view returns (address, uint256, bytes memory){
        
        bytes memory callData = abi.encodeWithSignature(DELEGATE_SIGNATURE, bytes32(0), _delegatee); 

        return (delegateRegistryAddress, 0, callData); 
    }

    /**
     * Revokes previous delegation from msg.sender. If id is left as ZERO_BYTES, then undelegates all votes
     *
     * @return address              Target contract address
     * @return uint256              Total quantity of ETH (Set to 0)
     * @return bytes                Propose calldata
     */

    function getRevokeCalldata() external view returns (address, uint256, bytes memory){

        bytes memory callData = abi.encodeWithSignature(CLEAR_DELEGATE_SIGNATURE, bytes32(0)); 

        return (delegateRegistryAddress, 0, callData); 
    }
}