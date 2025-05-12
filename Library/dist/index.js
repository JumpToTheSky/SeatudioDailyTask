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
Object.defineProperty(exports, "__esModule", { value: true });
const books_1 = require("./books");
const users_1 = require("./users");
const utils_1 = require("./utils");
let allBooks = [];
let allUsers = [];
let dataLoaded = false;
function loadAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            allBooks = yield (0, books_1.fetchBooks)();
            allUsers = yield (0, users_1.fetchUsers)();
            dataLoaded = true;
            console.log("Initial book and user data loaded.");
        }
    });
}
function showMenu() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });
    function handleBorrowBook() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dataLoaded) {
                yield loadAllData();
            }
            readline.question("Enter User ID to borrow: ", (userIdStr) => {
                const userId = parseInt(userIdStr);
                const user = allUsers.find(u => u.user_id === userId);
                if (!user) {
                    console.log("User not found.");
                    displayMenu();
                    return;
                }
                readline.question("Enter Book ID to borrow: ", (bookIdStr) => {
                    const bookId = parseInt(bookIdStr);
                    const book = allBooks.find(b => b.id === bookId);
                    if (!book) {
                        console.log("Book not found.");
                        displayMenu();
                        return;
                    }
                    const result = (0, utils_1.borrowBook)(user, book);
                    console.log(result.message);
                    // Note: Changes are in-memory. To persist, you'd need to write back to JSON files.
                    displayMenu();
                });
            });
        });
    }
    function handleReturnBook() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!dataLoaded) {
                yield loadAllData();
            }
            readline.question("Enter User ID returning the book: ", (userIdStr) => {
                const userId = parseInt(userIdStr);
                const user = allUsers.find(u => u.user_id === userId);
                if (!user) {
                    console.log("User not found.");
                    displayMenu();
                    return;
                }
                if (user.borrowed_books.length === 0) {
                    console.log(`${user.name} has no books to return.`);
                    displayMenu();
                    return;
                }
                console.log(`${user.name}'s borrowed books:`);
                user.borrowed_books.forEach(b => {
                    const bookDetails = allBooks.find(book => book.id === b.book_id);
                    console.log(`  - ID: ${b.book_id}, Title: ${bookDetails ? bookDetails.title : 'Unknown Title'}, Borrowed: ${b.borrow_date}, Due: ${b.return_date}`);
                });
                readline.question("Enter Book ID to return: ", (bookIdStr) => {
                    const bookId = parseInt(bookIdStr);
                    const result = (0, utils_1.returnBook)(user, bookId, allBooks);
                    console.log(result.message);
                    // Note: Changes are in-memory. To persist, you'd need to write back to JSON files.
                    displayMenu();
                });
            });
        });
    }
    function displayMenu() {
        console.log("\nLibrary Management System");
        console.log("1. Display list of books");
        console.log("2. Display list of users");
        console.log("3. Borrow a book");
        console.log("4. Return a book");
        console.log("5. Exit");
        readline.question("Enter your choice (1-5): ", (choice) => __awaiter(this, void 0, void 0, function* () {
            switch (choice) {
                case "1":
                    if (!dataLoaded)
                        yield loadAllData();
                    (0, books_1.displayBooks)(allBooks);
                    displayMenu();
                    break;
                case "2":
                    if (!dataLoaded)
                        yield loadAllData();
                    (0, users_1.displayUsers)(allUsers);
                    displayMenu();
                    break;
                case "3":
                    yield handleBorrowBook();
                    break;
                case "4":
                    yield handleReturnBook();
                    break;
                case "5":
                    console.log("Exiting...");
                    readline.close();
                    break;
                default:
                    console.log("Invalid choice. Please try again.");
                    displayMenu();
            }
        }));
    }
    // Initial load can be done here or lazily as implemented
    // loadAllData().then(displayMenu); 
    displayMenu(); // Start with menu, load data on demand
}
showMenu();
