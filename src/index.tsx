import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {S} from './index.styled.tsx';
import './index.css';

const root = document.getElementById('root')!;

root.style.width = '100%';

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <S.Root>
      <App />
    </S.Root>
  </React.StrictMode>,
)
