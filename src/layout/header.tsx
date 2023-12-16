import react, {useEffect, useState} from 'react';
import {S} from './header.styles';
import {ConfigProvider, Space, type MenuProps} from 'antd';

import elephantLogo from '../assets/logo.png';

const scrollToOptions: {[key: string]: number} = {
    home: 0,
    story: 800,
    game: 1000,
    roadmap: 2000
}

export const Header = () => {
    const [currentKey, setCurrentKey] = useState<string>('home');
    const [isScrolled, setIsScrolled] = useState<boolean>(false);

    useEffect(() => {
        window.scrollTo({top: scrollToOptions[currentKey], behavior: 'smooth'});
    }, [currentKey]);

    const items: MenuProps['items'] = [
        {
            label: 'Home',
            key: 'home',
        },
        {
            label: 'The Story',
            key: 'story',
        },
        {
            label: 'GAME',
            key: 'game',
        },
        {
            label: 'ROADMAP',
            key: 'roadmap',
        },
    ]

    const handleOnclick: MenuProps['onClick'] = (e) => {
        console.log(e);
        setCurrentKey(e.key)
        return;
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
                    src={elephantLogo}
                    onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                />
                <S.StyledMenu
                    theme="dark"
                    onClick={handleOnclick}
                    mode="horizontal"
                    items={items}
                />
                <Space size="large">
                    <S.DiscordButton>discord</S.DiscordButton>
                    <S.BaskaButton>Baska</S.BaskaButton>
                </Space>
            </S.HeaderContainer>
        </ConfigProvider>
        // return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
    );
};
