import { useEffect, useRef, useState } from "react";
import { Player } from "./classes/player";
import { Peanut } from "./classes/peanut";
import { Platform } from "./classes/platform";
import playerPositions from "./positions/player.json";
import peanutPositions from "./positions/peanutPositions.json";
import platformPositions from "./positions/platforms.json";
import { createImage } from "../../utils/createImage";

import jumpeffectSound from "../../assets/soundEffects/jump.mp3";
import eateffectSound from "../../assets/soundEffects/eat.mp3";

import gameBackGroundLevel1 from "../../assets/gameAssets/lvl1background.png";
import gameBackGroundLevel2 from "../../assets/gameAssets/lvl2background.png";
import gameBackGroundLevel3 from "../../assets/gameAssets/lvl3background.png";

import platformLevel1 from "../../assets/gameAssets/platformlv1.png";
import platformLevel2 from "../../assets/gameAssets/platformlv2.png";
import platformLevel3 from "../../assets/gameAssets/platformlv3.png";

import groundLevel1 from "../../assets/gameAssets/lv2ground.png";
import groundLevel2 from "../../assets/gameAssets/lv2ground.png";
import groundLevel3 from "../../assets/gameAssets/lvl3ground.png";
import groundLevel32 from "../../assets/gameAssets/lvl3ground2.png";

import peanutImage from "../../assets/gameAssets/peanut.svg";
import { S } from "./canvas.styles";
import { GameMenu } from "./gameMenu";

import Icon from "@mdi/react";
import {
    mdiVolumeHigh,
    mdiVolumeMedium,
    mdiVolumeLow,
    mdiVolumeOff,
} from "@mdi/js";

declare global {
    interface ScreenOrientation {
        lock(orientation: "portrait" | "landscape"): Promise<void>;
    }
}

const jumpeffect = new Audio(jumpeffectSound);
const eateffect = new Audio(eateffectSound);

const gameBgImages = [
    createImage(gameBackGroundLevel1),
    createImage(gameBackGroundLevel2),
    createImage(gameBackGroundLevel3),
];

const platformImages = [
    createImage(platformLevel1),
    createImage(platformLevel2),
    createImage(platformLevel3),
];

const groundImages = [
    createImage(groundLevel1),
    createImage(groundLevel2),
    createImage(groundLevel3),
    createImage(groundLevel32),
];

const keys = { right: { pressed: false }, left: { pressed: false } };

// GAME SETTINGS
const playerSpeed = 8;
const gravity = 0.5;
const levelUp = 10;

// Needed Variables
const platforms: Platform[] = [];
let counter = 0;

