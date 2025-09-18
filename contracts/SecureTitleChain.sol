// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";
import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract SecureTitleChain is SepoliaConfig {
    using FHE for *;
    
    struct PropertyRecord {
        euint32 propertyId;
        euint32 value;
        euint32 area;
        euint32 yearBuilt;
        bool isActive;
        bool isVerified;
        string address;
        string description;
        address owner;
        address previousOwner;
        uint256 registrationTime;
        uint256 lastTransferTime;
    }
    
    struct PropertyTransfer {
        euint32 transferId;
        euint32 propertyId;
        euint32 transferValue;
        address from;
        address to;
        uint256 timestamp;
        bool isCompleted;
    }
    
    struct PropertyInspection {
        euint32 inspectionId;
        euint32 propertyId;
        euint32 conditionScore;
        euint32 safetyRating;
        bool isPassed;
        string reportHash;
        address inspector;
        uint256 timestamp;
    }
    
    struct OwnerReputation {
        euint32 reputationScore;
        euint32 transactionCount;
        bool isVerified;
        address owner;
    }
    
    mapping(uint256 => PropertyRecord) public properties;
    mapping(uint256 => PropertyTransfer) public transfers;
    mapping(uint256 => PropertyInspection) public inspections;
    mapping(address => OwnerReputation) public ownerReputations;
    mapping(address => euint32) public propertyCount;
    
    uint256 public propertyCounter;
    uint256 public transferCounter;
    uint256 public inspectionCounter;
    
    address public owner;
    address public verifier;
    address public inspector;
    
    event PropertyRegistered(uint256 indexed propertyId, address indexed owner, string propertyAddress);
    event PropertyTransferred(uint256 indexed transferId, uint256 indexed propertyId, address indexed from, address indexed to);
    event PropertyInspected(uint256 indexed inspectionId, uint256 indexed propertyId, address indexed inspector);
    event PropertyVerified(uint256 indexed propertyId, bool isVerified);
    event ReputationUpdated(address indexed owner, uint32 reputation);
    
    constructor(address _verifier, address _inspector) {
        owner = msg.sender;
        verifier = _verifier;
        inspector = _inspector;
    }
    
    function registerProperty(
        string memory _address,
        string memory _description,
        externalEuint32 _value,
        externalEuint32 _area,
        externalEuint32 _yearBuilt,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_address).length > 0, "Property address cannot be empty");
        require(bytes(_description).length > 0, "Property description cannot be empty");
        
        uint256 propertyId = propertyCounter++;
        
        // Convert external encrypted values to internal encrypted values
        euint32 internalValue = FHE.fromExternal(_value, inputProof);
        euint32 internalArea = FHE.fromExternal(_area, inputProof);
        euint32 internalYearBuilt = FHE.fromExternal(_yearBuilt, inputProof);
        
        properties[propertyId] = PropertyRecord({
            propertyId: FHE.asEuint32(0), // Will be set properly later
            value: internalValue,
            area: internalArea,
            yearBuilt: internalYearBuilt,
            isActive: true,
            isVerified: false,
            address: _address,
            description: _description,
            owner: msg.sender,
            previousOwner: address(0),
            registrationTime: block.timestamp,
            lastTransferTime: 0
        });
        
        // Update property count for owner
        propertyCount[msg.sender] = FHE.add(propertyCount[msg.sender], FHE.asEuint32(1));
        
        emit PropertyRegistered(propertyId, msg.sender, _address);
        return propertyId;
    }
    
    function transferProperty(
        uint256 propertyId,
        address to,
        externalEuint32 transferValue,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(properties[propertyId].owner == msg.sender, "Only property owner can transfer");
        require(properties[propertyId].isActive, "Property is not active");
        require(to != address(0), "Invalid recipient address");
        require(to != msg.sender, "Cannot transfer to self");
        
        uint256 transferId = transferCounter++;
        
        // Convert external encrypted value to internal encrypted value
        euint32 internalTransferValue = FHE.fromExternal(transferValue, inputProof);
        
        transfers[transferId] = PropertyTransfer({
            transferId: FHE.asEuint32(0), // Will be set properly later
            propertyId: FHE.asEuint32(propertyId),
            transferValue: internalTransferValue,
            from: msg.sender,
            to: to,
            timestamp: block.timestamp,
            isCompleted: false
        });
        
        // Update property ownership
        properties[propertyId].previousOwner = properties[propertyId].owner;
        properties[propertyId].owner = to;
        properties[propertyId].lastTransferTime = block.timestamp;
        
        // Update property counts
        propertyCount[msg.sender] = FHE.sub(propertyCount[msg.sender], FHE.asEuint32(1));
        propertyCount[to] = FHE.add(propertyCount[to], FHE.asEuint32(1));
        
        // Mark transfer as completed
        transfers[transferId].isCompleted = true;
        
        emit PropertyTransferred(transferId, propertyId, msg.sender, to);
        return transferId;
    }
    
    function inspectProperty(
        uint256 propertyId,
        euint32 conditionScore,
        euint32 safetyRating,
        string memory reportHash
    ) public returns (uint256) {
        require(msg.sender == inspector, "Only authorized inspector can inspect");
        require(properties[propertyId].owner != address(0), "Property does not exist");
        require(properties[propertyId].isActive, "Property is not active");
        
        uint256 inspectionId = inspectionCounter++;
        
        // Determine if property passes inspection based on encrypted scores
        // This would require FHE comparison operations in a real implementation
        ebool inspectionPassed = FHE.gt(conditionScore, FHE.asEuint32(70)); // Assuming 70 is minimum score
        
        inspections[inspectionId] = PropertyInspection({
            inspectionId: FHE.asEuint32(0), // Will be set properly later
            propertyId: FHE.asEuint32(propertyId),
            conditionScore: conditionScore,
            safetyRating: safetyRating,
            isPassed: false, // Would be decrypted from inspectionPassed
            reportHash: reportHash,
            inspector: msg.sender,
            timestamp: block.timestamp
        });
        
        emit PropertyInspected(inspectionId, propertyId, msg.sender);
        return inspectionId;
    }
    
    function verifyProperty(uint256 propertyId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify properties");
        require(properties[propertyId].owner != address(0), "Property does not exist");
        
        properties[propertyId].isVerified = isVerified;
        emit PropertyVerified(propertyId, isVerified);
    }
    
    function updateOwnerReputation(
        address ownerAddress,
        euint32 reputationScore,
        euint32 transactionCount
    ) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(ownerAddress != address(0), "Invalid owner address");
        
        ownerReputations[ownerAddress] = OwnerReputation({
            reputationScore: reputationScore,
            transactionCount: transactionCount,
            isVerified: true,
            owner: ownerAddress
        });
        
        emit ReputationUpdated(ownerAddress, 0); // FHE.decrypt(reputationScore) - will be decrypted off-chain
    }
    
    function getPropertyInfo(uint256 propertyId) public view returns (
        string memory propertyAddress,
        string memory description,
        uint8 value,
        uint8 area,
        uint8 yearBuilt,
        bool isActive,
        bool isVerified,
        address owner,
        address previousOwner,
        uint256 registrationTime,
        uint256 lastTransferTime
    ) {
        PropertyRecord storage property = properties[propertyId];
        return (
            property.address,
            property.description,
            0, // FHE.decrypt(property.value) - will be decrypted off-chain
            0, // FHE.decrypt(property.area) - will be decrypted off-chain
            0, // FHE.decrypt(property.yearBuilt) - will be decrypted off-chain
            property.isActive,
            property.isVerified,
            property.owner,
            property.previousOwner,
            property.registrationTime,
            property.lastTransferTime
        );
    }
    
    function getTransferInfo(uint256 transferId) public view returns (
        uint8 transferValue,
        address from,
        address to,
        uint256 timestamp,
        bool isCompleted
    ) {
        PropertyTransfer storage transfer = transfers[transferId];
        return (
            0, // FHE.decrypt(transfer.transferValue) - will be decrypted off-chain
            transfer.from,
            transfer.to,
            transfer.timestamp,
            transfer.isCompleted
        );
    }
    
    function getInspectionInfo(uint256 inspectionId) public view returns (
        uint8 conditionScore,
        uint8 safetyRating,
        bool isPassed,
        string memory reportHash,
        address inspector,
        uint256 timestamp
    ) {
        PropertyInspection storage inspection = inspections[inspectionId];
        return (
            0, // FHE.decrypt(inspection.conditionScore) - will be decrypted off-chain
            0, // FHE.decrypt(inspection.safetyRating) - will be decrypted off-chain
            inspection.isPassed,
            inspection.reportHash,
            inspection.inspector,
            inspection.timestamp
        );
    }
    
    function getOwnerReputation(address ownerAddress) public view returns (
        uint8 reputationScore,
        uint8 transactionCount,
        bool isVerified
    ) {
        OwnerReputation storage reputation = ownerReputations[ownerAddress];
        return (
            0, // FHE.decrypt(reputation.reputationScore) - will be decrypted off-chain
            0, // FHE.decrypt(reputation.transactionCount) - will be decrypted off-chain
            reputation.isVerified
        );
    }
    
    function getPropertyCount(address ownerAddress) public view returns (uint8) {
        return 0; // FHE.decrypt(propertyCount[ownerAddress]) - will be decrypted off-chain
    }
    
    function deactivateProperty(uint256 propertyId) public {
        require(properties[propertyId].owner == msg.sender, "Only property owner can deactivate");
        require(properties[propertyId].isActive, "Property is already inactive");
        
        properties[propertyId].isActive = false;
        
        // Update property count
        propertyCount[msg.sender] = FHE.sub(propertyCount[msg.sender], FHE.asEuint32(1));
    }
    
    function reactivateProperty(uint256 propertyId) public {
        require(properties[propertyId].owner == msg.sender, "Only property owner can reactivate");
        require(!properties[propertyId].isActive, "Property is already active");
        
        properties[propertyId].isActive = true;
        
        // Update property count
        propertyCount[msg.sender] = FHE.add(propertyCount[msg.sender], FHE.asEuint32(1));
    }
}
