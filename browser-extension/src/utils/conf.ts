import { id, JsonRpcProvider } from "ethers";

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
 * Configuration for IPFS storage.
 * Defines parameters needed to retrieve certificates.
 */
interface IpfsStorageConfig {
  /** Gateway URL for retrieving IPFS content */
  gatewayUrl: string;
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
 * @author Diego Da Giau
 * @co-author Tin Tun Naing
 */
export const blockchainConfig: BlockchainNetworkConfig = {
  /** Network endpoint. */
  url: "http://127.0.0.1:8545",
  /** StudentsRegister contract address. */
  registerAddress: "0xB9816fC57977D5A786E654c7CF76767be63b966e",
};

/**
 * IPFS storage configuration.
 */
export const ipfsConfig: IpfsStorageConfig = {
  /** IPFS gateway url. */
  gatewayUrl: "https://ipfs.io/ipfs/",
};

/**
 * Ethereum JSON-RPC provider instance.
 * Pre-configured with the URL from blockchain configuration.
 */
export const provider = new JsonRpcProvider(blockchainConfig.url);

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

/**
 * Debug mode flag. When true, logs errors to the console.
 * Set to false in production to minimize console output.
 */
export const DEBUG = true;

/**
 * Conditionally logs errors to the console based on the DEBUG flag.
 * @param message - The error message
 * @param error - The actual error object
 */
export function logError(message: string, error: any): void {
  if (DEBUG) {
    console.error(message, error);
  }
}
