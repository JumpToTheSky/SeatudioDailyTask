import { DataStorage } from './dataStorage';
import { Task, TaskStatus, Priority } from '../model/Task';
import { Tag } from '../model/Tag';

export class TaskManager {
    static addTask(
        title: string,
        priority: Priority = 'medium',
        description?: string,
        dueDate?: string,
        tagIds?: number[],
        parentId?: number
    ): Task {
        const tags = DataStorage.modifyTags([], (tags) => tags); // Load tags
        const validTagIds = tagIds?.filter(tagId => tags.some(tag => tag.id === tagId)) || [];
        const newTask = new Task(
            DataStorage.modifyTasks([], (tasks) => tasks.length + 1),
            title,
            priority,
            description,
            dueDate,
            TaskStatus.ToDo,
            undefined,
            parentId,
            validTagIds
        );
        DataStorage.modifyTasks([], (tasks) => {
            tasks.push(newTask.toPlainObject());
            return tasks;
        });
        return newTask;
    }

    static updateTask(
        id: number,
        updates: { 
            title?: string; 
            description?: string; 
            priority?: Priority; 
            status?: TaskStatus; 
            dueDate?: string; 
            tagIds?: number[] 
        }
    ): Task | null {
        return DataStorage.modifyTasks<Task | null>([], (tasks) => {
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex === -1) return null;

            const task = Task.fromPlainObject(tasks[taskIndex]);
            if (updates.title !== undefined) task.title = updates.title;
            if (updates.description !== undefined) task.description = updates.description;
            if (updates.priority !== undefined) task.priority = updates.priority;
            if (updates.status !== undefined) task.updateTaskStatus(updates.status);
            if (updates.dueDate !== undefined) task.dueDate = updates.dueDate;
            if (updates.tagIds !== undefined) task.tagIds = updates.tagIds;

            tasks[taskIndex] = task.toPlainObject();
            return task;
        });
    }

    static deleteTask(id: number): boolean {
        return DataStorage.modifyTasks<boolean>([], (tasks) => {
            const initialLength = tasks.length;
            const filteredTasks = tasks.filter(task => task.id !== id);
            if (filteredTasks.length !== initialLength) {
                tasks.length = 0;
                tasks.push(...filteredTasks);
                return true;
            }
            return false;
        });
    }

    static listTasks(): Task[] {
        return DataStorage.modifyTasks([], (tasks) => {
            return tasks.map(Task.fromPlainObject);
        });
    }

    static listTags(): Tag[] {
        return DataStorage.modifyTags([], (tags) => {
            return tags.map(Tag.fromPlainObject);
        });
    }

    static addTag(name: string): Tag {
        const newTag = new Tag(
            DataStorage.modifyTags([], (tags) => tags.length + 1),
            name
        );
        DataStorage.modifyTags([], (tags) => {
            tags.push(newTag.toPlainObject());
            return tags;
        });
        return newTag;
    }

    static deleteTag(id: number): boolean {
        return DataStorage.modifyTags<boolean>([], (tags) => {
            const initialLength = tags.length;
            const filteredTags = tags.filter(tag => tag.id !== id);
            if (filteredTags.length !== initialLength) {
                tags.length = 0;
                tags.push(...filteredTags);
                return true;
            }
            return false;
        });
    }
}
