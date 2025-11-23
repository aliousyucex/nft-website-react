import {Button, Flex, Input, InputNumber, Modal, message} from 'antd';
import type React from 'react';
import {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {useDisconnect} from 'wagmi';
import logo from '../../../../../public/logo.svg';
import WalletConnect from '../../../wallet/WalletConnect';
import DepositModal from '../components/DepositModal';
import {LeaderboardModal} from '../components/LeaderboardModal';
import RoomList from '../components/RoomList';
import SoundSettings from '../components/SoundSettings';
import TutorialModal from '../components/TutorialModal';
import WithdrawModal from '../components/WithdrawModal';
import type {Room} from '../types';

interface GameLobbyProps {
  availableRooms: Room[];
  loading: boolean;
  balance: string;
  contractBalance: string;
  userAddress: string;
  createRoom: (
    betAmount: number,
    password?: string,
    gameMode?: 'free' | 'paid' | 'single_player',
    isSinglePlayer?: boolean
  ) => void;
  joinRoom: (roomId: string, password?: string) => void;
  quickJoin: (betAmount: number, isSinglePlayer?: boolean) => void;
  soundsEnabled: boolean;
  volume: number;
  onToggleSounds: () => void;
  onVolumeChange: (volume: number) => void;
  walletConnected: boolean;
}

const GameLobby: React.FC<GameLobbyProps> = ({
  availableRooms,
  loading,
  balance,
  contractBalance,
  userAddress,
  createRoom,
  joinRoom,
  quickJoin,
  soundsEnabled,
  volume,
  onToggleSounds,
  onVolumeChange,
  walletConnected,
}) => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [quickJoinModalVisible, setQuickJoinModalVisible] = useState(false);
  const [leaderboardVisible, setLeaderboardVisible] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [betAmount, setBetAmount] = useState(0.001);
  const [password, setPassword] = useState('');
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const [roomPasswordToJoin, setRoomPasswordToJoin] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [quickBetAmount, setQuickBetAmount] = useState(0.001);
  const [gameMode, setGameMode] = useState<'multiplayer' | 'single_player'>('multiplayer');
  const [quickGameMode, setQuickGameMode] = useState<'multiplayer' | 'single_player'>(
    'multiplayer'
  );
  const [balanceDropdownOpen, setBalanceDropdownOpen] = useState(false);
  const [walletBalance, setWalletBalance] = useState(balance);
  const [localContractBalance, setLocalContractBalance] = useState(contractBalance);
  const [isRefreshingContractBalance, setIsRefreshingContractBalance] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {disconnect} = useDisconnect();

  // Update local balances when props change
  useEffect(() => {
    setWalletBalance(balance);
  }, [balance]);

  useEffect(() => {
    setLocalContractBalance(contractBalance);
  }, [contractBalance]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setBalanceDropdownOpen(false);
      }
    };

    if (balanceDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [balanceDropdownOpen]);

  const refreshContractBalance = async () => {
    if (!userAddress) return;

    setIsRefreshingContractBalance(true);
    try {
      const response = await fetch(`${VITE_API_URL}/api/contract/balance/${userAddress}`);
      if (response.ok) {
        const data = await response.json();
        setLocalContractBalance(data.balance || '0');
        message.success('Contract balance refreshed!');
      } else {
        message.error('Failed to refresh contract balance');
      }
    } catch (error) {
      console.error('Error refreshing contract balance:', error);
      message.error('Error refreshing contract balance');
    } finally {
      setIsRefreshingContractBalance(false);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setBalanceDropdownOpen(false);
    message.success('Wallet disconnected');
  };

  const handleCreateRoom = () => {
    // Allow 0 for free/single player games
    if (betAmount > 0 && betAmount < 0.001) {
      message.error('Minimum bet amount is 0.001 MON (or 0 for free games)');
      return;
    }

    const isSinglePlayer = gameMode === 'single_player';
    const mode = isSinglePlayer ? 'single_player' : betAmount === 0 ? 'free' : 'paid';

    createRoom(betAmount, password || undefined, mode, isSinglePlayer);
    setCreateModalVisible(false);

    // Reset to defaults
    setGameMode('multiplayer');
    setBetAmount(0.001);
    setPassword('');
  };

  const handleJoinRoom = (roomId: string, hasPassword: boolean) => {
    if (hasPassword) {
      // Open password modal
      setSelectedRoomId(roomId);
      setPasswordModalVisible(true);
    } else {
      // Join directly
      joinRoom(roomId);
    }
  };

  const handlePasswordSubmit = () => {
    if (!roomPasswordToJoin) {
      message.error('Please enter the room password');
      return;
    }
    joinRoom(selectedRoomId, roomPasswordToJoin);
    setPasswordModalVisible(false);
    setRoomPasswordToJoin('');
  };

  const handleJoinByCode = () => {
    if (!roomIdToJoin) {
      message.error('Please enter a room ID');
      return;
    }
    // Join with password if provided
    joinRoom(roomIdToJoin, password || undefined);
    setJoinModalVisible(false);
  };

  const handleQuickJoin = () => {
    // Allow 0 for free/single player games
    if (quickBetAmount > 0 && quickBetAmount < 0.001) {
      message.error('Minimum bet amount is 0.001 MON (or 0 for free games)');
      return;
    }

    const isSinglePlayer = quickGameMode === 'single_player';
    quickJoin(quickBetAmount, isSinglePlayer);
    setQuickJoinModalVisible(false);

    // Reset to defaults
    setQuickGameMode('multiplayer');
    setQuickBetAmount(0.001);
  };

  const contractAddress = VITE_CONTRACT_ADDRESS || '0x3A895aeA91388f6b44227CDb565FDb04a8A81C79';

  return (
    <Container>
      <Header>
        <HeaderContent>
          {/* Home Button */}
          <HomeButton
            onClick={() => {
              window.location.href = '/';
            }}
            title='Return to Homepage'
          >
            <img src={logo} alt='Home' width={50} height={50} />
          </HomeButton>

          <HeaderText>
            <Title>IVORA</Title>
          </HeaderText>
          {walletConnected ? (
            <>
              <WalletActions>
                <BalanceDisplayContainer ref={dropdownRef}>
                  <BalanceDisplay onClick={() => setBalanceDropdownOpen(!balanceDropdownOpen)}>
                    <BalanceLabel>Balance:</BalanceLabel>
                    <BalanceValue>{parseFloat(localContractBalance).toFixed(4)} MON</BalanceValue>
                    <DropdownArrow $isOpen={balanceDropdownOpen}>▼</DropdownArrow>
                  </BalanceDisplay>
                  {balanceDropdownOpen && (
                    <BalanceDropdown>
                      <DropdownItem>
                        <DropdownLabel>Wallet Balance:</DropdownLabel>
                        <DropdownValue>{parseFloat(walletBalance).toFixed(4)} MON</DropdownValue>
                      </DropdownItem>
                      <DropdownItem>
                        <DropdownLabel>Contract Balance:</DropdownLabel>
                        <DropdownValue>
                          {parseFloat(localContractBalance).toFixed(4)} MON
                        </DropdownValue>
                        <RefreshButton
                          onClick={refreshContractBalance}
                          disabled={isRefreshingContractBalance}
                        >
                          {isRefreshingContractBalance ? '⟳' : '↻'}
                        </RefreshButton>
                      </DropdownItem>

                      <Flex vertical gap={10}>
                        <DepositButton onClick={() => setDepositModalVisible(true)}>
                          Deposit
                        </DepositButton>

                        <WithdrawButton onClick={() => setWithdrawModalVisible(true)}>
                          Withdraw
                        </WithdrawButton>
                      </Flex>

                      <DropdownDivider />
                      <DisconnectButton onClick={handleDisconnect}>Disconnect</DisconnectButton>
                    </BalanceDropdown>
                  )}
                </BalanceDisplayContainer>
              </WalletActions>
            </>
          ) : (
            <WalletConnect />
          )}
        </HeaderContent>
      </Header>

      <Content>
        {/* Left Side - Actions */}
        <ActionsPanel>
          <ActionCard onClick={() => setCreateModalVisible(true)}>
            <ActionIcon>🏗️</ActionIcon>
            <ActionTitle>Create Room</ActionTitle>
            <ActionDescription>Set your bet amount and create a new game room</ActionDescription>
          </ActionCard>

          <ActionCard onClick={() => setJoinModalVisible(true)}>
            <ActionIcon>🔍</ActionIcon>
            <ActionTitle>Find Room</ActionTitle>
            <ActionDescription>Join a room using the room code</ActionDescription>
          </ActionCard>

          <ActionCard onClick={() => setQuickJoinModalVisible(true)}>
            <ActionIcon>⚡</ActionIcon>
            <ActionTitle>Quick Join</ActionTitle>
            <ActionDescription>Instantly join or create a room</ActionDescription>
          </ActionCard>

          <ActionCard onClick={() => setLeaderboardVisible(true)}>
            <ActionIcon>🏆</ActionIcon>
            <ActionTitle>Leaderboard</ActionTitle>
            <ActionDescription>View top players and rankings</ActionDescription>
          </ActionCard>

          <ActionCard onClick={() => setTutorialVisible(true)}>
            <ActionIcon>📚</ActionIcon>
            <ActionTitle>Tutorial</ActionTitle>
            <ActionDescription>Learn how to play the game</ActionDescription>
          </ActionCard>
        </ActionsPanel>

        {/* Right Side - Room List & Settings */}
        <RightPanel>
          <RoomListPanel>
            <RoomList rooms={availableRooms} onJoinRoom={handleJoinRoom} loading={loading} />
          </RoomListPanel>

          {/* Sound Settings */}
          <SoundSettings
            soundsEnabled={soundsEnabled}
            volume={volume}
            onToggleSounds={onToggleSounds}
            onVolumeChange={onVolumeChange}
          />
        </RightPanel>
      </Content>

      {/* Create Room Modal */}
      <Modal
        title='Create Room'
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setCreateModalVisible(false)}>
            Cancel
          </Button>,
          <Button key='create' type='primary' onClick={handleCreateRoom} loading={loading}>
            Create Room
          </Button>,
        ]}
      >
        <ModalContent>
          <Divider>Practice Mode</Divider>

          <FormGroup>
            <Label>Select Practice Type</Label>
            <GameModeButtons>
              <GameModeButton
                active={gameMode === 'single_player' ? 'true' : undefined}
                onClick={() => {
                  setGameMode('single_player');
                  setBetAmount(0); // Force free for single player
                }}
              >
                <GameModeIcon>🤖</GameModeIcon>
                <GameModeText>
                  <GameModeTitle>Single Player</GameModeTitle>
                  <GameModeSubtitle>Practice with AI (Free)</GameModeSubtitle>
                </GameModeText>
              </GameModeButton>
              <GameModeButton
                active={gameMode === 'multiplayer' ? 'true' : undefined}
                onClick={() => {
                  setGameMode('multiplayer');
                  if (betAmount !== 0) {
                    setBetAmount(0); // Default to free for practice multiplayer
                  }
                }}
              >
                <GameModeIcon>👥</GameModeIcon>
                <GameModeText>
                  <GameModeTitle>Multiplayer</GameModeTitle>
                  <GameModeSubtitle>Play with real players</GameModeSubtitle>
                </GameModeText>
              </GameModeButton>
            </GameModeButtons>
            {gameMode === 'single_player' && (
              <GameModeHint>💡 Single player mode is always free</GameModeHint>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Bet Amount</Label>
            <InputNumber
              min={0}
              step={0.001}
              value={walletConnected ? betAmount : 0}
              onChange={(val) => setBetAmount(val || 0)}
              addonAfter={betAmount === 0 ? 'FREE' : 'MON'}
              style={{width: '100%'}}
              disabled={gameMode === 'single_player' || !walletConnected}
            />
            <PresetButtons style={{marginTop: '8px'}}>
              <PresetButton
                active={betAmount === 0 ? 'true' : undefined}
                onClick={() => setBetAmount(0)}
                disabled={gameMode === 'single_player'}
              >
                Free
              </PresetButton>
              <PresetButton
                active={betAmount === 0.001 ? 'true' : undefined}
                onClick={() => setBetAmount(0.001)}
                disabled={gameMode === 'single_player' || !walletConnected}
              >
                0.001
              </PresetButton>
              <PresetButton
                active={betAmount === 0.01 ? 'true' : undefined}
                onClick={() => setBetAmount(0.01)}
                disabled={gameMode === 'single_player' || !walletConnected}
              >
                0.01
              </PresetButton>
              <PresetButton
                active={betAmount === 0.1 ? 'true' : undefined}
                onClick={() => setBetAmount(0.1)}
                disabled={gameMode === 'single_player' || !walletConnected}
              >
                0.1
              </PresetButton>
            </PresetButtons>
            {gameMode === 'multiplayer' && (
              <Hint>💡 Multiplayer practice games can be free or paid</Hint>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Password (Optional)</Label>
            <Input
              type='password'
              placeholder='Leave empty for public room'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={8}
              disabled={gameMode === 'single_player'}
            />
            {gameMode === 'single_player' ? (
              <Hint>🔒 Single player rooms don't need passwords</Hint>
            ) : (
              <Hint>Max 8 characters</Hint>
            )}
          </FormGroup>
        </ModalContent>
      </Modal>

      {/* Join Room Modal */}
      <Modal
        title='Join Room'
        open={joinModalVisible}
        onCancel={() => setJoinModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setJoinModalVisible(false)}>
            Cancel
          </Button>,
          <Button key='join' type='primary' onClick={handleJoinByCode} loading={loading}>
            Join Room
          </Button>,
        ]}
      >
        <ModalContent>
          <FormGroup>
            <Label>Room ID</Label>
            <Input
              placeholder='Enter 8-character room code'
              value={roomIdToJoin}
              onChange={(e) => setRoomIdToJoin(e.target.value.toUpperCase())}
              maxLength={8}
              style={{textTransform: 'uppercase'}}
            />
          </FormGroup>

          <FormGroup>
            <Label>Password (if required)</Label>
            <Input
              type='password'
              placeholder='Leave empty if no password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={8}
            />
          </FormGroup>
        </ModalContent>
      </Modal>

      {/* Deposit Modal */}
      <DepositModal
        visible={depositModalVisible}
        onClose={() => setDepositModalVisible(false)}
        contractAddress={contractAddress}
      />

      {/* Withdraw Modal */}
      <WithdrawModal
        visible={withdrawModalVisible}
        onClose={() => setWithdrawModalVisible(false)}
        contractAddress={contractAddress}
      />

      {/* Quick Join Modal */}
      <Modal
        title='Quick Join'
        open={quickJoinModalVisible}
        onCancel={() => setQuickJoinModalVisible(false)}
        footer={[
          <Button key='cancel' onClick={() => setQuickJoinModalVisible(false)}>
            Cancel
          </Button>,
          <Button key='join' type='primary' onClick={handleQuickJoin} loading={loading}>
            Quick Join
          </Button>,
        ]}
      >
        <ModalContent>
          <Divider>Practice Mode</Divider>

          <FormGroup>
            <Label>Select Practice Type</Label>
            <GameModeButtons>
              <GameModeButton
                active={quickGameMode === 'single_player' ? 'true' : undefined}
                onClick={() => {
                  setQuickGameMode('single_player');
                  setQuickBetAmount(0); // Force free for single player
                }}
              >
                <GameModeIcon>🤖</GameModeIcon>
                <GameModeText>
                  <GameModeTitle>Single Player</GameModeTitle>
                  <GameModeSubtitle>Play with AI instantly (Free)</GameModeSubtitle>
                </GameModeText>
              </GameModeButton>
              <GameModeButton
                active={quickGameMode === 'multiplayer' ? 'true' : undefined}
                onClick={() => {
                  setQuickGameMode('multiplayer');
                  if (quickBetAmount !== 0) {
                    setQuickBetAmount(0); // Default to free for practice multiplayer
                  }
                }}
              >
                <GameModeIcon>👥</GameModeIcon>
                <GameModeText>
                  <GameModeTitle>Multiplayer</GameModeTitle>
                  <GameModeSubtitle>Join or create room</GameModeSubtitle>
                </GameModeText>
              </GameModeButton>
            </GameModeButtons>
            {quickGameMode === 'single_player' && (
              <GameModeHint>💡 Single player mode is always free</GameModeHint>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Bet Amount</Label>
            <InputNumber
              min={0}
              step={0.001}
              value={walletConnected ? quickBetAmount : 0}
              onChange={(value) => {
                if (value !== null && value !== undefined) {
                  setQuickBetAmount(value);
                }
              }}
              addonAfter={quickBetAmount === 0 ? 'FREE' : 'MON'}
              style={{width: '100%'}}
              disabled={quickGameMode === 'single_player' || !walletConnected}
            />
            <PresetButtons style={{marginTop: '8px'}}>
              <PresetButton
                active={quickBetAmount === 0 ? 'true' : undefined}
                onClick={() => setQuickBetAmount(0)}
                disabled={quickGameMode === 'single_player'}
              >
                Free
              </PresetButton>
              <PresetButton
                active={quickBetAmount === 0.001 ? 'true' : undefined}
                onClick={() => setQuickBetAmount(0.001)}
                disabled={quickGameMode === 'single_player' || !walletConnected}
              >
                0.001
              </PresetButton>
              <PresetButton
                active={quickBetAmount === 0.01 ? 'true' : undefined}
                onClick={() => setQuickBetAmount(0.01)}
                disabled={quickGameMode === 'single_player' || !walletConnected}
              >
                0.01
              </PresetButton>
              <PresetButton
                active={quickBetAmount === 0.1 ? 'true' : undefined}
                onClick={() => setQuickBetAmount(0.1)}
                disabled={quickGameMode === 'single_player' || !walletConnected}
              >
                0.1
              </PresetButton>
            </PresetButtons>
            {quickGameMode === 'multiplayer' && (
              <Hint>💡 Multiplayer practice games can be free or paid</Hint>
            )}
          </FormGroup>
        </ModalContent>
      </Modal>

      {/* Password Modal */}
      <Modal
        title='Enter Room Password'
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          setRoomPasswordToJoin('');
        }}
        footer={[
          <Button key='cancel' onClick={() => setPasswordModalVisible(false)}>
            Cancel
          </Button>,
          <Button key='submit' type='primary' onClick={handlePasswordSubmit}>
            Join Room
          </Button>,
        ]}
      >
        <Input.Password
          placeholder='Enter password'
          value={roomPasswordToJoin}
          onChange={(e) => setRoomPasswordToJoin(e.target.value)}
          onPressEnter={handlePasswordSubmit}
          autoFocus
        />
      </Modal>

      {/* Leaderboard Modal */}
      <LeaderboardModal visible={leaderboardVisible} onClose={() => setLeaderboardVisible(false)} />

      {/* Tutorial Modal */}
      <TutorialModal visible={tutorialVisible} onClose={() => setTutorialVisible(false)} />
    </Container>
  );
};

