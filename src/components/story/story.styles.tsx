import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';
import {Card as AntCard, Space, Modal as Md} from 'antd';

export namespace S {
    export const Title = styled.span    `
        font-family: 'Bakbak One', sans-serif;
        color: #fff;
        font-size: 44px;
    `;

    export const Text = styled.p`
        font-family: 'Poppins', sans-serif;
        color: #C2C3C5;
        max-width: 500px;
        font-size: 18px;
        line-height: 28px;
    `;

    export const StoryContainer = styled(Space)`
        scroll-margin-top: 125px;
        margin-top: 200px;
    `;

    export const footerHeaders = styled.span`
        font-family: 'Bakbak One', sans-serif;
        font-weight: bold;
        font-size: 20px;
        color: #C2C3C5;
    `;

    export const footerTexts = styled.span`
        font-size: 56px;
        font-family: 'Bakbak One', sans-serif;
        color: #fff;
        text-shadow: 0px 4px 16px rgba(255, 255, 255, 0.4);
    `;

    export const Button = styled.button`
        background: none;

        font-family: 'Bakbak One', sans-serif;
        font-size: 16px;
        font-weight: bold;
        width: 138px;
        height: 48px;
        border: 2px solid #21E786;
        border-radius: 0;

        :hover {
            background: #21E786;
            border: 2px solid #21E786;
            font-size: 16px;
            color: #000;
        }
    `;

    export const Card = styled(AntCard)`
        color: #fff;
        background-color: #141B22;

        border-radius: 0;
        border: none;
        width: 330px;
        height: 250px;
        font-family: 'poppins', sans-serif;

        .ant-card-head {
            display: flex;
            justify-content: center;
            text-align: center;

            padding-top: 24px;
            font-size: 24px;
            font-family: 'Bakbak One', sans-serif;

            color: #fff;
            border: none;
        }
    `;

    export const ManifestCard = styled(Card)`
        :hover {
            background: #0FA37D;
        }
    `;

    export const NftCard = styled(Card)`
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    export const TwitterLink = styled.a`
        color: #fff;
        text-decoration: none;

        :hover {
            color: #1A8CD8;
        }
    `;

    export const DiscordLink = styled.a`
        color: #fff;
        text-decoration: none;

        :hover {
            color: #3841AA;
        }
    `;

    export const Modal = styled(Md)`
        .ant-modal-content{
            background: #11121E;
            padding: 24px;

            color: #fff;
            width: 100%;
            max-height: 750px;
            overflow: auto;
        }
    `;

    export const stroyImg = styled.img`
        max-width: 300px;
    `;

    export const StoryModalContainer = styled(Space)`
        color: #999;
        font-family: 'Poppins', sans-serif;
    `;
}
