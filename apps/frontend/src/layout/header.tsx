import {Flex, Space} from 'antd';
import {type RefObject, useState} from 'react';
import {S} from './header.styles';

import {useLocation, useNavigate} from 'react-router-dom';
import logo from '../../public/logo.svg';
import twitterBrown from '../assets/social-media/twitter-brown.svg';
import twitter from '../assets/social-media/twitter.svg';

export const Header = (props: {
  manifest?: RefObject<HTMLDivElement>;
  faq?: RefObject<HTMLDivElement>;
  noMenu?: true;
}) => {
  const navigate = useNavigate();
  const {pathname} = useLocation();
  const [width, setWidth] = useState(window.innerWidth);

  window.addEventListener('resize', () => setWidth(window.innerWidth));

  if (width <= 750) {
    return (
      <S.HeaderContainer>
        <S.Logo
          src={logo}
          onClick={() => {
            if (props.noMenu) {
              navigate('/');
            }

            window.scrollTo({top: 0, behavior: 'smooth'});
          }}
        />
        <S.MenuLinkItem onClick={() => navigate('/game')}>GAME</S.MenuLinkItem>
        <S.MenuLinkItem onClick={() => navigate('/story')}>STORY</S.MenuLinkItem>
        <Space size='large'>
          <a href='https://x.com/ivorynfts'>
            <img src={twitterBrown} alt='Twitter' width={30} />
          </a>
        </Space>
      </S.HeaderContainer>
    );
  }

  return (
    <S.HeaderContainer>
      <S.Logo
        src={logo}
        onClick={() => {
          if (pathname !== '/') {
            navigate('/');
          }

          window.scrollTo({top: 0, behavior: 'smooth'});
        }}
      />
      <Flex align='center' justify='center' gap={36}>
        <S.MenuItem
          onClick={() => {
            if (pathname === '/game' || pathname === '/story') {
              navigate('/');
            }
            return;
          }}
          to='manifest'
          offset={-75}
          smooth={true}
          duration={200}
        >
          ABOUT
        </S.MenuItem>
        <S.MenuItem
          onClick={() => {
            if (pathname === '/game' || pathname === '/story') {
              navigate('/');
            }
            return;
          }}
          to='roadmap'
          offset={-75}
          smooth={true}
          duration={200}
        >
          ROADMAP
        </S.MenuItem>
        <S.MenuItem
          onClick={() => {
            if (pathname === '/game' || pathname === '/story') {
              navigate('/');
            }
            return;
          }}
          to='faq'
          smooth={true}
          duration={200}
        >
          FAQ
        </S.MenuItem>
        <S.MenuLinkItem onClick={() => navigate('/game')}>GAME</S.MenuLinkItem>
        <S.MenuLinkItem onClick={() => navigate('/story')}>STORY</S.MenuLinkItem>
        <S.MenuOutLinkItem href='https://ivorynfts.gitbook.io' target='_blank'>
          WHITEPAPER
        </S.MenuOutLinkItem>
      </Flex>
      <Space size='large'>
        <a href='https://x.com/ivorynfts'>
          <img src={twitter} alt='Twitter' width={35} />
        </a>
      </Space>
    </S.HeaderContainer>
  );
};
