import { Button } from './button.js';
export class MiniGameEngine {
    constructor(canvasId) {
        this.gameObjects = [];
        this.lastTimestamp = 0;
        const element = document.getElementById(canvasId);
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
    setupInputHandlers() {
        this.canvasElement.addEventListener('click', this.handleCanvasClick.bind(this));
    }
    handleCanvasClick(event) {
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
    addGameObject(gameObject) {
        this.gameObjects.push(gameObject);
    }
    removeGameObject(gameObject) {
        this.gameObjects = this.gameObjects.filter(obj => obj !== gameObject);
    }
    start() {
        if (this.animationFrameId) {
            console.warn("Engine already started.");
            return;
        }
        this.lastTimestamp = performance.now();
        this.runGameLoop(this.lastTimestamp);
        console.log("MiniGameEngine started.");
    }
    stop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = undefined;
            console.log("MiniGameEngine stopped.");
        }
    }
    runGameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTimestamp);
        //khong can doi sang s!
        this.lastTimestamp = currentTime;
        this.updateGameObjects(deltaTime);
        this.renderGameObjects();
        this.animationFrameId = requestAnimationFrame(this.runGameLoop.bind(this));
    }
    updateGameObjects(deltaTime) {
        const allAssetsLoaded = this.gameObjects.every(obj => obj.isLoaded);
        if (!allAssetsLoaded) {
            return;
        }
        for (const obj of this.gameObjects) {
            obj.update(deltaTime);
        }
    }
    renderGameObjects() {
        const allAssetsLoaded = this.gameObjects.every(obj => obj.isLoaded);
        if (!allAssetsLoaded)
            return;
        this.renderingContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
        for (const obj of this.gameObjects) {
            obj.draw(this.renderingContext);
        }
    }
    getCanvasElement() {
        return this.canvasElement;
    }
    getRenderingContext() {
        return this.renderingContext;
    }
}
//# sourceMappingURL=miniGameEngine.js.map