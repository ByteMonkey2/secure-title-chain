import { useAccount, useWriteContract, useReadContract } from 'wagmi';
import { useState } from 'react';
import { 
  encryptPropertyValue, 
  encryptPropertyArea, 
  encryptYearBuilt, 
  generateEncryptionProof 
} from '@/lib/fhe-utils';

// Contract ABI for SecureTitleChain
const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "_address", "type": "string"},
      {"name": "_description", "type": "string"},
      {"name": "_value", "type": "bytes"},
      {"name": "_area", "type": "bytes"},
      {"name": "_yearBuilt", "type": "bytes"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "registerProperty",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "propertyId", "type": "uint256"},
      {"name": "to", "type": "address"},
      {"name": "transferValue", "type": "bytes"},
      {"name": "inputProof", "type": "bytes"}
    ],
    "name": "transferProperty",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "propertyId", "type": "uint256"}],
    "name": "getPropertyInfo",
    "outputs": [
      {"name": "propertyAddress", "type": "string"},
      {"name": "description", "type": "string"},
      {"name": "value", "type": "uint8"},
      {"name": "area", "type": "uint8"},
      {"name": "yearBuilt", "type": "uint8"},
      {"name": "isActive", "type": "bool"},
      {"name": "isVerified", "type": "bool"},
      {"name": "owner", "type": "address"},
      {"name": "previousOwner", "type": "address"},
      {"name": "registrationTime", "type": "uint256"},
      {"name": "lastTransferTime", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';

export const usePropertyContract = () => {
  const { address, isConnected } = useAccount();
  const { writeContract, isPending, error } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);

  const registerProperty = async (
    propertyAddress: string,
    description: string,
    value: number,
    area: number,
    yearBuilt: number
  ) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      // Encrypt the sensitive data using FHE
      const encryptedValue = await encryptPropertyValue(value);
      const encryptedArea = await encryptPropertyArea(area);
      const encryptedYearBuilt = await encryptYearBuilt(yearBuilt);

      // Generate proof for the encrypted data
      const inputProofValue = await generateEncryptionProof(encryptedValue);
      const inputProofArea = await generateEncryptionProof(encryptedArea);
      const inputProofYear = await generateEncryptionProof(encryptedYearBuilt);

      // Call the smart contract
      const result = await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'registerProperty',
        args: [
          propertyAddress,
          description,
          encryptedValue,
          encryptedArea,
          encryptedYearBuilt,
          inputProofValue,
          inputProofArea,
          inputProofYear
        ]
      });

      return result;
    } catch (err) {
      console.error('Error registering property:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const transferProperty = async (
    propertyId: number,
    to: string,
    transferValue: number
  ) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    try {
      // Encrypt the transfer value
      const encryptedTransferValue = await encryptPropertyValue(transferValue);
      const inputProof = await generateEncryptionProof(encryptedTransferValue);

      // Call the smart contract
      const result = await writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'transferProperty',
        args: [
          propertyId,
          to,
          encryptedTransferValue,
          inputProof
        ]
      });

      return result;
    } catch (err) {
      console.error('Error transferring property:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPropertyInfo = (propertyId: number) => {
    return useReadContract({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: CONTRACT_ABI,
      functionName: 'getPropertyInfo',
      args: [propertyId]
    });
  };

  return {
    registerProperty,
    transferProperty,
    getPropertyInfo,
    isLoading,
    isPending,
    error,
    isConnected,
    address
  };
};