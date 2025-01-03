import {createImage} from '../../../utils/createImage';

import PlayerOneLeft from '../../../assets/gameAssets/playeroneleft.svg'
import PlayerOneRight from '../../../assets/gameAssets/playeroneright.svg'
import PlayerTwoLeft from '../../../assets/gameAssets/playertwoleft.svg'
import PlayerTwoRight from '../../../assets/gameAssets/playertworight.svg'
import PlayerThreeLeft from '../../../assets/gameAssets/playerthreeleft.svg'
import PlayerThreeRight from '../../../assets/gameAssets/playerthreeright.svg'

export class Player {
    private gravity: number;
    public sprites : {left: CanvasImageSource, right: CanvasImageSource}[];
    public currentsprite: CanvasImageSource;
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
        this.context.drawImage(this.currentsprite, this.position.x, this.position.y, this.width, this.height);
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
