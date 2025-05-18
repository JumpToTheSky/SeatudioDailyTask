import { Sprite } from './Sprite';
import { Button } from './Button';
type GameObject = Sprite | Button;
export declare class MiniGameEngine {
    private canvas;
    private ctx;
    private gameObjects;
    private lastTime;
    private animationFrameId?;
    constructor(canvasId: string);
    private setupInputHandlers;
    private handleCanvasClick;
    add(gameObject: GameObject): void;
    remove(gameObject: GameObject): void;
    start(): void;
    stop(): void;
    private gameLoop;
    private update;
    private render;
    getCanvas(): HTMLCanvasElement;
    getContext(): CanvasRenderingContext2D;
}
export {};
