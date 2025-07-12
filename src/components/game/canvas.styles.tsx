/* eslint-disable @typescript-eslint/no-namespace */
import styled from "@emotion/styled";
import {Slider, Space} from "antd";
import '@fontsource/poppins';

export namespace S {
  export const Container = styled.div`
    display: flex;
    position: relative;

    border: 1px solid #21E78662;
  `;

  export const TimeLabel = styled.label`
    display: flex;
    position: absolute;
    margin: 12px 0 0 12px;
    user-select: none;
    z-index: 1;
  `;

  export const VolumeBarContainer = styled.div`
    display: flex;
    position: absolute;
    right: 12px;
    margin: 12px 0 0 12px;
    z-index: 1;

    height: 20px;
    align-items: center;
    justify-content: center;
  `;

  export const VolumeBarInput = styled.div`
    display: flex;
    margin-left: 8px;
    background-color: #faf2e3;
    border-radius: 16px;

    height: 20px;
    opacity: 0.7;
    align-items: center;
    justify-content: center;
    width: 135px;

    :hover {
      opacity: 1;
    }
  `;

  export const VolumeBar = styled(Slider)`
    width: 100px;
    background: #faf2e3;

    user-select: none;
  `;

  export const FocusLabel = styled.label`
    font-family: 'Poppins', sans-serif;
  `;

  export const FocusSpace = styled(Space)`
    margin-right: 16px;
  `;
}
