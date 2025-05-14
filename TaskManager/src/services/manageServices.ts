import { loadTasksFromFile, saveTasksToFile } from './dataStorage';
import { Task, TaskStatus, Priority } from '../model/Task';
import { Tag } from '../model/Tag';
import { loadTagsFromFile, saveTagsToFile } from './dataStorage';

export class TaskManager {
    static addTask(
        title: string,
        priority: Priority = 'medium',
        description?: string,
        dueDate?: string,
        tagIds?: number[]
    ): Task {
        const tasks = loadTasksFromFile();
        const tags = loadTagsFromFile();

        // Validate tag IDs
        const validTagIds = tagIds?.filter(tagId => tags.some(tag => tag.id === tagId)) || [];

        const newTask = new Task(
            tasks.length + 1,
            title,
            priority,
            description,
            dueDate,
            TaskStatus.ToDo,
            undefined,
            undefined,
            validTagIds
        );
        tasks.push(newTask.toPlainObject());
        saveTasksToFile(tasks);
        return newTask;
    }

    static updateTask(
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

    static deleteTask(id: number): boolean {
        let tasks = loadTasksFromFile();
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.id !== id);
        if (tasks.length === initialLength) return false;

        saveTasksToFile(tasks);
        return true;
    }

    static listTasks(): Task[] {
        const tasks = loadTasksFromFile();
        return tasks.map(Task.fromPlainObject);
    }

    static listTags(): Tag[] {
        const tags = loadTagsFromFile();
        return tags.map(Tag.fromPlainObject);
    }

    static addTag(name: string): Tag {
        const tags = loadTagsFromFile();
        const newTag = new Tag(tags.length + 1, name);
        tags.push(newTag.toPlainObject());
        saveTagsToFile(tags);
        return newTag;
    }

    static deleteTag(id: number): boolean {
        let tags = loadTagsFromFile();
        const initialLength = tags.length;
        tags = tags.filter(tag => tag.id !== id);
        if (tags.length === initialLength) return false;

        saveTagsToFile(tags);
        return true;
    }
}
