import styled from '@emotion/styled';

export namespace S {
  export const Layout = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        @media (max-width: 1100px) {
            margin-top: 100px;
        }
    `;
}
