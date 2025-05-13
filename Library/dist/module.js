"use strict";
// src/module.ts
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
exports.saveDataToJSON = saveDataToJSON;
exports.fetchBorrowedBooks = fetchBorrowedBooks;
exports.saveBorrowedBooks = saveBorrowedBooks;
exports.borrowBook = borrowBook;
exports.returnBook = returnBook;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
function loadDataFromJSON(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
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
function saveDataToJSON(url, data) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const filePath = path.resolve(__dirname, url);
            const jsonData = JSON.stringify(data, null, 2);
            fs.writeFileSync(filePath, jsonData, 'utf-8');
            return data; // Return the saved data
        }
        catch (error) {
            console.error(`Error saving data to ${url}:`, error);
            throw error;
        }
    });
}
function fetchBorrowedBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        // Thay đổi đường dẫn ở đây
        const borrowedBooks = yield loadDataFromJSON('./data/borrowed_book.json');
        return borrowedBooks;
    });
}
function saveBorrowedBooks(borrowedBooks) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Thay đổi đường dẫn ở đây
            yield saveDataToJSON('./data/borrowed_book.json', borrowedBooks);
            console.log("Borrowed book data saved successfully.");
            return true;
        }
        catch (error) {
            console.error("Failed to save borrowed book data:", error);
            return false;
        }
    });
}
function borrowBook(user, book) {
    if (book.copies <= 0) {
        return [null, `Book "${book.title}" is out of stock.`];
    }
    book.copies--;
    const today = new Date();
    const newBorrowedBook = {
        book_id: book.id,
        user_id: user.user_id,
        borrow_date: today.toISOString().split('T')[0],
    };
    return [newBorrowedBook, `Book "${book.title}" prepared for borrowing by ${user.name}. Remember to save all changes.`];
}
function returnBook(allBorrowedBooks, userId, bookIdToReturn, allBooks) {
    const borrowedBookIndex = allBorrowedBooks.findIndex(b => b.user_id === userId && b.book_id === bookIdToReturn && !b.return_date);
    if (borrowedBookIndex === -1) {
        return [null, `Active borrow record for Book ID ${bookIdToReturn} by User ID ${userId} not found.`];
    }
    const borrowDate = new Date(allBorrowedBooks[borrowedBookIndex].borrow_date);
    const returnDate = new Date(); // Current date for return
    const updatedBorrowedBooks = allBorrowedBooks.map((borrowedRecord, index) => {
        if (index === borrowedBookIndex) {
            return Object.assign(Object.assign({}, borrowedRecord), { return_date: returnDate.toISOString().split('T')[0] });
        }
        return borrowedRecord;
    });
    const bookInLibrary = allBooks.find(b => b.id === bookIdToReturn);
    if (bookInLibrary) {
        bookInLibrary.copies++;
    }
    else {
        console.warn(`Returned book ID ${bookIdToReturn} not found in the main library book list. Copies not incremented.`);
        return [updatedBorrowedBooks, `Book ID ${bookIdToReturn} returned, but book not found in library to update count.`];
    }
    let successMessage = `Book ID ${bookIdToReturn} returned successfully by User ID ${userId}.`;
    const timeDifference = returnDate.getTime() - borrowDate.getTime();
    if (timeDifference > ONE_WEEK_IN_MILLISECONDS) {
        const daysLate = Math.floor((timeDifference - ONE_WEEK_IN_MILLISECONDS) / (1000 * 60 * 60 * 24));
        successMessage += ` The book was returned ${daysLate > 0 ? daysLate : 'several'} day(s) late.`;
    }
    successMessage += " Remember to save all changes.";
    return [updatedBorrowedBooks, successMessage];
}
