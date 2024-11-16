import styled from '@emotion/styled';
import backgroundNoText from './assets/background-no-text.jpg';
import background from './assets/background.jpg';

export namespace S {
  export const App = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;
  `;

  export const BackgroundContainer = styled.div`
    margin-top: 100px;
    opacity: 0.75;
    position: absolute;
    background-image: url(${background});
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    z-index: -1;

    @media (max-width: 1200px) {
      height: 500px;
      background-image: url(${backgroundNoText});
      background-position: center;
      background-size: cover;
      margin-top: 25px;
    }
  `;
}
