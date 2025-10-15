import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import RoomList from '../components/RoomList';
import DepositModal from '../components/DepositModal';
import WithdrawModal from '../components/WithdrawModal';
import TutorialModal from '../components/TutorialModal';
import SoundSettings from '../components/SoundSettings';
import { Modal, Input, Button, InputNumber, message } from 'antd';

interface GameLobbyProps {
  availableRooms: any[];
  loading: boolean;
  balance: string;
  createRoom: (betAmount: number, password?: string) => void;
  joinRoom: (roomId: string, password?: string) => void;
  quickJoin: (betAmount: number) => void;
  soundsEnabled: boolean;
  volume: number;
  onToggleSounds: () => void;
  onVolumeChange: (volume: number) => void;
}

const GameLobby: React.FC<GameLobbyProps> = ({ 
  availableRooms,
  loading,
  balance,
  createRoom,
  joinRoom,
  quickJoin,
  soundsEnabled,
  volume,
  onToggleSounds,
  onVolumeChange
}) => {

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [depositModalVisible, setDepositModalVisible] = useState(false);
  const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(false);
  const [quickJoinModalVisible, setQuickJoinModalVisible] = useState(false);
  const [betAmount, setBetAmount] = useState(0.001);
  const [password, setPassword] = useState('');
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const [roomPasswordToJoin, setRoomPasswordToJoin] = useState('');
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [quickBetAmount, setQuickBetAmount] = useState(0.001);

  // Check if tutorial should be shown on first visit
  useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setTutorialVisible(true);
    }
  }, []);

  const handleCreateRoom = () => {
    if (betAmount < 0.001) {
      message.error('Minimum bet amount is 0.001 ETH');
      return;
    }

    createRoom(betAmount, password || undefined);
    setCreateModalVisible(false);
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
    if (quickBetAmount < 0.001) {
      message.error('Minimum bet amount is 0.001 ETH');
      return;
    }
    quickJoin(quickBetAmount);
    setQuickJoinModalVisible(false);
  };

  const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS || '';

  return (
    <Container>
      <Header>
        <HeaderContent>
          <HeaderText>
            <Title>🎴 Ice Water Fire</Title>
          </HeaderText>
          <WalletActions>
            <BalanceDisplay>
              <BalanceLabel>Balance:</BalanceLabel>
              <BalanceValue>{parseFloat(balance).toFixed(4)} ETH</BalanceValue>
            </BalanceDisplay>
            <DepositButton onClick={() => setDepositModalVisible(true)}>
              💰 Deposit
            </DepositButton>
            <WithdrawButton onClick={() => setWithdrawModalVisible(true)}>
              💸 Withdraw
            </WithdrawButton>
          </WalletActions>
        </HeaderContent>
      </Header>

      <Content>
        {/* Left Side - Actions */}
        <ActionsPanel>
          <ActionCard onClick={() => setCreateModalVisible(true)}>
            <ActionIcon>🏗️</ActionIcon>
            <ActionTitle>Create Room</ActionTitle>
            <ActionDescription>
              Set your bet amount and create a new game room
            </ActionDescription>
          </ActionCard>

          <ActionCard onClick={() => setJoinModalVisible(true)}>
            <ActionIcon>🔍</ActionIcon>
            <ActionTitle>Find Room</ActionTitle>
            <ActionDescription>
              Join a room using the room code
            </ActionDescription>
          </ActionCard>

          <ActionCard onClick={() => setQuickJoinModalVisible(true)}>
            <ActionIcon>⚡</ActionIcon>
            <ActionTitle>Quick Join</ActionTitle>
            <ActionDescription>
              Instantly join or create a room
            </ActionDescription>
          </ActionCard>
        </ActionsPanel>

        {/* Right Side - Room List & Settings */}
        <RightPanel>
          <RoomListPanel>
            <RoomList
              rooms={availableRooms}
              onJoinRoom={handleJoinRoom}
              loading={loading}
            />
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
        title="Create Room"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setCreateModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="create" type="primary" onClick={handleCreateRoom} loading={loading}>
            Create Room
          </Button>,
        ]}
      >
        <ModalContent>
          <FormGroup>
            <Label>Bet Amount (ETH)</Label>
            <InputNumber
              min={0.001}
              max={10}
              step={0.001}
              value={betAmount}
              onChange={(val) => setBetAmount(val || 0.01)}
              addonAfter="ETH"
              style={{ width: '100%' }}
            />
            <PresetButtons>
              <PresetButton active={betAmount === 0.001 ? `true` : undefined} onClick={() => setBetAmount(0.001)}>0.001</PresetButton>
              <PresetButton active={betAmount === 0.01 ? `true` : undefined} onClick={() => setBetAmount(0.01)}>0.01</PresetButton>
              <PresetButton active={betAmount === 0.1 ? `true` : undefined} onClick={() => setBetAmount(0.1)}>0.1</PresetButton>
              <PresetButton active={betAmount === 1 ? `true` : undefined} onClick={() => setBetAmount(1)}>1</PresetButton>
            </PresetButtons>
          </FormGroup>

          <FormGroup>
            <Label>Password (Optional)</Label>
            <Input
              type="password"
              placeholder="Leave empty for public room"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              maxLength={8}
            />
            <Hint>Max 8 characters</Hint>
          </FormGroup>
        </ModalContent>
      </Modal>

      {/* Join Room Modal */}
      <Modal
        title="Join Room"
        open={joinModalVisible}
        onCancel={() => setJoinModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setJoinModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="join" type="primary" onClick={handleJoinByCode} loading={loading}>
            Join Room
          </Button>,
        ]}
      >
        <ModalContent>
          <FormGroup>
            <Label>Room ID</Label>
            <Input
              placeholder="Enter 8-character room code"
              value={roomIdToJoin}
              onChange={(e) => setRoomIdToJoin(e.target.value.toUpperCase())}
              maxLength={8}
              style={{ textTransform: 'uppercase' }}
            />
          </FormGroup>

          <FormGroup>
            <Label>Password (if required)</Label>
            <Input
              type="password"
              placeholder="Leave empty if no password"
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
        title="Quick Join"
        open={quickJoinModalVisible}
        onCancel={() => setQuickJoinModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setQuickJoinModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="join" type="primary" onClick={handleQuickJoin} loading={loading}>
            Quick Join
          </Button>,
        ]}
      >
        <ModalContent>
          <FormGroup>
            <Label>Bet Amount (ETH)</Label>
            <InputNumber
              min={0.001}
              max={10}
              step={0.001}
              value={quickBetAmount}
              onChange={(value) => {
                if (value) {
                  setQuickBetAmount(value);
                }
              }}
              addonAfter="ETH"
              style={{ width: '100%' }}
            />
            <PresetButtons>
              <PresetButton active={quickBetAmount === 0.001 ? `true` : undefined} onClick={() => setQuickBetAmount(0.001)}>0.001</PresetButton>
              <PresetButton active={quickBetAmount === 0.01 ? `true` : undefined} onClick={() => setQuickBetAmount(0.01)}>0.01</PresetButton>
              <PresetButton active={quickBetAmount === 0.1 ? `true` : undefined} onClick={() => setQuickBetAmount(0.1)}>0.1</PresetButton>
              <PresetButton active={quickBetAmount === 1 ? `true` : undefined} onClick={() => setQuickBetAmount(1)}>1</PresetButton>
            </PresetButtons>
          </FormGroup>
        </ModalContent>
      </Modal>

      {/* Password Modal */}
      <Modal
        title="Enter Room Password"
        open={passwordModalVisible}
        onCancel={() => {
          setPasswordModalVisible(false);
          setRoomPasswordToJoin('');
        }}
        footer={[
          <Button key="cancel" onClick={() => setPasswordModalVisible(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handlePasswordSubmit}>
            Join Room
          </Button>,
        ]}
      >
        <Input.Password
          placeholder="Enter password"
          value={roomPasswordToJoin}
          onChange={(e) => setRoomPasswordToJoin(e.target.value)}
          onPressEnter={handlePasswordSubmit}
          autoFocus
        />
      </Modal>

      {/* Tutorial Modal */}
      <TutorialModal visible={tutorialVisible} onClose={() => setTutorialVisible(false)} />
    </Container>
  );
};

export default GameLobby;

const Container = styled.div`
  min-height: 100vh;
  max-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  @media (min-height: 900px) {
    overflow-y: hidden;
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
    flex-direction: column;
  }
`;

const BalanceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    width: 100%;
    align-items: center;
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
  padding: 10px 20px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 215, 0, 0.6);
    background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    font-size: 14px;
  }
`;

const WithdrawButton = styled.button`
  padding: 10px 20px;
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(82, 196, 26, 0.4);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(82, 196, 26, 0.6);
    background: linear-gradient(135deg, #73d13d 0%, #52c41a 100%);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    font-size: 14px;
  }
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  max-height: calc(100vh - 140px);

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 16px;
    max-height: none;
  }
`;

const ActionsPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;

  @media (max-width: 1024px) {
    flex-direction: row;
    justify-content: space-between;
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

const PresetButton = styled.button<{ active?: string | undefined }>`
  padding: 8px;
  border: 2px solid ${(props) => (props.active ? '#667eea' : '#e0e0e0')};
  background: ${(props) => (props.active ? '#667eea' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#666')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: ${(props) => (props.active ? '#5568d3' : '#f0f0f0')};
  }
`;

