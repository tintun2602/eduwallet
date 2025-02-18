export class User {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _surname: string;
    private readonly _birthDate: string;
    private readonly _birthPlace: string;
    private readonly _country: string;
    private _results: Result[] = [];

    constructor(id: number, name: string, surname: string, birthDate: string, birthPlace: string, country: string) {
        this._id = id;
        this._name = name;
        this._surname = surname;
        this._birthDate = birthDate;
        this._birthPlace = birthPlace;
        this._country = country;
    }

    getId(): number {
        return this._id;
    }

    getName(): string {
        return this._name;
    }

    getSurname(): string {
        return this._surname;
    }

    getBirthDate(): string {
        return this._birthDate;
    }

    getBirthPlace(): string {
        return this._birthPlace;
    }

    getCountry(): string {
        return this._country;
    }

    getResults(): Result[] {
        return this._results;
    }

    getResultsByUniversityGroupedByCourseDegree(universityId: number): { [key: string]: Result[] } {
        return this.getResultsByUniversity(universityId).reduce((acc, result) => {
            if (!acc[result.degreeCourse]) {
                acc[result.degreeCourse] = [];
            }
            acc[result.degreeCourse].push(result);
            return acc;
        }, {} as { [key: string]: Result[] });
    }

    getResultsByUniversity(universityId: number): Result[] {
        return this._results.filter(result => result.university === universityId);
    }

    setResults(results: any[]) {
        results.forEach(r => this._results.push(
            {
                name: r.name,
                code: r.code,
                university: r.university,
                degreeCourse: r.degreeCourse,
                grade: r.grade,
                date: r.date,
                ects: r.ects,
            }
        ));
    }

    toObject() {
        return (
            {
                id: this._id,
                name: this._name,
                surname: this._surname,
                birthDate: this._birthDate,
                birthPlace: this._birthPlace,
                country: this._country,
            }
        );
    }
}

export interface Result {
    readonly name: string;
    readonly code: string;
    readonly university: number;
    readonly degreeCourse: string;
    readonly grade: string;
    readonly date: string;
    readonly ects: number;
}
