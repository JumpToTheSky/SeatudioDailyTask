import { Sprite } from './Sprite';
import { Button } from './Button';

type GameObject = Sprite | Button; 

export class MiniGameEngine {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private gameObjects: GameObject[] = [];
    private lastTime: number = 0;
    private animationFrameId?: number;

    constructor(canvasId: string) {
        const canvasElement = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvasElement) {
            throw new Error(`Canvas with id "${canvasId}" not found.`);
        }
        this.canvas = canvasElement;

        const context = this.canvas.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D rendering context.');
        }
        this.ctx = context;

        this.setupInputHandlers();
    }

    private setupInputHandlers(): void {
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    }

    private handleCanvasClick(event: MouseEvent): void {
        const rect = this.canvas.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const clickY = event.clientY - rect.top;

        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            const obj = this.gameObjects[i];
            if (obj instanceof Button && obj.visible && obj.isPointInside(clickX, clickY)) {
                obj.triggerClick();
                return; 
            }
        }
    }

    public add(gameObject: GameObject): void {
        this.gameObjects.push(gameObject);
    }

    public remove(gameObject: GameObject): void {
        this.gameObjects = this.gameObjects.filter(obj => obj !== gameObject);
    }

    public start(): void {
        if (this.animationFrameId) {
            console.warn("Engine already started.");
            return;
        }
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
        console.log("MiniGameEngine started.");
    }

    public stop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = undefined;
            console.log("MiniGameEngine stopped.");
        }
    }

    private gameLoop(currentTime: number): void {
        const deltaTime = (currentTime - this.lastTime) / 1000; 
        this.lastTime = currentTime;

        this.update(deltaTime);
        this.render();

        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }

    private update(deltaTime: number): void {
        const allLoaded = this.gameObjects.every(obj => obj.isLoaded);
        if (!allLoaded) {
            return; 
        }
        
        for (const obj of this.gameObjects) {
            obj.update(deltaTime);
        }
    }

    private render(): void {
        const allLoaded = this.gameObjects.every(obj => obj.isLoaded);
        if (!allLoaded) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (const obj of this.gameObjects) {
            obj.draw(this.ctx);
        }
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getContext(): CanvasRenderingContext2D {
        return this.ctx;
    }
}