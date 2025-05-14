import * as fs from 'fs';
import * as path from 'path';
import { Task } from '../model/Task';

const DATA_FILE_PATH = path.join(__dirname, '..', '..', 'data.json'); // Trỏ ra ngoài thư mục src

// Định nghĩa kiểu dữ liệu cho object Task thuần túy mà chúng ta lưu trữ
type PlainTaskObject = Omit<Task, 'toggleCompletion' | 'updateDetails' | 'toPlainObject' | 'fromPlainObject'>;


export class DataStorageService {
    constructor(private filePath: string = DATA_FILE_PATH) {}

    loadTasks(): PlainTaskObject[] {
        try {
            if (fs.existsSync(this.filePath)) {
                const fileContent = fs.readFileSync(this.filePath, 'utf-8');
                if (fileContent.trim() === "") return [];
                const plainObjects = JSON.parse(fileContent);
                // Có thể thêm bước xác thực dữ liệu ở đây nếu cần
                return plainObjects as PlainTaskObject[];
            }
            return [];
        } catch (error) {
            console.error(`Error loading tasks from ${this.filePath}:`, error);
            return [];
        }
    }

    saveTasks(tasks: PlainTaskObject[]): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(tasks, null, 2), 'utf-8');
        } catch (error) {
            console.error(`Error saving tasks to ${this.filePath}:`, error);
        }
    }

    // (Tùy chọn) Hàm khởi tạo file nếu chưa có
    initializeDataFile(): void {
        if (!fs.existsSync(this.filePath)) {
            try {
                fs.writeFileSync(this.filePath, '[]', 'utf-8');
                console.log(`Data file created at: ${this.filePath}`);
            } catch (error)
            {
                console.error(`Error creating data file at ${this.filePath}:`, error);
            }
        }
    }
}