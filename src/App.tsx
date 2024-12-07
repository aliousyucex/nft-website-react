import {useRef, useState} from 'react';
import {S} from './App.styled';
import {Header} from './layout/header.tsx';
import {Layout} from './layout/index.tsx';
import {Story} from './components/story/story.tsx';
import {Team} from './components/team/index.tsx';
import {FAQ} from './components/faq/index.tsx';
import {Footer} from './components/footer/index.tsx';
import {Game} from './components/game/index.tsx';

function App() {
  const [pageWidth, setPageWidth] = useState<number>(window.innerWidth);

  window.addEventListener('resize', () => {
    setPageWidth(window.innerWidth);
  });

  const manifest = useRef(null);
  const story = useRef(null);
  const game = useRef(null);
  const team = useRef(null);
  const faq = useRef(null);

  return (
    <S.App>
      <Header pageWidth={pageWidth} story={story} game={game} manifest={manifest} team={team} faq={faq} />
      <S.BackgroundContainer />
      <Layout>
        {/* <Story pageWidth={pageWidth} myRef={story} /> */}
        {/* <Team myRef={team} /> */}
        {/* <Game pageWidth={pageWidth} /> */}
        <FAQ myRef={faq} />
      </Layout>
      <Footer />
    </S.App>
  )
}

export default App
