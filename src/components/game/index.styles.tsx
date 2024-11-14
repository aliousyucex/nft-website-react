/* eslint-disable @typescript-eslint/no-namespace */
import styled from "@emotion/styled";
import "@fontsource/bakbak-one";

export namespace S {
  export const Container = styled.div`
    align-items: center;
    justify-content: center;

    scroll-margin-top: 100px;
    margin-top: 200px;

    @media (max-width: 1200px) {
      width: 85%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: black;
      color: #faf2e3;
      text-align: center;
      height: 100px;
      margin-top: 100px;
      scroll-margin-top: 200px;
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
