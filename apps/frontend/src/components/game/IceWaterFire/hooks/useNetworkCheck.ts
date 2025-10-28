import {useAccount, useChainId, useSwitchChain} from 'wagmi';
import {abstractTestnet} from '../../../../config/wagmi';

export const useNetworkCheck = () => {
  const {isConnected} = useAccount();
  const chainId = useChainId();
  const {switchChain} = useSwitchChain();

  const isCorrectNetwork = chainId === abstractTestnet.id;
  const currentChainId = chainId;

  const switchToCorrectNetwork = () => {
    if (switchChain) {
      switchChain({chainId: abstractTestnet.id});
    }
  };

  return {
    isConnected,
    isCorrectNetwork,
    currentChainId,
    switchToCorrectNetwork,
    requiredChainId: abstractTestnet.id,
    requiredNetworkName: abstractTestnet.name,
  };
};