export const GameCanvas = (props: {walletAddress: string}) => {
    const [openGameMenu, setOpenGameMenu] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const sayacLabelRef = useRef<HTMLLabelElement | null>(null);
    const ContainerRef = useRef<HTMLDivElement | null>(null);
    const [volume, setVolume] = useState<number>(0);
    const [bisi, setBisi] = useState<number>(0);
    const [gameScore, setGameScore] = useState<string | undefined>();
    const [firstPixelDrawned, setFirstPixelDrawned] = useState(false);
    const [playerOption, setPlayerOption] = useState(0);
    const [updateAnimation, setUpdateAnimation] = useState(false);
    const [scaleRatio, setScaleRatio] = useState(1);

    const calculateScaleRatio = () => {
        const width = Math.min(window.outerWidth, window.innerWidth);

        if (width >= 1410) {
            setScaleRatio(1);
        } else if (width >= 1000 && width < 1410) {
            setScaleRatio(0.75);
        } else if (width >= 850 && width < 1000) {
            setScaleRatio(0.6);
        } else if (width >= 710 && width < 850) {
            setScaleRatio(0.5);
        }
        // else if (width >= 580 && width < 710) {
        //     setScaleRatio(0.4);
        // } else if (width >= 450 && width < 580) {
        //     setScaleRatio(0.3);
        // } else if (width < 450) {
        //     setScaleRatio(0.24);
        // }
    };

    useEffect(() => {
        calculateScaleRatio();
    }, []);

    const createMoveButtons = () => {
        let left = document.getElementById("left");
        let right = document.getElementById("right");
        let up = document.getElementById("up");
        let down = document.getElementById("down");

        if (!left && !right && !up && !down) {
            left = document.createElement("div");
            right = document.createElement("div");
            up = document.createElement("div");
            down = document.createElement("div");

            left.id = "LEFT";
            left.style.display = "flex";
            left.style.alignItems = "center";
            left.style.justifyContent = "center";
            left.style.position = "absolute";
            left.style.width = "75px";
            left.style.height = "75px";
            left.style.bottom = "-85px";
            left.style.left = `20px`;
            left.style.background = "#3C322E";
            left.innerText = "Left";
            left.style.borderRadius = "32px";
            left.style.userSelect = "none";

            right.id = "RIGHT";
            right.style.display = "flex";
            right.style.alignItems = "center";
            right.style.justifyContent = "center";
            right.style.position = "absolute";
            right.style.width = "75px";
            right.style.height = "75px";
            right.style.bottom = "-85px";
            right.style.left = `${20 + 75}px`;
            right.style.background = "#3C322E";
            right.innerText = "Right";
            right.style.borderRadius = "32px";
            right.style.userSelect = "none";

            up.id = "UP";
            up.style.display = "flex";
            up.style.alignItems = "center";
            up.style.justifyContent = "center";
            up.style.position = "absolute";
            up.style.width = "75px";
            up.style.height = "75px";
            up.style.bottom = "-85px";
            up.style.right = `20px`;
            up.style.background = "#3C322E";
            up.innerText = "UP";
            up.style.borderRadius = "32px";
            up.style.userSelect = "none";

            down.id = "DOWN";
            down.style.display = "flex";
            down.style.alignItems = "center";
            down.style.justifyContent = "center";
            down.style.position = "absolute";
            down.style.width = "75px";
            down.style.height = "75px";
            down.style.bottom = "-85px";
            down.style.right = `${20 + 75}px`;
            down.style.background = "#3C322E";
            down.innerText = "DOWN";
            down.style.borderRadius = "32px";
            down.style.userSelect = "none";
        }

        return { left, right, up, down };
    };

    const player = new Player(
        gravity,
        playerPositions[0].playerx,
        playerPositions[0].playery,
        playerSpeed,
        playerOption,
    );

    let random = Math.floor(Math.random() * peanutPositions[0].length);
    const peanut = new Peanut(
        peanutPositions[0][random].x,
        peanutPositions[0][random].y,
        peanutImage,
    );

    const levelChangeHandle = (
        context: CanvasRenderingContext2D,
        level: number,
    ) => {
        if (!context) {
            return;
        }

        let platformy = 657;

        if (level == 2) {
            platformy = 620;
            platforms[7] = new Platform(
                context,
                750,
                platformy,
                groundImages[level + 1],
            );
        }
        platforms[0] = new Platform(context, 0, platformy, groundImages[level]);

        for (var i = 0; i < platformPositions[level].length; i++) {
            platforms[i + 1] = new Platform(
                context,
                platformPositions[level][i]["platform-x"],
                platformPositions[level][i]["platform-y"],
                platformImages[level],
            );
        }

        context.drawImage(gameBgImages[level], 0, 0);
    };

    const move = (props: {
        keys: { right: { pressed: boolean }; left: { pressed: boolean } };
        Canvas: { width: number };
    }) => {
        const { keys, Canvas } = props;
        if (
            // sag gitme siniri
            keys.right.pressed &&
            (player.position.x + player.width) * scaleRatio < Canvas.width
        ) {
            player.velocity.x = player.speed;
            player.currentsprite = player.sprites[playerOption].right;
        } else if (keys.left.pressed && player.position.x > 0) {
            // sola gitme siniri
            player.velocity.x = -player.speed;
            player.currentsprite = player.sprites[playerOption].left;
        } else {
            player.velocity.x *= 0;
        }
    };

    useEffect(() => {
        jumpeffect.volume = volume / 100;
        eateffect.volume = volume / 100;
    }, [volume]);

    useEffect(() => {
        const Canvas = canvasRef.current;

        if (!Canvas) {
            console.log("not initiliaze yet...");
            return;
        }

        const context = Canvas.getContext("2d");

        const { left, right, up, down } = createMoveButtons();

        if (ContainerRef && scaleRatio < 0.75) {
            if (left && right && up && down) {
                const childs = ContainerRef.current?.children;

                if (childs !== undefined) {
                    Array.from(childs).forEach((child) => {
                        if (
                            child.id === "UP" ||
                            child.id === "DOWN" ||
                            child.id === "LEFT" ||
                            child.id === "RIGHT"
                        ) {
                            ContainerRef.current?.removeChild(child);
                        }
                    });

                    ContainerRef.current?.appendChild(left);
                    ContainerRef.current?.appendChild(right);
                    ContainerRef.current?.appendChild(up);
                    ContainerRef.current?.appendChild(down);
                }

                left.addEventListener("touchstart", () => {
                    keys.left.pressed = true;
                });
                right.addEventListener("touchstart", () => {
                    keys.right.pressed = true;
                });
                left.addEventListener("mousedown", () => {
                    keys.left.pressed = true;
                });
                right.addEventListener("mousedown", () => {
                    keys.right.pressed = true;
                });
                down.addEventListener("mousedown", () => {
                    if (
                        (level != 2 && player.position.y <= 556) ||
                        (level == 2 && player.position.y <= 519)
                    ) {
                        player.velocity.y += 1;
                    }
                });
                up.addEventListener("touchstart", () => {
                    if (player.velocity.y == 0) {
                        player.velocity.y -= 14.5;

                        jumpeffect.pause();
                        jumpeffect.currentTime = 0;
                        jumpeffect.play().catch(() => {});
                    }
                });
                up.addEventListener("mousedown", () => {
                    if (player.velocity.y == 0) {
                        player.velocity.y -= 14.5;

                        jumpeffect.pause();
                        jumpeffect.currentTime = 0;
                        jumpeffect.play().catch(() => {});
                    }
                });

                left.addEventListener("touchend", () => {
                    keys.left.pressed = false;
                });
                right.addEventListener("touchend", () => {
                    keys.right.pressed = false;
                });
                left.addEventListener("mouseup", () => {
                    keys.left.pressed = false;
                });
                right.addEventListener("mouseup", () => {
                    keys.right.pressed = false;
                });
            }
        }

        calculateScaleRatio();

        Canvas.width = 1410 * scaleRatio;
        Canvas.height = 698 * scaleRatio;

        context!.fillStyle = "#3C322E";
        context?.fillRect(0, 0, Canvas.width, Canvas.height);

        if (sayacLabelRef.current) {
            sayacLabelRef.current.style.display = "none";
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
            console.log("Unexpected Error: Context does not exist");
            return;
        }

        const resizeCanvas = () => {
            const width = Math.min(window.outerWidth, window.innerWidth);
            let scaleRatio = 1;

            if (width >= 1450) {
                scaleRatio = 1;
            } else if (width >= 1000 && width < 1450) {
                scaleRatio = 0.75;
            } else if (width >= 850 && width < 1000) {
                scaleRatio = 0.6;
            } else if (width >= 710 && width < 850) {
                scaleRatio = 0.5;
            }
            // else if (width >= 580 && width < 710) {
            //     scaleRatio = 0.4;
            // } else if (width >= 450 && width < 580) {
            //     scaleRatio = 0.3;
            // } else if (width < 450) {
            //     scaleRatio = 0.28;
            // }

            Canvas.width = Math.min(1410 * scaleRatio, 1410);
            Canvas.height = Math.min(698 * scaleRatio, 698);

            // Ölçek faktörüne göre tekrar çizim yap
            context.setTransform(
                scaleRatio <= 1 ? scaleRatio : 1,
                0,
                0,
                scaleRatio <= 1 ? scaleRatio : 1,
                0,
                0,
            );
            // Her türlü çizim işlevini buraya ekleyin...
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        let ramdomEx = random;

        const animate = () => {
            animationId = requestAnimationFrame(animate);
            context?.drawImage(gameBgImages[level], 0, -3);
            platforms.forEach((platform) => {
                platform.draw();
            });

            peanut.setContext(context);
            player.setContext(context);

            peanut.draw();
            player.update();

            move({ keys, Canvas });

            platforms.forEach((platform) => {
                // platformun üstünde durma checkleri
                if (
                    player.position.y + player.height <= platform.position.y &&
                    player.position.y + player.height + player.velocity.y >=
                        platform.position.y &&
                    player.position.x + player.width >=
                        platform.position.x + 10 &&
                    player.position.x <=
                        platform.position.x + platform.width - 10
                ) {
                    player.velocity.y = 0;
                }

                // fıstığı yeme koşulları
                if (
                    player.position.x + player.width >=
                        peanut.position.x + peanut.width - 50 &&
                    player.position.y + player.height >=
                        peanut.position.y + peanut.height - 50 &&
                    player.position.x + player.width <=
                        peanut.position.x + peanut.width + 50 &&
                    player.position.y + player.height <=
                        peanut.position.y + peanut.height + 50
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
                        const postData = {
                            field1: props.walletAddress,
                            field2: score,
                            field3: new Date(),
                        };

                        fetch("putScore.php", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify(postData),
                        })
                            .then((response) => response.json())
                            .catch((error) => {
                                console.error("Error:", error);
                            });

                    }
                    // Level UP POINT
                    if (counter % levelUp == 0 && counter != 0) {
                        level++;
                        if (level != 3) {
                            levelChangeHandle(context, level);
                            player.velocity.y = 0;
                            player.velocity.x = 0;
                            player.position.x = playerPositions[level].playerx;
                            player.position.y = playerPositions[level].playery;
                        }
                    }

                    // fıstık aynı yerde tekrar çıkmasın logic'i
                    while (ramdomEx == random && level != 3) {
                        random = Math.floor(
                            Math.random() * peanutPositions[level].length,
                        );
                    }

                    if (level != 3) {
                        peanut.position.x = peanutPositions[level][random].x;
                        peanut.position.y = peanutPositions[level][random].y;
                    }
                    ramdomEx = random;
                    eateffect.play().catch(() => {});
                }
            });
        };

        const start = async () => {
            setOpenGameMenu(false);
            level = 0;
            counter = 0;
            score = "";
            if (sayacLabelRef.current) {
                sayacLabelRef.current.style.display = "flex";
                sayacLabelRef.current.innerHTML = "00:00";
                sayacLabelRef.current.style.display = "flex";
            }
            random = Math.floor(Math.random() * peanutPositions[level].length);
            levelChangeHandle(context, level);
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
                score =
                    String(gameTime.timeMin).padStart(2, "0") +
                    ":" +
                    String(gameTime.timeSec).padStart(2, "0") +
                    ":" +
                    String(gameTime.timeMs).padStart(2, "0");
                if (sayacLabelRef.current)
                    sayacLabelRef.current.innerHTML = score;
                if (level == platformPositions.length) {
                    clearInterval(myfunc);
                }
            }, 10);
        };

        const onKeyUp = (e: KeyboardEvent) => {
            switch (e.keyCode) {
                case 65:
                    keys.left.pressed = false;
                    break;
                case 37:
                    keys.left.pressed = false;
                    break;
                case 68:
                    keys.right.pressed = false;
                    break;
                case 39:
                    keys.right.pressed = false;
                    break;
                case 87:
                    player.velocity.y -= 0.1;
                    break;
                case 38:
                    player.velocity.y -= 0.1;
                    break;
                case 32:
                    player.velocity.y -= 0.1;
                    break;
                default:
                    break;
            }
        };

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
                case 87:
                    if (player.velocity.y == 0) {
                        player.velocity.y -= 14.5;

                        jumpeffect.pause();
                        jumpeffect.currentTime = 0;
                        jumpeffect.play().catch(() => {});
                    }
                    break;
                case 38:
                    if (player.velocity.y == 0) {
                        player.velocity.y -= 14.5;
                        jumpeffect.pause();
                        jumpeffect.currentTime = 0;
                        jumpeffect.play().catch(() => {});
                    }
                    break;
                case 32:
                    if (player.velocity.y == 0) {
                        player.velocity.y -= 14.5;
                        jumpeffect.pause();
                        jumpeffect.currentTime = 0;
                        jumpeffect.play().catch(() => {});
                    }
                    break;
                case 83:
                    if (
                        (level != 2 && player.position.y <= 556) ||
                        (level == 2 && player.position.y <= 519)
                    ) {
                        player.velocity.y += 1;
                    }
                    break;
                case 40:
                    if (
                        (level != 2 && player.position.y <= 556) ||
                        (level == 2 && player.position.y <= 519)
                    ) {
                        player.velocity.y += 1;
                    }
                    break;
                default:
                    break;
            }
        };

        const drawFirstPixelForUser = () => {
            levelChangeHandle(context, level);
            animationId = requestAnimationFrame(animate);
            setTimeout(() => {
                cancelAnimationFrame(animationId);
            }, 20);
        };

        if (firstPixelDrawned && !updateAnimation) {
            window.addEventListener("keydown", onKeyDown);

            window.addEventListener("keyup", onKeyUp);

            start();
        }

        drawFirstPixelForUser();
        if (updateAnimation) {
            setUpdateAnimation(false);
        }

        setFirstPixelDrawned(true);

        context.drawImage(gameBgImages[0], 0, 0);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, [bisi]);

    function startGame() {
        // Google Analytics'e event gönderin
        (window as any).gtag("event", "button_click", {
            event_category: "interaction",
            event_label: "start_game", // Buton adını belirtin
            value: 2,
        });

        (window as any).gtag("event", "button_click", {
            event_category: "interaction",
            event_label: "game_start",
            value: 1,
            start_game: Date.now(),
        });

        setBisi(Date.now());
    }

    function changePlayer(value: number) {
        setPlayerOption(value);
        setUpdateAnimation(true);
        setBisi(Date.now());
    }

    return (
        <S.Container ref={ContainerRef}>
            <canvas ref={canvasRef} width={1410} height={698} />
            {openGameMenu === false && (
                <S.TimeLabel ref={sayacLabelRef}>00:00</S.TimeLabel>
            )}
            <S.VolumeBarContainer>
                {volume >= 75 && volume <= 100 && (
                    <Icon path={mdiVolumeHigh} size={1} />
                )}
                {volume >= 25 && volume < 75 && (
                    <Icon path={mdiVolumeMedium} size={1} />
                )}
                {volume >= 1 && volume < 25 && (
                    <Icon path={mdiVolumeLow} size={1} />
                )}
                {volume == 0 && <Icon path={mdiVolumeOff} size={1} />}
                <S.VolumeBarInput>
                    <S.VolumeBar
                        value={volume}
                        onChange={(value) => setVolume(value)}
                    />
                </S.VolumeBarInput>
            </S.VolumeBarContainer>
            {openGameMenu && <GameMenu
                score={gameScore}
                onStartClicked={() => startGame()}
                defaultChecked={playerOption}
                onPlayerOptionChanged={(value) => changePlayer(value)}
                wallet={props.walletAddress}
            />}
        </S.Container>
    );
};

export default GameCanvas;
