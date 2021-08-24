pragma solidity 0.6.10;
pragma experimental "ABIEncoderV2";

/**
* @title SnapshotGovernanceAdapter
* @author John Hearn
*/

contract SnapshotGovernanceAdapter {
    address public immutable delegateRegistry;

    /**
     * Set the delegator state variable
     *
     * @param _delegateRegistry       Address of DelegateRegistry contract
     */
    constructor(address _delegateRegistry) public {
        delegateRegistry = _delegateRegistry;
    }

    /**
     * Return calldata for DelegateRegistry when calling the setDelegate method
     *
     * @return address                   Target contract address
     * @return uint256                   Call value
     * @return bytes                     Trade calldata
     */
    function getDelegateCalldata(address _delegatee) 
        external
        view
        returns(address, uint256, bytes memory) 
    {
        bytes memory callData = abi.encodeWithSignature(
            "setDelegate(bytes32,address)",
            bytes32(0),
            _delegatee
        );

        return (delegateRegistry, 0, callData);
    }

    /**
     * Return calldata for DelegateRegistry when calling the clearDelegate method
     *
     * @return address                   Target contract address
     * @return uint256                   Call value
     * @return bytes                     Trade calldata
     */
    function getRevokeCalldata() 
        external
        view
        returns (address, uint256, bytes memory)
    {
        bytes memory callData = abi.encodeWithSignature(
            "clearDelegate(bytes32)",
            bytes32(0)
        );

        return (delegateRegistry, 0, callData);
    }
}