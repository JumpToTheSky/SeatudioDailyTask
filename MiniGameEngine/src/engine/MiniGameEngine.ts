import { Sprite } from './sprite.js'; 
import { Button } from './button.js'; 

type GameObject = Sprite | Button; 

export class MiniGameEngine {
    private canvasElement: HTMLCanvasElement; 
    private renderingContext: CanvasRenderingContext2D; 
    private gameObjects: GameObject[] = [];
    private lastTimestamp: number = 0; 
    private animationFrameId?: number;

    constructor(canvasId: string) {
        const element = document.getElementById(canvasId) as HTMLCanvasElement; 
        if (!element) {
            throw new Error(`Canvas with id "${canvasId}" not found.`);
        }
        this.canvasElement = element;

        const context = this.canvasElement.getContext('2d');
        if (!context) {
            throw new Error('Failed to get 2D rendering context.');
        }
        this.renderingContext = context;

        this.setupInputHandlers();
    }

    private setupInputHandlers(): void {
        this.canvasElement.addEventListener('click', this.handleCanvasClick.bind(this));
    }

    private handleCanvasClick(event: MouseEvent): void {
        const canvasRect = this.canvasElement.getBoundingClientRect(); 
        const clickX = event.clientX - canvasRect.left;
        const clickY = event.clientY - canvasRect.top;

        for (let i = this.gameObjects.length - 1; i >= 0; i--) {
            const obj = this.gameObjects[i];
            if (obj instanceof Button && obj.visible && obj.isPointInside(clickX, clickY)) {
                obj.triggerClick();
                return;
            }
        }
    }

    public addGameObject(gameObject: GameObject): void { 
        this.gameObjects.push(gameObject);
    }

    public removeGameObject(gameObject: GameObject): void { 
        this.gameObjects = this.gameObjects.filter(obj => obj !== gameObject);
    }

    public start(): void {
        if (this.animationFrameId) {
            console.warn("Engine already started.");
            return;
        }
        this.lastTimestamp = performance.now();
        this.runGameLoop(this.lastTimestamp); 
        console.log("MiniGameEngine started.");
    }

    public stop(): void {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = undefined;
            console.log("MiniGameEngine stopped.");
        }
    }

    private runGameLoop(currentTime: number): void { 
        const deltaTime = (currentTime - this.lastTimestamp) / 1000;
        //khong can doi sang s!
        this.lastTimestamp = currentTime;

        this.updateGameObjects(deltaTime); 
        this.renderGameObjects(); 

        this.animationFrameId = requestAnimationFrame(this.runGameLoop.bind(this));
    }

    private updateGameObjects(deltaTime: number): void { 
        const allAssetsLoaded = this.gameObjects.every(obj => obj.isLoaded); 
        if (!allAssetsLoaded) {
            return;
        }
        
        for (const obj of this.gameObjects) {
            obj.update(deltaTime);
        }
    }

    private renderGameObjects(): void { 
        const allAssetsLoaded = this.gameObjects.every(obj => obj.isLoaded);
        if (!allAssetsLoaded) return;

        this.renderingContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

        for (const obj of this.gameObjects) {
            obj.draw(this.renderingContext);
        }
    }

    public getCanvasElement(): HTMLCanvasElement { 
        return this.canvasElement;
    }

    public getRenderingContext(): CanvasRenderingContext2D { 
        return this.renderingContext;
    }
}