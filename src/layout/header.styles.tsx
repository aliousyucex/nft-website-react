import styled from '@emotion/styled';
import {Menu} from 'antd';
import '@fontsource/bakbak-one';

export namespace S {
    export const StyledMenu = styled(Menu)`
        height: 100px;
        justify-content: center;
        align-items: center;
        color: white;
        font-size: 16px;
        font-weight: 600;
        background-color: #040B11;
        font-family: 'Bakbak One', sans-serif;
        transition:all 1s;
        user-select: none;
        min-width: 550px;

        letter-spacing: 0.1em;
        text-transform: uppercase;
    `;

    export const HeaderContainer = styled.div`
        display: flex;
        position: fixed;
        z-index: 1;
        background-color: #040B11;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100px;

        scroll-margin-top: 50px;
    `;


    export const Logo = styled.img`
        width: 150px;
        cursor: pointer;
    `;

    export const DiscordButton = styled.button`
        width: 148px;
        height: 48px;
        border-radius: 0;
        background-color: #5865F2;
        font-family: 'Bakbak One', sans-serif;
        text-transform: uppercase;
    `;

    export const BaskaButton = styled.button`
        width: 148px;
        height: 48px;
        color: #000;
        border-radius: 0;
        background-color: #21E786;
        font-family: 'Bakbak One', sans-serif;
        text-transform: uppercase;
    `;
}
