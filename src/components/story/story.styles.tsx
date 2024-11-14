import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';
import {Card as AntCard, Modal as Md, Flex} from 'antd';

export namespace S {
    export const Title = styled.h1`
    display: flex;
    justify-content: center;

    font-family: 'Bakbak One', sans-serif;
    font-size: 36px;

    color: #faf2e3;
`;

    export const Text = styled.p`
        font-family: 'Poppins', sans-serif;
        color: #ccc5b9;
        font-size: 18px;
        line-height: 28px;
    `;

    export const CardText = styled.p`
        font-family: 'Poppins', sans-serif;
        color: #ccc5b9;
        font-size: 18px;
        line-height: 28px;
        text-align: center;
    `;

    export const StoryContainer = styled(Flex)`
        scroll-margin-top: 125px;
        margin-top: 200px;

        @media (max-width: 768px) {
        margin-top: 100px; // Mobil cihazlar için üst boşluğu azaltın.
        }
    `;

    export const footerHeaders = styled.span`
        font-family: 'Bakbak One', sans-serif;
        font-weight: bold;
        font-size: 20px;
        color: #ccc5b9;
    `;

    export const footerTexts = styled.span`
        font-size: 56px;
        font-family: 'Bakbak One', sans-serif;
        color: #faf2e3;
        text-shadow: 0px 4px 16px rgba(255, 255, 255, 0.4);
    `;

    export const Button = styled.button`
        background: none;

        font-family: 'Bakbak One', sans-serif;
        font-size: 16px;
        font-weight: bold;
        width: 250px;
        height: 60px;
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
        color: #faf2e3;
        background-color: #141B22;
        width: 500px;

        border-radius: 0;
        border: none;
        font-family: 'poppins', sans-serif;
        height: 350px;

        @media (max-width: 768px) {
            width: 350px;
        }
    `;

    export const CardTitle = styled.span`
        text-align: center;
        font-size: 42px;
        font-family: 'Bakbak One', sans-serif;

        @media (max-width: 1200px) {
            font-size: 36px;
        }
    `;

    export const DiscordLink = styled.a`
        color: #faf2e3;
        text-decoration: none;

        :hover {
            color: #3841AA;
        }
    `;

    export const Modal = styled(Md)`
        .ant-modal-content{
            background: #11121E;
            padding: 24px;

            color: #faf2e3;
            width: 100%;
            max-height: 750px;
            overflow: auto;

            @media (max-width: 1200px) {
                max-height: 500px;
            }
        }
    `;

    export const stroyImg = styled.img`
        max-width: 300px;

        @media (max-width: 1200px) {
            width: 100%;
        }
    `;

    export const StoryModalContainer = styled(Flex)`
        color: #999;
        font-family: 'Poppins', sans-serif;
    `;

    export const StoryModalTitle = styled.label`
        display: flex;
        justify-content: center;

        font-family: 'Bakbak One', sans-serif;
        font-size: 36px;

        margin: 12px;
    `;

    export const CardContent = styled(Flex)`
        height: 300px;

        @media (max-width: 1200px) {
            height: 280px;
        }
    `;

    export const CardButton = styled.button`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-radius: 0;

        height: 48px;
        font-size: 18px;
        font-family: 'Bakbak One', sans-serif;

        border: 4px solid #21E786;
        background: none;
        color: #21E786;

        :hover {
            background: #21E786;
            border: 4px solid #21E786;
            color: black;
        }
    `;

    export const PuncLines = styled.strong`
       font-family: 'Bakbak One', sans-serif;
    `;

    export const SubTitles = styled.strong`
       font-family: 'Bakbak One', sans-serif;
       font-size: 24px;
    `;

    export const Li = styled.li`
        margin: 0 0 12px 0;
    `;

    export const ModalTitle = styled.h1`
        @media (max-width: 1200px) {
            font-size: 32px;
        }
    `;

    export const ManifestContainer = styled(Flex)`
        font-family: 'Poppins', sans-serif;
        color: #ccc5b9;
        font-size: 18px;
        line-height: 28px;
    `;
}
