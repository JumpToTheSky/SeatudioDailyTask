import { loadDataFromJSON } from './utils';

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

export function displayBooks(books: Book[]) {
    console.log("\nList of Books:");
    books.forEach(book => {
        console.log(`- ${book.title} by ${book.author} (${book.published_year})`);
        console.log(`  Genre: ${book.genre}`);
        console.log(`  Description: ${book.description}`);
        console.log(`  Copies Available: ${book.copies}`);
        console.log("--------------------------------------------------");
    });
}

export async function fetchBooks(): Promise<Book[]> {
    const books = await loadDataFromJSON<Book>('../library_book.json');
    return books;
}