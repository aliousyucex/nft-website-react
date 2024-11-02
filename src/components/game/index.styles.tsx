/* eslint-disable @typescript-eslint/no-namespace */
import styled from "@emotion/styled";
import '@fontsource/bakbak-one';

export namespace S {
  export const Container = styled.div`
    align-items: center;
    justify-content: center;
    width: 100%;

    scroll-margin-top: 125px;
    margin-top: 200px;

    @media (max-width: 1400px) {
      display: none;
    }
  `;

  export const Title = styled.h1`
        display: flex;
        justify-content: center;

        font-family: 'Bakbak One', sans-serif;
        font-size: 36px;

        color: #fff;
    `;
}
