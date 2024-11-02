import {RefObject, useState} from 'react';
import {S} from './header.styles';
import {ConfigProvider, Space, type MenuProps} from 'antd';

import logo from '../../public/logo.png';

type HeaderProps = {
    story: RefObject<HTMLDivElement>,
    roadmap: RefObject<HTMLDivElement>,
    game: RefObject<HTMLDivElement>,
    team: RefObject<HTMLDivElement>,
    faq: RefObject<HTMLDivElement>,
}

export const Header = (props: HeaderProps) => {
    const [isScrolled, setIsScrolled] = useState<boolean>(false);


    const items: MenuProps['items'] = [
        {
            label: 'Home',
            key: 'home',
        },
        {
            label: 'ABOUT',
            key: 'story',
        },
        {
            label: 'Game',
            key: 'game',
        },
        {
            label: 'Our Team',
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

        if (e.key === 'story' || e.key === 'team' || e.key === 'faq' || e.key === 'game') {
            props[e.key].current?.scrollIntoView({behavior: 'smooth'});
        }
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY >= 75) {
            setIsScrolled(true);
         }
         else {
            setIsScrolled(false);
        }
      })

    return (
        <ConfigProvider
            theme={{
                components: {
                    Menu: {
                        itemHoverColor: '#07BC65',
                        horizontalItemSelectedColor: '#07BC65',
                    },
                },
            }}
        >
            <S.HeaderContainer style={isScrolled ? {borderBottom: '1px solid #21E786'} : {}}>
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
                    <S.DiscordButton onClick={() => window.open('https://discord.gg/ivorynfts')}>discord</S.DiscordButton>
                </Space>
            </S.HeaderContainer>
        </ConfigProvider>
    );
};
