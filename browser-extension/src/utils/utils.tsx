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
 * Formats a Unix timestamp into a date string in DD-MM-YYYY format.
 * @author Diego Da Giau
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Formatted date string in DD-MM-YYYY format, or "N/D" string if timestamp is 0
 */
export function formatDate(timestamp: number): string {
    // Return empty string for invalid/empty dates
    if (timestamp === 0) {
        return "N/D";
    }

    // Convert Unix timestamp to milliseconds and create Date
    const date = new Date(timestamp);

    // Format date using British locale
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}
