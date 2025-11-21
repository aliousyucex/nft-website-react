import {useLoginWithAbstract} from '@abstract-foundation/agw-react';
import {ConnectButton} from '@rainbow-me/rainbowkit';
import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {formatEther} from 'viem';
import {useAccount, useBalance, useChainId, useDisconnect, useSwitchChain} from 'wagmi';
import {monadTestnet} from '../../config/wagmi';
import WalletSelectionModal from './WalletSelectionModal';

type ConnectionMethod = 'rainbowkit' | 'agw' | null;

const CONNECTION_METHOD_KEY = 'wallet_connection_method';

const WalletConnect: React.FC = () => {
  const [connectionMethod, setConnectionMethod] = useState<ConnectionMethod>(null);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [shouldOpenRainbowKit, setShouldOpenRainbowKit] = useState(false);
  const {address, isConnected} = useAccount();
  const {disconnect} = useDisconnect();
  const chainId = useChainId();
  const {switchChain} = useSwitchChain();
  const {data: balance} = useBalance({address});
  const {login: loginWithAbstract} = useLoginWithAbstract();

  // Load connection method from localStorage on mount
  useEffect(() => {
    const savedMethod = localStorage.getItem(CONNECTION_METHOD_KEY) as ConnectionMethod;
    if (savedMethod && (savedMethod === 'rainbowkit' || savedMethod === 'agw')) {
      setConnectionMethod(savedMethod);
    }
  }, []);

  // Clear connection method when disconnected
  useEffect(() => {
    if (!isConnected) {
      setConnectionMethod(null);
      localStorage.removeItem(CONNECTION_METHOD_KEY);
      setShouldOpenRainbowKit(false);
    }
  }, [isConnected]);

  const handleSelectStandard = () => {
    setShowSelectionModal(false);
    setConnectionMethod('rainbowkit');
    localStorage.setItem(CONNECTION_METHOD_KEY, 'rainbowkit');
    setShouldOpenRainbowKit(true);
  };

  const handleSelectAbstract = async () => {
    setShowSelectionModal(false);
    setConnectionMethod('agw');
    localStorage.setItem(CONNECTION_METHOD_KEY, 'agw');
    try {
      loginWithAbstract();
    } catch (error) {
      console.error('Failed to connect with Abstract Wallet:', error);
      setConnectionMethod(null);
      localStorage.removeItem(CONNECTION_METHOD_KEY);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setConnectionMethod(null);
    localStorage.removeItem(CONNECTION_METHOD_KEY);
  };

  const handleConnectClick = () => {
    if (!isConnected) {
      setShowSelectionModal(true);
    }
  };

  // Ref to store RainbowKit modal opener function
  const rainbowKitModalRef = React.useRef<(() => void) | null>(null);

  // Open RainbowKit modal when flag is set
  useEffect(() => {
    if (shouldOpenRainbowKit && rainbowKitModalRef.current && !isConnected) {
      rainbowKitModalRef.current();
      setShouldOpenRainbowKit(false);
    }
  }, [shouldOpenRainbowKit, isConnected]);

  // Render RainbowKit UI (handles both connected and connecting states)
  return (
    <>
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

          // Store modal opener function in ref
          rainbowKitModalRef.current = openConnectModal;

          // If connected but connectionMethod is null, assume RainbowKit (backward compatibility)
          const effectiveConnectionMethod = connected && !connectionMethod ? 'rainbowkit' : connectionMethod;

          // If connected via RainbowKit, show RainbowKit UI
          if (connected && effectiveConnectionMethod === 'rainbowkit') {
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

          // If connected via AGW (not via RainbowKit), show AGW UI
          // Note: 'connected' is from RainbowKit, 'isConnected' is from wagmi
          if (!connected && isConnected && connectionMethod === 'agw') {
            const isWrongNetwork = chainId !== monadTestnet.id;
            const displayAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';
            const displayBalance = balance ? `${parseFloat(formatEther(balance.value)).toFixed(4)} MON` : '';

            return (
              <ConnectedContainer>
                {isWrongNetwork ? (
                  <WrongNetworkButton
                    onClick={() => {
                      if (switchChain) {
                        switchChain({chainId: monadTestnet.id});
                      }
                    }}
                  >
                    <WarningIcon>⚠️</WarningIcon>
                    Wrong Network
                  </WrongNetworkButton>
                ) : (
                  <ChainButton
                    onClick={() => {
                      if (switchChain) {
                        switchChain({chainId: monadTestnet.id});
                      }
                    }}
                  >
                    {monadTestnet.name}
                  </ChainButton>
                )}

                <AccountButton onClick={handleDisconnect}>
                  <AddressText>{displayAddress}</AddressText>
                  {displayBalance && <BalanceText>{displayBalance}</BalanceText>}
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
              <ConnectWalletButton onClick={handleConnectClick}>
                <WalletIcon>👛</WalletIcon>
                Connect Wallet
              </ConnectWalletButton>
            </div>
          );
        }}
      </ConnectButton.Custom>
      <WalletSelectionModal
        visible={showSelectionModal}
        onClose={() => setShowSelectionModal(false)}
        onSelectStandard={handleSelectStandard}
        onSelectAbstract={handleSelectAbstract}
      />
    </>
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
