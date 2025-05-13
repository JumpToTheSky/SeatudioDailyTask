// src/books.ts

import { loadDataFromJSON, saveDataToJSON } from './module';
import { BorrowedBook } from './users';
import Table from 'cli-table3';

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
    const table = new Table({
        head: ['ID', 'Title', 'Author', 'Year', 'Genre', 'Copies'],
        colWidths: [5, 32, 22, 8, 17, 8], // Adjusted for book data + padding
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
        colAligns: ['center', 'left', 'left', 'center', 'left', 'center'] // Adjusted for book data
    });

    books.forEach(book => {
        table.push([
            book.id,
            book.title,
            book.author,
            book.published_year,
            book.genre,
            book.copies,
        ]);
    });

    console.log("\n╔══════════════════╗");
    console.log("║  LIST OF BOOKS   ║");
    console.log("╚══════════════════╝");
    console.log(table.toString());
    return true;
}

export async function fetchBooks(): Promise<Book[]> {
    // Thay đổi đường dẫn ở đây
    const books = await loadDataFromJSON<Book>('./data/library_book.json');
    return books;
}

export async function saveBooks(books: Book[]): Promise<boolean> {
    try {
        // Thay đổi đường dẫn ở đây
        await saveDataToJSON<Book>('./data/library_book.json', books);
        console.log("Book data saved successfully.");
        return true;
    } catch (error) {
        console.error("Failed to save book data:", error);
        return false;
    }
}

export function addBook(books: Book[], newBookDetails: Omit<Book, 'id'>): Book[] {
    const maxId = books.reduce((max, book) => (book.id > max ? book.id : max), 0);
    const newBook: Book = {
        ...newBookDetails,
        id: maxId + 1,
    };
    return [...books, newBook];
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
    change: number
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