import {useRef, useState} from 'react';
import {S} from './App.styled';
import {Header} from './layout/header.tsx';
import {FAQ} from './components/faq/index.tsx';
import {Flex} from 'antd';

import manifestFirstFull from './assets/manifest/manifest.svg';
import manifestSecondFull from './assets/manifest/manifest2.svg';
import maskot from './assets/manifest/maskot.svg'
import peanut from '../public/logo.svg';

import phaseOne from './assets/roadmap/ticket1.svg';
import phaseTwo from './assets/roadmap/ticket2.svg';
import phaseThree from './assets/roadmap/ticket3.svg';
import phaseFour from './assets/roadmap/ticket4.svg';

import faqText from './assets/faq/FAQ.svg';
import faqVerticalText from './assets/faq/faqVertical.svg';

function App() {
  const [pageWidth, setPageWidth] = useState<number>(window.innerWidth);

  window.addEventListener('resize', () => {
    setPageWidth(window.innerWidth);
  });

  const manifest = useRef(null);
  const faq = useRef(null);

  return (
    <S.App>
      <Header pageWidth={pageWidth}  manifest={manifest} faq={faq} />
      <S.BackgroundContainer />

        {pageWidth <= 600 &&
          <S.ManifestContainer vertical justify="center" id="manifest" gap={12}>
            <S.ManifestTitle>Manifest</S.ManifestTitle>
            <strong>New Mechanics, New Adventures</strong>
            <span>At Ivory, there’s no room for the ordinary! From the minting process to game development, exclusive community content, and token integration, every stage is meticulously planned.</span>
            <Flex align="center" style={{fontFamily: 'inherit'}}>
              <span><strong>Leave Your Mark Through Adoption:</strong> Leave Your Mark Through Adoption: Post-mint, symbolic adoption certificates via WWF will immortalize our community's support.</span>
              <S.Maskot src={maskot} />
            </Flex>
            <span><strong>Tokenomics:</strong> Special benefits, airdrops, and much more for our holders.</span>
            <Flex align="center" justify="space-around" style={{fontFamily: 'inherit'}}>
              {/* PEANUT */}
              <S.Peanut src={peanut} />
              <span><strong>Peanut Rush:</strong> Enjoy a fun P2E mechanism where you can use your tokens.</span>
            </Flex>
            <span><strong>More:</strong> Each NFT is not just a design but also a feature you can use in the game, paired with its own story.</span>
          </S.ManifestContainer>
        }

        {/* MANIFEST BIG */}
        {pageWidth > 600 && <S.ManifestContainer vertical justify="center" align="center" id="manifest">
          <S.ManifestFull src={manifestFirstFull} />
          <S.Maskot src={maskot} />
          <S.ManifestFull src={manifestSecondFull} />
        </S.ManifestContainer>}

        {/* ROADMAP */}
        <S.Roadmap vertical justify="center" align="center" id="roadmap">
          <S.Ticket1 src={phaseOne} />
          <S.Ticket2 src={phaseTwo} />
          <S.Ticket3 src={phaseThree} />
          <S.Ticket4 src={phaseFour} />
        </S.Roadmap>

        {/* FAQ */}
        <S.FaqContainer id="faq" >
          <FAQ myRef={faq} />
          <S.FaqText src={pageWidth > 900 ? faqText : faqVerticalText} />
        </S.FaqContainer>
      {/* <Footer /> */}
    </S.App>
  )
}

export default App