export default GameLobby;

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;

  @media (min-height: 900px) {
    overflow-y: hidden;
  }
`;

const HomeButton = styled.button`
  top: 20px;
  left: 20px;
  cursor: pointer;
  z-index: 100;
  background: transparent;
  border: none;

  @media (max-width: 768px) {
    top: 10px;
    left: 10px;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeaderText = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 32px;
  color: white;
  margin: 0 0 4px 0;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 28px;
  }
`;

const WalletActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
  }
`;

const BalanceDisplayContainer = styled.div`
  position: relative;

  @media (max-width: 768px) {
    width: 90%;
  }
`;

const BalanceDisplay = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
  }
`;

const DropdownArrow = styled.span<{$isOpen: boolean}>`
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
  user-select: none;
`;

const BalanceDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(20px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  z-index: 1000;
  min-width: 300px;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    right: 0;
    left: auto;
    min-width: 280px;
  }
`;

const DropdownItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  border-radius: 8px;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(102, 126, 234, 0.05);
  }
`;

const DropdownLabel = styled.span`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.6);
  font-weight: 500;
  flex-shrink: 0;
`;

const DropdownValue = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
  flex: 1;
`;

const RefreshButton = styled.button<{disabled?: boolean}>`
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: 16px;
  color: #667eea;
  transition: all 0.2s ease;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    background: ${(props) => (props.disabled ? 'rgba(102, 126, 234, 0.1)' : 'rgba(102, 126, 234, 0.2)')};
    transform: ${(props) => (props.disabled ? 'none' : 'scale(1.1)')};
  }

  &:active {
    transform: ${(props) => (props.disabled ? 'none' : 'scale(0.95)')};
  }

  ${(props) =>
    props.disabled &&
    `
    animation: spin 1s linear infinite;
  `}

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
  margin: 8px 0;
`;

