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
    public status: TaskStatus;
    public createdAt: number;
    public dueDate?: string;
    public parentId?: number;
    public tagIds?: number[];

    constructor(
        id: number,
        title: string,
        priority: Priority = 'medium',
        description?: string,
        dueDate?: string,
        status: TaskStatus = TaskStatus.ToDo,
        createdAt?: number,
        parentId?: number,
        tagIds?: number[]
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.createdAt = createdAt || Date.now();
        this.dueDate = dueDate;
        this.parentId = parentId;
        this.tagIds = tagIds;
    }

    updateTaskStatus(newStatus: TaskStatus): boolean {
        this.status = newStatus;
        return true;
    }

    updateDetails(details: { title?: string; description?: string; priority?: Priority; dueDate?: string; parentId?: number | null; status?: TaskStatus; tagIds?: number[] }): boolean {
        if (details.title !== undefined) this.title = details.title;
        if (details.description !== undefined) this.description = details.description;
        if (details.priority !== undefined) this.priority = details.priority;
        if (details.dueDate !== undefined) this.dueDate = details.dueDate;
        if (details.parentId !== undefined) {
            this.parentId = details.parentId === null ? undefined : details.parentId;
        }
        if (details.status !== undefined) this.status = details.status;
        if (details.tagIds !== undefined) this.tagIds = details.tagIds;
        return true;
    }

    toPlainObject(): Omit<Task, 'toggleCompletion' | 'updateDetails' | 'toPlainObject' | 'addSubTask' | 'removeSubTask' | 'subtasks' | 'updateTaskStatus'> & { tagIds?: number[] } {
        const plainObject: Omit<Task, 'toggleCompletion' | 'updateDetails' | 'toPlainObject' | 'addSubTask' | 'removeSubTask' | 'subtasks' | 'updateTaskStatus'> & { tagIds?: number[] } = {
            id: this.id,
            title: this.title,
            description: this.description,
            priority: this.priority,
            status: this.status,
            createdAt: this.createdAt,
            dueDate: this.dueDate,
            parentId: this.parentId,
        };

        if (this.tagIds && this.tagIds.length > 0) {
            plainObject.tagIds = this.tagIds;
        }

        return plainObject;
    }

    static fromPlainObject(obj: any): Task {
        let status = TaskStatus.ToDo;
        if (obj.status) {
            status = obj.status as TaskStatus;
        } else if (obj.completed !== undefined) {
            status = obj.completed ? TaskStatus.Done : TaskStatus.ToDo;
        }

        const task = new Task(
            obj.id,
            obj.title,
            obj.priority,
            obj.description,
            obj.dueDate,
            status,
            obj.createdAt,
            obj.parentId,
            obj.tagIds
        );
        return task;
    }
}