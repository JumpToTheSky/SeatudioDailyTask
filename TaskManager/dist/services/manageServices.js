"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
const dataStorage_1 = require("./dataStorage");
const Task_1 = require("../model/Task");
const Tag_1 = require("../model/Tag");
const dataStorage_2 = require("./dataStorage");
class TaskManager {
    static addTask(title, priority = 'medium') {
        const tasks = (0, dataStorage_1.loadTasksFromFile)();
        const newTask = new Task_1.Task(tasks.length + 1, title, priority);
        tasks.push(newTask.toPlainObject());
        (0, dataStorage_1.saveTasksToFile)(tasks);
        return newTask;
    }
    static updateTask(id, updates) {
        const tasks = (0, dataStorage_1.loadTasksFromFile)();
        const taskIndex = tasks.findIndex(task => task.id === id);
        if (taskIndex === -1)
            return null;
        const task = Task_1.Task.fromPlainObject(tasks[taskIndex]);
        if (updates.title !== undefined)
            task.title = updates.title;
        if (updates.status !== undefined)
            task.updateTaskStatus(updates.status);
        tasks[taskIndex] = task.toPlainObject();
        (0, dataStorage_1.saveTasksToFile)(tasks);
        return task;
    }
    static deleteTask(id) {
        let tasks = (0, dataStorage_1.loadTasksFromFile)();
        const initialLength = tasks.length;
        tasks = tasks.filter(task => task.id !== id);
        if (tasks.length === initialLength)
            return false;
        (0, dataStorage_1.saveTasksToFile)(tasks);
        return true;
    }
    static listTasks() {
        const tasks = (0, dataStorage_1.loadTasksFromFile)();
        return tasks.map(Task_1.Task.fromPlainObject);
    }
    static listTags() {
        const tags = (0, dataStorage_2.loadTagsFromFile)();
        return tags.map(Tag_1.Tag.fromPlainObject);
    }
    static addTag(name) {
        const tags = (0, dataStorage_2.loadTagsFromFile)();
        const newTag = new Tag_1.Tag(tags.length + 1, name);
        tags.push(newTag.toPlainObject());
        (0, dataStorage_2.saveTagsToFile)(tags);
        return newTag;
    }
    static deleteTag(id) {
        let tags = (0, dataStorage_2.loadTagsFromFile)();
        const initialLength = tags.length;
        tags = tags.filter(tag => tag.id !== id);
        if (tags.length === initialLength)
            return false;
        (0, dataStorage_2.saveTagsToFile)(tags);
        return true;
    }
}
exports.TaskManager = TaskManager;
