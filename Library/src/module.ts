import * as fs from 'fs';
import * as path from 'path';
import { User, BorrowedBook } from './users';
import { Book } from './books';

export async function loadDataFromJSON<T>(url: string): Promise<T[]> {
    try {
        const filePath = path.resolve(__dirname, url);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);
        return data as T[];
    } catch (error) {
        console.error(`Error loading data from ${url}:`, error);
        return [];
    }
}

export async function saveDataToJSON<T>(url: string, data: T[]): Promise<T[]> {
    try {
        const filePath = path.resolve(__dirname, url);
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData, 'utf-8');
        return data; // Return the saved data
    } catch (error) {
        console.error(`Error saving data to ${url}:`, error);
        throw error;
    }
}

export async function fetchBorrowedBooks(): Promise<BorrowedBook[]> {
    const borrowedBooks = await loadDataFromJSON<BorrowedBook>('../borrowed_book.json');
    return borrowedBooks;
}

export async function saveBorrowedBooks(borrowedBooks: BorrowedBook[]): Promise<void> {
    try {
        await saveDataToJSON<BorrowedBook>('../borrowed_book.json', borrowedBooks);
        console.log("Borrowed book data saved successfully.");
    } catch (error) {
        console.error("Failed to save borrowed book data:", error);
    }
}

export function borrowBook<U extends User, B extends Book>(user: U, book: B): [BorrowedBook | null, string] {
    if (book.copies <= 0) {
        return [null, `Book "${book.title}" is out of stock.`];
    }

    book.copies--;

    const today = new Date();

    const newBorrowedBook: BorrowedBook = {
        book_id: book.id,
        user_id: user.user_id,
        borrow_date: today.toISOString().split('T')[0],
    };

    return [newBorrowedBook, `Book "${book.title}" prepared for borrowing by ${user.name}. Remember to save all changes.`];
}

export function returnBook<BB extends BorrowedBook, B extends Book>(
    allBorrowedBooks: BB[],
    userId: number,
    bookIdToReturn: number,
    allBooks: B[]
): [BB[] | null, string] {
    const borrowedBookIndex = allBorrowedBooks.findIndex(
        b => b.user_id === userId && b.book_id === bookIdToReturn && !b.return_date
    );

    if (borrowedBookIndex === -1) {
        return [null, `Active borrow record for Book ID ${bookIdToReturn} by User ID ${userId} not found.`];
    }

    const updatedBorrowedBooks = allBorrowedBooks.map((borrowedRecord, index) => {
        if (index === borrowedBookIndex) {
            return {
                ...borrowedRecord,
                return_date: new Date().toISOString().split('T')[0],
            };
        }
        return borrowedRecord;
    }) as BB[]; // Cast to BB[] to maintain the generic type

    const bookInLibrary = allBooks.find(b => b.id === bookIdToReturn);
    if (bookInLibrary) {
        bookInLibrary.copies++;
    } else {
        console.warn(`Returned book ID ${bookIdToReturn} not found in the main library book list. Copies not incremented.`);
        return [updatedBorrowedBooks, `Book ID ${bookIdToReturn} returned, but book not found in library to update count.`];
    }

    return [updatedBorrowedBooks, `Book ID ${bookIdToReturn} returned successfully by User ID ${userId}. Remember to save all changes.`];
}
