import {S} from './footerEnd.styles';
import {Space} from 'antd';
import Twitter from '../../assets/social-media-small/twitter.png';
import Discord from '../../assets/social-media-small/discord.png';

export const FooterEnd = () => {

    return (
        <S.FooterEndContainer>
            <S.Text>All rights reserved © 2024.</S.Text>
            <Space size={36}>
                <a target="_blank" href="https://x.com/ivorynfts"><img src={Twitter} /></a>
                <a target="_blank" href="https://discord.gg/ivorynfts"><img src={Discord} /></a>
            </Space>
        </S.FooterEndContainer>
    )
};
