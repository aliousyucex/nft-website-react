import styled from '@emotion/styled';
import {Carousel as Cl} from 'antd';
import '@fontsource/bakbak-one';
import '@fontsource/poppins';

export namespace S {
    export const CarouselContainer = styled.div`
        margin-top: 100px;

        scroll-margin-top: 100px;
    `;

    export const Title = styled.h1`
        display: flex;
        justify-content: center;

        font-family: 'Bakbak One', sans-serif;
        font-size: 36px;

        color: #fff;
    `;

    export const Carousel = styled(Cl)`
        width: 1150px;
        background: #11171D;
        color: #fff;

        height: 500px;

        li {
            background: green;
        }

        li:hover {
            background: #21E786;
        }

        .slick-active button {
            background: #21E786 !important;
        }
    `;

    export const Phase = styled.div`
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        flex-direction: row;
        padding: 32px;
        height: 100%;
    `;

    export const PhaseLargeImg = styled.img`
        padding-top: 5px;
        height: 400px;
    `;

    export const PhaseSmallImg = styled.img`
        width: 196px;
    `;

    export const PhaseExtraWidthImg = styled.img`
        width: 660px;
    `;

    export const PhaseFullImg = styled.img`
        height: 420px;
    `;

    export const PhaseDiscription = styled.div`
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        padding: 0 0 0 64px;
        width: 100%;
        height: 400px;
    `;

    export const PhaseTitle = styled.h1`
        font-family: 'Bakbak One', sans-serif;
        font-size: 36px;

        padding-top: 20px;
        letter-spacing: 0.15em;

    `;

    export const PhaseText = styled.span`
        font-family: 'Poppins', sans-serif;
        font-size: 18px;
    `;
}
