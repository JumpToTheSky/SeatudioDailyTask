import { Button } from './Button';
export class MiniGameEngine {
    constructor(canvasId) {
        this.gameObjects = [];
        this.lastTime = 0;
        const canvasElement = document.getElementById(canvasId);
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
    setupInputHandlers() {
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    }
    handleCanvasClick(event) {
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
    add(gameObject) {
        this.gameObjects.push(gameObject);
    }
    remove(gameObject) {
        this.gameObjects = this.gameObjects.filter(obj => obj !== gameObject);
    }
    start() {
        if (this.animationFrameId) {
            console.warn("Engine already started.");
            return;
        }
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
        console.log("MiniGameEngine started.");
    }
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = undefined;
            console.log("MiniGameEngine stopped.");
        }
    }
    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        this.update(deltaTime);
        this.render();
        this.animationFrameId = requestAnimationFrame(this.gameLoop.bind(this));
    }
    update(deltaTime) {
        const allLoaded = this.gameObjects.every(obj => obj.isLoaded);
        if (!allLoaded) {
            return;
        }
        for (const obj of this.gameObjects) {
            obj.update(deltaTime);
        }
    }
    render() {
        const allLoaded = this.gameObjects.every(obj => obj.isLoaded);
        if (!allLoaded)
            return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (const obj of this.gameObjects) {
            obj.draw(this.ctx);
        }
    }
    getCanvas() {
        return this.canvas;
    }
    getContext() {
        return this.ctx;
    }
}
//# sourceMappingURL=MiniGameEngine.js.map