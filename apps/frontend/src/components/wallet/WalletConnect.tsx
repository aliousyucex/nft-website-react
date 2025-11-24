import {ConnectButton} from '@rainbow-me/rainbowkit';
import styled from 'styled-components';

const WalletConnect: React.FC = () => {
  // Render RainbowKit UI
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        if (connected) {
          if (chain.unsupported) {
            return (
              <WrongNetworkButton onClick={openChainModal}>
                <WarningIcon>⚠️</WarningIcon>
                Wrong Network
              </WrongNetworkButton>
            );
          }

          return (
            <ConnectedContainer>
              <ChainButton onClick={openChainModal}>
                {chain.hasIcon && (
                  <ChainIcon
                    style={{
                      background: chain.iconBackground,
                    }}
                  >
                    {chain.iconUrl && (
                      <img
                        alt={chain.name ?? 'Chain icon'}
                        src={chain.iconUrl}
                        style={{width: 16, height: 16}}
                      />
                    )}
                  </ChainIcon>
                )}
                {chain.name}
              </ChainButton>

              <AccountButton onClick={openAccountModal}>
                <AddressText>{account.displayName}</AddressText>
                {account.displayBalance && <BalanceText>{account.displayBalance}</BalanceText>}
              </AccountButton>
            </ConnectedContainer>
          );
        }

        // Not connected - show connect button
        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            <ConnectWalletButton onClick={openConnectModal}>
              <WalletIcon>👛</WalletIcon>
              Connect Wallet
            </ConnectWalletButton>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default WalletConnect;

const ConnectWalletButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.6);
  }

  &:active {
    transform: translateY(0);
  }
`;

const WrongNetworkButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #E74C3C 0%, #C0392B 100%);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(231, 76, 60, 0.4);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(231, 76, 60, 0.6);
  }
`;

const WalletIcon = styled.span`
  font-size: 20px;
`;

const WarningIcon = styled.span`
  font-size: 20px;
`;

const ConnectedContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ChainButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const ChainIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const AccountButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
`;

const AddressText = styled.span`
  font-size: 14px;
  font-weight: 600;
  font-family: 'Courier New', monospace;
`;

const BalanceText = styled.span`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
`;
