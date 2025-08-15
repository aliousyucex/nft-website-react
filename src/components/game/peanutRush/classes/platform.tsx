export class Platform {
    private context: CanvasRenderingContext2D;
    public position: {x: number, y: number};
    public width: number;
    public height: number;
    public image: HTMLImageElement;

    constructor(context: CanvasRenderingContext2D, x: number, y: number, image: HTMLImageElement) {
        this.position = {
            x,
            y
        }
        this.image = image;

        this.width = image.width;
        this.height = image.height;
        this.context = context;
    }
    draw() {
        this.context.drawImage(this.image, this.position.x, this.position.y)
    }
}
