import styled from '@emotion/styled';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';

export namespace S {
    export const Team = styled.div`
        margin-top: 100px;

        scroll-margin-top: 100px;
    `;

    export const Title = styled.h1`
        display: flex;
        justify-content: center;

        font-family: 'Bakbak One', sans-serif;
        font-size: 36px;

        color: #faf2e3;
    `;

    export const TeamCard = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        width: 230px;
        height: 315px;
        padding: 20px;

        background-color: #141B22;

        @media (max-width: 1200px) {
            width: 120px;
            height: 160px;
            text-align: center;
        }
    `;

    export const CardTitle = styled.span`
        font-family: 'Bakbak One', sans-serif;
        font-size: 28px;

        @media (max-width: 1200px) {
            font-size: 16px;
        }
    `;

    export const CardRole = styled.span`
        font-family: 'Poppins', sans-serif;
        font-size: 16px;
        margin: 8px 0;

        @media (max-width: 1200px) {
            font-size: 12px;
            align-text: center;
        }
    `;

    export const Img = styled.img`
        width: 180px;
        padding-left: 30px;
        margin-bottom: 12px;

        @media (max-width: 1200px) {
            width: 80px;
            padding-left: 10px;
        }
    `;
}
