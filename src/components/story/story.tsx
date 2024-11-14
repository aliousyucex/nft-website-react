import { useState } from "react";
import { S } from "./story.styles";
import { Flex } from "antd";
import storyOne from "../../assets/story/storyOne.png";
import storyTwo from "../../assets/story/storyTwo.png";
import storyThree from "../../assets/story/storyThree.png";
import storyFour from "../../assets/story/storyFour.png";

const manifestText = (
    <S.ManifestContainer vertical justify="left" gap={24}>
        <S.ModalTitle style={{textAlign: 'center'}}>The Ivory Chronicles Manifesto</S.ModalTitle>

        {/* Entering Section */}
        <div>
            <S.SubTitles>We are the Tribe of Toothless.</S.SubTitles>
            <S.Text>
                We believe in a world where life is valued not for its physical
                attributes but for its spirit, resilience, and will to survive.
                In a world driven by greed, we stand as a force for change, a
                collective voice for those who have been silenced.
            </S.Text>
            <S.Text>
                Our journey began with Toothless, an innocent soul who
                discovered the harsh reality of a world obsessed with taking
                rather than giving. His story is not just his own—it is the
                story of all those who have lost, endured and survived. And now,
                it is our story.
            </S.Text>
            <S.Text>
                We are here to honor those who can no longer speak, reclaim what
                has been taken, and ensure that no creature, no spirit, is ever
                exploited for profit.
            </S.Text>
        </div>

        {/* Our Beliefs Section */}
        <div>
            <S.SubTitles>Our Beliefs</S.SubTitles>
            <ul>
                <S.Li>
                    <u>Every Life Has Value:</u> Whether you possess ivory tusks
                    or nothing at all, your worth is beyond measure. We stand
                    against a world that commodifies life and strips it of its
                    inherent dignity.
                </S.Li>
                <S.Li>
                    <u>Community is Strength:</u> Just as Toothless called upon
                    his tribe, we call upon ours. Together, we are stronger,
                    louder, and more resilient. Our community is built on the
                    principles of trust, respect, and shared purpose.
                </S.Li>
                <S.Li>
                    <u>Stories Shape the Future:</u> Toothless’s journey teaches
                    us that stories have the power to change minds, hearts, and
                    actions. We believe in using art and storytelling as tools
                    to inspire and drive meaningful change.
                </S.Li>
                <S.Li>
                    <u>Action Over Apathy:</u> We refuse to be mere bystanders
                    in a world where cruelty is normalized. Our NFTs are not
                    just digital assets—they are symbols of commitment to a
                    better world. Each purchase is a step towards protecting the
                    innocent and standing up against exploitation.
                </S.Li>
            </ul>
        </div>

        {/* Our Mission Section */}
        <div>
            <S.SubTitles>Our Mission</S.SubTitles>
            <ul>
                <S.Li>
                    To use the power of NFTs and storytelling to raise awareness
                    about the impact of poaching, cruelty, and exploitation.
                </S.Li>
                <S.Li>
                    To build a community that stands for compassion, justice,
                    and resilience—where members actively shape the story of
                    Toothless and his journey.
                </S.Li>
                <S.Li>
                    To contribute to wildlife conservation by dedicating a
                    portion of our proceeds to organizations working to protect
                    vulnerable species and their habitats.
                </S.Li>
                <S.Li>
                    To inspire others to see beyond material value and recognize
                    the beauty of life in all its forms.
                </S.Li>
            </ul>
        </div>

        {/* Our Call To You Section */}
        <div>
            <S.SubTitles>Our Call to You</S.SubTitles>
            <S.Text>
                This is not just our story; it is yours too. By joining our
                tribe, you become a guardian of Toothless’s legacy, a protector
                of those who have been silenced, and a voice for change.
            </S.Text>
            <S.Text>
                Together, we will rewrite the narrative. We will transform pain
                into purpose and loss into hope.
            </S.Text>
            <S.Text>
                Will you join us on this journey? Will you stand with Toothless
                and the tribe?
            </S.Text>
        </div>
    </S.ManifestContainer>
);

