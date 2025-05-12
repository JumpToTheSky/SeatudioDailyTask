import * as fs from 'fs';
import * as path from 'path';
import { User, BorrowedBook } from './users'; // Import User and BorrowedBook
import { Book } from './books'; // Import Book

export async function loadDataFromJSON<T>(url: string): Promise<T[]> {
    try {
        // Resolve path relative to the current file's directory (__dirname)
        // This assumes JSON files are in the project root, and src/utils.ts compiles to dist/utils.js
        // So, ../ from dist/ points to the project root.
        const filePath = path.resolve(__dirname, url);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return data as T[];
    } catch (error) {
        console.error(`Error loading data from ${url}:`, error);
        return [];
    }
}

export function borrowBook<U extends User, B extends Book>(user: Required<U>, book: Required<B>): [boolean, string] {
    if (book.copies <= 0) {
        return [false, `Book "${book.title}" is out of stock.`];
    }

    book.copies--;

    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 14); // Example: 14 days borrowing period

    const newBorrowedBook: Required<BorrowedBook> = {
        book_id: book.id,
        borrow_date: today.toISOString().split('T')[0], // YYYY-MM-DD
        return_date: returnDate.toISOString().split('T')[0], // YYYY-MM-DD
    };

    user.borrowed_books.push(newBorrowedBook);

    return [true, `Book "${book.title}" borrowed successfully by ${user.name}. Return by ${newBorrowedBook.return_date}.`];
}

export function returnBook<U extends User, B extends Book>(user: Required<U>, bookIdToReturn: number, allBooks: Required<B>[]): [boolean, string] {
    const borrowedBookIndex = user.borrowed_books.findIndex(b => b.book_id === bookIdToReturn);

    if (borrowedBookIndex === -1) {
        return [false, `Book ID ${bookIdToReturn} not found in ${user.name}'s borrowed list.`];
    }

    // Remove the book from the user's borrowed list
    user.borrowed_books.splice(borrowedBookIndex, 1);

    // Find the book in the main list and increment its copies
    const bookInLibrary = allBooks.find(b => b.id === bookIdToReturn);
    if (bookInLibrary) {
        bookInLibrary.copies++;
    } else {
        // This case should ideally not happen if data is consistent
        console.warn(`Returned book ID ${bookIdToReturn} not found in the main library book list. Copies not incremented.`);
        return [true, `Book ID ${bookIdToReturn} returned by ${user.name}, but book not found in library to update count.`];
    }

    return [true, `Book ID ${bookIdToReturn} returned successfully by ${user.name}.`];
}
