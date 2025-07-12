import {createImage} from '../../../utils/createImage';

export class Peanut {
    private context: CanvasRenderingContext2D | null;
    public position: {x: number, y: number};
    public width: number;
    public height: number;
    public image: CanvasImageSource;

    constructor(x: number, y: number, image: string) {
        this.position = {
            x,
            y
        }
        this.image = createImage(image);

        this.width = 40;
        this.height = 30;
        this.context = null;
    }

    setContext(context: CanvasRenderingContext2D) {
        if (this.context) return;

        this.context = context;
    }

    draw() {
        if (!this.context) return;

        this.context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
}
