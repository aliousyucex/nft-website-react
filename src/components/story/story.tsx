import {S} from './story.styles';
import {Space} from 'antd';
import FreyR from '../../assets/OurTeam/freyr.png'

export const Story = () => (
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
                        <S.Button>Read More</S.Button>
                    </Space>
                </Space>
            </Space>

            <Space>
                <Space direction="vertical">
                    <S.Card>
                        <img src={FreyR} style={{width: '100%', height: 'auto'}} />
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
                    <S.Card title="Manifest" hoverable onClick={() => console.log('clicked')}>
                        First of all, we are here with the joy and excitement of bringing you a
                        new NFT collection. We need to inform you about the foundations of this NFT collection...
                    </S.Card>
                </Space>
            </Space>
        </S.StoryContainer>
    );
