/* eslint-disable @typescript-eslint/no-namespace */
import styled from "@emotion/styled";
import '@fontsource/bakbak-one';
import '@fontsource/poppins';
import {Card, Row} from "antd";

export namespace S {
  export const Container = styled.div`
    display: flex;
    position: absolute;
    justify-content: center;
    align-items: center;
    user-select: none;

    width: 1410px;
    height: 698px;

    margin: 0 auto;
  `;

  export const Cards = styled(Card)`
    width: 320px;
    height: 350px;

    background-color: #5033C3;
    border-radius: 0;
    border: none;
    user-select: none;
    color: white;
    font-size: 16px;
  `;

  export const ScoreLabel = styled.label`
    font-size: 2.25rem;
    font-family: 'Bakbak One', sans-serif;
  `;

  export const StartButton = styled.button`
    width: 100%;
    background-color: #FF1616;
    color: white;
    border: none;
    border-radius: 0;
    height: 48px;

    font-family: 'Bakbak One', sans-serif;

    :hover {
      color: black;
    }
  `;

  export const OptionLabel = styled.label`
    width: 86px;
    height: 86px;

    padding: 0;
    margin: 0;
  `;

  export const PlayerOption = styled.img`
    width: 80px;
    height: 80px;
    cursor: pointer;
  `;

  export const RadioButton = styled.input`
    display: flex;
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;

    :checked+img {
      border: 2px solid #f00;
      padding: 0;
      margin: 0;
    }
  `;

  export const CardTitle = styled.h2`
    font-family: 'Bakbak One', sans-serif;
  `;

  export const KeyImg = styled.img`
    width: 50px;
    margin: 0;
    padding: 0;
  `;

  export const KeyLabel = styled.label`
    font-family: 'Poppins', sans-serif;
  `;

  export const Description = styled.p`
    font-family: 'Poppins', sans-serif;
    font-size: 16px;
  `;

  export const KeyRow = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  `;
}
