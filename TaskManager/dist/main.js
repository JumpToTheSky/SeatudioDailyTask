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
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const manageServices_1 = require("./services/manageServices");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function showMenu() {
    console.log(`
    Task Manager CLI
    ----------------
    1. List all tasks
    2. Add a new task
    3. Update a task
    4. Delete a task
    5. List all tags
    6. Add a new tag
    7. Delete a tag
    8. Exit
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
            updateTask();
            break;
        case '4':
            deleteTask();
            break;
        case '5':
            listTags();
            break;
        case '6':
            addTag();
            break;
        case '7':
            deleteTag();
            break;
        case '8':
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
    console.log('Tasks:');
    tasks.forEach(task => console.log(task));
    showMenu();
}
function addTask() {
    rl.question('Enter task title: ', title => {
        rl.question('Enter task priority (low, medium, high): ', priority => {
            const task = manageServices_1.TaskManager.addTask(title, priority);
            console.log('Task added:', task);
            showMenu();
        });
    });
}
function updateTask() {
    rl.question('Enter task ID to update: ', id => {
        rl.question('Enter new title (leave blank to skip): ', title => {
            rl.question('Enter new status (todo, in-progress, done, cancelled): ', status => {
                const updates = {};
                if (title)
                    updates.title = title;
                if (status)
                    updates.status = status;
                const task = manageServices_1.TaskManager.updateTask(Number(id), updates);
                if (task) {
                    console.log('Task updated:', task);
                }
                else {
                    console.log('Task not found.');
                }
                showMenu();
            });
        });
    });
}
function deleteTask() {
    rl.question('Enter task ID to delete: ', id => {
        const success = manageServices_1.TaskManager.deleteTask(Number(id));
        console.log(success ? 'Task deleted.' : 'Task not found.');
        showMenu();
    });
}
function listTags() {
    const tags = manageServices_1.TaskManager.listTags();
    console.log('Tags:');
    tags.forEach(tag => console.log(tag));
    showMenu();
}
function addTag() {
    rl.question('Enter tag name: ', name => {
        const tag = manageServices_1.TaskManager.addTag(name);
        console.log('Tag added:', tag);
        showMenu();
    });
}
function deleteTag() {
    rl.question('Enter tag ID to delete: ', id => {
        const success = manageServices_1.TaskManager.deleteTag(Number(id));
        console.log(success ? 'Tag deleted.' : 'Tag not found.');
        showMenu();
    });
}
showMenu();