const DisconnectButton = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #ff4757 0%, #ff6b81 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);

  &:hover {
    background: linear-gradient(135deg, #ff3838 0%, #ff5252 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 71, 87, 0.5);
  }

  &:active {
    transform: translateY(0);
  }
`;

const BalanceLabel = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BalanceValue = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: #FFD700;
  text-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
`;

const DepositButton = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: none;
  border-radius: 8px;
  color: black;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);

  &:hover {
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
    background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const WithdrawButton = styled.button`
  width: 100%;
  padding: 10px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  border-radius: 8px;
  color: black;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(82, 196, 26, 0.4);

  &:hover {
    box-shadow: 0 6px 20px rgba(82, 196, 26, 0.6);
    background: linear-gradient(135deg, #73d13d 0%, #52c41a 100%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const ActionsPanel = styled.div`
  display: flex;
  flex-direction: row;
  gap: 14px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    
    /* Make tutorial button span full width on mobile for better layout */
    > :nth-child(5) {
      grid-column: 1 / -1;
    }
  }
`;

const ActionCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 20px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  

  @media (min-width: 768px) {
    width: 100%;;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.4);
  }

  &:active {
    transform: translateY(-2px);
  }
`;

const ActionIcon = styled.div`
  font-size: 40px;
  margin-bottom: 10px;
`;

