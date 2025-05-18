// src/engine/sprite.ts
export interface SpriteConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    imageSrc?: string;
    color?: string;
    visible?: boolean;
}

export class Sprite {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public image?: HTMLImageElement;
    public color?: string;
    public visible: boolean;
    public isLoaded: boolean = false;

    constructor(config: SpriteConfig) {
        this.x = config.x;
        this.y = config.y;
        this.width = config.width;
        this.height = config.height;
        this.color = config.color;
        this.visible = config.visible !== undefined ? config.visible : true;

        if (config.imageSrc) {
            this.image = new Image();
            this.image.onload = () => {
                this.isLoaded = true;
            };
            this.image.onerror = () => {
                console.error(`Failed to load image: ${config.imageSrc}`);
                this.isLoaded = true;
            }
            this.image.src = config.imageSrc;
        } else {
            this.isLoaded = true;
        }
    }

    public draw(context: CanvasRenderingContext2D): void { 
        if (!this.visible) return;

        if (this.image && this.isLoaded && this.image.complete && this.image.naturalWidth > 0) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else if (this.color) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    public update(deltaTime: number): void {
        
    }

    public isPointInside(pointX: number, pointY: number): boolean { 
        return (
            pointX >= this.x &&
            pointX <= this.x + this.width &&
            pointY >= this.y &&
            pointY <= this.y + this.height
        );
    }
}