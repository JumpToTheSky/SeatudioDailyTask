import * as fs from 'fs'; // Module 'fs' của Node.js để làm việc với file system
import * as path from 'path'; // Module 'path' để làm việc với đường dẫn file
import { Task, Priority } from './types';

const tasksFilePath = path.join(__dirname, 'tasks.json'); 
export class TaskManager {
    private tasks: Task[] = []; 
    private nextId: number = 1;
    
    constructor() {
        this.loadTasks();
        this.nextId = this.calculateNextId(); 
    }

    private calculateNextId(): number {
        if (this.tasks.length === 0) {
            return 1; 
        }
        return Math.max(...this.tasks.map(task => task.id)) + 1; 
    }
    private loadTasks(): Task[]

} 
