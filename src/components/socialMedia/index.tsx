import {S} from './index.styles';
import { Space } from 'antd';

import twitter from '../../assets/social-media/twitter.svg';
import discord from '../../assets/social-media/discord.svg';
import reddit from '../../assets/social-media/reddit.svg';
import linkedin from '../../assets/social-media/linkedin.svg';
import medium from '../../assets/social-media/medium.svg';

export const SocialMedia = () => {
    return (
        <>
            <S.H1>Follow us!</S.H1>
            <Space size="large">
                <S.CoverCard href="https://twitter.com/">
                    <S.Img src={twitter} alt="Twitter" />
                </S.CoverCard>
                <S.CoverCard href="https://discord.com/">
                    <S.Img src={discord} alt="Discord" />
                </S.CoverCard>
                <S.CoverCard href="https://www.reddit.com/">
                    <S.Img src={reddit} alt="Reddit" />
                </S.CoverCard>
                <S.CoverCard href="https://www.linkedin.com/">
                    <S.Img src={linkedin} alt="LinkedIn" />
                </S.CoverCard>
                <S.CoverCard href="https://medium.com/">
                    <S.Img src={medium} alt="Medium" />
                </S.CoverCard>
            </Space>
        </>
    );
}
