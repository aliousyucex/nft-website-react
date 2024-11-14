import styled from "@emotion/styled";

export namespace S {
    export const Layout = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 200px;

        @media (max-width: 1400px) {
            margin-top: 100px;
        }
    `;
}
