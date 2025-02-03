/* eslint-disable @typescript-eslint/no-namespace */
import styled from "@emotion/styled";
import "@fontsource/bakbak-one";
import { Flex } from "antd";

export namespace S {
  export const Container = styled(Flex)`
    margin: auto 0;
    font-family: 'fuzzy', sans-serif;

    scroll-margin-top: 135px;

    @media (max-width: 710px) {
      padding: 24px;
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

  export const ComingSoonContainer = styled.div`
    margin-top: 120px;
    align-items: center;
    justify-content: center;
    font-family: 'fuzzy', sans-serif;

    scroll-margin-top: 135px;
  `;

  export const ComingSoon = styled(Flex)`
    position: relative;
    color: #3C322E;
    text-aling: center;
    font-size: 64px;
    font-family: 'Londrina Solid', system-ui;
    width: 500px;
    height: 60vh;
  `;

  export const Loading = styled.div`
    position: relative;
    width: 65px; /* Konteyner genişliği */
    height: 65px; /* Konteyner yüksekliği */
    animation: spin 5s linear infinite; /* Konteynerin kendisini döndürme animasyonu */

    img {
      position: absolute;
      width: 65px; /* Görsellerin genişliği */
      height: 65px; /* Görsellerin yüksekliği */
      transform-origin: center;
    }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

export const H2 = styled.h2`
  font-family: 'Londrina Solid', system-ui;
  color: black;
`;
}
