"use strict";
// filepath: /Users/sea-013/Documents/GitHub/SeatudioDailyTask/Library/src/books.ts
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
exports.displayBooks = displayBooks;
exports.fetchBooks = fetchBooks;
const utils_1 = require("./utils");
function displayBooks(books) {
    console.log("\nList of Books:");
    books.forEach(book => {
        console.log(`- ${book.title} by ${book.author} (${book.published_year})`);
        console.log(`  Genre: ${book.genre}`);
        console.log(`  Description: ${book.description}`);
        console.log(`  Copies Available: ${book.copies}`);
        console.log("--------------------------------------------------");
    });
}
function fetchBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        const books = yield (0, utils_1.loadDataFromJSON)('../library_book.json');
        return books;
    });
}
