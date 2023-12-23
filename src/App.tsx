import {useRef} from 'react';
import {S} from './App.styled';
import {Countdown} from './components/countdown';
import {Header} from './layout/header.tsx';
import {Layout} from './layout/index.tsx';
import {Story} from './components/story/story.tsx';
import {SocialMedia} from './components/socialMedia/index.tsx';
import {RoadMap} from './components/roadmap/index.tsx';
import {Team} from './components/team/index.tsx';
import {FAQ} from './components/faq/index.tsx';
import {Footer} from './components/footer/index.tsx';

function App() {
  const roadmap = useRef(null);
  const story = useRef(null);
  const team = useRef(null);
  const faq = useRef(null);

  return (
    <S.App>
      <Header story={story} roadmap={roadmap} team={team} faq={faq} />
      <S.BackgroundContainer />
      <Layout>
        <Countdown />
        <SocialMedia />
        <Story myRef={story} />
        <RoadMap myRef={roadmap} />
        <Team myRef={team} />
        <FAQ myRef={faq} />
      </Layout>
      <Footer />
    </S.App>
  )
}

export default App
