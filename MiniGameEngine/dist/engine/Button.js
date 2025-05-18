import { Sprite } from './Sprite';
export class Button extends Sprite {
    constructor(config) {
        super(config);
        this.text = config.text;
        this.textColor = config.textColor || 'white';
        this.font = config.font || '16px Arial';
        this.onClick = config.onClick;
        if (!config.imageSrc && !config.color) {
            this.color = 'blue';
        }
    }
    draw(ctx) {
        if (!this.visible)
            return;
        super.draw(ctx);
        if (this.text) {
            ctx.fillStyle = this.textColor;
            ctx.font = this.font;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        }
    }
    triggerClick() {
        if (this.onClick) {
            this.onClick();
        }
    }
}
//# sourceMappingURL=Button.js.map