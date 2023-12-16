import {useState} from 'react';
import {S} from './story.styles';
import {Space} from 'antd';
import freyR from '../../assets/OurTeam/freyr.png'
import storyOne from '../../assets/story/storyOne.png'
import storyTwo from '../../assets/story/storyTwo.png'
import storyThree from '../../assets/story/storyThree.png'
import storyFour from '../../assets/story/storyFour.png'

const manifestText = (
    <div>
        <p>Hi there!</p>

        <p>First of all, we are here with the joy and excitement of bringing you a new NFT collection. We need to inform you about the foundations of this NFT collection.</p>
        <p>Although we are not an aid campaign, we aim to raise awareness about the "Elephant Tusks" genocide in today's conditions and enable more people to have information about it. To show that there are many ways to spread this awareness and be a source of inspiration for many different projects, we decided to branch this project into different directions.</p>
        <p>The first of these branches begins with a 3-season story that we have written for you. This story serves as a building block in raising the awareness needed for both our NFTs and elephants. Another of these branches is the game we developed, PeanutRush. Based on platform game PeanutRush, the main character is an elephant, and they chase their favorite food, peanuts. With this game, we aim to bring the mentality of playing with and renting their collection pieces (with certain collection pieces in the Demo version) to our collectors and collector candidates.</p>
    </div>);

const storyText = (
    <S.StoryModalContainer direction="vertical" size="large">
        <Space size="large">
            <S.stroyImg src={storyOne} />
            Toothless, who woke up with the first light of the day hitting his eyes, greeted the sunrise with a smile. Unaware that today would be much different than any other day, she went for a walk to do her daily routine. Finding and tasting different herbs during the trek was his favorite activity. Her happiness multiplied as she ate the greens that had just begun to grow. Suddenly, peanuts, which she had often heard but could not taste, appeared in front of him. 'I'll finally be able to taste it,' she sighed, raising her hose and yelling for joy.
        </Space>
        <Space size="large">
            He continued his walk, thinking about how delicious the peanuts were. As he continued, more and more peanuts appeared in front of him. Toothless ate these perfect peanuts with great pleasure. His interest had now completely shifted from herbs to peanuts. He looked up and saw piles of peanuts just ahead. He walked quickly towards it. As he got closer, he realized that something was wrong. The peanuts here were red, not brown. He began to examine these peanuts that looked red. While she was examining it, the redness smeared his hose. As she grumbled, annoyed by this, she saw an elephant lying at full length next to the heap. She smiled briefly and said, "Who knows how much she ate, she felt like she needed to lie down to rest.". She wanted to share her happiness by going to the elephant and explaining that she had finally eaten peanuts. As the toothless approached, she saw she was facing a great disaster. The elephant was lying on the ground, covered with blood and breathless, with its tusks cut off. It took only a few seconds for him to realize why the peanut looked red and the redness in his trunk. Immediately after, he lifted his trunk and shouted with all his might, summoning his fellow tribesmen to their side. After a while, all his nearby friends gathered around her and tried to understand what was happening. Each was looking at something different.
            <S.stroyImg src={storyTwo} />
        </Space>
        <Space size="large">
            <S.stroyImg src={storyThree} />
            At that moment, Toothless heard a crackle. She turned her head and saw a human silhouette in the bushes with his friend's diamond teeth on his back. Quickly, without warning her friends, she heard an explosion, and her friend, who was right behind her, collapsed to the ground. After each blast, the others collapsed to the ground as they tried to escape. The sound stopped, and when she looked around, all his friends were covered in blood. Unable to protect himself, he was in shock the human who killed her friends hadn't harmed Toothless. Toothless couldn't do anything, and she just watched the human. She went to Toothless's friends and removed their precious teeth if she could or cut them off if she didn't and put them on her back. That's when Toothless realized why she wasn't killed. What she had in his friends she didn't have.
        </Space>
        <Space size="large">
            The reason Toothless wasn't killed was that he didn't have teeth. She realized she had never questioned why she had no teeth until that day. Meanwhile, the murderer who killed her friends walked away with his precious teeth on his back. Why did he kill her friends? What would he do with those teeth that belonged to his friends? While she was sitting next to her dead friends, she was sad that he could no longer make good memories with them. On the other hand, these things kept spinning in the corner of her mind. The only question that crosses one's mind as she watches her slowly walk away from her is, 'AM I LUCKY OR VALUABLE? I DON'T HAVE TEETH?'
            <S.stroyImg src={storyFour} />
        </Space>
    </S.StoryModalContainer>
)
export const Story = () => {
    const [modalOpen, setModalOpen] = useState<{open: boolean, text: JSX.Element | undefined}>({open: false, text: manifestText});

    return (
        <S.StoryContainer align="center">
            <Space size={72} direction="vertical">
                <Space direction="vertical">
                    <S.Title>WHAT IS THE LUCK?</S.Title>
                    <S.Text>
                        An elephant without a single tusk in the elephant tribe faces a great dilemma. Are these teeth a blessing or punishment?
                    </S.Text>
                    <S.Text>
                        Click read more and find out!
                    </S.Text>
                </Space>

                <Space size={48} direction="vertical">
                    <Space direction="horizontal" size={72}>
                        <Space size="small" direction="vertical">
                            <S.footerHeaders>Total</S.footerHeaders>
                            <S.footerTexts>13.000</S.footerTexts>
                        </Space>
                        <Space size="small" direction="vertical">
                            <S.footerHeaders>Price</S.footerHeaders>
                            <S.footerTexts>1 ETH</S.footerTexts>
                        </Space>
                    </Space>
                    <Space>
                        <S.Button onClick={() => setModalOpen({open: true, text: storyText})}>Read More</S.Button>
                    </Space>
                </Space>
            </Space>

            <Space>
                <Space direction="vertical">
                    <S.Card>
                        <img src={freyR} style={{ width: 200, height: 'auto' }} />
                    </S.Card>
                    <S.Card title="We Are Not Alone">
                        Elephants, which have been illegally hunted for accessories and ornaments
                        in the last century, are facing extinction. We want to say something about this.
                    </S.Card>
                </Space>
                <Space direction="vertical">
                    <S.Card title="Elephants">
                        Elephants included in the proboscis order have the right to be classified as intelligent animals. There are two classes Asian and African elephants. They are in danger of extinction!
                    </S.Card>
                    <S.Card id="manifest" title="Manifest" hoverable onClick={() => setModalOpen({open: true, text: manifestText})}>
                        First of all, we are here with the joy and excitement of bringing you a
                        new NFT collection. We need to inform you about the foundations of this NFT collection...
                    </S.Card>
                </Space>

                <S.Modal
                    width={900}
                    centered
                    open={modalOpen.open}
                    onCancel={() => setModalOpen({open: false, text: undefined})}
                    closeIcon={false}
                    okButtonProps={{ style: { display: 'none' } }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    {modalOpen.text}
                </S.Modal>
            </Space>
        </S.StoryContainer>
    )
};
