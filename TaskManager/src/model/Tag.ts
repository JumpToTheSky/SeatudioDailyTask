

export class Tag {
    public id: number;

    public name: string;

    public createdAt: number;

    constructor(id: number, name: string, createdAt?: number) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt || Date.now();
    }

    static fromPlainObject(obj: any): Tag {
        return new Tag(obj.id, obj.name, obj.createdAt);
    }

    toPlainObject(): { id: number; name: string; createdAt: number } {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
        };
    }
}
