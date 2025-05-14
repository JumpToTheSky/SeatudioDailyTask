export type Priority = "low" | "medium" | "high";

export enum TaskStatus {
    ToDo = "todo",
    InProgress = "in-progress",
    Done = "done",
    Cancelled = "cancelled"
}

export class Task {
    public id: number;
    public title: string;
    public description?: string;
    public priority: Priority;
    public status: TaskStatus; // Changed from completed
    public createdAt: number;
    public dueDate?: string;
    public parentId?: number; // ID of the parent task
    public tagIds?: number[]; // Changed from tags: string[]

    constructor(
        id: number,
        title: string,
        priority: Priority = 'medium',
        description?: string,
        dueDate?: string,
        status: TaskStatus = TaskStatus.ToDo, // Changed from completed
        createdAt?: number, 
        parentId?: number,
        tagIds?: number[] // Changed from tags: string[]
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status; // Changed from completed
        this.createdAt = createdAt || Date.now();
        this.dueDate = dueDate;
        this.parentId = parentId;
        this.tagIds = tagIds; // Initialize tagIds
    }

    // Renamed and updated method
    updateTaskStatus(newStatus: TaskStatus): boolean {
        this.status = newStatus;
        return true;
    }

    updateDetails(details: { title?: string; description?: string; priority?: Priority; dueDate?: string; parentId?: number | null; status?: TaskStatus; tagIds?: number[] }): boolean { // Changed tags to tagIds
        if (details.title !== undefined) this.title = details.title;
        if (details.description !== undefined) this.description = details.description;
        if (details.priority !== undefined) this.priority = details.priority;
        if (details.dueDate !== undefined) this.dueDate = details.dueDate;
        if (details.parentId !== undefined) {
            this.parentId = details.parentId === null ? undefined : details.parentId;
        }
        if (details.status !== undefined) this.status = details.status; // Added status update
        if (details.tagIds !== undefined) this.tagIds = details.tagIds; // Changed tags to tagIds
        return true;
    }

    // Phương thức để chuyển đổi instance thành object thuần túy để lưu trữ
    toPlainObject(): Omit<Task, 'toggleCompletion' | 'updateDetails' | 'toPlainObject' | 'addSubTask' | 'removeSubTask' | 'subtasks' | 'updateTaskStatus'> & { tagIds?: number[] } { // Changed tags to tagIds
        const plainObject: Omit<Task, 'toggleCompletion' | 'updateDetails' | 'toPlainObject' | 'addSubTask' | 'removeSubTask' | 'subtasks' | 'updateTaskStatus'> & { tagIds?: number[] } = { // Changed tags to tagIds
            id: this.id,
            title: this.title,
            description: this.description,
            priority: this.priority,
            status: this.status, // Changed from completed
            createdAt: this.createdAt,
            dueDate: this.dueDate,
            parentId: this.parentId,
        };

        if (this.tagIds && this.tagIds.length > 0) {
            plainObject.tagIds = this.tagIds; // Changed tags to tagIds
        }

        return plainObject;
    }

    // Phương thức static để tạo Task từ object thuần túy (khi load từ file)
    static fromPlainObject(obj: any): Task {
        let status = TaskStatus.ToDo; // Default status
        if (obj.status) {
            status = obj.status as TaskStatus;
        } else if (obj.completed !== undefined) { // For backward compatibility
            status = obj.completed ? TaskStatus.Done : TaskStatus.ToDo;
        }

        const task = new Task(
            obj.id,
            obj.title,
            obj.priority,
            obj.description,
            obj.dueDate,
            status, // Use determined status
            obj.createdAt,
            obj.parentId,
            obj.tagIds // Changed from obj.tags
        );
        return task;
    }
}