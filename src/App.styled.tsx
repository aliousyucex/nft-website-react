import styled from '@emotion/styled';
import background from './assets/background.png';

export namespace S {
  export const App = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
  `;

  export const BackgroundContainer = styled.div`
    margin-top: 130px;
    box-shadow: rgb(4, 11, 17) 0px 140px 200px 130px inset;
    position: absolute;
    background-image: url(${background});
    width: 100%;
    height: 750px;
    z-index: -1;

    @media (max-width: 1200px) {
      box-shadow: rgb(4, 11, 17) 0px 16px 104px 86px inset;
      height: 600px;
      margin-top: 25px;
    }
  `;
}
