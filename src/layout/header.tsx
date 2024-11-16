import {RefObject, useState} from 'react';
import {S} from './header.styles';
import {ConfigProvider, Dropdown, Space, type MenuProps} from 'antd';

import logo from '../../public/logo.png';
import twitter from '../assets/social-media/twitter.svg'
import discord from '../assets/social-media/discord.svg'
import Icon from '@mdi/react';
import { mdiMenu } from '@mdi/js';

type HeaderProps = {
    story: RefObject<HTMLDivElement>,
    manifest: RefObject<HTMLDivElement>,
    game: RefObject<HTMLDivElement>,
    team: RefObject<HTMLDivElement>,
    faq: RefObject<HTMLDivElement>,
    pageWidth: number;
}

export const Header = (props: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);


    const items: MenuProps['items'] = [
        {
            label: 'Manifest',
            key: 'manifest',
        },
        {
            label: 'Story',
            key: 'story',
        },
        {
            label: 'Game',
            key: 'game',
        },
        {
            label: 'Tribe',
            key: 'team',
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

        if (e.key === 'story' || e.key === 'team' || e.key === 'faq' || e.key === 'game' || e.key === 'manifest') {
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
                            itemHoverColor: '#D9A459',
                            horizontalItemSelectedColor: '#D9A459',
                        },
                    },
                }}
            >
                <S.HeaderContainer style={isScrolled ? {borderBottom: '2px solid #D9A459'} : {}}>
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
                        <a href='https://discord.gg/ivorynfts'><img src={discord} width={35} /></a>
                        <a href='https://x.com/ivorynfts'><img src={twitter} width={35} /></a>
                    </Space>
                </S.HeaderContainer>
            </ConfigProvider>
        );
    }

    return (
        <>
          <S.HeaderContainer style={isScrolled ? {borderBottom: '2px solid #D9A459'} : {}}>
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
