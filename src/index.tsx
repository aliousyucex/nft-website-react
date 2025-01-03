import React from 'react';
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import {S} from './index.styled.tsx';
import './index.css';

import {Game} from './components/game/index.tsx';
// import {Story} from './components/story/story.tsx';
import { Header } from './layout/header.tsx';

const root = document.getElementById('root')!;

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <Navigate to="/" replace />,
    children: [
      {
        index: true,
        element: <App />
      },
      {
        path: 'game',
        element: (
            <S.GameContainer vertical align="center">
              <Header pageWidth={window.innerWidth} noMenu />
              <Game />
            </S.GameContainer>
        ),
      }
    ]
  }
])

// {
      //   path: 'story',
      //   element: (
      //     <S.StoryContainer justify="center" align="center">
      //       <Header pageWidth={window.innerWidth} noMenu />
      //       <Story />
      //     </S.StoryContainer>
      //   ),
      // },

ReactDOM.createRoot(root).render(
  <React.StrictMode>
      <S.Root>
        <RouterProvider router={router} />
      </S.Root>
  </React.StrictMode>,
)
