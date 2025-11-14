import type React from 'react';
import styled from 'styled-components';

interface WalletSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectStandard: () => void;
  onSelectAbstract: () => void;
}

const WalletSelectionModal: React.FC<WalletSelectionModalProps> = ({
  visible,
  onClose,
  onSelectStandard,
  onSelectAbstract,
}) => {
  if (!visible) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Connect Wallet</Title>
        </ModalHeader>

        <OptionsContainer>
          <OptionAbsCard onClick={onSelectAbstract}>
            <OptionTitle>Connect Abstract</OptionTitle>
          </OptionAbsCard>

          <OptionCard onClick={onSelectStandard}>
            <OptionTitle>
                Connect different Wallet
            </OptionTitle>
          </OptionCard>
        </OptionsContainer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default WalletSelectionModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 32px;
  max-width: 350px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  color: white;
  font-size: 24px;
  font-weight: 700;
  margin: 0;
`;

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OptionCard = styled.button`
  background: rgba(55, 55, 55, 1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const OptionAbsCard = styled.button`
font-family: 'Poppins', system-ui;
  font-weight: bold;
  background: rgba(0, 222, 115, 1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:hover {
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const OptionTitle = styled.h3`
  color: white;
  font-size: 20px;
  font-family: 'Poppins', system-ui;
  font-weight: bold;
  margin: 0;
`;

