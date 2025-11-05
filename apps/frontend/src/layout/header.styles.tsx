import styled from '@emotion/styled';
import {Button, Flex, Menu} from 'antd';
import '@fontsource/bakbak-one';
import '@fontsource/londrina-solid';
import {Link as ScrollLink} from 'react-scroll';

export namespace S {
  export const StyledMenu = styled(Menu)`
        height: 70px;
        justify-content: right;
        align-items: center;
        color: #E4F4E9;
        font-size: 18px;
        font-weight: 600;
        background-color: #81AA93;
        font-family: 'my_font', sans-serif;
        transition:all 1s;
        user-select: none;
        width: 500px;
        border-bottom: none;

        letter-spacing: 0.1em;
        text-transform: uppercase;

        @media (max-width: 800px) {
            display: none;
        }
    `;

  export const MenuItem = styled(ScrollLink)`
        color: #E4F4E9;
        font-size: 32px;
        font-weight: 600;
        font-family: 'Londrina Solid', system-ui;
        scroll-margin-top: 70px;

        :hover {
            color: #E4F4E9;
        }
    `;

  export const MenuLinkItem = styled.button`
        color: #E4F4E9;
        font-size: 32px;
        font-weight: 600;
        font-family: 'Londrina Solid', system-ui;
        scroll-margin-top: 70px;
        background: none;
        border: none;


        :hover {
            color: #E4F4E9;
            cursor: pointer;
        }
    `;

  export const MenuOutLinkItem = styled.a`
        color: #E4F4E9;
        font-size: 32px;
        font-weight: 600;
        font-family: 'Londrina Solid', system-ui;
        scroll-margin-top: 70px;
        background: none;
        border: none;


        :hover {
            color: #E4F4E9;
            cursor: pointer;
        }
    `;

  export const HeaderContainer = styled.div`
        display: flex;
        position: fixed;
        top: 0;
        z-index: 2;
        background-color: #81AA93;
        justify-content: space-between;
        align-items: center;
        width: 92%;
        height: 70px;
        padding: 0 100px 0 100px;

        scroll-margin-top: 50px;

        @media (max-width: 800px) {
            width: 92%;
            padding: 0 20px 0 20px;
            justify-content: space-between;
        }

        @media (max-width: 1200px) {
            width: 96%;
            padding: 0 20px 0 20px;
            justify-content: space-between;
        }
    `;

  export const Logo = styled.img`
        width: 65px;
        cursor: pointer;

        @media (max-width: 650px) {
            width: 55px;
        }
    `;

  export const Container = styled(Flex)`
        padding: 18px;
        background-color: #81AA93;

        @media (min-width: 1200px) {
            width: 100%;
        }
    `;

  export const MenuButton = styled(Button)`
        background: #3C322E;
        color: #8BB39D;

        border: none;

        .ant-dropdown-open {
            border: none;
        }

        :focus {
            border none;
        }
    `;
}
