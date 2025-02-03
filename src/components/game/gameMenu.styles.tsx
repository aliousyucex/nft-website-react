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
    z-index: 2;

    width: 100%;
    height: 100%;

    margin: 0 auto;
  `;

  export const Cards = styled(Card)`
    width: 320px;
    height: 370px;

    background-color: #F6DFB6;
    border-radius: 0;
    border: none;
    user-select: none;
    color: #292826;
    font-size: 16px;
  `;

  export const ScoreLabel = styled.label`
    font-size: 2.25rem;
    font-family: 'DynaPuff Variable', system-ui;
  `;

  export const StartButton = styled.button`
    width: 100%;
    background-color: #8049F4;
    color: #eff85b;
    border: none;
    border-radius: 8px;
    height: 48px;
    cursor: pointer;

    font-family: 'DynaPuff Variable', system-ui;
    font-size: 20px;
    :hover {
      background-color: #eff85b;
      color: #8049F4;
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
      border: 2px solid #292826;
      border-radius: 8px;
      padding: 0;
      margin: 0;
    }
  `;

  export const CardTitle = styled.h2`
    font-family: 'DynaPuff Variable', system-ui;
  `;

  export const LeaderBoard = styled.span`
    width: 100%;
    font-size: 24px;
    font-weight: 600;
    font-family: 'DynaPuff Variable', system-ui;
    border-bottom: 1px solid black;
    text-align: center;
    margin-top: -6px;
    padding: 6px;
  `;

  export const KeyImg = styled.img`
    width: 50px;
    margin: 0;
    padding: 0;
  `;

  export const KeyLabel = styled.label`
    font-family: 'DynaPuff Variable', system-ui;
  `;

  export const Description = styled.p`
    font-family: 'DynaPuff Variable', system-ui;
    font-size: 16px;
  `;

  export const KeyRow = styled(Row)`
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  `;

  export const Table = styled.table`
    font-family: 'DynaPuff Variable', system-ui;
    width: 100%;
    border-collapse: collapse;
  `;

  export const Th = styled.th`
  padding: 8px;
  text-align: left;
  `;

  export const Td = styled.td`
  padding: 8px;
  text-align: left;
  `;
}
