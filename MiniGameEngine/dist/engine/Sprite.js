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
    draw(context) {
        if (!this.visible)
            return;
        if (this.image && this.isLoaded && this.image.complete && this.image.naturalWidth > 0) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else if (this.color) {
            context.fillStyle = this.color;
            context.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    update(deltaTime) {
    }
    isPointInside(pointX, pointY) {
        return (pointX >= this.x &&
            pointX <= this.x + this.width &&
            pointY >= this.y &&
            pointY <= this.y + this.height);
    }
}
//# sourceMappingURL=sprite.js.map