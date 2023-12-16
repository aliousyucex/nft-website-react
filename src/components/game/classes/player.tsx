import {createImage} from '../../../utils/createImage';

import PlayerOneLeft from '../../../assets/gameAssets/playeroneleft.png'
import PlayerOneRight from '../../../assets/gameAssets/playeroneright.png'
import PlayerTwoLeft from '../../../assets/gameAssets/playertwoleft.png'
import PlayerTwoRight from '../../../assets/gameAssets/playertworight.png'
import PlayerThreeLeft from '../../../assets/gameAssets/playerthreeleft.png'
import PlayerThreeRight from '../../../assets/gameAssets/playerthreeright.png'

export class Player {
    private gravity: number;
    private sprites : {left: CanvasImageSource, right: CanvasImageSource}[];
    private currentsprite: CanvasImageSource;
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    public position: {x: number, y: number};
    public velocity: {x: number, y: number} = {x: 0, y: 0};
    public speed: number;
    public width: number;
    public height: number;

    constructor(
        gravity: number,
        canvas: HTMLCanvasElement,
        c: CanvasRenderingContext2D,
        x: number,
        y: number,
        speed: number,
        playerImg: number
    ) {
        this.position = {x, y};
        this.speed = speed;
        this.width = 80;
        this.height = 80;
        this.canvas = canvas;
        this.gravity = gravity;
        this.sprites = [
                {
                    left: createImage(PlayerOneLeft),
                    right: createImage(PlayerOneRight)
                },
                {
                    left: createImage(PlayerTwoLeft),
                    right: createImage(PlayerTwoRight)
                },
                {
                    left: createImage(PlayerThreeLeft),
                    right: createImage(PlayerThreeRight)
                }
            ]
        this.context = c;
        this.currentsprite = this.sprites[playerImg].left;
    }
    draw() {
        this.context.drawImage(this.currentsprite, this.position.x, this.position.y);
    }
    update() {
        this.draw();
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;

        if (this.position.y + this.height + this.velocity.y <= this.canvas.height - 3) {
            this.velocity.y += this.gravity
        } else {
            this.velocity.y = 0;
        }
    }
}
