import * as fs from 'fs';
import * as path from 'path';

const tasksFilePath = path.join(__dirname, '..', '..', 'tasks.json');

export function loadTasksFromFile(): any[] {
    try {
        if (!fs.existsSync(tasksFilePath)) {
            console.warn(`Warning: Tasks file not found at ${tasksFilePath}. Returning empty array.`);
            return [];
        }
        const data = fs.readFileSync(tasksFilePath, 'utf-8');
        const plainTasks = JSON.parse(data);
        return plainTasks;
    } catch (error) {
        console.error("Error loading tasks from file:", error);
        return [];
    }
}

export function saveTasksToFile(tasks: any[]): void {
    try {
        const data = JSON.stringify(tasks, null, 2);
        fs.writeFileSync(tasksFilePath, data, 'utf-8');
    } catch (error) {
        console.error("Error saving tasks to file:", error);
    }
}
