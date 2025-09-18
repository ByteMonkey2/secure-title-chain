// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecureTitleChain is SepoliaConfig {
    using FHE for *;
    
    struct PropertyRecord {
        euint32 propertyId;
        euint32 value; // Encrypted property value
        euint32 area;  // Encrypted property area
        euint32 yearBuilt; // Encrypted year built
        ebool isVerified;
        ebool isActive;
        string location;
        string description;
        address currentOwner;
        address previousOwner;
        uint256 registrationTimestamp;
        uint256 lastTransferTimestamp;
    }

    struct TransferRecord {
        euint32 transferId;
        euint32 price; // Encrypted transfer price
        address previousOwner;
        address newOwner;
        uint256 transferTimestamp;
        ebool isVerified;
    }

    mapping(uint256 => PropertyRecord) public properties;
    mapping(uint256 => TransferRecord) public transfers;
    mapping(address => euint32) public ownerPropertyCount; // Encrypted count of properties owned by an address
    mapping(address => bool) public authorizedVerifiers; // Authorized property verifiers

    uint256 public propertyCounter;
    uint256 public transferCounter;

    address public owner; // Contract deployer
    address public verifier; // Entity responsible for verifying properties and transfers

    event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string location);
    event PropertyTransferred(uint256 indexed transferId, uint256 indexed propertyId, address indexed newOwner);
    event PropertyVerified(uint256 indexed propertyId, bool isVerified);
    event TransferVerified(uint256 indexed transferId, bool isVerified);
    event VerifierAuthorized(address indexed verifier, bool authorized);

    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
        authorizedVerifiers[_verifier] = true;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }

    modifier onlyVerifier() {
        require(authorizedVerifiers[msg.sender], "Only authorized verifier can call this function");
        _;
    }

    modifier onlyPropertyOwner(uint256 _propertyId) {
        require(properties[_propertyId].currentOwner == msg.sender, "Only property owner can call this function");
        _;
    }

    function authorizeVerifier(address _verifier, bool _authorized) public onlyOwner {
        authorizedVerifiers[_verifier] = _authorized;
        emit VerifierAuthorized(_verifier, _authorized);
    }

    function registerProperty(
        string memory _location,
        string memory _description,
        externalEuint32 _value, // Encrypted value
        externalEuint32 _area,  // Encrypted area
        externalEuint32 _yearBuilt, // Encrypted year built
        bytes calldata inputProofValue,
        bytes calldata inputProofArea,
        bytes calldata inputProofYear
    ) public returns (uint256) {
        require(bytes(_location).length > 0, "Location cannot be empty");
        require(bytes(_description).length > 0, "Description cannot be empty");

        uint256 newPropertyId = propertyCounter++;

        euint32 internalValue = FHE.fromExternal(_value, inputProofValue);
        euint32 internalArea = FHE.fromExternal(_area, inputProofArea);
        euint32 internalYearBuilt = FHE.fromExternal(_yearBuilt, inputProofYear);

        properties[newPropertyId] = PropertyRecord({
            propertyId: FHE.asEuint32(uint32(newPropertyId)),
            value: internalValue,
            area: internalArea,
            yearBuilt: internalYearBuilt,
            isVerified: FHE.asEbool(false),
            isActive: FHE.asEbool(true),
            location: _location,
            description: _description,
            currentOwner: msg.sender,
            previousOwner: address(0),
            registrationTimestamp: block.timestamp,
            lastTransferTimestamp: 0
        });

        ownerPropertyCount[msg.sender] = FHE.add(ownerPropertyCount[msg.sender], FHE.asEuint32(1));

        emit PropertyRegistered(newPropertyId, msg.sender, _location);
        return newPropertyId;
    }

    function transferProperty(
        uint256 _propertyId,
        address _newOwner,
        externalEuint32 _price, // Encrypted price
        bytes calldata inputProofPrice
    ) public onlyPropertyOwner(_propertyId) returns (uint256) {
        require(_newOwner != address(0), "New owner address cannot be zero");
        require(_newOwner != msg.sender, "Cannot transfer to self");
        require(properties[_propertyId].isVerified.decrypt() == true, "Property must be verified before transfer");
        require(properties[_propertyId].isActive.decrypt() == true, "Property must be active");

        uint256 newTransferId = transferCounter++;
        address previousOwner = properties[_propertyId].currentOwner;

        euint32 internalPrice = FHE.fromExternal(_price, inputProofPrice);

        transfers[newTransferId] = TransferRecord({
            transferId: FHE.asEuint32(uint32(newTransferId)),
            price: internalPrice,
            previousOwner: previousOwner,
            newOwner: _newOwner,
            transferTimestamp: block.timestamp,
            isVerified: FHE.asEbool(false)
        });

        // Update property ownership
        properties[_propertyId].currentOwner = _newOwner;
        properties[_propertyId].previousOwner = previousOwner;
        properties[_propertyId].lastTransferTimestamp = block.timestamp;
        
        ownerPropertyCount[previousOwner] = FHE.sub(ownerPropertyCount[previousOwner], FHE.asEuint32(1));
        ownerPropertyCount[_newOwner] = FHE.add(ownerPropertyCount[_newOwner], FHE.asEuint32(1));

        emit PropertyTransferred(newTransferId, _propertyId, _newOwner);
        return newTransferId;
    }

    function verifyProperty(uint256 _propertyId, ebool _isVerified) public onlyVerifier {
        require(properties[_propertyId].currentOwner != address(0), "Property does not exist");
        properties[_propertyId].isVerified = _isVerified;
        emit PropertyVerified(_propertyId, _isVerified.decrypt());
    }

    function verifyTransfer(uint256 _transferId, ebool _isVerified) public onlyVerifier {
        require(transfers[_transferId].previousOwner != address(0), "Transfer does not exist");
        transfers[_transferId].isVerified = _isVerified;
        emit TransferVerified(_transferId, _isVerified.decrypt());
    }

    function deactivateProperty(uint256 _propertyId) public onlyPropertyOwner(_propertyId) {
        properties[_propertyId].isActive = FHE.asEbool(false);
    }

    function reactivateProperty(uint256 _propertyId) public onlyPropertyOwner(_propertyId) {
        properties[_propertyId].isActive = FHE.asEbool(true);
    }

    function getPropertyDetails(uint256 _propertyId) public view returns (
        string memory location,
        string memory description,
        uint8 value, // Decrypted off-chain
        uint8 area,  // Decrypted off-chain
        uint8 yearBuilt, // Decrypted off-chain
        bool isVerified,
        bool isActive,
        address currentOwner,
        address previousOwner,
        uint256 registrationTimestamp,
        uint256 lastTransferTimestamp
    ) {
        PropertyRecord storage property = properties[_propertyId];
        return (
            property.location,
            property.description,
            0, // FHE.decrypt(property.value) - will be decrypted off-chain
            0, // FHE.decrypt(property.area) - will be decrypted off-chain
            0, // FHE.decrypt(property.yearBuilt) - will be decrypted off-chain
            property.isVerified.decrypt(),
            property.isActive.decrypt(),
            property.currentOwner,
            property.previousOwner,
            property.registrationTimestamp,
            property.lastTransferTimestamp
        );
    }

    function getTransferDetails(uint256 _transferId) public view returns (
        uint8 price, // Decrypted off-chain
        address previousOwner,
        address newOwner,
        uint256 transferTimestamp,
        bool isVerified
    ) {
        TransferRecord storage transfer = transfers[_transferId];
        return (
            0, // FHE.decrypt(transfer.price) - will be decrypted off-chain
            transfer.previousOwner,
            transfer.newOwner,
            transfer.transferTimestamp,
            transfer.isVerified.decrypt()
        );
    }

    function getOwnerPropertyCount(address _owner) public view returns (uint8) {
        return 0; // FHE.decrypt(ownerPropertyCount[_owner]) - will be decrypted off-chain
    }

    function getPropertyCount() public view returns (uint256) {
        return propertyCounter;
    }

    function getTransferCount() public view returns (uint256) {
        return transferCounter;
    }
}
