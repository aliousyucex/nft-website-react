import {RefObject, useState} from 'react';
import {S} from './header.styles';
import {ConfigProvider, Dropdown, Space, type MenuProps} from 'antd';

import logo from '../../public/logo.png';
import twitter from '../assets/social-media/twitter.svg'
import discord from '../assets/social-media/discord.svg'
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';

type HeaderProps = {
    manifest: RefObject<HTMLDivElement>,
    faq: RefObject<HTMLDivElement>,
    pageWidth: number;
}

export const Header = (props: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);


    const items: MenuProps['items'] = [
        {
            label: 'About',
            key: 'manifest',
        },
        {
            label: 'Story',
            key: 'story',
        },
        {
            label: 'Game',
            key: 'game',
            disabled: window.innerWidth < 1400
        },
        {
            label: 'FAQ',
            key: 'faq',
        },
    ]

    const handleOnclick: MenuProps['onClick'] = (e) => {
        if (e.key === 'home') {
            window.scrollTo({top: 0, behavior: 'smooth'})
        }

        if (e.key === 'game') {
            window.location.href = '/game';
        }

        if (e.key === 'story') {
            window.location.href = '/story';
        }


        if (e.key === 'faq' || e.key === 'manifest') {
            props[e.key].current?.scrollIntoView({behavior: 'smooth'});
        }
    }

    const menuProps = {
        items,
        onClick: handleOnclick,
      };

    window.addEventListener('scroll', function() {
        if (window.scrollY >= 75) {
            setIsScrolled(true);
         }
         else {
            setIsScrolled(false);
        }
      })

    if (props.pageWidth > 800) {
        return (
            <ConfigProvider
                theme={{
                    components: {
                        Menu: {
                            itemHoverColor: '#8049F4',
                            horizontalItemSelectedColor: '#8049F4',
                        },
                    },
                }}
            >
                <S.HeaderContainer style={isScrolled ? {borderBottom: '2px solid #8049F4'} : {}}>
                    <S.Logo
                        src={logo}
                        onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                    />
                    <S.StyledMenu
                        theme="dark"
                        onClick={handleOnclick}
                        mode="horizontal"
                        items={items}
                    />
                    <Space size="large">
                        <a href='https://discord.gg/RMvaFAbFtA'><img src={discord} width={35} /></a>
                        <a href='https://x.com/ivorynfts'><img src={twitter} width={35} /></a>
                    </Space>
                </S.HeaderContainer>
            </ConfigProvider>
        );
    }

    return (
        <>
          <S.HeaderContainer style={isScrolled ? {borderBottom: '2px solid #8049F4'} : {}}>
            <S.Logo src={logo} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} />
            {props.pageWidth < 1200 && (
              <Dropdown menu={menuProps} trigger={["click"]} >
                <S.MenuButton icon={<Icon path={mdiMenu} size={1} />} />
              </Dropdown>
            )}
          </S.HeaderContainer>
        </>
      );
};
