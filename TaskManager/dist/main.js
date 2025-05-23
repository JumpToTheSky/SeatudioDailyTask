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
function getTableConfig(headers, widths) {
    return {
        head: headers,
        colWidths: widths,
        wordWrap: true,
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗',
            'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝',
            'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼',
            'right': '║', 'right-mid': '╢', 'middle': '│'
        },
        style: {
            head: ['cyan', 'bold'],
            border: ['grey'],
            'padding-left': 1,
            'padding-right': 1
        }
    };
}
function showMenu() {
    console.log(`
    ╔═════════════════════════════════════════════════════╗
    ║          Task Manager CLI (type 'EXIT' to cancel)   ║
    ╠═════════════════════════════════════════════════════╣
    ║ 1. List all tasks         8. List all tags          ║
    ║ 2. Add a new task         9. Add a new tag          ║
    ║ 3. Create a subtask       10. Delete a tag          ║
    ║ 4. Update a task          11. Assign tags to a task ║
    ║ 5. Delete a task                                    ║
    ║ 6. Mark task as completed                           ║
    ║ 7. Show completed tasks                             ║
    ║                                                     ║
    ║ 12. Exit application                                ║
    ╚═════════════════════════════════════════════════════╝
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
    const tags = manageServices_1.TaskManager.listTags();
    const table = new cli_table3_1.default(getTableConfig(['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'], [5, 20, 10, 15, 15, 20]));
    tasks.forEach(task => {
        var _a;
        const tagNames = ((_a = task.tagIds) === null || _a === void 0 ? void 0 : _a.map(tagId => { var _a; return (_a = tags.find(tag => tag.id === tagId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean).join(', ')) || "";
        table.push([
            task.id,
            task.title || "",
            task.priority || "",
            task.status || "",
            task.dueDate || "",
            tagNames
        ]);
    });
    console.log("\n╔═════════════════════════════════════════════════════╗");
    console.log("║                    ALL TASKS                        ║");
    console.log("╚═════════════════════════════════════════════════════╝");
    console.log(table.toString());
    showMenu();
}
function addTask() {
    rl.question('Enter task title: ', title => {
        rl.question('Enter task priority (low, medium, high): ', priority => {
            rl.question('Enter task description (optional): ', description => {
                rl.question('Enter task due date (YYYY-MM-DD, optional): ', dueDate => {
                    rl.question('Enter tag IDs (comma-separated, optional): ', tagIdsInput => {
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
    const tags = manageServices_1.TaskManager.listTags();
    if (tasks.length === 0) {
        console.log('No tasks available.');
        showMenu();
        return;
    }
    const taskTable = new cli_table3_1.default(getTableConfig(['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'], [5, 20, 10, 15, 15, 20]));
    tasks.forEach(task => {
        var _a;
        const tagNames = ((_a = task.tagIds) === null || _a === void 0 ? void 0 : _a.map(tagId => { var _a; return (_a = tags.find(tag => tag.id === tagId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean).join(', ')) || "";
        taskTable.push([
            task.id,
            task.title || "",
            task.priority || "",
            task.status || "",
            task.dueDate || "",
            tagNames
        ]);
    });
    console.log("\n╔═════════════════════════════════════════════════════╗");
    console.log("║                     TASKS                           ║");
    console.log("╚═════════════════════════════════════════════════════╝");
    console.log(taskTable.toString());
    rl.question('Enter the ID of the task you want to update: ', taskIdInput => {
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
        rl.question('Choose the field to update: ', fieldOption => {
            switch (fieldOption) {
                case '1':
                    rl.question('Enter new title: ', newTitle => {
                        manageServices_1.TaskManager.updateTask(taskId, { title: newTitle });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '2':
                    rl.question('Enter new description: ', newDescription => {
                        manageServices_1.TaskManager.updateTask(taskId, { description: newDescription });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '3':
                    rl.question('Enter new priority (low, medium, high): ', newPriority => {
                        manageServices_1.TaskManager.updateTask(taskId, { priority: newPriority });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '4':
                    rl.question('Enter new status (todo, in-progress, done, cancelled): ', newStatus => {
                        manageServices_1.TaskManager.updateTask(taskId, { status: newStatus });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '5':
                    rl.question('Enter new due date (YYYY-MM-DD): ', newDueDate => {
                        manageServices_1.TaskManager.updateTask(taskId, { dueDate: newDueDate });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '6':
                    const tagTable = new cli_table3_1.default(getTableConfig(['ID', 'Name'], [5, 20]));
                    tags.forEach(tag => {
                        tagTable.push([tag.id, tag.name || ""]);
                    });
                    console.log("\n╔═════════════════════════════════════════════════════╗");
                    console.log("║                      TAGS                           ║");
                    console.log("╚═════════════════════════════════════════════════════╝");
                    console.log(tagTable.toString());
                    rl.question('Enter the IDs of the tags to assign (comma-separated): ', tagIdsInput => {
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
    rl.question('Enter task ID to delete: ', id => {
        const success = manageServices_1.TaskManager.deleteTask(Number(id));
        console.log(success ? 'Task deleted.' : 'Task not found.');
        showMenu();
    });
}
function listTags() {
    const tags = manageServices_1.TaskManager.listTags();
    const table = new cli_table3_1.default(getTableConfig(['ID', 'Name', 'Created At'], [5, 25, 25]));
    tags.forEach(tag => {
        table.push([
            tag.id,
            tag.name || "",
            tag.createdAt ? new Date(tag.createdAt).toLocaleString() : ""
        ]);
    });
    console.log("\n╔═════════════════════════════════════════════════════╗");
    console.log("║                    ALL TAGS                         ║");
    console.log("╚═════════════════════════════════════════════════════╝");
    console.log(table.toString());
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
function markTaskAsCompleted() {
    rl.question('Enter task ID to mark as completed: ', id => {
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
    const tags = manageServices_1.TaskManager.listTags();
    const table = new cli_table3_1.default(getTableConfig(['ID', 'Title', 'Priority', 'Due Date', 'Tags'], [5, 25, 10, 15, 20]));
    tasks.forEach(task => {
        var _a;
        const tagNames = ((_a = task.tagIds) === null || _a === void 0 ? void 0 : _a.map(tagId => { var _a; return (_a = tags.find(tag => tag.id === tagId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean).join(', ')) || "";
        table.push([
            task.id,
            task.title || "",
            task.priority || "",
            task.dueDate || "",
            tagNames
        ]);
    });
    console.log("\n╔═════════════════════════════════════════════════════╗");
    console.log("║                COMPLETED TASKS                      ║");
    console.log("╚═════════════════════════════════════════════════════╝");
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
    const taskTable = new cli_table3_1.default(getTableConfig(['ID', 'Title', 'Priority', 'Status'], [5, 30, 10, 15]));
    tasks.forEach(task => {
        taskTable.push([task.id, task.title || "", task.priority || "", task.status || ""]);
    });
    console.log("\n╔═════════════════════════════════════════════════════╗");
    console.log("║                     TASKS                           ║");
    console.log("╚═════════════════════════════════════════════════════╝");
    console.log(taskTable.toString());
    rl.question('Enter the ID of the task you want to assign tags to: ', taskIdInput => {
        const taskId = Number(taskIdInput);
        const task = tasks.find(t => t.id === taskId);
        if (!task) {
            console.log('Invalid task ID.');
            showMenu();
            return;
        }
        const tagTable = new cli_table3_1.default(getTableConfig(['ID', 'Name'], [5, 50]));
        tags.forEach(tag => {
            tagTable.push([tag.id, tag.name || ""]);
        });
        console.log("\n╔═════════════════════════════════════════════════════╗");
        console.log("║                      TAGS                           ║");
        console.log("╚═════════════════════════════════════════════════════╝");
        console.log(tagTable.toString());
        rl.question('Enter the IDs of the tags to assign (comma-separated): ', tagIdsInput => {
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
    const taskTable = new cli_table3_1.default(getTableConfig(['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'], [5, 20, 10, 15, 15, 20]));
    tasks.forEach(task => {
        var _a;
        const tags = manageServices_1.TaskManager.listTags();
        const tagNames = ((_a = task.tagIds) === null || _a === void 0 ? void 0 : _a.map(tagId => { var _a; return (_a = tags.find(tag => tag.id === tagId)) === null || _a === void 0 ? void 0 : _a.name; }).filter(Boolean).join(', ')) || "";
        taskTable.push([
            task.id,
            task.title || "",
            task.priority || "",
            task.status || "",
            task.dueDate || "",
            tagNames
        ]);
    });
    console.log("\n╔═════════════════════════════════════════════════════╗");
    console.log("║                     TASKS                           ║");
    console.log("╚═════════════════════════════════════════════════════╝");
    console.log(taskTable.toString());
    rl.question('Enter the ID or name of the parent task: ', input => {
        const parentTask = tasks.find(task => task.id === Number(input) || task.title === input);
        if (!parentTask) {
            console.log('Parent task not found.');
            showMenu();
            return;
        }
        rl.question('Enter subtask title: ', title => {
            rl.question('Enter subtask priority (low, medium, high): ', priority => {
                rl.question('Enter subtask description (optional): ', description => {
                    rl.question('Enter subtask due date (YYYY-MM-DD, optional): ', dueDate => {
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
