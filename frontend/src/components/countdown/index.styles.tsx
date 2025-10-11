import styled from "@emotion/styled";
import '@fontsource/bakbak-one';
import { Flex } from "antd";

export namespace S {
  export const Main = styled.div`
    user-select: none;
  `;

  export const CountDownComponentContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    text-transform: capitalize;
  `;

  export const CountDown = styled.span`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #292826A8;

    width: 108px;
    height: 108px;
    font-size: 56px;
    font-family: 'Bakbak One', sans-serif;
    padding: 12px;
    text-transform: capitalize;
    color: #faf2e3;

    @media (max-width: 1400px) {
      width: 40px;
      height: 40px;
      font-size: 36px;
      padding: 12px;
    }
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
    color: #faf2e3;

    @media (max-width: 1400px) {
      font-size: 14px;
    }
  `;

  export const FlexContainer = styled(Flex)`
    gap: 36px;

    @media (max-width: 1400px) {
      gap: 12px;
    }
  `;
}
