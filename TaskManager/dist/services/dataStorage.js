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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTasksFromFile = loadTasksFromFile;
exports.saveTasksToFile = saveTasksToFile;
exports.loadTagsFromFile = loadTagsFromFile;
exports.saveTagsToFile = saveTagsToFile;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const tasksFilePath = path.join(__dirname, '..', '..', 'tasks.json');
const tagsFilePath = path.join(__dirname, '..', '..', 'tag.json');
function loadTasksFromFile() {
    try {
        if (!fs.existsSync(tasksFilePath)) {
            console.warn(`Warning: Tasks file not found at ${tasksFilePath}. Returning empty array.`);
            return [];
        }
        const data = fs.readFileSync(tasksFilePath, 'utf-8');
        const plainTasks = JSON.parse(data);
        return plainTasks;
    }
    catch (error) {
        console.error("Error loading tasks from file:", error);
        return [];
    }
}
function saveTasksToFile(tasks) {
    try {
        const data = JSON.stringify(tasks, null, 2);
        fs.writeFileSync(tasksFilePath, data, 'utf-8');
    }
    catch (error) {
        console.error("Error saving tasks to file:", error);
    }
}
function loadTagsFromFile() {
    try {
        if (!fs.existsSync(tagsFilePath)) {
            console.warn(`Warning: Tags file not found at ${tagsFilePath}. Returning empty array.`);
            return [];
        }
        const data = fs.readFileSync(tagsFilePath, 'utf-8');
        const plainTags = JSON.parse(data);
        return plainTags;
    }
    catch (error) {
        console.error("Error loading tags from file:", error);
        return [];
    }
}
function saveTagsToFile(tags) {
    try {
        const data = JSON.stringify(tags, null, 2);
        fs.writeFileSync(tagsFilePath, data, 'utf-8');
    }
    catch (error) {
        console.error("Error saving tags to file:", error);
    }
}
