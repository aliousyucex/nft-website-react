import {useRef, useState} from 'react';
import {S} from './App.styled';
import {Countdown} from './components/countdown';
import {Header} from './layout/header.tsx';
import {Layout} from './layout/index.tsx';
import {Story} from './components/story/story.tsx';
import {SocialMedia} from './components/socialMedia/index.tsx';
import {Team} from './components/team/index.tsx';
import {FAQ} from './components/faq/index.tsx';
import {Footer} from './components/footer/index.tsx';
import { Game } from './components/game/index.tsx';
import { Banner } from './components/banner/index.tsx';

function App() {
  const [pageWidth, setPageWidth] = useState<number>(window.innerWidth);

  window.addEventListener('resize', () => {
    setPageWidth(window.innerWidth);
  });

  const roadmap = useRef(null);
  const story = useRef(null);
  const game = useRef(null);
  const team = useRef(null);
  const faq = useRef(null);

  return (
    <S.App>
      <Header pageWidth={pageWidth} story={story} roadmap={roadmap} game={game}  team={team} faq={faq} />
      <S.BackgroundContainer />
      <Layout>
        <Countdown />
        <SocialMedia />
        <Story pageWidth={pageWidth} myRef={story} />
        <Banner pageWidth={pageWidth} />
        <Game pageWidth={pageWidth} myRef={game} />
        <Team myRef={team} />
        <FAQ myRef={faq} />
      </Layout>
      <Footer />
    </S.App>
  )
}

export default App
