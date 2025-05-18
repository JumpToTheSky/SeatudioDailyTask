import { Sprite } from './sprite.js';
import { Button } from './button.js';
type GameObject = Sprite | Button;
export declare class MiniGameEngine {
    private canvasElement;
    private renderingContext;
    private gameObjects;
    private lastTimestamp;
    private animationFrameId?;
    constructor(canvasId: string);
    private setupInputHandlers;
    private handleCanvasClick;
    addGameObject(gameObject: GameObject): void;
    removeGameObject(gameObject: GameObject): void;
    start(): void;
    stop(): void;
    private runGameLoop;
    private updateGameObjects;
    private renderGameObjects;
    getCanvasElement(): HTMLCanvasElement;
    getRenderingContext(): CanvasRenderingContext2D;
}
export {};
