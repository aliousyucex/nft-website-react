import styled from '@emotion/styled';
import backgroundYellow from './assets/background-yellow.jpg';

export namespace S {
  export const App = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;

    background-color: #F3753F;
  `;

  export const BackgroundContainer = styled.div`
    margin-top: 100px;
    position: absolute;
    background-image: url(${backgroundYellow});
    background-size: cover;
    background-repeat: no-repeat;
    width: 100%;
    height: 1600px;
    z-index: 0;

    @media (max-width: 1100px) {
      height: 100%;
    }

    @media (max-width: 700px) {
      height: 550px;
    }

    @media (max-width: 500px) {
      height: 405px;
    }
  `;

  export const Text = styled.div`
    width: 100%;
    height: 100vh;
    font-family: 'fuzzy bold', sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #8049F4;
  `;
}
