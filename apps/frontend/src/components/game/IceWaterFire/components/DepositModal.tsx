import {Button, InputNumber, Modal, Spin, message} from 'antd';
import type React from 'react';
import {useEffect, useState} from 'react';
import styled from 'styled-components';
import {formatEther, parseEther} from 'viem';
import {useAccount, useBalance, useWaitForTransactionReceipt, useWriteContract} from 'wagmi';

interface DepositModalProps {
  visible: boolean;
  onClose: () => void;
  contractAddress: string;
}

const CONTRACT_ABI = [
  {
    inputs: [],
    name: 'deposit',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [{internalType: 'address', name: 'user', type: 'address'}],
    name: 'getWithdrawableUserBalance',
    outputs: [{internalType: 'uint256', name: '', type: 'uint256'}],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const DepositModal: React.FC<DepositModalProps> = ({visible, onClose, contractAddress}) => {
  const {address} = useAccount();
  const [depositAmount, setDepositAmount] = useState(0.01);
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get wallet balance
  const {data: walletBalance} = useBalance({
    address: address,
  });

  // Write contract (deposit)
  const {writeContract, data: hash, isPending} = useWriteContract();

  // Wait for transaction
  const {isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful deposit
  useEffect(() => {
    if (isSuccess) {
      message.success('Deposit successful!');
      refreshContractBalance();
    }
  }, [isSuccess]);

  // Fetch contract balance
  const refreshContractBalance = async () => {
    if (!address) return;

    setIsRefreshing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contract/balance/${address}`
      );
      const data = await response.json();
      setContractBalance(data.balance || '0');
    } catch (error) {
      console.error('Error fetching contract balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (visible && address) {
      refreshContractBalance();
    }
  }, [visible, address]);

  const handleDeposit = async () => {
    if (!address) {
      message.error('Please connect your wallet');
      return;
    }

    if (depositAmount <= 0) {
      message.error('Amount must be greater than 0');
      return;
    }

    const maxBalance = walletBalance ? parseFloat(formatEther(walletBalance.value)) : 0;
    if (depositAmount > maxBalance) {
      message.error('Insufficient wallet balance');
      return;
    }

    try {
      writeContract({
        address: contractAddress as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'deposit',
        value: parseEther(depositAmount.toString()),
      });
    } catch (error: unknown) {
      console.error('Deposit error:', error);
      message.error((error as Error).message || 'Deposit failed');
    }
  };

  const presetAmounts = [0.001, 0.01, 0.1, 0.5];

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={500} title={null} centered>
      <Container>
        <Header>
          <Icon>💰</Icon>
          <Title>Deposit ETH</Title>
          <Subtitle>Deposit ETH to your game balance</Subtitle>
        </Header>

        <BalanceSection>
          <BalanceCard>
            <BalanceLabel>Wallet Balance</BalanceLabel>
            <BalanceValue>
              {walletBalance ? formatEther(walletBalance.value) : '0'} ETH
            </BalanceValue>
          </BalanceCard>

          <BalanceCard highlight>
            <BalanceLabel>
              Contract Balance
              <RefreshButton onClick={refreshContractBalance} disabled={isRefreshing}>
                {isRefreshing ? '⟳' : '🔄'}
              </RefreshButton>
            </BalanceLabel>
            <BalanceValue>{contractBalance} ETH</BalanceValue>
          </BalanceCard>
        </BalanceSection>

        <InputSection>
          <Label>Deposit Amount (ETH)</Label>
          <InputNumber
            min={0.001}
            max={walletBalance ? parseFloat(formatEther(walletBalance.value)) : 10}
            step={0.001}
            value={depositAmount}
            onChange={(val) => setDepositAmount(val || 0.001)}
            style={{width: '100%', marginBottom: '12px'}}
          />

          <PresetButtons>
            {presetAmounts.map((amount) => (
              <PresetButton
                key={amount}
                onClick={() => setDepositAmount(amount)}
                active={depositAmount === amount}
              >
                {amount} ETH
              </PresetButton>
            ))}
          </PresetButtons>
        </InputSection>

        <InfoBox>
          <InfoIcon>ℹ️</InfoIcon>
          <InfoText>
            You need to deposit ETH to your contract balance before playing. This balance is used
            for placing bets and will be refunded when you withdraw.
          </InfoText>
        </InfoBox>

        <ActionButtons>
          <CancelButton onClick={onClose} disabled={isPending || isConfirming}>
            Cancel
          </CancelButton>
          <DepositButton
            onClick={handleDeposit}
            disabled={isPending || isConfirming || depositAmount <= 0}
          >
            {isPending || isConfirming ? (
              <>
                <Spin size='small' style={{marginRight: '8px'}} />
                {isPending ? 'Confirming...' : 'Processing...'}
              </>
            ) : (
              `Deposit ${depositAmount} ETH`
            )}
          </DepositButton>
        </ActionButtons>
      </Container>
    </Modal>
  );
};

export default DepositModal;

const Container = styled.div`
  padding: 8px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const Icon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin: 0 0 8px 0;
  color: #1a1a1a;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0;
`;

const BalanceSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
`;

const BalanceCard = styled.div<{highlight?: boolean}>`
  background: ${(props) =>
    props.highlight ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5'};
  padding: 16px;
  border-radius: 12px;
  color: ${(props) => (props.highlight ? 'white' : '#1a1a1a')};
`;

const BalanceLabel = styled.div`
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const RefreshButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  opacity: 0.8;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    opacity: 1;
    transform: rotate(180deg);
  }

  &:disabled {
    cursor: not-allowed;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const BalanceValue = styled.div`
  font-size: 20px;
  font-weight: bold;
`;

const InputSection = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #1a1a1a;
`;

const PresetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const PresetButton = styled.button<{active?: boolean}>`
  padding: 8px;
  border: 2px solid ${(props) => (props.active ? '#667eea' : '#e0e0e0')};
  background: ${(props) => (props.active ? '#667eea' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#666')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: ${(props) => (props.active ? '#5568d3' : '#f0f0f0')};
  }
`;

const InfoBox = styled.div`
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
  padding: 12px;
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const InfoIcon = styled.div`
  font-size: 20px;
  flex-shrink: 0;
`;

const InfoText = styled.div`
  font-size: 13px;
  color: #0050b3;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 12px;
`;

const CancelButton = styled(Button)`
  height: 44px;
  border-radius: 8px;
  font-weight: 500;
`;

const DepositButton = styled(Button)`
  height: 44px;
  border-radius: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, #5568d3 0%, #653a8a 100%);
  }

  &:disabled {
    background: #d9d9d9;
    cursor: not-allowed;
  }
`;
