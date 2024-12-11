import {useRef, useState} from 'react';
import {S} from './App.styled';
import {Header} from './layout/header.tsx';
import {Layout} from './layout/index.tsx';
import {FAQ} from './components/faq/index.tsx';
import {Footer} from './components/footer/index.tsx';

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
      <Layout>
        <FAQ myRef={faq} />
      </Layout>
      <Footer />
    </S.App>
  )
}

export default App
