import styled from "@emotion/styled";
import "@fontsource/poppins";
import cardImage from "../../assets/story/asd.png";
import { Flex } from "antd";

export namespace S {
    export const Container = styled(Flex)`
        scroll-margin-top: 125px;
    `;

    export const CardText = styled.p`
        font-family: 'Poppins', sans-serif;
        color: #292826;
        font-size: 18px;
        line-height: 28px;
        text-align: center;

        margin-top: 100px;
    `;

    export const Card = styled.div`
        background: url(${cardImage});
        background-repeat: no-repeat;
        background-size: contain;
        width: 1100px;
        height: 280px;

        @media (max-width: 1100px) {
            width: 900px;
            height: 270px;
        }

        @media (max-width: 700px) {
            width: 500px;
            height: 140px;
        }

        @media (max-width: 500px) {
            width: 350px;
            height: 100px;
        }
    `;
}
