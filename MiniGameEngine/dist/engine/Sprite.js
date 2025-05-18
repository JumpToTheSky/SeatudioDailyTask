export class Sprite {
    constructor(config) {
        this.isLoaded = false;
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
            };
            this.image.src = config.imageSrc;
        }
        else {
            this.isLoaded = true;
        }
    }
    draw(ctx) {
        if (!this.visible)
            return;
        if (this.image && this.isLoaded && this.image.complete && this.image.naturalWidth > 0) {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else if (this.color) {
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    update(deltaTime) {
    }
    isPointInside(px, py) {
        return (px >= this.x &&
            px <= this.x + this.width &&
            py >= this.y &&
            py <= this.y + this.height);
    }
}
//# sourceMappingURL=Sprite.js.map