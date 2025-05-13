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
exports.addUser = addUser;
exports.removeUser = removeUser;
exports.saveUsers = saveUsers;
const module_1 = require("./module");
function displayUsers(users) {
    console.log("\nList of Users:");
    users.forEach(user => {
        console.log(`- ${user.name} (${user.email}) [ID: ${user.user_id}]`);
        console.log(`  Phone: ${user.phone}`);
        console.log(`  Address: ${user.address}`);
        console.log("--------------------------------------------------");
    });
    return true;
}
function fetchUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield (0, module_1.loadDataFromJSON)('../library_user.json');
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
            yield (0, module_1.saveDataToJSON)('../library_user.json', users);
            console.log("User data saved successfully.");
            return true;
        }
        catch (error) {
            console.error("Failed to save user data:", error);
            return false;
        }
    });
}
