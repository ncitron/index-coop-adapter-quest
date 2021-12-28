pragma solidity 0.6.10;
pragma experimental "ABIEncoderV2";


/**
 * @author aaneg
 */
contract SnapshotGovernanceAdapter {
    bytes32 public constant ZERO_BYTES = bytes32(0);

    address public immutable delegateRegistry;

    constructor(
        address _delegateRegistery
    ) public {
        delegateRegistry = _delegateRegistery;
    }

    /** 
    * Generates the calldata to delegate all votes off chain on Snapshot.org
    * @param _delegate            the address to delegate to
    * 
    * @return address             delegate registry
    * @return value               quantity of eth (Set to 0)
    * @return bytes               delegate call data
    */
    function getDelegateCalldata(address _delegate) external view returns (address, uint256, bytes memory) {
        require(_delegate != delegateRegistry, "can't delegate to registry");
        // ZERO_BYTES represents delegating all votes
        bytes memory callData = abi.encodeWithSignature("setDelegate(bytes32,address)", ZERO_BYTES, _delegate);
        return (delegateRegistry, 0, callData);
    }

    /** 
    * Generates the revoke calldata to undelegate all votes off chain on Snapshot.org
    * 
    * @return address             delegate registry
    * @return value               quantity of eth (Set to 0)
    * @return bytes               undelegate call data
    */
    function getRevokeCalldata() external view returns (address, uint256, bytes memory) {
        // ZERO_BYTES represents undelegating all votes
        bytes memory callData = abi.encodeWithSignature("clearDelegate(bytes32)", ZERO_BYTES);
        return (delegateRegistry, 0, callData);
    }
}