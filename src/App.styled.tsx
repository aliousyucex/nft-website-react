import styled from '@emotion/styled';

export namespace S {
  export const App = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  `;

  export const BackgroundContainer = styled.div`
    margin-top: 75px;
    box-shadow: rgb(4, 11, 17) 0px 140px 200px 130px inset;
    position: absolute;
    background-image: url(/src/assets/background.png);
    width: 100%;
    height: 750px;
    z-index: -1;
  `;
}
