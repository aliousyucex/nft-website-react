import {createImage} from '../../../utils/createImage';

export class Peanut {
    private context: CanvasRenderingContext2D;
    public position: {x: number, y: number};
    public width: number;
    public height: number;
    public image: CanvasImageSource;

    constructor(context: CanvasRenderingContext2D, x: number, y: number, image: string) {
        this.position = {
            x,
            y
        }
        this.image = createImage(image);

        this.width = 40;
        this.height = 30;
        this.context = context;
    }

    draw() {
        this.context.drawImage(this.image, this.position.x, this.position.y)
    }
}
