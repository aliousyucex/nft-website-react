/* eslint-disable @typescript-eslint/no-namespace */
import styled from "@emotion/styled";
import '@fontsource/bakbak-one';
import { Space } from "antd";

export namespace S {
  export const Container = styled(Space)`
    display: flex;
    flex-direction: row;

    align-items: center;
    justify-content: center;
    width: 100%;
  `;

  export const Header = styled.h1`
    font-family: 'Bakbak One', sans-serif;
    font-size: 56px;
    letter-spacing: 0.625em;
    text-align: center;

    color: #FFF;
  `;

  export const CountDownComponentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    padding: 20px;
    text-transform: capitalize;
  `;

  export const CountDown = styled.span`
    display: flex;
    flex-direction: column;
    width: 108px;
    height: 108px;
    justify-content: center;
    align-items: center;
    background: rgba(194, 195, 197, 0.1);

    font-size: 56px;
    font-family: 'Bakbak One', sans-serif;
    text-transform: capitalize;
    color: #FFFFFF;
  `;

  export const CountDownSub = styled.span`
    height: 28px;
    margin-top: 10px;

    text-align: center;
    font-family: 'Bakbak One', sans-serif;
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 28px;
    text-transform: uppercase;
    color: #C2C3C5;
  `;
}
