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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataStorage = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const tasksFilePath = path.join(__dirname, '..', '..', 'tasks.json');
const tagsFilePath = path.join(__dirname, '..', '..', 'tag.json');
function autoSaveLoad(filePath) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (data, callback, ...args) {
            if (typeof callback !== 'function') {
                throw new Error(`Callback is not a function in method ${propertyKey}`);
            }
            const fileData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];
            const result = originalMethod.apply(this, [fileData, callback, ...args]);
            fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');
            return result;
        };
        return descriptor;
    };
}
class DataStorage {
    static modifyTasks(data, callback) {
        return callback(data);
    }
    static modifyTags(data, callback) {
        return callback(data);
    }
}
exports.DataStorage = DataStorage;
__decorate([
    autoSaveLoad(tasksFilePath),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Function]),
    __metadata("design:returntype", typeof (_a = typeof T !== "undefined" && T) === "function" ? _a : Object)
], DataStorage, "modifyTasks", null);
__decorate([
    autoSaveLoad(tagsFilePath),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Function]),
    __metadata("design:returntype", typeof (_b = typeof T !== "undefined" && T) === "function" ? _b : Object)
], DataStorage, "modifyTags", null);
