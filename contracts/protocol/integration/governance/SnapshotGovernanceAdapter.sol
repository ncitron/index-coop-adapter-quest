pragma solidity 0.6.10;
pragma experimental "ABIEncoderV2";


/**
 * @title AaveGovernanceAdapter
 * @author Christian Koopmann
 *
 * Governance adapter for Snapshot
 */
contract SnapshotGovernanceAdapter {
    address public delegatee;

    /* ============ Constructor ============ */

    constructor(address _delegatee) public {
        delegatee = _delegatee;
    }
}

