import React from 'react';
import {ThirdwebProvider} from "thirdweb/react";
import {  } from "thirdweb/chains";

import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import {S} from './index.styled.tsx';
import './index.css';

const root = document.getElementById('root')!;

root.style.width = '100%';
// Currency symbol APE
// Network URL https://rpc.apechain.com/http
// Chain ID 33139
// Network name Ape Chain
// Block explorer URL https://apescan.io

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <ThirdwebProvider>
      <S.Root>
        <App />
      </S.Root>
    </ThirdwebProvider>
  </React.StrictMode>,
)
