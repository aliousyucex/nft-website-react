import {RefObject} from 'react';
import {S} from './header.styles';
import {Flex, Space} from 'antd';

import logo from '../../public/logo.svg';
import twitter from '../assets/social-media/twitter.svg'
import discord from '../assets/social-media/discord.svg'
import twitterBrown from '../assets/social-media/twitter-brown.svg'
import discordBrown from '../assets/social-media/discord-brown.svg'

type HeaderProps = {
    manifest: RefObject<HTMLDivElement>,
    faq: RefObject<HTMLDivElement>,
    pageWidth: number;
}

export const Header = (props: HeaderProps) => {

    if (props.pageWidth > 800) {
        return (
                <S.HeaderContainer>
                    <S.Logo
                        src={logo}
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                    />
                    <Flex align="center" justify="center" gap={36}>
                        <S.MenuItem to="manifest" offset={-75} smooth={true} duration={200}>
                            ABOUT
                        </S.MenuItem>
                        <S.MenuItem to="roadmap" offset={-75} smooth={true} duration={200}>
                            ROAD MAP
                        </S.MenuItem>
                        <S.MenuItem to="faq" smooth={true} duration={200}>
                            FAQ
                        </S.MenuItem>
                    </Flex>
                    <Space size="large">
                        <a href='https://discord.gg/ivorynfts'><img src={discord} width={35} /></a>
                        <a href='https://x.com/ivorynfts'><img src={twitter} width={35} /></a>
                    </Space>
                </S.HeaderContainer>
        );
    }

    return (
        <>
          <S.HeaderContainer>
            <S.Logo src={logo} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
            <Space size="large">
                <a href='https://discord.gg/ivorynfts'><img src={discordBrown} width={30} /></a>
                <a href='https://x.com/ivorynfts'><img src={twitterBrown} width={30} /></a>
            </Space>
          </S.HeaderContainer>
        </>
      );
};
