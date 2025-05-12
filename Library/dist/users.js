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
exports.displayUsers = displayUsers;
exports.fetchUsers = fetchUsers;
const utils_1 = require("./utils");
function displayUsers(users) {
    console.log("\nList of Users:");
    users.forEach(user => {
        console.log(`- ${user.name} (${user.email})`);
        console.log(`  Phone: ${user.phone}`);
        console.log(`  Address: ${user.address}`);
        console.log("  Borrowed Books:");
        user.borrowed_books.forEach(b => {
            console.log(`    - Book ID: ${b.book_id} (Borrow: ${b.borrow_date}, Return: ${b.return_date})`);
        });
        console.log("--------------------------------------------------");
    });
}
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield (0, utils_1.loadDataFromJSON)('../library_user.json');
        return users;
    });
}
