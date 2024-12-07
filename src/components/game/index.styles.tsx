/* eslint-disable @typescript-eslint/no-namespace */
import styled from "@emotion/styled";
import "@fontsource/bakbak-one";

export namespace S {
  export const Container = styled.div`
    align-items: center;
    justify-content: center;
    font-family: 'fuzzy', sans-serif;
    width: 1410px;

    scroll-margin-top: 135px;

    @media (max-width: 1200px) {
      width: 350px;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #F6DFB6;
      color: #292826;
      text-align: center;
      height: 100px;
      margin-top: 100px;
      scroll-margin-top: 200px;
    }
  `;
}
