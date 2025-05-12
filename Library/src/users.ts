import { loadDataFromJSON } from './utils';

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