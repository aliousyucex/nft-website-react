import styled from '@emotion/styled';
import {Button, Flex, Menu} from 'antd';
import '@fontsource/bakbak-one';

export namespace S {
    export const StyledMenu = styled(Menu)`
        height: 100px;
        justify-content: right;
        align-items: center;
        color: #8049F4;
        font-size: 18px;
        font-weight: 600;
        background-color: #eff85b;
        font-family: 'my_font', sans-serif;
        transition:all 1s;
        user-select: none;
        width: 350px;
        border-bottom: none;

        letter-spacing: 0.1em;
        text-transform: uppercase;

        @media (max-width: 800px) {
            display: none;
        }
    `;

    export const HeaderContainer = styled.div`
        display: flex;
        position: fixed;
        z-index: 2;
        background-color: #eff85b;
        justify-content: space-between;
        align-items: center;
        width: 92%;
        height: 100px;
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
        height: 60px;
        cursor: pointer;

        @media (max-width: 1200px) {
            height: 45px;
        }
    `;

    export const Container = styled(Flex)`
        padding: 18px;
        background-color: #eff85b;

        @media (min-width: 1200px) {
            width: 100%;
        }
    `;

    export const MenuButton = styled(Button)`
        background: #eff85b;
        border: none;

        .ant-dropdown-open {
            border: none;
        }

        :focus {
            border none;
        }
    `;
}
