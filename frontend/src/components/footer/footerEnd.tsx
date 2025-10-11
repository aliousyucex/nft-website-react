import {S} from './footerEnd.styles';
import {Space} from 'antd';
import Twitter from '../../assets/social-media-small/twitter.svg';
import Discord from '../../assets/social-media-small/discord.svg';

export const FooterEnd = () => {

    return (
        <S.FooterEndContainer>
            <S.Text>All rights reserved © 2024.</S.Text>
            <Space size={36}>
                <a target="_blank" href="https://x.com/ivorynfts"><img src={Twitter} width={16} /></a>
                <a target="_blank" href="https://discord.gg/RMvaFAbFtA"><img src={Discord} width={16} /></a>
            </Space>
        </S.FooterEndContainer>
    )
};
