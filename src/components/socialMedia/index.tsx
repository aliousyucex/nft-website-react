import {S} from './index.styles';
import { Space } from 'antd';

import twitter from '../../assets/social-media/twitter.svg';
import discord from '../../assets/social-media/discord.svg';

export const SocialMedia = () => {
    return (
        <>
            <S.H1>FOLLOW US!</S.H1>
            <Space size="large">
                <S.CoverCard target="_blank" href="https://x.com/ivorynfts">
                    <S.Img src={twitter} alt="Twitter" />
                </S.CoverCard>
                <S.CoverCard target="_blank" href="https://discord.gg/RMvaFAbFtA">
                    <S.Img src={discord} alt="Discord" />
                </S.CoverCard>
            </Space>
        </>
    );
}
