import styled from "@emotion/styled";
import "@fontsource/bakbak-one";
import "@fontsource/poppins";

export namespace S {
    export const Container = styled.div`
        max-width: 1400px;
    `;


    export const stroyImg = styled.img`
        max-width: 300px;

        @media (max-width: 1200px) {
            width: 100%;
        }
    `;

    export const Text = styled.p`
        font-family: 'Poppins', sans-serif;
        font-size: 18px;
        line-height: 28px;
        color: #292826;
    `;

    export const PuncLines = styled.strong`
       font-family: 'Bakbak One', sans-serif;
    `;

    export const Li = styled.li`
        margin: 0 0 12px 0;
    `;

    export const ModalTitle = styled.h1`
        @media (max-width: 1200px) {
            font-size: 32px;
        }
    `;

    export const Title = styled.h1`
        display: flex;
        justify-content: center;

        font-family: 'Bakbak One', sans-serif;
        font-size: 36px;

        color: #faf2e3;
    `;
}
