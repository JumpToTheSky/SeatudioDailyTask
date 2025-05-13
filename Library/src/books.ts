import { loadDataFromJSON, saveDataToJSON } from './module';

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
    console.log("\nList of Books:");
    books.forEach(book => {
        console.log(`- ${book.title} by ${book.author} (${book.published_year})`);
        console.log(`  Genre: ${book.genre}`);
        console.log(`  Description: ${book.description}`);
        console.log(`  Copies Available: ${book.copies}`);
        console.log("--------------------------------------------------");
    });
    return true;
}

export async function fetchBooks(): Promise<Book[]> {
    const books = await loadDataFromJSON<Book>('../library_book.json');
    return books;
}

export async function saveBooks(books: Book[]): Promise<boolean> {
    try {
        await saveDataToJSON<Book>('../library_book.json', books);
        console.log("Book data saved successfully.");
        return true;
    } catch (error) {
        console.error("Failed to save book data:", error);
        return false;
    }
}