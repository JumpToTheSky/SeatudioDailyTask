import { loadDataFromJSON, saveDataToJSON } from './module';
import Table from 'cli-table3';

export interface BorrowedBook {
    book_id: number;
    user_id: number;
    borrow_date: string;
    return_date?: string;
}

export interface User {
    user_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export function displayUsers(users: User[]): boolean {
    if (!users || users.length === 0) {
        console.log("\nNo users to display.");
        return false;
    }

    const table = new Table({
        head: ['ID', 'Name', 'Email', 'Phone', 'Address'],
        colWidths: [6, 17, 27, 14, 27],
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
        },
        colAligns: ['center', 'left', 'left', 'left', 'left']
    });

    users.forEach(user => {
        table.push([
            user.user_id,
            user.name,
            user.email,
            user.phone,
            user.address,
        ]);
    });

    console.log("\n╔═══════════════════╗");
    console.log("║   LIST OF USERS   ║");
    console.log("╚═══════════════════╝");
    console.log(table.toString());
    return true;
}

export async function fetchUsers(): Promise<User[]> {
    const users = await loadDataFromJSON<User>('./data/library_user.json');
    return users;
}

export function addUser(users: User[], newUserDetails: Omit<User, 'user_id'>): User[] {
    const maxId = users.reduce((max, user) => (user.user_id > max ? user.user_id : max), 0);
    const newUser: User = {
        ...newUserDetails,
        user_id: maxId + 1,
    };
    return [...users, newUser];
}

export function removeUser(users: User[], userIdToRemove: number): [User[], boolean] {
    const initialLength = users.length;
    const updatedUsers = users.filter(user => user.user_id !== userIdToRemove);
    const userWasRemoved = updatedUsers.length < initialLength;
    return [updatedUsers, userWasRemoved];
}

export async function saveUsers(users: User[]): Promise<boolean> {
    try {
        await saveDataToJSON<User>('./data/library_user.json', users);
        console.log("User data saved successfully.");
        return true;
    } catch (error) {
        console.error("Failed to save user data:", error);
        return false;
    }
}