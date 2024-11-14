import styled from '@emotion/styled';
import {Button, Flex, Menu} from 'antd';
import '@fontsource/bakbak-one';

export namespace S {
    export const StyledMenu = styled(Menu)`
        height: 100px;
        justify-content: right;
        align-items: center;
        color: #faf2e3;
        font-size: 16px;
        font-weight: 600;
        background-color: #040B11;
        font-family: 'Bakbak One', sans-serif;
        transition:all 1s;
        user-select: none;
        width: 650px;

        letter-spacing: 0.1em;
        text-transform: uppercase;

        @media (max-width: 1400px) {
            display: none;
        }
    `;

    export const HeaderContainer = styled.div`
        display: flex;
        position: fixed;
        z-index: 2;
        background-color: #040B11;
        justify-content: space-between;
        align-items: center;
        width: 92%;
        height: 100px;
        padding: 0 100px 0 100px;

        scroll-margin-top: 50px;

        @media (max-width: 1200px) {
            width: 92%;
            padding: 0 20px 0 20px;
            justify-content: space-between;
        }
    `;


    export const Logo = styled.img`
        height: 75px;
        cursor: pointer;

        @media (max-width: 1200px) {
            height: 60px;
        }
    `;

    export const DiscordButton = styled.button`
        width: 148px;
        height: 48px;
        border-radius: 0;
        background-color: #5865F2;
        font-family: 'Bakbak One', sans-serif;
        text-transform: uppercase;

        :hover {
            color: #5865F2;
            background-color: #faf2e3;
        }
    `;

    export const TwitterButton = styled.button`
        width: 148px;
        height: 48px;
        border-radius: 0;
        font-family: 'Bakbak One', sans-serif;
        text-transform: uppercase;
        background: #faf2e3;
        color: #000;
        border: 1px solid #000;

        :hover {
            border: 1px solid #faf2e3;
            background-color: #000;
            color: #faf2e3;
        }
    `;

    export const Container = styled(Flex)`
        padding: 18px;
        background-color: #040B11;

        @media (min-width: 1200px) {
            width: 100%;
        }
    `;

    export const MenuButton = styled(Button)`
        background: #07BC65;
        border: none;

        .ant-dropdown-open {
            border: none;
        }

        :focus {
            border none;
        }
    `;
}
