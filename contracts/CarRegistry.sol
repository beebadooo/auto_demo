// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CarRegistry is AccessControl {
    bytes32 public constant MANUFACTURER_ROLE = keccak256("MANUFACTURER_ROLE");

    struct Vehicle {
        bytes32 vinHash;     // hashed(VIN + salt) computed off-chain
        address owner;       // current on-chain owner address
        uint256 createdAt;   // block timestamp when registered
        string metadataURI;  // optional metadata (IPFS URI or JSON pointer)
    }

    // vinHash => Vehicle
    mapping(bytes32 => Vehicle) private vehicles;
    // track existence
    mapping(bytes32 => bool) public exists;

    event VehicleRegistered(bytes32 indexed vinHash, address indexed manufacturer, address indexed owner, uint256 timestamp, string metadataURI);
    event OwnershipTransferred(bytes32 indexed vinHash, address indexed oldOwner, address indexed newOwner);

    constructor(address admin) {
        // grant deployer/admin roles
        _setupRole(DEFAULT_ADMIN_ROLE, admin == address(0) ? msg.sender : admin);
        // admin implicitly can grant MANUFACTURER_ROLE
    }

    /// @notice Register a vehicle. Only accounts with MANUFACTURER_ROLE can call.
    /// @param vinHash keccak256 hash of VIN + salt computed off-chain
    /// @param owner initial owner (dealer or customer)
    /// @param metadataURI optional pointer to off-chain metadata (IPFS)
    function registerVehicle(bytes32 vinHash, address owner, string calldata metadataURI) external onlyRole(MANUFACTURER_ROLE) {
        require(!exists[vinHash], "Vehicle already registered");
        vehicles[vinHash] = Vehicle({vinHash: vinHash, owner: owner, createdAt: block.timestamp, metadataURI: metadataURI});
        exists[vinHash] = true;

        emit VehicleRegistered(vinHash, msg.sender, owner, block.timestamp, metadataURI);
    }

    /// @notice Transfer ownership of a registered vehicle. Can be called by current owner.
    function transferOwnership(bytes32 vinHash, address newOwner) external {
        require(exists[vinHash], "Vehicle not registered");
        Vehicle storage v = vehicles[vinHash];
        require(msg.sender == v.owner, "Only current owner can transfer");
        address old = v.owner;
        v.owner = newOwner;
        emit OwnershipTransferred(vinHash, old, newOwner);
    }

    /// @notice Get vehicle details
    function getVehicle(bytes32 vinHash) external view returns (Vehicle memory) {
        require(exists[vinHash], "Vehicle not registered");
        return vehicles[vinHash];
    }

    // Admin helpers (grant/revoke come from AccessControl)
}