const largeStoryText = (
    <S.StoryModalContainer vertical>
    <S.ModalTitle style={{textAlign: 'center'}}>Toothless and the Red Peanuts: A Journey of Loss and Hope</S.ModalTitle>
        <Flex gap={24} wrap="wrap">
            <Flex gap={24} align="center">
                <S.stroyImg src={storyOne} />
                <Flex vertical gap={24}>
                    <S.Text>
                        Toothless, a curious and gentle elephant, greeted the
                        sunrise with a smile as the first rays of light danced
                        across the savannah. Each morning, he set off on his
                        usual walks, savoring the fresh air and tasting the
                        tender herbs that grew along his path. Finding new
                        plants to nibble on was his favorite pastime; each bite
                        brought him joy as he explored the world around him.
                    </S.Text>
                    <S.Text>
                        <S.PuncLines>
                            Today, however, would be unlike any other.
                        </S.PuncLines>
                    </S.Text>
                </Flex>
            </Flex>

            <Flex vertical wrap="wrap">
                <S.Text>
                    As Toothless wandered deeper into the forest, something
                    unusual caught his eye. There, lying in the grass, were
                    peanuts—golden treasures he had heard about but never
                    tasted. With a delighted trumpet, he rushed forward, his
                    heart leaping at the thought of finally trying the famed
                    treat.
                </S.Text>
                <S.Text>
                    As he continued along his path, the peanuts appeared more
                    frequently, leading him onward. He eagerly ate them, their
                    rich taste, unlike anything he had ever experienced. But
                    soon, the trail led to something unexpected: a great heap of
                    peanuts ahead. Excitement turned to confusion as Toothless
                    noticed the peanuts were not brown, but a deep, unsettling
                    red.
                </S.Text>
            </Flex>

            <Flex gap={24} align="center">
                <S.Text>
                    Curiosity overcame him. He approached the pile and reached
                    down with his trunk, only to realize the redness was
                    staining him. As he examined the strange color, he heard a
                    faint groan. His eyes widened when he saw, lying beside the
                    heap, an elephant from his herd, her tusks cruelly severed,
                    her body lifeless and covered in crimson.
                </S.Text>
                <S.stroyImg src={storyTwo} />
            </Flex>

            <Flex gap={24} align="center" vertical>
                <S.Text>
                    Horror seized Toothless. The red that had stained his trunk
                    was not from the peanuts but from the blood of his fallen
                    friend. The joyful morning turned into a nightmare. Lifting
                    his trunk, Toothless let out a mighty trumpet, calling for
                    his tribe. One by one, his fellow elephants gathered, their
                    confusion quickly turning to grief as they discovered the
                    tragedy.
                </S.Text>
                <S.Text>
                    Suddenly, the sound of rustling leaves drew Toothless’s
                    attention. He turned to see a human figure hiding in the
                    bushes, carrying the severed tusks of his friends on his
                    back. Before he could warn his herd, a deafening explosion
                    echoed through the forest. One by one, his companions fell,
                    their cries silenced by gunfire.
                </S.Text>
            </Flex>

            <Flex gap={24} align="center">
                <S.stroyImg src={storyThree} />
                <S.Text>
                    Toothless stood frozen, his heart racing. The human hunter
                    approached, yet did not aim his weapon at him. It was then
                    Toothless understood: the reason he was spared was because
                    he had no tusks, nothing of value to be taken. The very
                    trait he had once questioned about himself—his lack of
                    teeth—was what saved his life.
                </S.Text>
            </Flex>

            <Flex gap={24} align="center">
                <S.Text>
                    As he watched the human walk away, burdened with the ivory
                    of his fallen friends, a profound question echoed in
                    Toothless’s mind:{" "}
                    <S.PuncLines>
                        “Am I lucky or worthless because I have no ivory?”
                    </S.PuncLines>
                </S.Text>
            </Flex>

            <Flex gap={24} align="center">
                <S.Text>
                    For days, Toothless grieved, unable to shake the guilt that
                    he alone had survived. But in his sorrow, a resolve began to
                    form. He would not let his friends’ sacrifice be in vain. He
                    would become their voice, their legacy, ensuring that the
                    world knew their story.
                </S.Text>
                <S.stroyImg src={storyFour} />
            </Flex>
        </Flex>
    </S.StoryModalContainer>
);

