import react from 'react';
import {Player} from './classes/player';
import {Peanut} from './classes/peanut';
import {Platform} from './classes/platform';
import playerPositions from './positions/player.json';
import peanutPositions from './positions/peanutPositions.json';
import platformPositions from './positions/platforms.json';
import {createImage} from '../../utils/createImage';

import gameBackGroundLevel1 from '../../assets/gameAssets/lvl1background.png';
import gameBackGroundLevel2 from '../../assets/gameAssets/lvl2background.png';
import gameBackGroundLevel3 from '../../assets/gameAssets/lvl3background.png';

import platformLevel1 from '../../assets/gameAssets/platformlv1.png';
import platformLevel2 from '../../assets/gameAssets/platformlv2.png';
import platformLevel3 from '../../assets/gameAssets/platformlv3.png';

import groundLevel1 from '../../assets/gameAssets/lv2ground.png';
import groundLevel2 from '../../assets/gameAssets/lv2ground.png';
import groundLevel3 from '../../assets/gameAssets/lvl3ground.png';
import groundLevel32 from '../../assets/gameAssets/lvl3ground2.png';

import peanutImage from '../../assets/gameAssets/peanut1.png';

const Canvas = document.createElement('canvas');
const context = Canvas.getContext('2d');
context!.fillStyle = '#000';
context?.fillRect(0, 0, Canvas.width, Canvas.height);
const sayacLabel = document.createElement('label');
let weFuckedUp: string;

const gameBgImages = [
    createImage(gameBackGroundLevel1),
    createImage(gameBackGroundLevel2),
    createImage(gameBackGroundLevel3),
]

const platformImages = [
    createImage(platformLevel1),
    createImage(platformLevel2),
    createImage(platformLevel3),
]

const groundImages = [
    createImage(groundLevel1),
    createImage(groundLevel2),
    createImage(groundLevel3),
    createImage(groundLevel32),
]

const keys = {right: {pressed: false }, left: {pressed: false}};

const peanutImg = createImage(peanutImage);

// GAME SETTINGS
const playerSpeed = 8;
const gravity = 0.5;
const levelUp = 10;

// Needed Variables
const platforms: Platform[] = [];
const gameTime = {
    timeMin: 0,
    timeSec: 0,
    timeMs: 0,
};
let counter = 0;
let score;
Canvas.width = 1410;
Canvas.height = 698;
sayacLabel.style.display = 'none';
sayacLabel.innerHTML = "00:00";

export const GameCanvas = () => {
    let animationId: number;
    let level = 0;

    if (!context) {
        return <img src={Canvas.toDataURL()} />;
    }

    let random = Math.floor(Math.random() * peanutPositions[level].length);
    let ramdomEx = random;
    const peanut = new Peanut(context, peanutPositions[level][random].x, peanutPositions[level][random].y, peanutImage);
    const player = new Player(gravity, Canvas, context, playerPositions[level].playerx, playerPositions[level].playery, playerSpeed, 0);

    const beforeStart = () => {
        init()
        animate();
        setTimeout(() => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }
        }, 10);
        console.log('?');
        start();
    }

    const init = () => {
        levelChangeHandle(context);
    }

    const levelChangeHandle = (context: CanvasRenderingContext2D) => {
        if (!context) {
            return;
        }

        let platformy = 657;

        if (level == 2) {
            platformy = 620;
            platforms[7] = new Platform(context, 750, platformy, groundImages[level+1]);
        }
        platforms[0] = new Platform(context, 0, platformy, groundImages[level]);

        for (var i = 0; i < platformPositions[level].length; i++) {
            platforms[i + 1] = new Platform(context, platformPositions[level][i]['platform-x'], platformPositions[level][i]['platform-y'], platformImages[level]);
        }

        context.drawImage(gameBgImages[level], 0, 0);
    };

    const animate = () => {
        animationId = requestAnimationFrame(animate);
        context?.drawImage(gameBgImages[level], 0, -3);
        platforms.forEach(platform => {
            platform.draw();
        })
        peanut.draw();
        player.update();

        if ( // sag gitme siniri
            keys.right.pressed &&
            player.position.x + player.width < Canvas.width
        ) {
            player.velocity.x = player.speed;
        } else if (keys.left.pressed && player.position.x > 0) { // sola gitme siniri
            player.velocity.x = -player.speed;
        } else {
            player.velocity.x *= 0;
        }

        platforms.forEach(platform => {
            // platformun üstünde durma checkleri
            if (
                player.position.y + player.height <= platform.position.y &&
                player.position.y + player.height + player.velocity.y >= platform.position.y &&
                player.position.x + player.width >= platform.position.x + 10 &&
                player.position.x <= platform.position.x + platform.width - 10
            ) {
                player.velocity.y = 0;
            }

            // fıstığı yeme koşulları
            if (
                player.position.x + player.width >= peanut.position.x + peanut.width - 50 &&
                player.position.y + player.height >= peanut.position.y + peanut.height - 50 &&
                player.position.x + player.width <= peanut.position.x + peanut.width + 50 &&
                player.position.y + player.height <= peanut.position.y + peanut.height + 50
            ) {
                counter++;
                // GameOver Check Point
                if (level == 3) {
                    peanut.position.x = -50;
                    peanut.position.y = -50;
                    cancelAnimationFrame(animationId);
                }
                // Level UP POINT
                if (counter % levelUp == 0 && counter != 0) {
                    level++;
                    if (level != 3) {
                        levelChangeHandle(context!);
                        player.position.x = playerPositions[level].playerx;
                        player.position.y = playerPositions[level].playery;
                    }
                }

                // fıstık aynı yerde tekrar çıkmasın logic'i
                while (ramdomEx == random && level != 3) { 
                    random = Math.floor(Math.random() * peanutPositions[level].length);
                }

                if (level != 3) {
                    peanut.position.x = peanutPositions[level][random].x;
                    peanut.position.y = peanutPositions[level][random].y;
                }
                ramdomEx = random;
            }
            weFuckedUp = Canvas.toDataURL();
        })
    }

    const start = () => {
            level = 0;
            counter = 0;
            sayacLabel.style.display = 'flex';
            sayacLabel.innerHTML = "00:00";
            sayacLabel.style.display = 'flex';
            random = Math.floor(Math.random() * peanutPositions[level].length);
            init();
            animate();
            var myfunc = setInterval(function Gametime() {
                gameTime.timeMs++;
                if (gameTime.timeMs == 100) {
                    gameTime.timeMs = 0;
                    gameTime.timeSec++;
                    if (gameTime.timeSec == 60) {
                        gameTime.timeMin++;
                        gameTime.timeSec = 0;
                    }
                }
                score = String(gameTime.timeMin).padStart(2, '0') + ":" + String(gameTime.timeSec).padStart(2, '0') + ":" + String(gameTime.timeMs).padStart(2, '0');
                sayacLabel.innerHTML = score;
                if (level == platformPositions.length) {
                    clearInterval(myfunc);
                }
            }, 10)
    }

    context.drawImage(gameBgImages[0], 0, 0);

    beforeStart();

    const canvasContainer = document.createElement('div');
    canvasContainer.appendChild(Canvas);

    return canvasContainer;
}
