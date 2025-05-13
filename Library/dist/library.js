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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const books_1 = require("./books");
const users_1 = require("./users");
const module_1 = require("./module");
const readlineInterface = __importStar(require("readline"));
const cli_table3_1 = __importDefault(require("cli-table3"));
let allBooks = [];
let allUsers = [];
let allBorrowedBookRecords = [];
let dataLoaded = false;
function loadAllData() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            allBooks = yield (0, books_1.fetchBooks)();
            allUsers = yield (0, users_1.fetchUsers)();
            allBorrowedBookRecords = yield (0, module_1.fetchBorrowedBooks)();
            dataLoaded = true;
            console.log("Initial book, user, and borrowed book data loaded.");
        }
        return true;
    });
}
function handleBorrowBook(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        rl.question("Enter User ID to borrow: ", (userIdStr) => {
            const userId = parseInt(userIdStr);
            const user = allUsers.find(u => u.user_id === userId);
            if (!user) {
                console.log("User not found.");
                displayMenu(rl);
                return true;
            }
            rl.question("Enter Book ID to borrow: ", (bookIdStr) => __awaiter(this, void 0, void 0, function* () {
                const bookId = parseInt(bookIdStr);
                const book = allBooks.find(b => b.id === bookId);
                if (!book) {
                    console.log("Book not found.");
                    displayMenu(rl);
                    return true;
                }
                const [newBorrowedRecord, message] = (0, module_1.borrowBook)(user, book);
                console.log(message);
                if (newBorrowedRecord) {
                    allBorrowedBookRecords.push(newBorrowedRecord);
                    yield (0, users_1.saveUsers)(allUsers);
                    yield (0, books_1.saveBooks)(allBooks);
                    yield (0, module_1.saveBorrowedBooks)(allBorrowedBookRecords);
                }
                displayMenu(rl);
            }));
        });
        return true;
    });
}
function handleReturnBook(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        rl.question("Enter User ID returning the book: ", (userIdStr) => {
            const userId = parseInt(userIdStr);
            const user = allUsers.find(u => u.user_id === userId);
            if (!user) {
                console.log("User not found.");
                displayMenu(rl);
                return true;
            }
            const userActiveBorrows = allBorrowedBookRecords.filter(b => b.user_id === userId && !b.return_date);
            if (userActiveBorrows.length === 0) {
                console.log(`${user.name} has no active borrows to return.`);
                displayMenu(rl);
                return true;
            }
            console.log(`${user.name}'s actively borrowed books:`);
            userActiveBorrows.forEach(b => {
                const bookDetails = allBooks.find(book => book.id === b.book_id);
                console.log(`  - ID: ${b.book_id}, Title: ${bookDetails ? bookDetails.title : 'Unknown Title'}, Borrowed: ${b.borrow_date}`);
            });
            rl.question("Enter Book ID to return: ", (bookIdStr) => __awaiter(this, void 0, void 0, function* () {
                const bookId = parseInt(bookIdStr);
                const [updatedBorrowedRecords, message] = (0, module_1.returnBook)(allBorrowedBookRecords, userId, bookId, allBooks);
                console.log(message);
                if (updatedBorrowedRecords) {
                    allBorrowedBookRecords = updatedBorrowedRecords;
                    yield (0, books_1.saveBooks)(allBooks);
                    yield (0, module_1.saveBorrowedBooks)(allBorrowedBookRecords);
                }
                displayMenu(rl);
            }));
        });
        return true;
    });
}
function handleAddUser(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        rl.question("Enter new user's name: ", (name) => {
            rl.question("Enter new user's email: ", (email) => {
                rl.question("Enter new user's phone: ", (phone) => {
                    rl.question("Enter new user's address: ", (address) => __awaiter(this, void 0, void 0, function* () {
                        const newUserDetails = { name, email, phone, address };
                        allUsers = (0, users_1.addUser)(allUsers, newUserDetails);
                        yield (0, users_1.saveUsers)(allUsers);
                        console.log(`User "${name}" added successfully with ID ${allUsers[allUsers.length - 1].user_id}.`);
                        displayMenu(rl);
                    }));
                });
            });
        });
        return true;
    });
}
function handleRemoveUser(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        rl.question("Enter User ID to remove: ", (userIdStr) => __awaiter(this, void 0, void 0, function* () {
            const userId = parseInt(userIdStr);
            if (isNaN(userId)) {
                console.log("Invalid User ID format.");
                displayMenu(rl);
                return true;
            }
            const [updatedUsers, userWasRemoved] = (0, users_1.removeUser)(allUsers, userId);
            if (userWasRemoved) {
                allUsers = updatedUsers;
                yield (0, users_1.saveUsers)(allUsers);
                console.log(`User ID ${userId} removed successfully.`);
            }
            else {
                console.log(`User ID ${userId} not found.`);
            }
            displayMenu(rl);
        }));
        return true;
    });
}
const ONE_WEEK_IN_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
function handleCheckOverdueBorrows(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        displayOverdueRecords(allBorrowedBookRecords, allUsers, allBooks);
        displayMenu(rl);
        return true;
    });
}
function handleCheckLateReturns(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        displayLateReturns(allBorrowedBookRecords, allUsers, allBooks);
        displayMenu(rl);
        return true;
    });
}
function handleRemoveBook(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        rl.question("Enter Book ID to remove completely: ", (bookIdStr) => __awaiter(this, void 0, void 0, function* () {
            const bookId = parseInt(bookIdStr);
            if (isNaN(bookId)) {
                console.log("Invalid Book ID format.");
                displayMenu(rl);
                return true;
            }
            const [updatedBooks, updatedBorrowedRecords, success, message] = (0, books_1.removeBookCompletely)(allBooks, allBorrowedBookRecords, bookId);
            console.log(message);
            if (success) {
                allBooks = updatedBooks;
                allBorrowedBookRecords = updatedBorrowedRecords;
                yield (0, books_1.saveBooks)(allBooks);
                yield (0, module_1.saveBorrowedBooks)(allBorrowedBookRecords);
            }
            displayMenu(rl);
        }));
        return true;
    });
}
function handleAddBookCopies(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        rl.question("Enter Book ID to add copies to: ", (bookIdStr) => {
            const bookId = parseInt(bookIdStr);
            if (isNaN(bookId)) {
                console.log("Invalid Book ID format.");
                displayMenu(rl);
                return true;
            }
            rl.question("Enter number of copies to add: ", (copiesStr) => __awaiter(this, void 0, void 0, function* () {
                const copiesToAdd = parseInt(copiesStr);
                if (isNaN(copiesToAdd) || copiesToAdd <= 0) {
                    console.log("Invalid number of copies. Must be a positive number.");
                    displayMenu(rl);
                    return true;
                }
                const [updatedBooks, message] = (0, books_1.updateBookCopies)(allBooks, bookId, copiesToAdd);
                console.log(message);
                if (updatedBooks) {
                    allBooks = updatedBooks;
                    yield (0, books_1.saveBooks)(allBooks);
                }
                displayMenu(rl);
            }));
        });
        return true;
    });
}
function handleRemoveBookCopies(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        rl.question("Enter Book ID to remove copies from: ", (bookIdStr) => {
            const bookId = parseInt(bookIdStr);
            if (isNaN(bookId)) {
                console.log("Invalid Book ID format.");
                displayMenu(rl);
                return true;
            }
            rl.question("Enter number of copies to remove: ", (copiesStr) => __awaiter(this, void 0, void 0, function* () {
                const copiesToRemove = parseInt(copiesStr);
                if (isNaN(copiesToRemove) || copiesToRemove <= 0) {
                    console.log("Invalid number of copies. Must be a positive number.");
                    displayMenu(rl);
                    return true;
                }
                const [updatedBooks, message] = (0, books_1.updateBookCopies)(allBooks, bookId, -copiesToRemove); // Pass negative value
                console.log(message);
                if (updatedBooks) {
                    allBooks = updatedBooks;
                    yield (0, books_1.saveBooks)(allBooks);
                }
                displayMenu(rl);
            }));
        });
        return true;
    });
}
function handleAddBook(rl) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        rl.question("Enter book title: ", (title) => {
            rl.question("Enter book author: ", (author) => {
                rl.question("Enter book genre: ", (genre) => {
                    rl.question("Enter published year: ", (publishedYearStr) => {
                        const published_year = parseInt(publishedYearStr);
                        if (isNaN(published_year)) {
                            console.log("Invalid published year.");
                            displayMenu(rl);
                            return true;
                        }
                        rl.question("Enter cover image URL: ", (cover_image) => {
                            rl.question("Enter edition count: ", (editionCountStr) => {
                                const edition_count = parseInt(editionCountStr);
                                if (isNaN(edition_count)) {
                                    console.log("Invalid edition count.");
                                    displayMenu(rl);
                                    return true;
                                }
                                rl.question("Enter book description: ", (description) => {
                                    rl.question("Enter number of copies: ", (copiesStr) => __awaiter(this, void 0, void 0, function* () {
                                        const copies = parseInt(copiesStr);
                                        if (isNaN(copies) || copies < 0) {
                                            console.log("Invalid number of copies.");
                                            displayMenu(rl);
                                            return true;
                                        }
                                        const newBookDetails = { title, author, genre, published_year, cover_image, edition_count, description, copies };
                                        allBooks = (0, books_1.addBook)(allBooks, newBookDetails);
                                        yield (0, books_1.saveBooks)(allBooks);
                                        console.log(`Book "${title}" added successfully with ID ${allBooks[allBooks.length - 1].id}.`);
                                        displayMenu(rl);
                                    }));
                                });
                            });
                        });
                    });
                });
            });
        });
        return true;
    });
}
function handleDisplayBooks() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        (0, books_1.displayBooks)(allBooks);
        return true;
    });
}
function handleDisplayUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!dataLoaded) {
            yield loadAllData();
        }
        (0, users_1.displayUsers)(allUsers);
        return true;
    });
}
function displayBorrowedRecords(records, users, books) {
    const table = new cli_table3_1.default({
        head: ['User Name', 'Book Title', 'Borrow Date', 'Return Date'],
        colWidths: [22, 32, 17, 17],
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
        colAligns: ['left', 'left', 'center', 'center']
    });
    records.forEach(record => {
        const user = users.find(u => u.user_id === record.user_id);
        const book = books.find(b => b.id === record.book_id);
        table.push([
            user ? user.name : 'Unknown',
            book ? book.title : 'Unknown',
            record.borrow_date,
            record.return_date || 'Not yet',
        ]);
    });
    console.log("\n╔═════════════════════════════════╗");
    console.log("║   ALL BORROWED BOOK RECORDS   ║");
    console.log("╚═════════════════════════════════╝");
    console.log(table.toString());
}
function displayOverdueRecords(records, users, books) {
    const table = new cli_table3_1.default({
        head: ['User Name', 'Book Title', 'Borrow Date', 'Days Overdue'],
        colWidths: [22, 32, 17, 17],
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
        colAligns: ['left', 'left', 'center', 'center']
    });
    const today = new Date();
    records.forEach(record => {
        if (!record.return_date) {
            const borrowDate = new Date(record.borrow_date);
            const timeDifference = today.getTime() - borrowDate.getTime();
            if (timeDifference > ONE_WEEK_IN_MILLISECONDS) {
                const user = users.find(u => u.user_id === record.user_id);
                const book = books.find(b => b.id === record.book_id);
                const daysOverdue = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) - 7;
                table.push([
                    user ? user.name : 'Unknown',
                    book ? book.title : 'Unknown',
                    record.borrow_date,
                    daysOverdue,
                ]);
            }
        }
    });
    console.log("\n╔═════════════════════════════════════════════════════╗");
    console.log("║   USERS WITH OVERDUE BOOKS (Not returned after 1 week)   ║");
    console.log("╚═════════════════════════════════════════════════════╝");
    console.log(table.toString());
}
function displayLateReturns(records, users, books) {
    const table = new cli_table3_1.default({
        head: ['User Name', 'Book Title', 'Borrow Date', 'Return Date', 'Days Late'],
        colWidths: [22, 32, 17, 17, 12],
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
        colAligns: ['left', 'left', 'center', 'center', 'center']
    });
    records.forEach(record => {
        if (record.return_date) {
            const borrowDate = new Date(record.borrow_date);
            const returnDate = new Date(record.return_date);
            const timeDifference = returnDate.getTime() - borrowDate.getTime();
            if (timeDifference > ONE_WEEK_IN_MILLISECONDS) {
                const user = users.find(u => u.user_id === record.user_id);
                const book = books.find(b => b.id === record.book_id);
                const daysLate = Math.floor((timeDifference - ONE_WEEK_IN_MILLISECONDS) / (1000 * 60 * 60 * 24));
                table.push([
                    user ? user.name : 'Unknown',
                    book ? book.title : 'Unknown',
                    record.borrow_date,
                    record.return_date,
                    daysLate,
                ]);
            }
        }
    });
    console.log("\n╔═══════════════════════════════════════════════════╗");
    console.log("║   USERS WITH LATE RETURNS (Returned after 1 week)   ║");
    console.log("╚═══════════════════════════════════════════════════╝");
    console.log(table.toString());
}
function displayMenu(rl) {
    console.log("\nLibrary Management System");
    console.log("1. Display list of books");
    console.log("2. Display list of users");
    console.log("3. Borrow a book");
    console.log("4. Return a book");
    console.log("5. Add a new user");
    console.log("6. Remove a user");
    console.log("7. Display all borrowed book records");
    console.log("8. Check Overdue Borrows (Not returned > 1 week)");
    console.log("9. Check Late Returns (Returned > 1 week)");
    console.log("10. Add a new book");
    console.log("11. Remove a Book from Library");
    console.log("12. Add Copies to a Book");
    console.log("13. Remove Copies from a Book");
    console.log("14. Exit");
    rl.question("Enter your choice (1-14): ", (choice) => __awaiter(this, void 0, void 0, function* () {
        switch (choice) {
            case "1":
                yield handleDisplayBooks();
                displayMenu(rl);
                break;
            case "2":
                yield handleDisplayUsers();
                displayMenu(rl);
                break;
            case "3":
                yield handleBorrowBook(rl);
                break;
            case "4":
                yield handleReturnBook(rl);
                break;
            case "5":
                yield handleAddUser(rl);
                break;
            case "6":
                yield handleRemoveUser(rl);
                break;
            case "7":
                if (!dataLoaded)
                    yield loadAllData();
                displayBorrowedRecords(allBorrowedBookRecords, allUsers, allBooks);
                displayMenu(rl);
                break;
            case "8":
                if (!dataLoaded)
                    yield loadAllData();
                displayOverdueRecords(allBorrowedBookRecords, allUsers, allBooks);
                displayMenu(rl);
                break;
            case "9":
                if (!dataLoaded)
                    yield loadAllData();
                displayLateReturns(allBorrowedBookRecords, allUsers, allBooks);
                displayMenu(rl);
                break;
            case "10":
                yield handleAddBook(rl);
                break;
            case "11":
                yield handleRemoveBook(rl);
                break;
            case "12":
                yield handleAddBookCopies(rl);
                break;
            case "13":
                yield handleRemoveBookCopies(rl);
                break;
            case "14":
                console.log("Exiting...");
                rl.close();
                break;
            default:
                console.log("Invalid choice. Please try again.");
                displayMenu(rl);
        }
    }));
    return true;
}
function showMenu() {
    const rl = readlineInterface.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    displayMenu(rl);
    return true;
}
showMenu();
