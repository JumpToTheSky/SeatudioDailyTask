"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const manageServices_1 = require("./services/manageServices");
const Task_1 = require("./model/Task");
const cli_table3_1 = __importDefault(require("cli-table3"));
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
class TaskCLI {
    static askQuestion(rl, question, callback) {
        rl.question(`${question} (type EXIT to cancel): `, (input) => {
            if (input.toUpperCase() === 'EXIT') {
                showMenu();
                return;
            }
            callback(input);
        });
    }
}
function showMenu() {
    console.log(`
    Task Manager CLI
    ----------------
    1. List all tasks
    2. Add a new task
    3. Create a subtask
    4. Update a task
    5. Delete a task
    6. Mark a task as completed
    7. Show completed tasks
    8. List all tags
    9. Add a new tag
    10. Delete a tag
    11. Assign tags to a task
    12. Exit
    `);
    rl.question('Choose an option: ', handleMenuSelection);
}
function handleMenuSelection(option) {
    switch (option) {
        case '1':
            listTasks();
            break;
        case '2':
            addTask();
            break;
        case '3':
            createSubtask();
            break;
        case '4':
            updateTask();
            break;
        case '5':
            deleteTask();
            break;
        case '6':
            markTaskAsCompleted();
            break;
        case '7':
            showCompletedTasks();
            break;
        case '8':
            listTags();
            break;
        case '9':
            addTag();
            break;
        case '10':
            deleteTag();
            break;
        case '11':
            assignTagsToTask();
            break;
        case '12':
            console.log('Exiting...');
            rl.close();
            break;
        default:
            console.log('Invalid option. Please try again.');
            showMenu();
    }
}
function listTasks() {
    const tasks = manageServices_1.TaskManager.listTasks();
    const table = new cli_table3_1.default({
        head: ['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'],
        colWidths: [5, 20, 10, 15, 15, 20]
    });
    tasks.forEach(task => {
        var _a;
        table.push([
            task.id,
            task.title || "",
            task.priority || "",
            task.status || "",
            task.dueDate || "",
            ((_a = task.tagIds) === null || _a === void 0 ? void 0 : _a.join(', ')) || ""
        ]);
    });
    console.log(table.toString());
    showMenu();
}
function addTask() {
    TaskCLI.askQuestion(rl, 'Enter task title', title => {
        TaskCLI.askQuestion(rl, 'Enter task priority (low, medium, high)', priority => {
            TaskCLI.askQuestion(rl, 'Enter task description (optional)', description => {
                TaskCLI.askQuestion(rl, 'Enter task due date (YYYY-MM-DD, optional)', dueDate => {
                    TaskCLI.askQuestion(rl, 'Enter tag IDs (comma-separated, optional)', tagIdsInput => {
                        const tagIds = tagIdsInput ? tagIdsInput.split(',').map(id => Number(id.trim())) : [];
                        const task = manageServices_1.TaskManager.addTask(title, priority, description, dueDate, tagIds);
                        console.log('Task added:', task);
                        showMenu();
                    });
                });
            });
        });
    });
}
function updateTask() {
    const tasks = manageServices_1.TaskManager.listTasks();
    if (tasks.length === 0) {
        console.log('No tasks available.');
        showMenu();
        return;
    }
    const taskTable = new cli_table3_1.default({
        head: ['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'],
        colWidths: [5, 20, 10, 15, 15, 20]
    });
    tasks.forEach(task => {
        var _a;
        taskTable.push([
            task.id,
            task.title || "",
            task.priority || "",
            task.status || "",
            task.dueDate || "",
            ((_a = task.tagIds) === null || _a === void 0 ? void 0 : _a.join(', ')) || ""
        ]);
    });
    console.log('Tasks:');
    console.log(taskTable.toString());
    TaskCLI.askQuestion(rl, 'Enter the ID of the task you want to update', taskIdInput => {
        const taskId = Number(taskIdInput);
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            console.log('Invalid task ID.');
            showMenu();
            return;
        }
        console.log(`
        Update Options:
        1. Title
        2. Description
        3. Priority
        4. Status
        5. Due Date
        6. Tags
        `);
        TaskCLI.askQuestion(rl, 'Choose the field to update', fieldOption => {
            switch (fieldOption) {
                case '1':
                    TaskCLI.askQuestion(rl, 'Enter new title', newTitle => {
                        manageServices_1.TaskManager.updateTask(taskId, { title: newTitle });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '2':
                    TaskCLI.askQuestion(rl, 'Enter new description', newDescription => {
                        manageServices_1.TaskManager.updateTask(taskId, { description: newDescription });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '3':
                    TaskCLI.askQuestion(rl, 'Enter new priority (low, medium, high)', newPriority => {
                        manageServices_1.TaskManager.updateTask(taskId, { priority: newPriority });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '4':
                    TaskCLI.askQuestion(rl, 'Enter new status (todo, in-progress, done, cancelled)', newStatus => {
                        manageServices_1.TaskManager.updateTask(taskId, { status: newStatus });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '5':
                    TaskCLI.askQuestion(rl, 'Enter new due date (YYYY-MM-DD)', newDueDate => {
                        manageServices_1.TaskManager.updateTask(taskId, { dueDate: newDueDate });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '6':
                    const tags = manageServices_1.TaskManager.listTags();
                    const tagTable = new cli_table3_1.default({
                        head: ['ID', 'Name'],
                        colWidths: [5, 20]
                    });
                    tags.forEach(tag => {
                        tagTable.push([tag.id, tag.name || ""]);
                    });
                    console.log('Tags:');
                    console.log(tagTable.toString());
                    TaskCLI.askQuestion(rl, 'Enter the IDs of the tags to assign (comma-separated)', tagIdsInput => {
                        const tagIds = tagIdsInput.split(',').map(id => Number(id.trim()));
                        manageServices_1.TaskManager.updateTask(taskId, { tagIds });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                default:
                    console.log('Invalid option.');
                    showMenu();
            }
        });
    });
}
function deleteTask() {
    TaskCLI.askQuestion(rl, 'Enter task ID to delete', id => {
        const success = manageServices_1.TaskManager.deleteTask(Number(id));
        console.log(success ? 'Task deleted.' : 'Task not found.');
        showMenu();
    });
}
function listTags() {
    const tags = manageServices_1.TaskManager.listTags();
    const table = new cli_table3_1.default({
        head: ['ID', 'Name', 'Created At'],
        colWidths: [5, 20, 20]
    });
    tags.forEach(tag => {
        table.push([
            tag.id,
            tag.name || "",
            tag.createdAt ? new Date(tag.createdAt).toLocaleString() : ""
        ]);
    });
    console.log(table.toString());
    showMenu();
}
function addTag() {
    TaskCLI.askQuestion(rl, 'Enter tag name', name => {
        const tag = manageServices_1.TaskManager.addTag(name);
        console.log('Tag added:', tag);
        showMenu();
    });
}
function deleteTag() {
    TaskCLI.askQuestion(rl, 'Enter tag ID to delete', id => {
        const success = manageServices_1.TaskManager.deleteTag(Number(id));
        console.log(success ? 'Tag deleted.' : 'Tag not found.');
        showMenu();
    });
}
function markTaskAsCompleted() {
    TaskCLI.askQuestion(rl, 'Enter task ID to mark as completed', id => {
        const task = manageServices_1.TaskManager.updateTask(Number(id), { status: Task_1.TaskStatus.Done });
        if (task) {
            console.log('Task marked as completed:', task);
        }
        else {
            console.log('Task not found.');
        }
        showMenu();
    });
}
function showCompletedTasks() {
    const tasks = manageServices_1.TaskManager.listTasks().filter(task => task.status === Task_1.TaskStatus.Done);
    const table = new cli_table3_1.default({
        head: ['ID', 'Title', 'Priority', 'Due Date', 'Tags'],
        colWidths: [5, 20, 10, 15, 20]
    });
    tasks.forEach(task => {
        var _a;
        table.push([
            task.id,
            task.title || "",
            task.priority || "",
            task.dueDate || "",
            ((_a = task.tagIds) === null || _a === void 0 ? void 0 : _a.join(', ')) || ""
        ]);
    });
    console.log(table.toString());
    showMenu();
}
function assignTagsToTask() {
    const tasks = manageServices_1.TaskManager.listTasks();
    const tags = manageServices_1.TaskManager.listTags();
    if (tasks.length === 0) {
        console.log('No tasks available.');
        showMenu();
        return;
    }
    if (tags.length === 0) {
        console.log('No tags available.');
        showMenu();
        return;
    }
    const taskTable = new cli_table3_1.default({
        head: ['ID', 'Title', 'Priority', 'Status'],
        colWidths: [5, 20, 10, 15]
    });
    tasks.forEach(task => {
        taskTable.push([task.id, task.title || "", task.priority || "", task.status || ""]);
    });
    console.log('Tasks:');
    console.log(taskTable.toString());
    TaskCLI.askQuestion(rl, 'Enter the ID of the task you want to assign tags to', taskIdInput => {
        const taskId = Number(taskIdInput);
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            console.log('Invalid task ID.');
            showMenu();
            return;
        }
        const tagTable = new cli_table3_1.default({
            head: ['ID', 'Name'],
            colWidths: [5, 20]
        });
        tags.forEach(tag => {
            tagTable.push([tag.id, tag.name || ""]);
        });
        console.log('Tags:');
        console.log(tagTable.toString());
        TaskCLI.askQuestion(rl, 'Enter the IDs of the tags to assign (comma-separated)', tagIdsInput => {
            const tagIds = tagIdsInput.split(',').map(id => Number(id.trim()));
            const validTagIds = tags.filter(tag => tagIds.includes(tag.id)).map(tag => tag.id);
            if (validTagIds.length === 0) {
                console.log('No valid tags selected.');
                showMenu();
                return;
            }
            const updatedTask = manageServices_1.TaskManager.updateTask(taskId, { tagIds: validTagIds });
            if (updatedTask) {
                console.log('Tags assigned successfully:', updatedTask);
            }
            else {
                console.log('Failed to assign tags.');
            }
            showMenu();
        });
    });
}
function createSubtask() {
    const tasks = manageServices_1.TaskManager.listTasks();
    if (tasks.length === 0) {
        console.log('No tasks available.');
        showMenu();
        return;
    }
    const taskTable = new cli_table3_1.default({
        head: ['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'],
        colWidths: [5, 20, 10, 15, 15, 20]
    });
    tasks.forEach(task => {
        var _a;
        taskTable.push([
            task.id,
            task.title || "",
            task.priority || "",
            task.status || "",
            task.dueDate || "",
            ((_a = task.tagIds) === null || _a === void 0 ? void 0 : _a.join(', ')) || ""
        ]);
    });
    console.log('Tasks:');
    console.log(taskTable.toString());
    TaskCLI.askQuestion(rl, 'Enter the ID or name of the parent task', input => {
        const parentTask = tasks.find(task => task.id === Number(input) || task.title === input);
        if (!parentTask) {
            console.log('Parent task not found.');
            showMenu();
            return;
        }
        TaskCLI.askQuestion(rl, 'Enter subtask title', title => {
            TaskCLI.askQuestion(rl, 'Enter subtask priority (low, medium, high)', priority => {
                TaskCLI.askQuestion(rl, 'Enter subtask description (optional)', description => {
                    TaskCLI.askQuestion(rl, 'Enter subtask due date (YYYY-MM-DD, optional)', dueDate => {
                        const subtask = manageServices_1.TaskManager.addTask(title, priority, description, dueDate, [], parentTask.id);
                        console.log('Subtask created:', subtask);
                        showMenu();
                    });
                });
            });
        });
    });
}
showMenu();
