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
}
