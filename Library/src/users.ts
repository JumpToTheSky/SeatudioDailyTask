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
    const table = new Table({
        head: ['ID', 'Name', 'Email', 'Phone', 'Address'],
        colWidths: [5, 20, 30, 15, 30],
        style: { head: ['black', 'bgWhite'] }, 
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

    console.log("\nList of Users:");
    console.log(table.toString());
    return true;
}

export async function fetchUsers(): Promise<User[]> {
    const users = await loadDataFromJSON<User>('../library_user.json');
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
        await saveDataToJSON<User>('../library_user.json', users);
        console.log("User data saved successfully.");
        return true;
    } catch (error) {
        console.error("Failed to save user data:", error);
        return false;
    }
}