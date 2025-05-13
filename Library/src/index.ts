import { fetchBooks, displayBooks, Book, saveBooks } from './books';
import { fetchUsers, displayUsers, User, addUser, removeUser, saveUsers, BorrowedBook } from './users';
import { borrowBook, returnBook, fetchBorrowedBooks, saveBorrowedBooks } from './module';

let allBooks: Book[] = [];
let allUsers: User[] = [];
let allBorrowedBookRecords: BorrowedBook[] = [];
let dataLoaded = false;

async function loadAllData() {
    if (!dataLoaded) {
        allBooks = await fetchBooks();
        allUsers = await fetchUsers();
        allBorrowedBookRecords = await fetchBorrowedBooks();
        dataLoaded = true;
        console.log("Initial book, user, and borrowed book data loaded.");
    }
}

function showMenu() {
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    async function handleBorrowBook() {
        if (!dataLoaded) {
            await loadAllData();
        }

        readline.question("Enter User ID to borrow: ", (userIdStr: string) => {
            const userId = parseInt(userIdStr);
            const user = allUsers.find(u => u.user_id === userId);

            if (!user) {
                console.log("User not found.");
                displayMenu();
                return;
            }

            readline.question("Enter Book ID to borrow: ", async (bookIdStr: string) => {
                const bookId = parseInt(bookIdStr);
                const book = allBooks.find(b => b.id === bookId);

                if (!book) {
                    console.log("Book not found.");
                    displayMenu();
                    return;
                }

                const [newBorrowedRecord, message] = borrowBook(user, book);
                console.log(message);
                if (newBorrowedRecord) {
                    allBorrowedBookRecords.push(newBorrowedRecord);
                    await saveUsers(allUsers);
                    await saveBooks(allBooks);
                    await saveBorrowedBooks(allBorrowedBookRecords);
                }
                displayMenu();
            });
        });
    }

    async function handleReturnBook() {
        if (!dataLoaded) {
            await loadAllData();
        }

        readline.question("Enter User ID returning the book: ", (userIdStr: string) => {
            const userId = parseInt(userIdStr);
            const user = allUsers.find(u => u.user_id === userId);

            if (!user) {
                console.log("User not found.");
                displayMenu();
                return;
            }

            const userActiveBorrows = allBorrowedBookRecords.filter(
                b => b.user_id === userId && !b.return_date
            );

            if (userActiveBorrows.length === 0) {
                console.log(`${user.name} has no active borrows to return.`);
                displayMenu();
                return;
            }

            console.log(`${user.name}'s actively borrowed books:`);
            userActiveBorrows.forEach(b => {
                const bookDetails = allBooks.find(book => book.id === b.book_id);
                console.log(`  - ID: ${b.book_id}, Title: ${bookDetails ? bookDetails.title : 'Unknown Title'}, Borrowed: ${b.borrow_date}`);
            });

            readline.question("Enter Book ID to return: ", async (bookIdStr: string) => {
                const bookId = parseInt(bookIdStr);
                
                const [updatedBorrowedRecords, message] = returnBook(allBorrowedBookRecords, userId, bookId, allBooks);
                console.log(message);
                if (updatedBorrowedRecords) {
                    allBorrowedBookRecords = updatedBorrowedRecords;
                    await saveBooks(allBooks);
                    await saveBorrowedBooks(allBorrowedBookRecords);
                }
                displayMenu();
            });
        });
    }

    async function handleAddUser() {
        if (!dataLoaded) {
            await loadAllData();
        }
        readline.question("Enter new user's name: ", (name: string) => {
            readline.question("Enter new user's email: ", (email: string) => {
                readline.question("Enter new user's phone: ", (phone: string) => {
                    readline.question("Enter new user's address: ", async (address: string) => {
                        const newUserDetails = { name, email, phone, address };
                        allUsers = addUser(allUsers, newUserDetails);
                        await saveUsers(allUsers);
                        console.log(`User "${name}" added successfully with ID ${allUsers[allUsers.length -1].user_id}.`);
                        displayMenu();
                    });
                });
            });
        });
    }

    async function handleRemoveUser() {
        if (!dataLoaded) {
            await loadAllData();
        }
        readline.question("Enter User ID to remove: ", async (userIdStr: string) => {
            const userId = parseInt(userIdStr);
            if (isNaN(userId)) {
                console.log("Invalid User ID format.");
                displayMenu();
                return;
            }

            const [updatedUsers, userWasRemoved] = removeUser(allUsers, userId);
            if (userWasRemoved) {
                allUsers = updatedUsers;
                await saveUsers(allUsers);
                console.log(`User ID ${userId} removed successfully.`);
            } else {
                console.log(`User ID ${userId} not found.`);
            }
            displayMenu();
        });
    }

    function displayMenu() {
        console.log("\nLibrary Management System");
        console.log("1. Display list of books");
        console.log("2. Display list of users");
        console.log("3. Borrow a book");
        console.log("4. Return a book");
        console.log("5. Add a new user");
        console.log("6. Remove a user");
        console.log("7. Display all borrowed book records");
        console.log("8. Exit");
        readline.question("Enter your choice (1-8): ", async (choice: string) => {
            switch (choice) {
                case "1":
                    if (!dataLoaded) await loadAllData();
                    displayBooks(allBooks);
                    displayMenu();
                    break;
                case "2":
                    if (!dataLoaded) await loadAllData();
                    displayUsers(allUsers);
                    displayMenu();
                    break;
                case "3":
                    await handleBorrowBook();
                    break;
                case "4":
                    await handleReturnBook();
                    break;
                case "5":
                    await handleAddUser();
                    break;
                case "6":
                    await handleRemoveUser();
                    break;
                case "7":
                    if (!dataLoaded) await loadAllData();
                    console.log("\nAll Borrowed Book Records:");
                    allBorrowedBookRecords.forEach(b => {
                        const user = allUsers.find(u => u.user_id === b.user_id);
                        const book = allBooks.find(bk => bk.id === b.book_id);
                        console.log(`- User: ${user ? user.name : 'Unknown'}, Book: ${book ? book.title : 'Unknown'}, Borrowed: ${b.borrow_date}, Returned: ${b.return_date || 'Not yet'}`);
                    });
                    displayMenu();
                    break;
                case "8":
                    console.log("Exiting...");
                    readline.close();
                    break;
                default:
                    console.log("Invalid choice. Please try again.");
                    displayMenu();
            }
        });
    }
    displayMenu();
}

showMenu();