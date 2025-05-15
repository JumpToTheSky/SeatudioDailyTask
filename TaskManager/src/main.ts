import * as readline from 'readline';
import { TaskManager } from './services/manageServices';
import { TaskStatus, Priority } from './model/Task';
import Table from 'cli-table3';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


function getTableConfig(headers: string[], widths: number[]) {
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

function handleMenuSelection(option: string) {
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
    const tasks = TaskManager.listTasks();
    const tags = TaskManager.listTags();
    const table = new Table(getTableConfig(
        ['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'],
        [5, 20, 10, 15, 15, 20]
    ));

    tasks.forEach(task => {
        const tagNames = task.tagIds?.map(tagId => tags.find(tag => tag.id === tagId)?.name).filter(Boolean).join(', ') || "";
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
                        const task = TaskManager.addTask(title, priority as Priority, description, dueDate, tagIds);
                        console.log('Task added:', task);
                        showMenu();
                    });
                });
            });
        });
    });
}

function updateTask() {
    const tasks = TaskManager.listTasks();
    const tags = TaskManager.listTags();

    if (tasks.length === 0) {
        console.log('No tasks available.');
        showMenu();
        return;
    }

    const taskTable = new Table(getTableConfig(
        ['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'],
        [5, 20, 10, 15, 15, 20]
    ));

    tasks.forEach(task => {
        const tagNames = task.tagIds?.map(tagId => tags.find(tag => tag.id === tagId)?.name).filter(Boolean).join(', ') || "";
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
                        TaskManager.updateTask(taskId, { title: newTitle });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '2':
                    rl.question('Enter new description: ', newDescription => {
                        TaskManager.updateTask(taskId, { description: newDescription });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '3':
                    rl.question('Enter new priority (low, medium, high): ', newPriority => {
                        TaskManager.updateTask(taskId, { priority: newPriority as Priority });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '4':
                    rl.question('Enter new status (todo, in-progress, done, cancelled): ', newStatus => {
                        TaskManager.updateTask(taskId, { status: newStatus as TaskStatus });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '5':
                    rl.question('Enter new due date (YYYY-MM-DD): ', newDueDate => {
                        TaskManager.updateTask(taskId, { dueDate: newDueDate });
                        console.log('Task updated successfully.');
                        showMenu();
                    });
                    break;
                case '6':
                    const tagTable = new Table(getTableConfig(
                        ['ID', 'Name'],
                        [5, 20]
                    ));

                    tags.forEach(tag => {
                        tagTable.push([tag.id, tag.name || ""]);
                    });

                    console.log("\n╔═════════════════════════════════════════════════════╗");
                    console.log("║                      TAGS                           ║");
                    console.log("╚═════════════════════════════════════════════════════╝");
                    console.log(tagTable.toString());

                    rl.question('Enter the IDs of the tags to assign (comma-separated): ', tagIdsInput => {
                        const tagIds = tagIdsInput.split(',').map(id => Number(id.trim()));
                        TaskManager.updateTask(taskId, { tagIds });
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
        const success = TaskManager.deleteTask(Number(id));
        console.log(success ? 'Task deleted.' : 'Task not found.');
        showMenu();
    });
}

function listTags() {
    const tags = TaskManager.listTags();
    const table = new Table(getTableConfig(
        ['ID', 'Name', 'Created At'],
        [5, 25, 25]
    ));

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
        const tag = TaskManager.addTag(name);
        console.log('Tag added:', tag);
        showMenu();
    });
}

function deleteTag() {
    rl.question('Enter tag ID to delete: ', id => {
        const success = TaskManager.deleteTag(Number(id));
        console.log(success ? 'Tag deleted.' : 'Tag not found.');
        showMenu();
    });
}

function markTaskAsCompleted() {
    rl.question('Enter task ID to mark as completed: ', id => {
        const task = TaskManager.updateTask(Number(id), { status: TaskStatus.Done });
        if (task) {
            console.log('Task marked as completed:', task);
        } else {
            console.log('Task not found.');
        }
        showMenu();
    });
}

function showCompletedTasks() {
    const tasks = TaskManager.listTasks().filter(task => task.status === TaskStatus.Done);
    const tags = TaskManager.listTags();
    const table = new Table(getTableConfig(
        ['ID', 'Title', 'Priority', 'Due Date', 'Tags'],
        [5, 25, 10, 15, 20]
    ));

    tasks.forEach(task => {
        const tagNames = task.tagIds?.map(tagId => tags.find(tag => tag.id === tagId)?.name).filter(Boolean).join(', ') || "";
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
    const tasks = TaskManager.listTasks();
    const tags = TaskManager.listTags();

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

    const taskTable = new Table(getTableConfig(
        ['ID', 'Title', 'Priority', 'Status'],
        [5, 30, 10, 15]
    ));

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

        const tagTable = new Table(getTableConfig(
            ['ID', 'Name'],
            [5, 50]
        ));

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

            const updatedTask = TaskManager.updateTask(taskId, { tagIds: validTagIds });
            if (updatedTask) {
                console.log('Tags assigned successfully:', updatedTask);
            } else {
                console.log('Failed to assign tags.');
            }
            showMenu();
        });
    });
}

function createSubtask() {
    const tasks = TaskManager.listTasks();

    if (tasks.length === 0) {
        console.log('No tasks available.');
        showMenu();
        return;
    }

    const taskTable = new Table(getTableConfig(
        ['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'],
        [5, 20, 10, 15, 15, 20]
    ));

    tasks.forEach(task => {
        const tags = TaskManager.listTags();
        const tagNames = task.tagIds?.map(tagId => tags.find(tag => tag.id === tagId)?.name).filter(Boolean).join(', ') || "";
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
                        const subtask = TaskManager.addTask(
                            title,
                            priority as Priority,
                            description,
                            dueDate,
                            [],
                            parentTask.id
                        );
                        console.log('Subtask created:', subtask);
                        showMenu();
                    });
                });
            });
        });
    });
}

showMenu();
