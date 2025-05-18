import { Sprite, SpriteConfig } from './Sprite';
export interface ButtonConfig extends SpriteConfig {
    text?: string;
    textColor?: string;
    font?: string;
    onClick?: () => void;
}
export declare class Button extends Sprite {
    text?: string;
    textColor: string;
    font: string;
    onClick?: () => void;
    constructor(config: ButtonConfig);
    draw(ctx: CanvasRenderingContext2D): void;
    triggerClick(): void;
}
