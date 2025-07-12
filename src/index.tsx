import React, { useMemo } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import ReactDOM from "react-dom/client";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

import App from "./App.tsx";
import { S } from "./index.styled.tsx";
import "./index.css";

import { Game } from "./components/game/index.tsx";
import {Story} from './components/story/story.tsx';
import { Header } from "./layout/header.tsx";

const root = document.getElementById("root")!;

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Navigate to="/" replace />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: "game",
        element: (
          <S.GameContainer vertical align="center" justify="center">
            <Header noMenu />
            <Game />
          </S.GameContainer>
        ),
      },
      {
        path: 'story',
        element: (
          <S.StoryContainer justify="center" align="center">
            <Header noMenu />
            <Story />
          </S.StoryContainer>
        ),
      },
    ],
  },
]);


const RootApp = () => {
  const network = WalletAdapterNetwork.Mainnet;

  const endpoint = "https://blue-spring-spree.solana-mainnet.quiknode.pro/e9add5c886179e90f36055798215ab48bdb8f5c6";

  const wallets = useMemo(
    () => [new PhantomWalletAdapter()],
    [network],
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <S.Root>
            <RouterProvider router={router} />
          </S.Root>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <RootApp />
  </React.StrictMode>,
);
