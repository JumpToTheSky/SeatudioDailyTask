"use strict";
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
exports.removeBookCompletely = removeBookCompletely;
exports.updateBookCopies = updateBookCopies;
const module_1 = require("./module");
const cli_table3_1 = __importDefault(require("cli-table3"));
function displayBooks(books) {
    const table = new cli_table3_1.default({
        head: ['ID', 'Title', 'Author', 'Year', 'Genre', 'Copies'],
        colWidths: [5, 30, 20, 10, 15, 10],
        style: { head: ['black', 'bgWhite'] },
        wordWrap: true, // Enable word wrapping
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
    console.log("\nList of Books:");
    console.log(table.toString());
    return true;
}
function fetchBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        const books = yield (0, module_1.loadDataFromJSON)('../library_book.json');
        return books;
    });
}
function saveBooks(books) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, module_1.saveDataToJSON)('../library_book.json', books);
            console.log("Book data saved successfully.");
            return true;
        }
        catch (error) {
            console.error("Failed to save book data:", error);
            return false;
        }
    });
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
