export type Priority = 'low' | 'medium' | 'high';

export interface Task {
    id: number;
    title: string;
    description?: string;
    completed: boolean;
    priority: Priority;
    createdAt: Date;
    dueDate?: Date;
}
