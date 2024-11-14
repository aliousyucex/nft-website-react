import { useEffect, useRef, useState } from 'react';
import { Player } from './classes/player';
import { Peanut } from './classes/peanut';
import { Platform } from './classes/platform';
import playerPositions from './positions/player.json';
import peanutPositions from './positions/peanutPositions.json';
import platformPositions from './positions/platforms.json';
import { createImage } from '../../utils/createImage';

import jumpeffectSound from '../../assets/soundEffects/jump.mp3';
import eateffectSound from '../../assets/soundEffects/eat.mp3';

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
import { S } from './canvas.styles';
import { GameMenu } from './gameMenu';

import Icon from '@mdi/react';
import { mdiVolumeHigh, mdiVolumeMedium, mdiVolumeLow, mdiVolumeOff } from '@mdi/js';
import { Switch, Tooltip } from 'antd';

const jumpeffect = new Audio(jumpeffectSound);
const eateffect = new Audio(eateffectSound);

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

const keys = { right: { pressed: false }, left: { pressed: false } };

// GAME SETTINGS
const playerSpeed = 8;
const gravity = 0.5;
const levelUp = 10;

// Needed Variables
const platforms: Platform[] = [];
let counter = 0;

export const GameCanvas = (props: { containerRef: React.RefObject<HTMLDivElement> }) => {
    const [openGameMenu, setOpenGameMenu] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sayacLabelRef = useRef<HTMLLabelElement | null>(null);
    const [volume, setVolume] = useState<number>(0);
    const [bisi, setBisi] = useState<number>(0);
    const [gameScore, setGameScore] = useState<string | undefined>();
    const [firstPixelDrawned, setFirstPixelDrawned] = useState(false);
    const [playerOption, setPlayerOption] = useState(0);
    const [updateAnimation, setUpdateAnimation] = useState(false);
    const [focusGame, setFocusGame] = useState(false);

    useEffect(() => {
        if (focusGame) {
            window.document.body.style.overflow = 'hidden';
            if (props.containerRef.current) {
                props.containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            window.document.body.style.overflow = 'visible';
        }
    }, [focusGame])

    useEffect(() => {
        jumpeffect.volume = volume / 100;
        eateffect.volume = volume / 100;
    }, [volume])

    useEffect(() => {
        const Canvas = canvasRef.current;

        if (!Canvas) {
            console.log('not initiliaze yet...');
            return;
        }

        const context = Canvas.getContext('2d');

        context!.fillStyle = '#ccc';
        context?.fillRect(0, 0, Canvas.width, Canvas.height);
        Canvas.width = 1410;
        Canvas.height = 698;


        if (sayacLabelRef.current) {
            sayacLabelRef.current.style.display = 'none';
            sayacLabelRef.current.innerHTML = "00:00";
        }

        let animationId: number;
        let level = 0;
        let score: string;
        const gameTime = {
            timeMin: 0,
            timeSec: 0,
            timeMs: 0,
        };

        if (!context) {
            console.log('Unexpected Error: Context does not exist')
            return;
        }

        let random = Math.floor(Math.random() * peanutPositions[level].length);
        let ramdomEx = random;
        const peanut = new Peanut(context, peanutPositions[level][random].x, peanutPositions[level][random].y, peanutImage);
        const player = new Player(gravity, Canvas, context, playerPositions[level].playerx, playerPositions[level].playery, playerSpeed, playerOption);

        const levelChangeHandle = (context: CanvasRenderingContext2D) => {
            if (!context) {
                return;
            }

            let platformy = 657;

            if (level == 2) {
                platformy = 620;
                platforms[7] = new Platform(context, 750, platformy, groundImages[level + 1]);
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
                    eateffect.pause();
                    eateffect.currentTime = 0;
                    counter++;
                    // GameOver Check Point
                    if (level == 3) {
                        peanut.position.x = -50;
                        peanut.position.y = -50;
                        setGameScore(score);
                        cancelAnimationFrame(animationId);
                        setOpenGameMenu(true);
                    }
                    // Level UP POINT
                    if (counter % levelUp == 0 && counter != 0) {
                        level++;
                        if (level != 3) {
                            levelChangeHandle(context!);
                            player.velocity.y = 0;
                            player.velocity.x = 0;
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
                    eateffect.play().catch(() => { });
                }
            })
        }

        const start = () => {
            setOpenGameMenu(false);
            level = 0;
            counter = 0;
            score = '';
            if (sayacLabelRef.current) {
                sayacLabelRef.current.style.display = 'flex';
                sayacLabelRef.current.innerHTML = "00:00";
                sayacLabelRef.current.style.display = 'flex';
            }
            random = Math.floor(Math.random() * peanutPositions[level].length);
            levelChangeHandle(context);
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
                if (sayacLabelRef.current) sayacLabelRef.current.innerHTML = score;
                if (level == platformPositions.length) {
                    clearInterval(myfunc);
                }
            }, 10)
        }

        const onKeyUp = (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case 65: keys.left.pressed = false; break;
                case 37: keys.left.pressed = false; break;
                case 68: keys.right.pressed = false; break;
                case 39: keys.right.pressed = false; break;
                case 87: player.velocity.y -= 0.1; break;
                case 38: player.velocity.y -= 0.1; break;
                case 32: player.velocity.y -= 0.1; break;
                default: break;
            }
        }

        const onKeyDown = (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case 65:

                    player.currentsprite = player.sprites[playerOption].left;
                    keys.left.pressed = true;
                    break;
                case 37:

                    player.currentsprite = player.sprites[playerOption].left;
                    keys.left.pressed = true;
                    break;
                case 68:

                    player.currentsprite = player.sprites[playerOption].right;
                    keys.right.pressed = true;
                    break;
                case 39:

                    player.currentsprite = player.sprites[playerOption].right;
                    keys.right.pressed = true;
                    break;
                case 87: if (player.velocity.y == 0) {

                    player.velocity.y -= 14.5;

                    jumpeffect.pause();
                    jumpeffect.currentTime = 0;
                    jumpeffect.play().catch(() => { });

                }; break;
                case 38: if (player.velocity.y == 0) {

                    player.velocity.y -= 14.5;
                    jumpeffect.pause();
                    jumpeffect.currentTime = 0;
                    jumpeffect.play().catch(() => { });
                };
                    break;
                case 32: if (player.velocity.y == 0) {

                    player.velocity.y -= 14.5;
                    jumpeffect.pause();
                    jumpeffect.currentTime = 0;
                    jumpeffect.play().catch(() => { });
                };
                    break;
                case 83: if ((level != 2 && player.position.y <= 556) || (level == 2 && player.position.y <= 519)) { player.velocity.y += 1; }; break;
                case 40: if ((level != 2 && player.position.y <= 556) || (level == 2 && player.position.y <= 519)) { player.velocity.y += 1; }; break;
                default: break;

            }
        };

        const drawFirstPixelForUser = () => {
            levelChangeHandle(context);
            animationId = requestAnimationFrame(animate);
            setTimeout(() => {
                cancelAnimationFrame(animationId)
            }, 20)
        };

        if (firstPixelDrawned && !updateAnimation) {
            window.addEventListener('keydown', onKeyDown);

            window.addEventListener('keyup', onKeyUp)

            start();
        }

        drawFirstPixelForUser();
        if (updateAnimation) {
            setUpdateAnimation(false);
        }

        setFirstPixelDrawned(true);

        context.drawImage(gameBgImages[0], 0, 0);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        }
    }, [bisi])

    function startGame() {
        setBisi(Date.now());
    }

    function changePlayer(value: number) {
        setPlayerOption(value);
        setUpdateAnimation(true);
        setBisi(Date.now());
    }

    return (
        <S.Container>
            <canvas ref={canvasRef} width={1410} height={698} />
            {openGameMenu === false && <S.TimeLabel ref={sayacLabelRef}>00:00</S.TimeLabel>}
            <S.VolumeBarContainer>
                <Tooltip
                    placement="bottom"
                    title="Focus here and say goodbye to scrolling distractions"
                >
                    <S.FocusSpace>
                        <S.FocusLabel>
                            Focus
                        </S.FocusLabel>
                        <Switch checked={focusGame} onChange={() => setFocusGame(!focusGame)}></Switch>
                    </S.FocusSpace>
                </Tooltip>
                {volume >= 75 && volume <= 100 && <Icon path={mdiVolumeHigh} size={1} />}
                {volume >= 25 && volume < 75 && <Icon path={mdiVolumeMedium} size={1} />}
                {volume >= 1 && volume < 25 && <Icon path={mdiVolumeLow} size={1} />}
                {volume == 0 && <Icon path={mdiVolumeOff} size={1} />}
                <S.VolumeBarInput>
                    <S.VolumeBar value={volume} onChange={(value) => setVolume(value)} />
                </S.VolumeBarInput>
            </S.VolumeBarContainer>
            <GameMenu
                open={openGameMenu}
                score={gameScore}
                onStartClicked={() => startGame()}
                defaultChecked={playerOption}
                onPlayerOptionChanged={(value) => changePlayer(value)}
            />
        </S.Container>
    );
}

export default GameCanvas;
