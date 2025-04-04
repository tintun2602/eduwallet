/**
 * Derives a 256-bit private key from a password using PBKDF2.
 * @param {string} password - The student's password (random string).
 * @param {string} studentId - The student's unique ID string.
 * @returns {string} A private key formatted as a hex string with '0x' prefix.
 */
export async function derivePrivateKey(password: string, studentId: string): Promise<string> {
    const encoder = new TextEncoder();
    const salt = encoder.encode(`${studentId}`);
    const iterations = 100000;
    const keyLength = 256; // bits

    // Import password as a key
    const baseKey = await window.crypto.subtle.importKey(
        'raw',
        encoder.encode(password),
        'PBKDF2',
        false,
        ['deriveBits']
    );

    // Derive key using PBKDF2
    const derivedBits = await window.crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt,
            iterations,
            hash: 'SHA-256',
        },
        baseKey,
        keyLength
    );

    // Convert to hex string
    const keyBytes = new Uint8Array(derivedBits);
    const keyHex = Array.from(keyBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return '0x' + keyHex;
}

/**
 * Formats a camel case string by adding spaces between words and capitalizing the first letter.
 * @author Diego Da Giau
 * @param {string} str - The camel case string to format.
 * @returns {string} The formatted string.
 */
export function formatCamelCaseString(str: string): string {
    const spacedString = str.replace(/([A-Z])/g, ' $1').toLowerCase();
    const formattedString = spacedString.charAt(0).toUpperCase() + spacedString.slice(1);
    return formattedString;
}


/**
 * Formats a Unix timestamp into a human-readable local date string.
 * Converts the blockchain timestamp (in seconds) to milliseconds before formatting.
 * @author Diego Da Giau
 * @param {bigint} timestamp - The Unix timestamp in seconds (as a bigint).
 * @returns {string} A localized date string representation of the timestamp.
 */
export function formatDate(timestamp: bigint): string {
    return new Date(Number(timestamp) * 1000).toLocaleDateString();
}
