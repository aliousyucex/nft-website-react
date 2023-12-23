import {Space} from 'antd';
import {S} from './index.styles';

import freyr from '../../assets/OurTeam/freyr.png';
import bceby from '../../assets/OurTeam/bceby.png';
import ahmet from '../../assets/OurTeam/ahmet.png';
import kekiks from '../../assets/OurTeam/kekiks.png';

import instagram from '../../assets/social-media-small/instagram.png';
import linkedin from '../../assets/social-media-small/linkedin.png';

export const Team = (props: {myRef: React.RefObject<HTMLDivElement>}) => (
    <S.Team ref={props.myRef} >
        <S.Title>
            OUR TEAM
        </S.Title>
        <Space size={24}>
            <S.TeamCard>
                <S.Img src={freyr} />
                <S.CardTitle>FreyR</S.CardTitle>
                <S.CardRole>Creator - Developer</S.CardRole>
                <Space size="middle">
                    <a href="https://www.instagram.com" target='_blank'>
                        <img src={instagram} />
                    </a>
                    <a href="https://www.linkedin.com" target='_blank'>
                        <img src={linkedin} />
                    </a>
                </Space>
            </S.TeamCard>
            <S.TeamCard>
                <S.Img src={bceby} />
                <S.CardTitle>Bceby</S.CardTitle>
                <S.CardRole>Creator - Busines Manager</S.CardRole>
                <Space size="middle">
                    <a href="https://www.instagram.com" target='_blank'>
                        <img src={instagram} />
                    </a>
                    <a href="https://www.linkedin.com" target='_blank'>
                        <img src={linkedin} />
                    </a>
                </Space>
            </S.TeamCard>
            <S.TeamCard>
                <S.Img src={ahmet} />
                <S.CardTitle>Ahmet</S.CardTitle>
                <S.CardRole>Designer</S.CardRole>
                <Space size="middle">
                    <a href="https://www.instagram.com" target='_blank'>
                        <img src={instagram} />
                    </a>
                    <a href="https://www.linkedin.com" target='_blank'>
                        <img src={linkedin} />
                    </a>
                </Space>
            </S.TeamCard>
            <S.TeamCard>
                <S.Img src={kekiks} />
                <S.CardTitle>Kekiks</S.CardTitle>
                <S.CardRole>Designer</S.CardRole>
            </S.TeamCard>
        </Space>
    </S.Team>
);
