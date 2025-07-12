import { Flex } from "antd";
import { S } from "./story.styles";
import storyOne from "../../assets/story/storyOne.png";
import storyTwo from "../../assets/story/storyTwo.png";
import storyThree from "../../assets/story/storyThree.png";
import storyFour from "../../assets/story/storyFour.png";
import { useEffect, useState } from "react";

const LargeStoryText = (
    <S.InnerContainer vertical wrap="wrap">
        <S.ModalTitle style={{ textAlign: "center" }}>
            Toothless and the Red Peanuts: A Journey of Loss and Hope
        </S.ModalTitle>
        <Flex gap={24} wrap="wrap">
            <Flex gap={24} align="center" justify="center">
                <S.stroyImg src={storyOne} />
                <Flex vertical gap={24}>
                    <S.Text>
                        Toothless, a curious and gentle elephant, woke up every
                        morning with the first rays of sunlight, taking in the
                        fresh scent of nature as he set off on his walk. Tasting
                        new plants brought him peace and happiness.
                    </S.Text>
                    <S.Text>
                        <S.PuncLines>
                            But that day, everything would change.
                        </S.PuncLines>
                    </S.Text>
                </Flex>
            </Flex>

            <Flex vertical wrap="wrap">
                <S.Text>
                    Deep in the forest, his eyes caught sight of something
                    unusual: peanuts glimmering like gold in the grass. These
                    were treats he had never tasted before, like tiny treasures.
                    With a joyful trumpet, he rushed to eat the peanuts, their
                    taste almost enchanting him.
                </S.Text>
                <S.Text>
                    The peanuts led Toothless deeper into the forest. With every
                    step, he eagerly collected the golden treats, until
                    suddenly, he came across a massive pile at the end of the
                    path. But something was wrong: the peanuts were no longer
                    golden; they had turned a disturbing shade of blood red. He
                    approached curiously and touched them with his trunk, only
                    to realize that the red color had stained him.
                </S.Text>
            </Flex>

            <Flex gap={24} align="center">
                <S.Text>
                    Toothless heard a faint groan and turned his eyes to focus
                    on a figure lying next to the pile. It was a member of his
                    tribe. Her tusks had been cruelly severed, and her lifeless
                    body was drenched in blood. The red stains on Toothless’s
                    trunk became a heavy mark of guilt and sorrow. The once
                    loving eyes, filled with trust, were now empty and lifeless.
                </S.Text>
                <S.stroyImg src={storyTwo} />
            </Flex>

            <Flex gap={24} align="center" vertical>
                <S.Text>
                    Toothless stepped back in fear. The joyful morning had
                    turned into a nightmare in the blink of an eye. His scream
                    pierced the sky, his anguish echoing through the entire
                    forest. When he heard a rustle, it felt as if his heart
                    would stop. From the bushes, a human figure emerged, wearing
                    a cruel smile. The hunter was carrying the tusks of his
                    friends on his back.
                </S.Text>
                <S.Text>
                    Toothless was paralyzed with fear. He wanted to raise his
                    trunk and warn his herd, but the terror that gripped his
                    throat silenced him.
                </S.Text>
            </Flex>

            <Flex gap={24} align="center">
                <S.stroyImg src={storyThree} />
                <S.Text>
                    At that moment, a terrifying explosion echoed through the
                    forest. One by one, his friends fell to the ground; their
                    cries were cut short by gunfire. As tears streamed down his
                    cheeks, his whole world plunged into darkness. The hunter
                    approached Toothless but did not aim his weapon at him. It
                    was then that Toothless realized: he had been spared because
                    he was toothless.
                </S.Text>
            </Flex>

            <Flex gap={24} align="center">
                <S.Text>
                    A thought gnawed at his mind:{" "}
                    <S.PuncLines>
                        “Am I lucky or worthless because I have no
                        ivory?”
                    </S.PuncLines>{" "}
                    The very flaw he had once lamented had saved his life, yet a
                    deep sense of guilt weighed heavy on his heart.
                </S.Text>
            </Flex>

            <Flex gap={24} align="center">
                <S.Text>
                    For days, Toothless carried the burden of being the sole
                    survivor. But his grief slowly turned into determination. He
                    vowed to become the voice, the legacy, of his family and
                    friends; he swore to tell their story to the world.
                </S.Text>
                <S.stroyImg src={storyFour} />
            </Flex>
        </Flex>
    </S.InnerContainer>
);

