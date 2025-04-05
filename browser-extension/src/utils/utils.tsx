import { logError } from './conf';

/**
 * Derives a 256-bit private key from a password using PBKDF2.
 * @param {string} password - The student's password (random string).
 * @param {string} studentId - The student's unique ID string.
 * @returns {string} A private key formatted as a hex string with '0x' prefix.
 * @throws {Error} If key derivation fails or input parameters are invalid
 */
export async function derivePrivateKey(password: string, studentId: string): Promise<string> {
    try {
        if (!password || typeof password !== 'string') {
            throw new Error('Invalid password: must be a non-empty string');
        }
        
        if (!studentId || typeof studentId !== 'string') {
            throw new Error('Invalid student ID: must be a non-empty string');
        }
        
        const encoder = new TextEncoder();
        const salt = encoder.encode(`${studentId}`);
        const iterations = 100000;
        const keyLength = 256; // bits

        // Import password as a key
        let baseKey;
        try {
            baseKey = await window.crypto.subtle.importKey(
                'raw',
                encoder.encode(password),
                'PBKDF2',
                false,
                ['deriveBits']
            );
        } catch (importError) {
            logError('Failed to import password as key:', importError);
            throw new Error('Could not process password for key derivation');
        }

        // Derive key using PBKDF2
        let derivedBits;
        try {
            derivedBits = await window.crypto.subtle.deriveBits(
                {
                    name: 'PBKDF2',
                    salt,
                    iterations,
                    hash: 'SHA-256',
                },
                baseKey,
                keyLength
            );
        } catch (derivationError) {
            logError('Failed to derive key bits:', derivationError);
            throw new Error('Could not derive cryptographic key from password');
        }

        // Convert to hex string
        const keyBytes = new Uint8Array(derivedBits);
        const keyHex = Array.from(keyBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        return '0x' + keyHex;
    } catch (error) {
        logError('Key derivation failed:', error);
        throw new Error('Failed to generate private key from credentials');
    }
}

/**
 * Formats a camel case string by adding spaces between words and capitalizing the first letter.
 * @author Diego Da Giau
 * @param {string} str - The camel case string to format.
 * @returns {string} The formatted string.
 * @throws {Error} If input string is invalid
 */
export function formatCamelCaseString(str: string): string {
    try {
        if (!str || typeof str !== 'string') {
            throw new Error('Invalid input: expected a non-empty string');
        }
        
        const spacedString = str.replace(/([A-Z])/g, ' $1').toLowerCase();
        const formattedString = spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
        return formattedString;
    } catch (error) {
        logError('Failed to format camel case string:', error);
        // Return a fallback value instead of throwing since this is a UI formatting function
        return str || '';
    }
}

/**
 * Formats a Unix timestamp into a human-readable local date string.
 * Converts the blockchain timestamp (in seconds) to milliseconds before formatting.
 * @author Diego Da Giau
 * @param {bigint} timestamp - The Unix timestamp in seconds (as a bigint).
 * @returns {string} A localized date string representation of the timestamp.
 * @throws {Error} If timestamp conversion fails
 */
export function formatDate(timestamp: bigint): string {
    try {
        if (timestamp === undefined || timestamp === null) {
            throw new Error('Invalid timestamp: value is undefined or null');
        }
        
        // Safely convert bigint to number (may lose precision for very large timestamps)
        const timestampNumber = Number(timestamp);
        
        if (isNaN(timestampNumber)) {
            throw new Error('Invalid timestamp: could not convert to number');
        }
        
        if (timestampNumber < 0) {
            throw new Error('Invalid timestamp: negative value');
        }
        
        // Convert seconds to milliseconds and create Date object
        const date = new Date(timestampNumber * 1000);
        
        // Check if date is valid
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date created from timestamp');
        }
        
        return date.toLocaleDateString();
    } catch (error) {
        logError('Date formatting failed:', error);
        // Return a fallback value instead of throwing since this is a UI formatting function
        return 'Invalid date';
    }
}