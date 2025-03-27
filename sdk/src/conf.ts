import { S3Client, S3ClientConfig } from "@aws-sdk/client-s3";
import * as dotenv from 'dotenv'
import { ethers } from "ethers";

/**
 * Load environment variables from .env file.
 * This allows configuration to be customized per environment without code changes.
 */
dotenv.config();

/**
 * Configuration for blockchain network connections.
 * Defines parameters needed to connect to Ethereum networks.
 */
interface BlockchainNetworkConfig {
    /** JSON-RPC endpoint URL for the Ethereum network. */
    readonly url: string;
    /** Smart contract address for the StudentsRegister contract. */
    readonly registerAddress: string;
}

/**
 * Configuration for IPFS storage via S3-compatible service.
 * Defines parameters needed to store and retrieve certificates.
 */
interface IpfsStorageConfig {
    /** Gateway URL for retrieving IPFS content */
    gatewayUrl: string;
    /** AWS S3 client configuration. */
    s3Config: S3ClientConfig;
    /** S3 bucket name where certificates will be stored. */
    bucketName: string;
}

/**
 * Blockchain network configuration.
 * Uses environment variables when available, falls back to development defaults.
 */
export const blockchainConfig: BlockchainNetworkConfig = {
    /** Network endpoint - configure via NETWORK_URL env var. */
    url: process.env.NETWORK_URL || "http://127.0.0.1:8545",
    /** StudentsRegister contract address - configure via REGISTER_ADDRESS env var. */
    registerAddress: process.env.REGISTER_ADDRESS || "0xF2E246BB76DF876Cef8b38ae84130F4F55De395b",
}

/**
 * IPFS storage configuration via S3-compatible service.
 * Uses environment variables when available, falls back to development defaults.
 */
export const ipfsConfig: IpfsStorageConfig = {
    /** IPFS gateway url - configure via IPFS_GATEWAY env var. */
    gatewayUrl: process.env.IPFS_GATEWAY || "https://ipfs.io/ipfs/",
    /** S3 bucket name - configure via S3_BUCKET env var. */
    bucketName: process.env.S3_BUCKET || "eduwallet",
    /** S3 client configuration object. */
    s3Config: {
        /** S3 API version. */
        apiVersion: "2006-03-01",
        /** Authentication credentials. */
        credentials: {
            /** Access key ID - configure via S3_ACCESS_KEY env var. */
            accessKeyId: process.env.S3_ACCESS_KEY || "0419FE4769472C04145F",
            /** Secret access key - configure via S3_SECRET_KEY env var. */
            secretAccessKey: process.env.S3_SECRET_KEY || "Q5ZMwqobNDwz0u8MTb7diw1ql2uo8JqL8EzYjbO1",
        },
        /** S3 endpoint URL - configure via S3_ENDPOINT env var. */
        endpoint: process.env.S3_ENDPOINT || "https://s3.filebase.com",
        /** AWS region - configure via S3_REGION env var. */
        region: process.env.S3_REGION || "us-east-1",
        /** Use path-style addressing. */
        forcePathStyle: true
    }
}

/**
 * Ethereum JSON-RPC provider instance.
 * Pre-configured with the URL from blockchain configuration.
 */
export const provider = new ethers.JsonRpcProvider(blockchainConfig.url);

/**
 * S3 client for IPFS storage.
 * Pre-configured with the settings from IPFS configuration.
 */
export const s3Client = new S3Client(ipfsConfig.s3Config);