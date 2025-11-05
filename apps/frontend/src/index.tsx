import {RainbowKitProvider} from '@rainbow-me/rainbowkit';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';
import {WagmiProvider} from 'wagmi';
import '@rainbow-me/rainbowkit/styles.css';

import App from './App.tsx';
import {config} from './config/wagmi';
import {S} from './index.styled.tsx';
import './index.css';

import IceWaterFireGame from './components/game/IceWaterFire/index.tsx';
import {Story} from './components/story/story.tsx';
import {Header} from './layout/header.tsx';

const queryClient = new QueryClient();

const root = document.getElementById('root')!;

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <Navigate to='/' replace />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'game',
        element: <IceWaterFireGame />,
      },
      {
        path: 'game/:roomId',
        element: <IceWaterFireGame />,
      },
      {
        path: 'story',
        element: (
          <S.StoryContainer justify='center' align='center'>
            <Header noMenu />
            <Story />
          </S.StoryContainer>
        ),
      },
    ],
  },
]);

const RootApp = () => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <S.Root>
            <RouterProvider router={router} />
          </S.Root>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>
);
