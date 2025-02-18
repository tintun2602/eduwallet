export default class University {
    private readonly _id: number;
    private readonly _name: string;
    private readonly _shortName: string;

    constructor(id: number, name: string, shortName: string) {
        this._id = id;
        this._name = name;
        this._shortName = shortName;
    }

    public getId(): number {
        return this._id;
    }

    public getName(): string {
        return this._name;
    }

    public getShortName(): string {
        return this._shortName;
    }
}