import * as fs from 'fs';
import * as path from 'path';

const tasksFilePath = path.join(__dirname, '..', '..', 'tasks.json');
const tagsFilePath = path.join(__dirname, '..', '..', 'tag.json');

function autoSaveLoad(filePath: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args: any[]) {
            const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];
            const result = originalMethod.apply(this, [data, ...args]);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
            return result;
        };
        return descriptor;
    };
}

export class DataStorage {
    @autoSaveLoad(tasksFilePath)
    static modifyTasks<T>(data: any[], callback: (tasks: any[]) => T): T {
        return callback(data);
    }

    @autoSaveLoad(tagsFilePath)
    static modifyTags<T>(data: any[], callback: (tags: any[]) => T): T {
        return callback(data);
    }
}
