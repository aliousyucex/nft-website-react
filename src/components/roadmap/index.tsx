import {Space} from 'antd';
import {S} from './index.styles';

import nft1 from '../../assets/Roadmap/nft1.png';
import nft2 from '../../assets/Roadmap/nft2.png';
import gameImg from '../../assets/Roadmap/gameImg.png';
import roadmap21 from '../../assets/Roadmap/roadmap21.png';
import coffee from '../../assets/Roadmap/3.jpg';

export const RoadMap = (props: {myRef: React.RefObject<HTMLDivElement>}) => (
    <S.CarouselContainer ref={props.myRef}>
        <S.Title>ROADMAP</S.Title>
        <S.Carousel>
            <div>
                <S.Phase>
                    {/* Images */}
                    <Space align='center'>
                        <Space align='center'>
                            <S.PhaseLargeImg src={gameImg} />
                        </Space>
                        <Space direction='vertical' align='center'>
                            <S.PhaseSmallImg src={nft1} />
                            <S.PhaseSmallImg src={nft2} />
                        </Space>
                    </Space>
                    {/* Texts */}
                    <S.PhaseDiscription>
                        <Space direction="vertical" size="large">
                            <S.PhaseTitle>PHASE 1</S.PhaseTitle>
                            <S.PhaseText>Story Season 1</S.PhaseText>
                            <S.PhaseText>Game Alpha Version</S.PhaseText>
                            <S.PhaseText>Private Mint - Airdrop</S.PhaseText>
                            <S.PhaseText>Public Mint</S.PhaseText>
                        </Space>
                    </S.PhaseDiscription>
                </S.Phase>
            </div>
            <div>
            <S.Phase>
                    {/* Images */}
                    <Space align='center'>
                            <S.PhaseExtraWidthImg src={roadmap21} />
                    </Space>
                    {/* Texts */}
                    <S.PhaseDiscription>
                        <Space direction="vertical" size="large">
                            <S.PhaseTitle>PHASE 2</S.PhaseTitle>
                            <S.PhaseText>Story Season 2</S.PhaseText>
                        </Space>
                    </S.PhaseDiscription>
                </S.Phase>
            </div>
            <div>
                <S.Phase>
                    {/* Images */}
                    <Space align='center'>
                        <Space align='center'>
                            <S.PhaseFullImg src={coffee} />
                        </Space>
                    </Space>
                    {/* Texts */}
                    <S.PhaseDiscription>
                        <Space direction="vertical" size="large">
                            <S.PhaseTitle>PHASE 3</S.PhaseTitle>
                            <S.PhaseText>Story Season 3</S.PhaseText>
                        </Space>
                    </S.PhaseDiscription>
                </S.Phase>
            </div>
        </S.Carousel>
    </S.CarouselContainer>
);
