import { JsonRpcProvider, id } from "ethers";

// Environment variables are handled directly without dotenv to avoid Node.js module issues
// In browser environments, these will use default values

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
  /** S3 bucket name where certificates will be stored. */
  bucketName: string;
  /** S3 client configuration object. */
  s3Config: {
    /** S3 API version. */
    apiVersion: string;
    /** Authentication credentials. */
    credentials: {
      /** Access key ID - configure via S3_ACCESS_KEY env var. */
      accessKeyId: string;
      /** Secret access key - configure via S3_SECRET_KEY env var. */
      secretAccessKey: string;
    };
    /** S3 endpoint URL - configure via S3_ENDPOINT env var. */
    endpoint: string;
    /** AWS region - configure via S3_REGION env var. */
    region: string;
    /** Use path-style addressing. */
    forcePathStyle: boolean;
  };
}

/**
 * Configuration for role identifiers in the access control system.
 * Defines the string identifiers for different permission levels.
 */
interface RoleCodes {
  /** Role identifier for users requesting read access */
  readRequest: string;
  /** Role identifier for users requesting write access */
  writeRequest: string;
  /** Role identifier for users with approved read access */
  read: string;
  /** Role identifier for users with approved write access */
  write: string;
}

/**
 * Blockchain network configuration.
 * Uses environment variables when available, falls back to development defaults.
 * @author Diego Da Giau
 * @co-author Tin Tun Naing
 */
export const blockchainConfig: BlockchainNetworkConfig = {
  /** Network endpoint - configure via NETWORK_URL env var. */
  url:
    (typeof process !== "undefined" && process.env?.NETWORK_URL) ||
    "http://127.0.0.1:8545",
  /** StudentsRegister contract address - configure via REGISTER_ADDRESS env var. */
  registerAddress:
    (typeof process !== "undefined" && process.env?.REGISTER_ADDRESS) ||
    "0xB9816fC57977D5A786E654c7CF76767be63b966e",
};

/**
 * IPFS storage configuration via S3-compatible service.
 * Uses environment variables when available, falls back to development defaults.
 */
export const ipfsConfig: IpfsStorageConfig = {
  /** IPFS gateway url - configure via IPFS_GATEWAY env var. */
  gatewayUrl:
    (typeof process !== "undefined" && process.env?.IPFS_GATEWAY) ||
    "https://ipfs.io/ipfs/",
  /** S3 bucket name - configure via S3_BUCKET env var. */
  bucketName:
    (typeof process !== "undefined" && process.env?.S3_BUCKET) || "eduwallet",
  /** S3 client configuration object. */
  s3Config: {
    /** S3 API version. */
    apiVersion: "2006-03-01",
    /** Authentication credentials. */
    credentials: {
      /** Access key ID - configure via S3_ACCESS_KEY env var. */
      accessKeyId:
        (typeof process !== "undefined" && process.env?.S3_ACCESS_KEY) ||
        "0419FE4769472C04145F",
      /** Secret access key - configure via S3_SECRET_KEY env var. */
      secretAccessKey:
        (typeof process !== "undefined" && process.env?.S3_SECRET_KEY) ||
        "Q5ZMwqobNDwz0u8MTb7diw1ql2uo8JqL8EzYjbO1",
    },
    /** S3 endpoint URL - configure via S3_ENDPOINT env var. */
    endpoint:
      (typeof process !== "undefined" && process.env?.S3_ENDPOINT) ||
      "https://s3.filebase.com",
    /** AWS region - configure via S3_REGION env var. */
    region:
      (typeof process !== "undefined" && process.env?.S3_REGION) || "us-east-1",
    /** Use path-style addressing. */
    forcePathStyle: true,
  },
};

/**
 * Ethereum JSON-RPC provider instance.
 * Pre-configured with the URL from blockchain configuration.
 */
export const provider = new JsonRpcProvider(blockchainConfig.url);

/**
 * S3 client for IPFS storage.
 * Pre-configured with the settings from IPFS configuration.
 * Note: This will be null in browser environments.
 */
export const s3Client = null; // Will be initialized dynamically in Node.js environments

/**
 * Role identifiers used for access control.
 * Uses Ethereum's id() function to generate role identifiers from string constants.
 */
export const roleCodes: RoleCodes = {
  /** Role identifier for read access requesters */
  readRequest: id("READER_APPLICANT"),
  /** Role identifier for write access requesters */
  writeRequest: id("WRITER_APPLICANT"),
  /** Role identifier for approved readers */
  read: id("READER_ROLE"),
  /** Role identifier for approved writers */
  write: id("WRITER_ROLE"),
};
