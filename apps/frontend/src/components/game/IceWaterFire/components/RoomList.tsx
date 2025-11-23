import type React from 'react';
import styled from 'styled-components';
import type {Room} from '../types';

interface RoomListProps {
  rooms: Room[];
  onJoinRoom: (roomId: string, hasPassword: boolean) => void;
  loading?: boolean;
}

const RoomList: React.FC<RoomListProps> = ({rooms, onJoinRoom, loading = false}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  if (loading) {
    return (
      <Container>
        <Title>Available Rooms</Title>
        <LoadingText>Loading rooms...</LoadingText>
      </Container>
    );
  }

  if (rooms.length === 0) {
    return (
      <Container>
        <Title>Available Rooms</Title>
        <EmptyState>
          <EmptyIcon>🎴</EmptyIcon>
          <EmptyText>No rooms available</EmptyText>
          <EmptySubtext>Create a room or use Quick Join</EmptySubtext>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Title>
        Available Rooms <RoomCount>({rooms.length})</RoomCount>
      </Title>
      <RoomGrid>
        {rooms.map((room) => (
          <RoomCard key={room.roomId} onClick={() => onJoinRoom(room.roomId, room.hasPassword)}>
            <RoomHeader>
              <RoomId>{room.roomId}</RoomId>
              {room.hasPassword && <LockIcon>🔒</LockIcon>}
            </RoomHeader>

            <RoomInfo>
              <InfoRow>
                <Label>Bet Amount:</Label>
                <Value>
                  {room.displayLabel ||
                    (room.betAmount === 0 ? 'Practice Game' : `${room.betAmount} MON`)}
                </Value>
              </InfoRow>
              <InfoRow>
                <Label>Players:</Label>
                <Value>{room.playerCount}/2</Value>
              </InfoRow>
              <InfoRow>
                <Label>Created:</Label>
                <TimeValue>{formatTime(room.createdAt)}</TimeValue>
              </InfoRow>
            </RoomInfo>

            <JoinButton>
              Join Room
              <ArrowIcon>→</ArrowIcon>
            </JoinButton>
          </RoomCard>
        ))}
      </RoomGrid>
    </Container>
  );
};

export default RoomList;

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const RoomCount = styled.span`
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.5;
`;

const EmptyText = styled.div`
  font-size: 20px;
  color: white;
  font-weight: 600;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
`;

const RoomGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  max-height: 600px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 4px;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }
`;

const RoomCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const RoomHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const RoomId = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: white;
  font-family: 'Poppins', monospace;
`;

const LockIcon = styled.span`
  font-size: 20px;
`;

const RoomInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
`;

const Value = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: 'white';
`;

const TimeValue = styled(Value)`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
`;

const JoinButton = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #3498DB 0%, #2980B9 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 4px 16px rgba(52, 152, 219, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ArrowIcon = styled.span`
  font-size: 20px;
  transition: transform 0.3s ease;

  ${JoinButton}:hover & {
    transform: translateX(4px);
  }
`;
