"use strict";
// src/users.ts
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
exports.displayUsers = displayUsers;
exports.fetchUsers = fetchUsers;
exports.addUser = addUser;
exports.removeUser = removeUser;
exports.saveUsers = saveUsers;
const module_1 = require("./module");
const cli_table3_1 = __importDefault(require("cli-table3"));
function displayUsers(users) {
    const table = new cli_table3_1.default({
        head: ['ID', 'Name', 'Email', 'Phone', 'Address'],
        colWidths: [5, 20, 30, 15, 30],
        style: { head: ['black', 'bgWhite'] },
        wordWrap: true, // Enable word wrapping
    });
    users.forEach(user => {
        table.push([
            user.user_id,
            user.name,
            user.email,
            user.phone,
            user.address,
        ]);
    });
    console.log("\nList of Users:");
    console.log(table.toString());
    return true;
}
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        // Thay đổi đường dẫn ở đây
        const users = yield (0, module_1.loadDataFromJSON)('./data/library_user.json');
        return users;
    });
}
function addUser(users, newUserDetails) {
    const maxId = users.reduce((max, user) => (user.user_id > max ? user.user_id : max), 0);
    const newUser = Object.assign(Object.assign({}, newUserDetails), { user_id: maxId + 1 });
    return [...users, newUser];
}
function removeUser(users, userIdToRemove) {
    const initialLength = users.length;
    const updatedUsers = users.filter(user => user.user_id !== userIdToRemove);
    const userWasRemoved = updatedUsers.length < initialLength;
    return [updatedUsers, userWasRemoved];
}
function saveUsers(users) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Thay đổi đường dẫn ở đây
            yield (0, module_1.saveDataToJSON)('./data/library_user.json', users);
            console.log("User data saved successfully.");
            return true;
        }
        catch (error) {
            console.error("Failed to save user data:", error);
            return false;
        }
    });
}
