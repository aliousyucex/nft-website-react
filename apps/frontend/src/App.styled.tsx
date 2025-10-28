import styled from '@emotion/styled';
import {Flex} from 'antd';
import '@fontsource-variable/dynapuff';

import bannerFull from './assets/banner.svg';
import bannerHalf from './assets/bannerHalf.svg';
import bannerSmall from './assets/bannerSmall.svg';

import roadmapBackground from './assets/roadmap/background.svg';
import roadmapVertical from './assets/roadmap/roadmap.svg';

import bg from './assets/faq/background-.svg';

export namespace S {
  export const App = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    user-select: none;

    background-color: #D5E2D8;
  `;

  export const BackgroundContainer = styled.div`
    margin-top: 3 0px;
    background-image: url(${bannerFull});
    background-size: contain;
    background-repeat: no-repeat;
    width: 100%;
    height: 1320px;
    z-index: 0;

    @media (max-width: 1400px) {
      height: 1100px;
    }

    @media (max-width: 1300px) {
      height: 9500px;
    }

    @media (max-width: 1200px) {
      height: 800px;
    }

    @media (max-width: 1100px) {
      height: 670px;
    }

    @media (max-width: 940px) {
      background-image: url(${bannerHalf});
      height: 900px;
    }

    @media (max-width: 700px) {
      height: 700px;
    }

    @media (max-width: 575px) {
      background-image: url(${bannerSmall});
    }
  `;

  export const ManifestTitle = styled.span`
    font-size: 36px;
    font-weight: bold;
    text-align: center;
  `;

  export const ManifestContainer = styled(Flex)`
    padding: 12px;
    font-family: 'DynaPuff Variable', system-ui;
    scroll-margin-top: 70px;
    color: #000;
  `;

  export const ManifestFull = styled.img`
    width: 100%;
    height: 100%;
  `;

  export const Maskot = styled.img`
    margin-top: -150px;
    max-width: 225px;

    @media (max-width: 1300px) {
      margin-top: -50px;
      max-width: 150px;
    }

    @media (max-width: 700px) {
      margin-top: -20px;
      max-width: 110px;
    }
  `;

  export const Peanut = styled.img`
    max-width: 65px;
    background-color: transparent;
    border-radius: 50%;
    padding: 4px;
  `;

  export const Roadmap = styled(Flex)`
    margin-top: 175px;
    max-height: 1077px;
    width: 100%;
    background-size: contain;
    background-position: bottom;
    background-repeat: no-repeat;
    background-image: url(${roadmapBackground});


    @media (max-width: 1300px) {
      max-height: 800px;
    }

    @media (max-width: 600px) {
      padding-top: 100px;
      background-size: contain;
      background-position: top;
      background-repeat: no-repeat;
      background-image: url(${roadmapVertical});
    }
  `;

  export const TicketBase = styled.img`
    max-width: 800px;
    padding: 8px;

    @media (max-width: 1300px) {
      width: 580px;
    }

    @media (max-width: 1100px) {
      width: 400px;
    }
  `;

  export const Ticket1 = styled(TicketBase)`
    @media (min-width: 1300px) {
      margin-left: -200px;
      }
  `;

  export const Ticket2 = styled(TicketBase)`
        @media (min-width: 1300px) {
      margin-left: 50px;
    }
  `;

  export const Ticket3 = styled(TicketBase)`
    @media (min-width: 1300px) {
      margin-left: 300px;
    }
  `;

  export const Ticket4 = styled(TicketBase)`
    @media (min-width: 1300px) {
      margin-left: 550px;
    }
  `;

  export const FaqContainer = styled.div`
    display: flex;
    position: relative;
    justify-content: center;
    align-items: end;
    width: 100%;
    height: 100vh;
    z-index: 1;

    background-image: url(${bg});
    background-size: cover;

    @media (max-width: 1400px) {
      height: 80vh;
    }

    @media (max-width: 1200px) {
      margin-top: 50px;
      height: 70vh;
    }

    @media (max-width: 900px) {
      margin-top: 50px;
      height: 60vh;
    }

    @media (max-width: 650px) {
      margin-top: 50px;
      height: 70vh;
    }
  `;

  export const FaqText = styled.img`
    display: flex;
    position: absolute;
    right: 5%;
    top: 30%;

    @media (max-width: 1400px) {
      top: 25%;
    }

    @media (max-width: 900px) {
      top: 15px;
      right: 20%;
    }
  `;
}