const smallStoryText = (
    <S.StoryModalContainer vertical>
        <S.ModalTitle style={{textAlign: 'center'}}>Toothless and the Red Peanuts: A Journey of Loss and Hope</S.ModalTitle>
        <Flex gap={24} vertical wrap="wrap">
            <S.stroyImg src={storyOne} />
            <S.Text>
                Toothless, a curious and gentle elephant, greeted the sunrise
                with a smile as the first rays of light danced across the
                savannah. Each morning, he set off on his usual walks, savoring
                the fresh air and tasting the tender herbs that grew along his
                path. Finding new plants to nibble on was his favorite pastime;
                each bite brought him joy as he explored the world around him.
            </S.Text>
            <S.Text>
                <S.PuncLines>
                    Today, however, would be unlike any other.
                </S.PuncLines>
            </S.Text>

            <S.Text>
                As Toothless wandered deeper into the forest, something unusual
                caught his eye. There, lying in the grass, were peanuts—golden
                treasures he had heard about but never tasted. With a delighted
                trumpet, he rushed forward, his heart leaping at the thought of
                finally trying the famed treat.
            </S.Text>
            <S.Text>
                As he continued along his path, the peanuts appeared more
                frequently, leading him onward. He eagerly ate them, their rich
                taste, unlike anything he had ever experienced. But soon, the
                trail led to something unexpected: a great heap of peanuts
                ahead. Excitement turned to confusion as Toothless noticed the
                peanuts were not brown, but a deep, unsettling red.
            </S.Text>
            <S.Text>
                Curiosity overcame him. He approached the pile and reached down
                with his trunk, only to realize the redness was staining him. As
                he examined the strange color, he heard a faint groan. His eyes
                widened when he saw, lying beside the heap, an elephant from his
                herd, her tusks cruelly severed, her body lifeless and covered
                in crimson.
            </S.Text>
            <S.stroyImg src={storyTwo} />

            <S.Text>
                Horror seized Toothless. The red that had stained his trunk was
                not from the peanuts but from the blood of his fallen friend.
                The joyful morning turned into a nightmare. Lifting his trunk,
                Toothless let out a mighty trumpet, calling for his tribe. One
                by one, his fellow elephants gathered, their confusion quickly
                turning to grief as they discovered the tragedy.
            </S.Text>
            <S.Text>
                Suddenly, the sound of rustling leaves drew Toothless’s
                attention. He turned to see a human figure hiding in the bushes,
                carrying the severed tusks of his friends on his back. Before he
                could warn his herd, a deafening explosion echoed through the
                forest. One by one, his companions fell, their cries silenced by
                gunfire.
            </S.Text>

            <S.stroyImg src={storyThree} />
            <S.Text>
                Toothless stood frozen, his heart racing. The human hunter
                approached, yet did not aim his weapon at him. It was then
                Toothless understood: the reason he was spared was because he
                had no tusks, nothing of value to be taken. The very trait he
                had once questioned about himself—his lack of teeth—was what
                saved his life.
            </S.Text>

            <S.Text>
                As he watched the human walk away, burdened with the ivory of
                his fallen friends, a profound question echoed in Toothless’s
                mind:{" "}
                <S.PuncLines>
                    “Am I lucky or worthless because I have no ivory?”
                </S.PuncLines>
            </S.Text>

            <S.Text>
                For days, Toothless grieved, unable to shake the guilt that he
                alone had survived. But in his sorrow, a resolve began to form.
                He would not let his friends’ sacrifice be in vain. He would
                become their voice, their legacy, ensuring that the world knew
                their story.
            </S.Text>
            <S.stroyImg src={storyFour} />
        </Flex>
    </S.StoryModalContainer>
);

export const Story = (props: {
    myRef: React.RefObject<HTMLDivElement>;
    pageWidth: number;
}) => {
    const [modalOpen, setModalOpen] = useState<{
        open: boolean;
        text: JSX.Element | undefined;
    }>({ open: false, text: undefined });

    return (
        <S.StoryContainer
            align="center"
            vertical
            justify="center"
            gap={36}
            ref={props.myRef}
        >
            <S.Title>ABOUT</S.Title>
            <Flex wrap="wrap" justify="center" gap={54}>
                <S.Card>
                    <S.CardContent
                        vertical
                        justify="space-around"
                        align="center"
                    >
                        <S.CardTitle>The Tale of Toothless</S.CardTitle>
                        <S.CardText>
                            What happens when innocence meets cruelty? The
                            answer lies within Toothless’s story...
                        </S.CardText>
                        <S.CardButton
                            onClick={() =>
                                setModalOpen({
                                    open: true,
                                    text:
                                        props.pageWidth >= 1200
                                            ? largeStoryText
                                            : smallStoryText,
                                })
                            }
                        >
                            Read Our Story
                        </S.CardButton>
                    </S.CardContent>
                </S.Card>
                <S.Card>
                    <S.CardContent
                        vertical
                        justify="space-around"
                        align="center"
                    >
                        <S.CardTitle>Tribe of Toothless</S.CardTitle>
                        <S.CardText>
                            Join us in redefining what truly matters—read our
                            manifesto.
                        </S.CardText>
                        <S.CardButton
                            onClick={() =>
                                setModalOpen({
                                    open: true,
                                    text: manifestText,
                                })
                            }
                        >
                            Read Manifesto
                        </S.CardButton>
                    </S.CardContent>
                </S.Card>
            </Flex>

            {modalOpen && modalOpen.open === true && <S.Modal
                width={1150}
                open
                centered
                onCancel={() => setModalOpen({ open: false, text: undefined })}
                closeIcon={false}
                okButtonProps={{ style: { display: "none" } }}
                cancelButtonProps={{ style: { display: "none" } }}
            >
                {modalOpen.text}
            </S.Modal>}
        </S.StoryContainer>
    );
};
