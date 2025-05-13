import { loadDataFromJSON, saveDataToJSON } from './module';

export interface BorrowedBook {
    book_id: number;
    borrow_date: string;
    return_date: string;
}

export interface User {
    user_id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    borrowed_books: BorrowedBook[];
}

export function displayUsers(users: User[]) {
    console.log("\nList of Users:");
    users.forEach(user => {
        console.log(`- ${user.name} (${user.email})`);
        console.log(`  Phone: ${user.phone}`);
        console.log(`  Address: ${user.address}`);
        console.log("  Borrowed Books:");
        user.borrowed_books.forEach(b => {
            console.log(`    - Book ID: ${b.book_id} (Borrow: ${b.borrow_date}, Return: ${b.return_date})`);
        });
        console.log("--------------------------------------------------");
    });
}

export async function fetchUsers(): Promise<User[]> {
    const users = await loadDataFromJSON<User>('../library_user.json');
    return users;
}

export function addUser(users: User[], newUserDetails: Omit<User, 'user_id' | 'borrowed_books'>): User[] {
    const maxId = users.reduce((max, user) => (user.user_id > max ? user.user_id : max), 0);
    const newUser: User = {
        ...newUserDetails,
        user_id: maxId + 1,
        borrowed_books: [],
    };
    return [...users, newUser];
}

export function removeUser(users: User[], userIdToRemove: number): [User[], boolean] {
    const initialLength = users.length;
    const updatedUsers = users.filter(user => user.user_id !== userIdToRemove);
    const userWasRemoved = updatedUsers.length < initialLength;
    return [updatedUsers, userWasRemoved];
}

export async function saveUsers(users: User[]): Promise<void> {
    try {
        await saveDataToJSON<User>('../library_user.json', users);
        console.log("User data saved successfully.");
    } catch (error) {
        console.error("Failed to save user data:", error);
    }
}