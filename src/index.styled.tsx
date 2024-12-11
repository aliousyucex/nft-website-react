import styled from '@emotion/styled';
import { Flex } from 'antd';

export namespace S {
  export const Root = styled.div`
    margin: 0 auto;
  `;

  export const GameContainer = styled(Flex)`
    height: 100vh;
    background-color: #8049F4;
    // background-color: #EFF85B;
    // background-color: #F3753F;
  `;

  export const StoryContainer = styled(Flex)`
    padding: 100px 0 100px 0;
    // background-color: #8049F4;
    // background-color: #EFF85B;
    // background-color: #F3753F;
    background-color: #F6DFB6;
  `;

  export const Logo = styled.img`
        display: flex;
        position: absolute;
        left: 76px;
        top: 20px;

        height: 60px;
        cursor: pointer;

        @media (max-width: 1200px) {
            height: 45px;
        }
    `;
}
