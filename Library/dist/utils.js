"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDataFromJSON = loadDataFromJSON;
exports.borrowBook = borrowBook;
exports.returnBook = returnBook;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function loadDataFromJSON(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Resolve path relative to the current file's directory (__dirname)
            // This assumes JSON files are in the project root, and src/utils.ts compiles to dist/utils.js
            // So, ../ from dist/ points to the project root.
            const filePath = path.resolve(__dirname, url);
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            const data = JSON.parse(fileContent);
            return data;
        }
        catch (error) {
            console.error(`Error loading data from ${url}:`, error);
            return [];
        }
    });
}
function borrowBook(user, book) {
    if (book.copies <= 0) {
        return { success: false, message: `Book "${book.title}" is out of stock.` };
    }
    book.copies--;
    const today = new Date();
    const returnDate = new Date(today);
    returnDate.setDate(today.getDate() + 14); // Example: 14 days borrowing period
    const newBorrowedBook = {
        book_id: book.id,
        borrow_date: today.toISOString().split('T')[0], // YYYY-MM-DD
        return_date: returnDate.toISOString().split('T')[0], // YYYY-MM-DD
    };
    user.borrowed_books.push(newBorrowedBook);
    return { success: true, message: `Book "${book.title}" borrowed successfully by ${user.name}. Return by ${newBorrowedBook.return_date}.` };
}
function returnBook(user, bookIdToReturn, allBooks) {
    const borrowedBookIndex = user.borrowed_books.findIndex(b => b.book_id === bookIdToReturn);
    if (borrowedBookIndex === -1) {
        return { success: false, message: `Book ID ${bookIdToReturn} not found in ${user.name}'s borrowed list.` };
    }
    // Remove the book from the user's borrowed list
    user.borrowed_books.splice(borrowedBookIndex, 1);
    // Find the book in the main list and increment its copies
    const bookInLibrary = allBooks.find(b => b.id === bookIdToReturn);
    if (bookInLibrary) {
        bookInLibrary.copies++;
    }
    else {
        // This case should ideally not happen if data is consistent
        console.warn(`Returned book ID ${bookIdToReturn} not found in the main library book list. Copies not incremented.`);
        return { success: true, message: `Book ID ${bookIdToReturn} returned by ${user.name}, but book not found in library to update count.` };
    }
    return { success: true, message: `Book ID ${bookIdToReturn} returned successfully by ${user.name}.` };
}
