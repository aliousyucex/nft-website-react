import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';
import { Space } from 'antd';

export namespace S {
    export const BannerContainer = styled.div`
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        margin-top: -125px;

        width: 1150px;
        height: 250px;
        background: linear-gradient(268.28deg, #2333DE -1.34%, #0ABE66 100%);
        border-radius: 8px;
    `;

    export const ItemContainer = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        height: 65%;
    `;

    export const ButtonContainer = styled.div`
        display: flex;
        gap: 12px;

        align-items: center;
        justify-content: center;
    `;

    export const Title = styled.span`
        font-family: 'Bakbak One', sans-serif;
        font-size: 44px;
        line-height: 56px;
    `;

    export const Text = styled.h1`
        font-family: 'Poppins';
        font-size: 18px;
    `;

    export const DiscordButton = styled.button`
        width: 148px;
        height: 48px;
        border: none;
        border-radius: 0;
        background-color: #5865F2;
        font-family: 'Bakbak One', sans-serif;
        text-transform: uppercase;
    `;

    export const BaskaButton = styled.button`
        width: 148px;
        height: 48px;
        color: #000;
        border: none;
        border-radius: 0;
        background-color: #21E786;
        font-family: 'Bakbak One', sans-serif;
        text-transform: uppercase;
    `;
}
