import { loadDataFromJSON, saveDataToJSON } from './module';
import { BorrowedBook } from './users'; // Added import for BorrowedBook

export interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    published_year: number;
    cover_image: string;
    edition_count: number;
    description: string;
    copies: number;
}

export function displayBooks(books: Book[]): boolean {
    console.log("\nList of Books:");
    books.forEach(book => {
        console.log(`- ${book.title} by ${book.author} (${book.published_year})`);
        console.log(`  Genre: ${book.genre}`);
        console.log(`  Description: ${book.description}`);
        console.log(`  Copies Available: ${book.copies}`);
        console.log("--------------------------------------------------");
    });
    return true;
}

export async function fetchBooks(): Promise<Book[]> {
    const books = await loadDataFromJSON<Book>('../library_book.json');
    return books;
}

export async function saveBooks(books: Book[]): Promise<boolean> {
    try {
        await saveDataToJSON<Book>('../library_book.json', books);
        console.log("Book data saved successfully.");
        return true;
    } catch (error) {
        console.error("Failed to save book data:", error);
        return false;
    }
}

export function removeBookCompletely(
    books: Book[],
    borrowedRecords: BorrowedBook[],
    bookIdToRemove: number
): [Book[], BorrowedBook[], boolean, string] {
    const bookExists = books.some(book => book.id === bookIdToRemove);
    if (!bookExists) {
        return [books, borrowedRecords, false, `Book with ID ${bookIdToRemove} not found.`];
    }

    const updatedBooks = books.filter(book => book.id !== bookIdToRemove);
    const updatedBorrowedRecords = borrowedRecords.filter(record => record.book_id !== bookIdToRemove);

    const booksRemovedCount = books.length - updatedBooks.length;
    const borrowedRecordsRemovedCount = borrowedRecords.length - updatedBorrowedRecords.length;

    return [
        updatedBooks,
        updatedBorrowedRecords,
        true,
        `Book ID ${bookIdToRemove} removed. ${borrowedRecordsRemovedCount} borrow record(s) associated with this book also removed.`
    ];
}

export function updateBookCopies(
    books: Book[],
    bookId: number,
    change: number // positive to add, negative to remove
): [Book[] | null, string] {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
        return [null, `Book with ID ${bookId} not found.`];
    }

    const updatedBooks = [...books];
    const newCopies = updatedBooks[bookIndex].copies + change;

    if (newCopies < 0) {
        return [null, `Cannot reduce copies for Book ID ${bookId} below zero. Current copies: ${updatedBooks[bookIndex].copies}, attempted to remove ${Math.abs(change)}.`];
    }

    updatedBooks[bookIndex] = { ...updatedBooks[bookIndex], copies: newCopies };
    
    let message = `Copies for Book ID ${bookId} (${updatedBooks[bookIndex].title}) `;
    if (change > 0) {
        message += `increased by ${change}. New total: ${newCopies}.`;
    } else {
        message += `decreased by ${Math.abs(change)}. New total: ${newCopies}.`;
    }
    return [updatedBooks, message];
}