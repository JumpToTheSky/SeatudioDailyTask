import { Sprite, type SpriteConfig } from './sprite.js'; 

export interface ButtonConfig extends SpriteConfig {
    text?: string;
    textColor?: string;
    font?: string;
    onClick?: () => void;
}

export class Button extends Sprite {
    public text?: string;
    public textColor: string;
    public font: string;
    public onClick?: () => void;

    constructor(config: ButtonConfig) {
        super(config);
        this.text = config.text;
        this.textColor = config.textColor || 'white';
        this.font = config.font || '16px Arial';
        this.onClick = config.onClick;

        if (!config.imageSrc && !config.color) {
            this.color = 'blue';
        }
    }

    public override draw(context: CanvasRenderingContext2D): void { 
        if (!this.visible) return;

        super.draw(context); 

        if (this.text) {
            context.fillStyle = this.textColor;
            context.font = this.font;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    public triggerClick(): void {
        if (this.onClick) {
            this.onClick();
        }
    }
}