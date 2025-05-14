import * as readline from 'readline';
import { TaskManager } from './services/manageServices';
import { TaskStatus, Priority } from './model/Task';
import Table from 'cli-table3'; // Import cli-table3

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
    8. Mark a task as completed
    9. Show completed tasks
    10. Exit
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
            markTaskAsCompleted();
            break;
        case '9':
            showCompletedTasks();
            break;
        case '10':
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
    const table = new Table({
        head: ['ID', 'Title', 'Priority', 'Status', 'Due Date', 'Tags'],
        colWidths: [5, 20, 10, 15, 15, 20]
    });

    tasks.forEach(task => {
        table.push([
            task.id,
            task.title,
            task.priority,
            task.status,
            task.dueDate || 'N/A',
            task.tagIds?.join(', ') || 'None'
        ]);
    });

    console.log(table.toString());
    showMenu();
}

function addTask() {
    rl.question('Enter task title: ', title => {
        rl.question('Enter task priority (low, medium, high): ', priority => {
            const task = TaskManager.addTask(title, priority as Priority);
            console.log('Task added:', task);
            showMenu();
        });
    });
}

function updateTask() {
    rl.question('Enter task ID to update: ', id => {
        rl.question('Enter new title (leave blank to skip): ', title => {
            rl.question('Enter new status (todo, in-progress, done, cancelled): ', status => {
                const updates: any = {};
                if (title) updates.title = title;
                if (status) updates.status = status as TaskStatus;
                const task = TaskManager.updateTask(Number(id), updates);
                if (task) {
                    console.log('Task updated:', task);
                } else {
                    console.log('Task not found.');
                }
                showMenu();
            });
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
    const table = new Table({
        head: ['ID', 'Name', 'Created At'],
        colWidths: [5, 20, 20]
    });

    tags.forEach(tag => {
        table.push([tag.id, tag.name, new Date(tag.createdAt).toLocaleString()]);
    });

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
    const table = new Table({
        head: ['ID', 'Title', 'Priority', 'Due Date', 'Tags'],
        colWidths: [5, 20, 10, 15, 20]
    });

    tasks.forEach(task => {
        table.push([
            task.id,
            task.title,
            task.priority,
            task.dueDate || 'N/A',
            task.tagIds?.join(', ') || 'None'
        ]);
    });

    console.log(table.toString());
    showMenu();
}

showMenu();
