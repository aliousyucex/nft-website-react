import styled from '@emotion/styled';
import { Flex } from 'antd';

export namespace S {
  export const Root = styled.div`
    margin: 0 auto;
  `;

  export const GameContainer = styled(Flex)`
    height: 100vh;
    background-color: #D5E2D8;
  `;

  export const StoryContainer = styled(Flex)`
    padding: 100px 0 100px 0;
    background-color: #D5E2D8;
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
