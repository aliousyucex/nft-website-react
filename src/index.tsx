import React from 'react';
import {createBrowserRouter, Navigate, RouterProvider} from 'react-router-dom';
import ReactDOM from 'react-dom/client';

import App from './App.tsx';
import {S} from './index.styled.tsx';
import './index.css';
import {Game} from './components/game/index.tsx';
import logo from '../public/logo.png';

const root = document.getElementById('root')!;

const gameRef = React.createRef<HTMLDivElement>();

const router = createBrowserRouter([
  {
    path: '/',
    children: [
      {
        index: true,
        element: <Navigate to="./home" replace />,
      },
      {
        path: 'home',
        element: <App />
      },
      {
        path: 'story',
        element: <div>story</div>,
      },
      {
        path: 'game',
        element: <S.GameContainer justify="center" align="center">
              <S.Logo
                src={logo}
                onClick={() => window.location.href = '/home'}
              />
              <Game myRef={gameRef} />
          </S.GameContainer>,
      }
    ]
  }
])

ReactDOM.createRoot(root).render(
  <React.StrictMode>
      <S.Root>
        <RouterProvider router={router} />
      </S.Root>
  </React.StrictMode>,
)
