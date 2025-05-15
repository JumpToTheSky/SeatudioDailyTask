"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const dataStorage_1 = require("./dataStorage");
const Task_1 = require("../model/Task");
const Tag_1 = require("../model/Tag");
class TaskManager {
    static addTask(title, priority = 'medium', description, dueDate, tagIds, parentId) {
        const tags = dataStorage_1.DataStorage.modifyTags([], (tags) => tags); // Load tags
        const validTagIds = (tagIds === null || tagIds === void 0 ? void 0 : tagIds.filter(tagId => tags.some(tag => tag.id === tagId))) || [];
        const newTask = new Task_1.Task(dataStorage_1.DataStorage.modifyTasks([], (tasks) => tasks.length + 1), title, priority, description, dueDate, Task_1.TaskStatus.ToDo, undefined, parentId, validTagIds);
        dataStorage_1.DataStorage.modifyTasks([], (tasks) => {
            tasks.push(newTask.toPlainObject());
            return tasks;
        });
        return newTask;
    }
    static updateTask(id, updates) {
        return dataStorage_1.DataStorage.modifyTasks([], (tasks) => {
            const taskIndex = tasks.findIndex(task => task.id === id);
            if (taskIndex === -1)
                return null;
            const task = Task_1.Task.fromPlainObject(tasks[taskIndex]);
            if (updates.title !== undefined)
                task.title = updates.title;
            if (updates.description !== undefined)
                task.description = updates.description;
            if (updates.priority !== undefined)
                task.priority = updates.priority;
            if (updates.status !== undefined)
                task.updateTaskStatus(updates.status);
            if (updates.dueDate !== undefined)
                task.dueDate = updates.dueDate;
            if (updates.tagIds !== undefined)
                task.tagIds = updates.tagIds;
            tasks[taskIndex] = task.toPlainObject();
            return task;
        });
    }
    static deleteTask(id) {
        return dataStorage_1.DataStorage.modifyTasks([], (tasks) => {
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
    static listTasks() {
        return dataStorage_1.DataStorage.modifyTasks([], (tasks) => {
            return tasks.map(Task_1.Task.fromPlainObject);
        });
    }
    static listTags() {
        return dataStorage_1.DataStorage.modifyTags([], (tags) => {
            return tags.map(Tag_1.Tag.fromPlainObject);
        });
    }
    static addTag(name) {
        const newTag = new Tag_1.Tag(dataStorage_1.DataStorage.modifyTags([], (tags) => tags.length + 1), name);
        dataStorage_1.DataStorage.modifyTags([], (tags) => {
            tags.push(newTag.toPlainObject());
            return tags;
        });
        return newTag;
    }
    static deleteTag(id) {
        return dataStorage_1.DataStorage.modifyTags([], (tags) => {
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
exports.TaskManager = TaskManager;
