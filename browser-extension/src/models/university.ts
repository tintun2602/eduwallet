/**
 * University class represents a university in the system.
 * @author Diego Da Giau
 */
export default class UniversityModel {
    /**
     * Constructs a new UniversityModel instance.
     * @param {string} name - The full name of the university
     * @param {string} country - The country code (ISO 3166-1 alpha-2)
     * @param {string} shortName - The university's official abbreviation
     * @param {string} universityAddress - The university's blockchain address
     * @param {string} universityWalletAddress - The university's wallet address
     */
    constructor(
        public readonly name: string,
        public readonly country: string,
        public readonly shortName: string,
        public readonly universityAddress: string,
        public readonly universityWalletAddress: string,
    ) {
    }
}
