import { useState } from "react";
import { GameCanvas } from "./canvas";
import { S } from "./index.styles";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Flex } from "antd";

export const Game = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const { publicKey } = useWallet();

  window.addEventListener("resize", () => {
    setWidth(window.innerWidth);
  });

  if (width < 710) {
    return <S.Container>You need bigger screen to play the game.</S.Container>;
  }

  return (
    <S.Container vertical>
      {!publicKey && (
        <Flex vertical align="center">
          <S.H2>You need to connect your wallet to play the game!</S.H2>
          <WalletMultiButton />
        </Flex>
      )}

      {publicKey && <Flex vertical align="flex-end">
        <WalletMultiButton />
      </Flex>}

      {publicKey && <GameCanvas walletAddress={publicKey.toBase58()} />}
    </S.Container>
  );
};