const ActionTitle = styled.h3`
  font-size: 20px;
  color: white;
  margin-bottom: 8px;
  font-weight: bold;
`;

const ActionDescription = styled.p`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.4;
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
`;

const RoomListPanel = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  border: 2px solid rgba(255, 255, 255, 0.2);
`;

const ModalContent = styled.div`
  padding: 20px 0;
`;

const Divider = styled.div`
  width: 100%;
  padding: 10px 0;
  margin-bottom: 16px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  font-size: 16px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.75);
  text-align: left;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
`;

const Hint = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
`;

const PresetButtons = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const PresetButton = styled.button<{
  active?: string | undefined;
  $practice?: boolean;
  disabled?: boolean;
}>`
  padding: ${(props) => (props.$practice ? '12px 16px' : '8px')};
  border: 2px solid ${(props) => {
    if (props.disabled) return '#e0e0e0';
    if (props.$practice) return props.active ? '#4ECDC4' : '#4ECDC4';
    return props.active ? '#667eea' : '#e0e0e0';
  }};
  background: ${(props) => {
    if (props.disabled) return '#f5f5f5';
    if (props.$practice) {
      return props.active
        ? 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
        : 'linear-gradient(135deg, rgba(78, 205, 196, 0.1) 0%, rgba(68, 160, 141, 0.1) 100%)';
    }
    return props.active ? '#667eea' : 'white';
  }};
  color: ${(props) => {
    if (props.disabled) return '#bbb';
    if (props.$practice) return props.active ? 'white' : '#4ECDC4';
    return props.active ? 'white' : '#666';
  }};
  border-radius: 8px;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  font-size: ${(props) => (props.$practice ? '16px' : '16px')};
  font-weight: ${(props) => (props.$practice ? '600' : '500')};
  transition: all 0.2s;
  opacity: ${(props) => (props.disabled ? '0.6' : '1')};
  ${(props) => props.$practice && 'grid-column: 1 / -1;'}

  &:hover {
    border-color: ${(props) => (props.disabled ? '#e0e0e0' : props.$practice ? '#4ECDC4' : '#667eea')};
    background: ${(props) => {
      if (props.disabled) return '#f5f5f5';
      if (props.$practice) {
        return 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)';
      }
      return props.active ? '#5568d3' : '#f0f0f0';
    }};
    color: ${(props) => (props.disabled ? '#bbb' : props.$practice ? 'white' : props.active ? 'white' : '#666')};
    transform: ${(props) => (props.disabled ? 'none' : 'translateY(-2px)')};
    box-shadow: ${(props) => (props.disabled ? 'none' : props.$practice ? '0 4px 12px rgba(78, 205, 196, 0.3)' : 'none')};
  }
`;

const GameModeButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
`;

const GameModeButton = styled.button<{active?: string}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid ${(props) => (props.active ? '#667eea' : '#e0e0e0')};
  background: ${(props) => (props.active ? 'rgba(102, 126, 234, 0.1)' : 'white')};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: rgba(102, 126, 234, 0.05);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
  }
`;

const GameModeIcon = styled.div`
  font-size: 28px;
  flex-shrink: 0;
`;

const GameModeText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
`;

const GameModeTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
`;

const GameModeSubtitle = styled.div`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.55);
  margin-top: 2px;
`;

const GameModeHint = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  background: rgba(78, 205, 196, 0.1);
  border: 1px solid rgba(78, 205, 196, 0.3);
  border-radius: 8px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.65);
`;
