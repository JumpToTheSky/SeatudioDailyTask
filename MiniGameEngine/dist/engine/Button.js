import { Sprite } from './sprite.js';
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
    draw(context) {
        if (!this.visible)
            return;
        super.draw(context);
        if (this.text) {
            context.fillStyle = this.textColor;
            context.font = this.font;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);
        }
    }
    triggerClick() {
        if (this.onClick) {
            this.onClick();
        }
    }
}
//# sourceMappingURL=button.js.map