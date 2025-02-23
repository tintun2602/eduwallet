/**
 * University class represents a university in the system.
 * @author Diego Da Giau
 */
export default class UniversityModel {
    /**
     * Constructs a new UniversityModel instance.
     * @param {number} id - The university's ID.
     * @param {string} name - The university's name.
     * @param {string} shortName - The university's short name.
     */
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly shortName: string
    ) { }
}
