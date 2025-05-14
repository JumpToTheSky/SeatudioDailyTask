"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
class Tag {
    constructor(id, name, createdAt) {
        this.id = id;
        this.name = name;
        this.createdAt = createdAt || Date.now();
    }
    static fromPlainObject(obj) {
        return new Tag(obj.id, obj.name, obj.createdAt);
    }
    toPlainObject() {
        return {
            id: this.id,
            name: this.name,
            createdAt: this.createdAt,
        };
    }
}
exports.Tag = Tag;
