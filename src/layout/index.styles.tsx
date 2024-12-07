import styled from "@emotion/styled";

export namespace S {
    export const Layout = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 1600px;

        @media (max-width: 1100px) {
            margin-top: 1000px;
        }

        @media (max-width: 700px) {
            margin-top: 700px;
        }

        @media (max-width: 500px) {
            margin-top: 500px;
        }
    `;
}
