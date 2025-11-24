import {Flex} from 'antd';
import {useRef, useState} from 'react';
import {S} from './App.styled';
import manifestFisrt from './assets/manifest/manifest-first.svg';
import maskot from './assets/manifest/maskot.svg';
import {FAQ} from './components/faq/index.tsx';
import {Header} from './layout/header.tsx';

import phaseOne from './assets/roadmap/ticket1.svg';
import phaseTwo from './assets/roadmap/ticket2.svg';

import faqText from './assets/faq/FAQ.svg';
import faqVerticalText from './assets/faq/faqVertical.svg';

function App() {
  const [pageWidth, setPageWidth] = useState<number>(window.innerWidth);

  console.log('contractAddress', VITE_CONTRACT_ADDRESS);

  window.addEventListener('resize', () => {
    setPageWidth(window.innerWidth);
  });

  const manifest = useRef(null);
  const faq = useRef(null);

  return (
    <S.App>
      <Header manifest={manifest} faq={faq} />
      <S.BackgroundContainer />

      {pageWidth <= 600 && (
        <S.ManifestContainer vertical justify='center' id='manifest' gap={12}>
          <S.ManifestTitle>Manifest</S.ManifestTitle>
          <strong>We believe in the power of the game</strong>
          <span>
            Entertainment is not just a moment; it is a challenge.
          </span>
          <span><strong>Fire, Ice, and Water </strong>
          — each represents a different spirit: passion, strategy, and balance. Here, every move is a challenge, every victory a gain.
          </span>
          <Flex align='center' style={{fontFamily: 'inherit'}}>
          <span>You don't just play, you win; you don't just compete, you become part of the community. Fire Ice Water is where entertainment, strategy, and winning intersect. <br /> <br />
          In the NFT world, you are no longer just a spectator of the game; <strong>you are its owner.</strong></span>
            <S.Maskot src={maskot} />
          </Flex>
        </S.ManifestContainer>
      )}

      {/* MANIFEST BIG */}
      {pageWidth > 600 && (
        <S.ManifestContainer vertical justify='center' align='center' id='manifest'>
          <S.ManifestFull src={manifestFisrt  } />
          <S.Maskot src={maskot} />
        </S.ManifestContainer>
      )}

      {/* ROADMAP */}
      <S.Roadmap vertical justify='center' align='center' id='roadmap'>
        <S.Ticket1 src={phaseOne} />
        <S.Ticket2 src={phaseTwo} />
        {/* <S.Ticket3 src={phaseThree} />
        <S.Ticket4 src={phaseFour} /> */}
      </S.Roadmap>

      {/* FAQ */}
      <S.FaqContainer id='faq'>
        <FAQ myRef={faq} />
        <S.FaqText src={pageWidth > 900 ? faqText : faqVerticalText} />
      </S.FaqContainer>
      {/* <Footer /> */}
    </S.App>
  );
}

export default App;
