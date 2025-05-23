"use strict";
// src/books.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayBooks = displayBooks;
exports.fetchBooks = fetchBooks;
exports.saveBooks = saveBooks;
exports.addBook = addBook;
exports.removeBookCompletely = removeBookCompletely;
exports.updateBookCopies = updateBookCopies;
exports.getAllUniqueGenres = getAllUniqueGenres;
exports.displayUniqueGenres = displayUniqueGenres;
exports.searchBooksByTitleLogic = searchBooksByTitleLogic;
exports.searchBooksByGenreLogic = searchBooksByGenreLogic;
const module_1 = require("./module");
const cli_table3_1 = __importDefault(require("cli-table3"));
function displayBooks(books) {
    const table = new cli_table3_1.default({
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
            book.genre.join(', '), // Join array for display
            book.copies,
        ]);
    });
    console.log("\n╔══════════════════╗");
    console.log("║  LIST OF BOOKS   ║");
    console.log("╚══════════════════╝");
    console.log(table.toString());
    return true;
}
function fetchBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        // Thay đổi đường dẫn ở đây
        const books = yield (0, module_1.loadDataFromJSON)('./data/library_book.json');
        return books;
    });
}
function saveBooks(books) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Thay đổi đường dẫn ở đây
            yield (0, module_1.saveDataToJSON)('./data/library_book.json', books);
            console.log("Book data saved successfully.");
            return true;
        }
        catch (error) {
            console.error("Failed to save book data:", error);
            return false;
        }
    });
}
function addBook(books, newBookDetails) {
    const maxId = books.reduce((max, book) => (book.id > max ? book.id : max), 0);
    const newBook = Object.assign(Object.assign({}, newBookDetails), { id: maxId + 1 });
    return [...books, newBook];
}
function removeBookCompletely(books, borrowedRecords, bookIdToRemove) {
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
function updateBookCopies(books, bookId, change) {
    const bookIndex = books.findIndex(book => book.id === bookId);
    if (bookIndex === -1) {
        return [null, `Book with ID ${bookId} not found.`];
    }
    const updatedBooks = [...books];
    const newCopies = updatedBooks[bookIndex].copies + change;
    if (newCopies < 0) {
        return [null, `Cannot reduce copies for Book ID ${bookId} below zero. Current copies: ${updatedBooks[bookIndex].copies}, attempted to remove ${Math.abs(change)}.`];
    }
    updatedBooks[bookIndex] = Object.assign(Object.assign({}, updatedBooks[bookIndex]), { copies: newCopies });
    let message = `Copies for Book ID ${bookId} (${updatedBooks[bookIndex].title}) `;
    if (change > 0) {
        message += `increased by ${change}. New total: ${newCopies}.`;
    }
    else {
        message += `decreased by ${Math.abs(change)}. New total: ${newCopies}.`;
    }
    return [updatedBooks, message];
}
function getAllUniqueGenres(books) {
    const allGenres = new Set();
    books.forEach(book => {
        book.genre.forEach(g => allGenres.add(g));
    });
    return Array.from(allGenres).sort();
}
function displayUniqueGenres(genres) {
    if (genres.length === 0) {
        console.log("No genres found in the library.");
    }
    else {
        console.log("\n╔═══════════════════╗");
        console.log("║  ALL GENRES LIST  ║");
        console.log("╚═══════════════════╝");
        const genresTable = new cli_table3_1.default({
            head: ['Available Genres'],
            colWidths: [30],
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
        });
        genres.forEach(genre => genresTable.push([genre]));
        console.log(genresTable.toString());
    }
}
function searchBooksByTitleLogic(books, searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return books.filter(book => book.title.toLowerCase().includes(lowerCaseSearchTerm));
}
function searchBooksByGenreLogic(books, searchTerm) {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return books.filter(book => book.genre.some(g => g.toLowerCase().includes(lowerCaseSearchTerm)));
}
