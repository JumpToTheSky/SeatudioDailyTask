import { loadTasksFromFile, saveTasksToFile } from './dataStorage';
import { Task, TaskStatus, Priority } from '../model/Task';

export function listTasks(): Task[] {
    const tasks = loadTasksFromFile();
    return tasks.map(Task.fromPlainObject);
}

export function addTask(title: string, priority: Priority = 'medium'): Task {
    const tasks = loadTasksFromFile();
    const newTask = new Task(
        tasks.length + 1,
        title,
        priority
    );
    tasks.push(newTask.toPlainObject());
    saveTasksToFile(tasks);
    return newTask;
}

export function updateTask(
    id: number,
    updates: { title?: string; status?: TaskStatus }
): Task | null {
    const tasks = loadTasksFromFile();
    const taskIndex = tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) return null;

    const task = Task.fromPlainObject(tasks[taskIndex]);
    if (updates.title !== undefined) task.title = updates.title;
    if (updates.status !== undefined) task.updateTaskStatus(updates.status);

    tasks[taskIndex] = task.toPlainObject();
    saveTasksToFile(tasks);
    return task;
}

export function deleteTask(id: number): boolean {
    let tasks = loadTasksFromFile();
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);
    if (tasks.length === initialLength) return false;

    saveTasksToFile(tasks);
    return true;
}
