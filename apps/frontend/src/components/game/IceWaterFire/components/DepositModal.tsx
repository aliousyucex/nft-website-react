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
  const [depositAmount, setDepositAmount] = useState(1);
  const [contractBalance, setContractBalance] = useState<string>('0');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get wallet balance with refetch function
  const {data: walletBalance, refetch: refetchWalletBalance} = useBalance({
    address: address,
  });

  // Write contract (deposit)
  const {writeContract, data: hash, isPending, error: writeError} = useWriteContract();

  // Handle write contract errors
  useEffect(() => {
    if (writeError) {
      console.error('Write contract error:', writeError);
      const errorMessage = writeError.message || 'Transaction failed';
      
      if (errorMessage.includes('Internal JSON-RPC error') || errorMessage.includes('-32603')) {
        message.error({
          content: (
            <div>
              <div style={{marginBottom: '8px', fontWeight: 'bold'}}>RPC Error Detected</div>
              <div style={{fontSize: '12px'}}>
                Please ensure:
                <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
                  <li>Monad Testnet is added to MetaMask (Chain ID: 10143)</li>
                  <li>You have enough MON for gas fees (keep at least 0.01 MON)</li>
                  <li>RPC URL is correct: https://testnet-rpc.monad.xyz</li>
                </ul>
              </div>
            </div>
          ),
          duration: 8,
        });
      } else {
        message.error(errorMessage);
      }
    }
  }, [writeError]);

  // Wait for transaction
  const {isLoading: isConfirming, isSuccess} = useWaitForTransactionReceipt({
    hash,
  });

  // Handle successful deposit
  useEffect(() => {
    if (isSuccess) {
      message.success('Deposit successful!');
      refreshContractBalance();
      // Refetch wallet balance after a short delay to ensure blockchain state is updated
      setTimeout(() => {
        refetchWalletBalance();
      }, 1000);
    }
  }, [isSuccess, refetchWalletBalance]);

  // Fetch contract balance
  const refreshContractBalance = async () => {
    if (!address) return;

    setIsRefreshing(true);
    try {
      const response = await fetch(
        `${VITE_API_URL}/api/contract/balance/${address}`
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
    
    // Monad: Gas fee MON ile ödenir, gas fee için minimum buffer bırakmalıyız
    const GAS_FEE_BUFFER = 0.01; // Minimum MON to keep for gas fees
    const maxDepositAmount = maxBalance - GAS_FEE_BUFFER;
    
    if (depositAmount > maxDepositAmount) {
      message.error(
        `Insufficient balance. You need to keep at least ${GAS_FEE_BUFFER} MON for gas fees. Maximum deposit: ${maxDepositAmount.toFixed(4)} MON`
      );
      return;
    }

    if (depositAmount > maxBalance) {
      message.error('Insufficient wallet balance');
      return;
    }

    try {
      // Validate contract address
      if (!contractAddress || contractAddress === '0x' || contractAddress.length !== 42) {
        message.error('Invalid contract address. Please check configuration.');
        return;
      }

      writeContract({
        address: contractAddress as `0x${string}`,
        abi: CONTRACT_ABI,
        functionName: 'deposit',
        value: parseEther(depositAmount.toString()),
      });
    } catch (error: unknown) {
      console.error('Deposit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Deposit failed';
      
      // Provide more helpful error messages
      if (errorMessage.includes('Internal JSON-RPC error') || errorMessage.includes('-32603')) {
        message.error({
          content: (
            <div>
              <div style={{marginBottom: '8px', fontWeight: 'bold'}}>RPC Error Detected</div>
              <div style={{fontSize: '12px'}}>
                Please ensure:
                <ul style={{marginTop: '4px', paddingLeft: '20px'}}>
                  <li>Monad Testnet is added to MetaMask (Chain ID: 10143)</li>
                  <li>You have enough MON for gas fees (keep at least 0.01 MON)</li>
                  <li>RPC URL is correct: https://testnet-rpc.monad.xyz</li>
                </ul>
              </div>
            </div>
          ),
          duration: 8,
        });
      } else if (errorMessage.includes('user rejected') || errorMessage.includes('User denied')) {
        message.warning('Transaction cancelled by user');
      } else {
        message.error(errorMessage);
      }
    }
  };

  const presetAmounts = [1, 5, 20, 50];

  return (
    <Modal open={visible} onCancel={onClose} footer={null} width={500} title={null} centered>
      <Container>
        <Header>
          <Title>Deposit MON</Title>
          <Subtitle>Deposit MON to your game balance</Subtitle>
        </Header>

        <BalanceSection>
          <BalanceCard>
            <BalanceLabel>Wallet Balance</BalanceLabel>
            <BalanceValue>
              {walletBalance ? parseFloat(formatEther(walletBalance.value)).toFixed(5) : '0'} MON
            </BalanceValue>
          </BalanceCard>

          <BalanceCard $highlight>
            <BalanceLabel>
              Contract Balance
              <RefreshButton onClick={refreshContractBalance} disabled={isRefreshing}>
                {isRefreshing ? '⟳' : '🔄'}
              </RefreshButton>
            </BalanceLabel>
            <BalanceValue>{contractBalance} MON</BalanceValue>
          </BalanceCard>
        </BalanceSection>

        <InputSection>
          <Label>Deposit Amount (MON)</Label>
          <InputNumber
            min={0}
            value={depositAmount}
            onChange={(val) => {setDepositAmount(val || 1); console.log(val)}}
            style={{width: '100%', marginBottom: '12px'}}
          />

          <PresetButtons>
            {presetAmounts.map((amount) => (
              <PresetButton
                key={amount}
                onClick={() => setDepositAmount(amount)}
                $active={depositAmount === amount}
              >
                {amount} MON
              </PresetButton>
            ))}
          </PresetButtons>
        </InputSection>

        <InfoBox>
          <InfoIcon>ℹ️</InfoIcon>
          <InfoText>
            <div>
              <div style={{marginBottom: '4px'}}>
                You need to deposit MON to your contract balance before playing. This balance is used
                for placing bets and will be refunded when you withdraw.
              </div>
              <div style={{marginTop: '8px', fontSize: '12px', opacity: 0.9}}>
                <strong>Important:</strong> Keep at least 0.01 MON in your wallet for gas fees. 
                If you see RPC errors, ensure Monad Testnet (Chain ID: 10143) is added to MetaMask.
              </div>
            </div>
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
              `Deposit ${depositAmount} MON`
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

const BalanceCard = styled.div<{$highlight?: boolean}>`
  background: ${(props) =>
    props.$highlight ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f5f5f5'};
  padding: 16px;
  border-radius: 12px;
  color: ${(props) => (props.$highlight ? 'white' : '#1a1a1a')};
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

const PresetButton = styled.button<{$active?: boolean}>`
  padding: 8px;
  border: 2px solid ${(props) => (props.$active ? '#667eea' : '#e0e0e0')};
  background: ${(props) => (props.$active ? '#667eea' : 'white')};
  color: ${(props) => (props.$active ? 'white' : '#666')};
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    border-color: #667eea;
    background: ${(props) => (props.$active ? '#5568d3' : '#f0f0f0')};
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
