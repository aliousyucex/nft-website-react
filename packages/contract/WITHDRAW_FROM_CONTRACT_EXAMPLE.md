# withdrawFromContract Doğru Kullanım Örneği

## Sorun
`withdrawFromContract` fonksiyonunu çağırırken $31,335,553.63 gibi çok yüksek bir fee görünüyor. Bu, amount parametresinin yanlış birimde gönderilmesinden kaynaklanıyor olabilir.

## Çözüm

### ✅ Doğru Kullanım (Frontend - React/Wagmi)

```typescript
import { parseEther, formatEther } from 'viem';
import { useWriteContract, useReadContract } from 'wagmi';

// Contract ABI
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: 'address payable', name: 'to', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'withdrawFromContract',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getWithdrawableContractBalance',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

function WithdrawFromContractComponent() {
  const { address } = useAccount();
  const [amount, setAmount] = useState(0.1); // ETH cinsinden
  const { writeContract } = useWriteContract();
  
  // Contract balance'ı oku (Wei cinsinden döner)
  const { data: contractBalanceWei } = useReadContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'getWithdrawableContractBalance',
  });

  // Wei'yi ETH'ye çevir (göstermek için)
  const contractBalanceEth = contractBalanceWei 
    ? parseFloat(formatEther(contractBalanceWei))
    : 0;

  const handleWithdraw = () => {
    if (!address || amount <= 0) return;

    // ✅ ÖNEMLİ: Amount ETH cinsinden ise parseEther ile Wei'ye çevir
    writeContract({
      address: contractAddress,
      abi: CONTRACT_ABI,
      functionName: 'withdrawFromContract',
      args: [
        address, // to address
        parseEther(amount.toString()) // amount Wei'ye çevriliyor
      ],
    });
  };

  return (
    <div>
      <p>Contract Balance: {contractBalanceEth} ETH</p>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        step="0.001"
      />
      <button onClick={handleWithdraw}>
        Withdraw {amount} ETH
      </button>
    </div>
  );
}
```

### ❌ Yanlış Kullanım Örnekleri

#### Hata 1: Amount zaten Wei cinsinden ama tekrar parseEther ile çarpılıyor
```typescript
// YANLIŞ - amount zaten Wei cinsinden
const amountWei = BigInt("1000000000000000000"); // 1 ETH in Wei
writeContract({
  args: [address, parseEther(amountWei.toString())] // ❌ Çift dönüşüm!
});
```

#### Hata 2: Amount ETH cinsinden ama Wei'ye çevrilmeden gönderiliyor
```typescript
// YANLIŞ - amount ETH cinsinden ama Wei'ye çevrilmemiş
const amountEth = 1.5; // ETH
writeContract({
  args: [address, amountEth] // ❌ Contract Wei bekliyor!
});
```

#### Hata 3: Contract balance Wei cinsinden ama ETH olarak gönderiliyor
```typescript
// YANLIŞ - contractBalanceWei zaten Wei cinsinden
const contractBalanceWei = await contract.getWithdrawableContractBalance();
writeContract({
  args: [address, contractBalanceWei] // ✅ Bu doğru, ama...
  // Eğer UI'da ETH olarak gösteriliyorsa ve kullanıcı ETH giriyorsa:
  // args: [address, parseEther(userInput)] // ✅ Bu doğru
});
```

## Kontrol Listesi

1. ✅ Amount değeri ETH cinsinden giriliyorsa → `parseEther(amount)` kullan
2. ✅ Amount değeri Wei cinsinden ise → Direkt kullan, `parseEther` kullanma
3. ✅ Contract balance Wei cinsinden dönüyor → `formatEther()` ile ETH'ye çevir (sadece gösterim için)
4. ✅ `withdrawFromContract` çağrısında amount her zaman Wei cinsinden olmalı

## Debug İpuçları

```typescript
// Debug için console.log ekle
const amountEth = 1.5;
const amountWei = parseEther(amountEth.toString());
console.log('Amount ETH:', amountEth);
console.log('Amount Wei:', amountWei.toString());
console.log('Amount Wei (hex):', amountWei.toString(16));

// Contract'a göndermeden önce kontrol et
if (amountWei > contractBalanceWei) {
  console.error('Insufficient balance!');
}
```

