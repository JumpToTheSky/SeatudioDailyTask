"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.TaskStatus = void 0;
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["ToDo"] = "todo";
    TaskStatus["InProgress"] = "in-progress";
    TaskStatus["Done"] = "done";
    TaskStatus["Cancelled"] = "cancelled";
})(TaskStatus || (exports.TaskStatus = TaskStatus = {}));
class Task {
    constructor(id, title, priority = 'medium', description, dueDate, status = TaskStatus.ToDo, createdAt, parentId, tagIds) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt || Date.now();
        this.dueDate = dueDate;
        this.parentId = parentId;
        this.tagIds = tagIds;
    }
    updateTaskStatus(newStatus) {
        this.status = newStatus;
        return true;
    }
    updateDetails(details) {
        if (details.title !== undefined)
            this.title = details.title;
        if (details.description !== undefined)
            this.description = details.description;
        if (details.priority !== undefined)
            this.priority = details.priority;
        if (details.dueDate !== undefined)
            this.dueDate = details.dueDate;
        if (details.parentId !== undefined) {
            this.parentId = details.parentId === null ? undefined : details.parentId;
        }
        if (details.status !== undefined)
            this.status = details.status;
        if (details.tagIds !== undefined)
            this.tagIds = details.tagIds;
        return true;
    }
    toPlainObject() {
        const plainObject = {
            id: this.id,
            title: this.title,
            description: this.description,
            priority: this.priority,
            status: this.status,
            createdAt: this.createdAt,
            dueDate: this.dueDate,
            parentId: this.parentId,
        };
        if (this.tagIds && this.tagIds.length > 0) {
            plainObject.tagIds = this.tagIds;
        }
        return plainObject;
    }
    static fromPlainObject(obj) {
        let status = TaskStatus.ToDo;
        if (obj.status) {
            status = obj.status;
        }
        else if (obj.completed !== undefined) {
            status = obj.completed ? TaskStatus.Done : TaskStatus.ToDo;
        }
        const task = new Task(obj.id, obj.title, obj.priority, obj.description, obj.dueDate, status, obj.createdAt, obj.parentId, obj.tagIds);
        return task;
    }
}
exports.Task = Task;
