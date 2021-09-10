
pragma solidity 0.6.10;
pragma experimental "ABIEncoderV2";

/**
 * @title SnapshotGovernanceAdapter
 * @author Richard Guan
 */
contract SnapshotGovernanceAdapter {

    /* ============ Constants ============ */

    // Signature of delegation function in Snapshot Governance
    string public constant SET_DELEGATE_SIGNATURE = "setDelegate(bytes32,address)";

    string public constant CLEAR_DELEGATE_SIGNATURE = "clearDelegate(bytes32)";

    bytes32 public constant ZERO_ADDRESS = bytes32(0);

    /* ============ State Variables ============ */

    // Address of the delegate registry
    address public immutable delegateRegistry;

    constructor(address _delegateRegistry) public {
        delegateRegistry = _delegateRegistry;
    }

    function getVoteCalldata(
        uint256 _proposalId,
        bool _support,
        bytes memory _data
    )
        external
        view
        returns (address _target, uint256 _value, bytes memory _calldata) {
            revert ("No vote available in Snapshot Delegate Registry");
        }

    function getDelegateCalldata(address _delegatee) external view returns (address _target, uint256 _value, bytes memory _calldata) {
        require(_delegatee != msg.sender, "Cannot delegate to self");
        require(_delegatee != delegateRegistry, "Cannot delegate to the registry");
        bytes memory callData = abi.encodeWithSignature(SET_DELEGATE_SIGNATURE, ZERO_ADDRESS, _delegatee);
        return (delegateRegistry, 0, callData);
    }

    function getRegisterCalldata(address _setToken) external view returns (address _target, uint256 _value, bytes memory _calldata) {
        revert("No register available in Snapshot Delegate Registry");
    }

    function getRevokeCalldata() external view returns (address _target, uint256 _value, bytes memory _calldata) {
        bytes memory callData = abi.encodeWithSignature(CLEAR_DELEGATE_SIGNATURE, ZERO_ADDRESS);
        return (delegateRegistry, 0, callData);
    }

    function getProposeCalldata(bytes memory _proposalData) external view returns (address _target, uint256 _value, bytes memory _calldata) {
        revert("No propose available in Snapshot Delegate Registry");
    }
}