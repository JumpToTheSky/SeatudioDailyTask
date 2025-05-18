export interface SpriteConfig {
    x: number;
    y: number;
    width: number;
    height: number;
    imageSrc?: string;
    color?: string;
    visible?: boolean;
}
export declare class Sprite {
    x: number;
    y: number;
    width: number;
    height: number;
    image?: HTMLImageElement;
    color?: string;
    visible: boolean;
    isLoaded: boolean;
    constructor(config: SpriteConfig);
    draw(ctx: CanvasRenderingContext2D): void;
    update(deltaTime: number): void;
    isPointInside(px: number, py: number): boolean;
}
