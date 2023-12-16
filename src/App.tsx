import {S} from './App.styled';
import {Countdown} from './components/countdown';
// import { Game } from './components/game/index.tsx';
import background from './assets/background.png';
import {Header} from './layout/header.tsx';
import {Layout} from './layout/index.tsx';
import {Story} from './components/story/story.tsx';
import {SocialMedia} from './components/socialMedia/index.tsx';
import {RoadMap} from './components/roadmap/index.tsx';
import {Team} from './components/team/index.tsx';
import {FAQ} from './components/faq/index.tsx';
import {Footer} from './components/footer/index.tsx';

function App() {

  return (
    <S.App>
      <Header />
      <S.BackgroundContainer />
      <Layout>
        <Countdown />
        <SocialMedia />
        <Story />
        <RoadMap />
        <Team />
        <FAQ />
      </Layout>
      <Footer />
    </S.App>
  )
}

export default App