const smallStoryText = (
    <S.InnerContainer vertical align="center" justify="center">
        <S.ModalTitle style={{ textAlign: "center" }}>
            Toothless and the Red Peanuts: A Journey of Loss and Hope
        </S.ModalTitle>
        <Flex gap={24} vertical wrap="wrap" align="center" justify="center">
            <S.stroyImg src={storyOne} />
            <S.Text>
                Toothless, a curious and gentle elephant, woke up every morning
                with the first rays of sunlight, taking in the fresh scent of
                nature as he set off on his walk. Tasting new plants brought him
                peace and happiness.
            </S.Text>
            <S.Text>
                <S.PuncLines>
                    But that day, everything would change.
                </S.PuncLines>
            </S.Text>

            <S.Text>
                Deep in the forest, his eyes caught sight of something unusual:
                peanuts glimmering like gold in the grass. These were treats he
                had never tasted before, like tiny treasures. With a joyful
                trumpet, he rushed to eat the peanuts, their taste almost
                enchanting him.
            </S.Text>
            <S.Text>
                The peanuts led Toothless deeper into the forest. With every
                step, he eagerly collected the golden treats, until suddenly, he
                came across a massive pile at the end of the path. But something
                was wrong: the peanuts were no longer golden; they had turned a
                disturbing shade of blood red. He approached curiously and
                touched them with his trunk, only to realize that the red color
                had stained him.
            </S.Text>
            <S.Text>
                Toothless heard a faint groan and turned his eyes to focus on a
                figure lying next to the pile. It was a member of his tribe. Her
                tusks had been cruelly severed, and her lifeless body was
                drenched in blood. The red stains on Toothless’s trunk became a
                heavy mark of guilt and sorrow. The once loving eyes, filled
                with trust, were now empty and lifeless.
            </S.Text>
            <S.stroyImg src={storyTwo} />

            <S.Text>
                Toothless stepped back in fear. The joyful morning had turned
                into a nightmare in the blink of an eye. His scream pierced the
                sky, his anguish echoing through the entire forest. When he
                heard a rustle, it felt as if his heart would stop. From the
                bushes, a human figure emerged, wearing a cruel smile. The
                hunter was carrying the tusks of his friends on his back.
            </S.Text>
            <S.Text>
                Toothless was paralyzed with fear. He wanted to raise his trunk
                and warn his herd, but the terror that gripped his throat
                silenced him.
            </S.Text>

            <S.stroyImg src={storyThree} />
            <S.Text>
                At that moment, a terrifying explosion echoed through the
                forest. One by one, his friends fell to the ground; their cries
                were cut short by gunfire. As tears streamed down his cheeks,
                his whole world plunged into darkness. The hunter approached
                Toothless but did not aim his weapon at him. It was then that
                Toothless realized: he had been spared because he was toothless.
            </S.Text>

            <S.Text>
                A thought gnawed at his mind:{" "}
                <S.PuncLines>
                    “Am I lucky or worthless because I have no ivory?”
                </S.PuncLines>{" "}
                The very flaw he had once lamented had saved his life, yet a
                deep sense of guilt weighed heavy on his heart.
            </S.Text>

            <S.Text>
                For days, Toothless carried the burden of being the sole
                survivor. But his grief slowly turned into determination. He
                vowed to become the voice, the legacy, of his family and
                friends; he swore to tell their story to the world.
            </S.Text>
            <S.stroyImg src={storyFour} />
        </Flex>
    </S.InnerContainer>
);

export const Story = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const changeWidth = () => {
            setWidth(window.innerWidth);
        };

        window.addEventListener('resize', changeWidth)

        return window.removeEventListener('resize', changeWidth);
    }, [])

    return (
        <Flex wrap="wrap" justify="center">
            <S.Container>
                {width > 750 ? LargeStoryText : smallStoryText}
            </S.Container>
        </Flex>
    );
};
