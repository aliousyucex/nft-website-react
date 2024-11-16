import {Flex} from 'antd';
import {S} from './index.styles';

import freyr from '../../assets/OurTeam/freyr.png';
import seby from '../../assets/OurTeam/seby.png';
import berizu from '../../assets/OurTeam/berizu.png';

export const Team = (props: { myRef: React.RefObject<HTMLDivElement> }) => (
    <S.Team ref={props.myRef} >
        <S.Title>TRIBE</S.Title>
        <Flex wrap="wrap" justify="center" align="center" gap={24}>
            <S.TeamCard>
                <S.Img src={berizu} />
                <S.CardTitle>Berizu</S.CardTitle>
                <S.CardRole>Founder</S.CardRole>
            </S.TeamCard>
            <S.TeamCard>
                <S.Img src={freyr} />
                <S.CardTitle>FreyR</S.CardTitle>
                <S.CardRole>Developer</S.CardRole>
            </S.TeamCard>
            <S.TeamCard>
                <S.Img src={seby} />
                <S.CardTitle>Seby</S.CardTitle>
                <S.CardRole>Designer</S.CardRole>
            </S.TeamCard>
        </Flex>
    </S.Team>
);
