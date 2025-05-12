import { fetchBooks, displayBooks, Book } from './books';
import { fetchUsers, displayUsers, User } from './users';
import { borrowBook, returnBook } from './utils';

let allBooks: Book[] = [];
let allUsers: User[] = [];
let dataLoaded = false;

async function loadAllData() {
    if (!dataLoaded) {
        allBooks = await fetchBooks();
        allUsers = await fetchUsers();
        dataLoaded = true;
        console.log("Initial book and user data loaded.");
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

            readline.question("Enter Book ID to borrow: ", (bookIdStr: string) => {
                const bookId = parseInt(bookIdStr);
                const book = allBooks.find(b => b.id === bookId);

                if (!book) {
                    console.log("Book not found.");
                    displayMenu();
                    return;
                }

                const [success, message] = borrowBook(user, book);
                console.log(message);
                // Note: Changes are in-memory. To persist, you'd need to write back to JSON files.
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

            readline.question("Enter Book ID to return: ", (bookIdStr: string) => {
                const bookId = parseInt(bookIdStr);
                
                const [success, message] = returnBook(user, bookId, allBooks);
                console.log(message);
                // Note: Changes are in-memory. To persist, you'd need to write back to JSON files.
                displayMenu();
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
        readline.question("Enter your choice (1-5): ", async (choice: string) => {
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
                    console.log("Exiting...");
                    readline.close();
                    break;
                default:
                    console.log("Invalid choice. Please try again.");
                    displayMenu();
            }
        });
    }
    // Initial load can be done here or lazily as implemented
    // loadAllData().then(displayMenu); 
    displayMenu(); // Start with menu, load data on demand
}

showMenu();