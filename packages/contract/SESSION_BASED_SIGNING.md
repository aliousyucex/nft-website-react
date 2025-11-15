# Session-Based Sign Request Implementation

## 🎯 Konsept

Sadece **ilk wallet connection'da** sign request yapılır. Disconnect/connect'e kadar aynı wallet ile işlem yapıldığı doğrulanır. Deposit, withdraw gibi işlemlerde sign istenmez (zaten gas fee ödeniyor).

## ✅ Avantajlar

1. **UX İyileştirmesi**: Sadece bir kez sign (ilk connection'da)
2. **Güvenlik**: Wallet sahipliği doğrulaması + wallet değişikliği kontrolü
3. **Pratiklik**: Deposit/withdraw gibi işlemlerde gereksiz popup yok
4. **Session Yönetimi**: Disconnect'e kadar geçerli

## 🔧 Backend Implementation

### 1. Auth Handler (`apps/backend/src/socket/handlers/auth.ts`)

```typescript
socket.on('verify_signature', async (data, callback) => {
  // Signature verification
  const recoveredAddress = ethers.verifyMessage(message, signature);
  
  // Store verified address in socket session
  socket.data.verifiedAddress = address.toLowerCase();
  socket.data.verifiedAt = Date.now();
  
  // Session established until disconnect
});
```

### 2. Wallet Verification Middleware (`apps/backend/src/socket/middleware/walletVerification.ts`)

```typescript
export const requireWalletVerification = (
  socket: Socket,
  address: string,
  callback: Function
): boolean => {
  // Check if wallet was verified
  if (!socket.data.verifiedAddress) {
    callback({
      success: false,
      error: 'Wallet not verified. Please sign to establish session.',
      code: SocketErrorCode.WALLET_NOT_VERIFIED,
    });
    return false;
  }
  
  // Check if address matches verified address
  if (socket.data.verifiedAddress !== address.toLowerCase()) {
    callback({
      success: false,
      error: 'Wallet address mismatch. Please reconnect and sign again.',
      code: SocketErrorCode.WALLET_NOT_VERIFIED,
    });
    return false;
  }
  
  return true;
};
```

### 3. Room Handler'da Kullanım

```typescript
socket.on('create_room', async (data, callback) => {
  const {address} = data;
  
  // Verify wallet (session-based)
  if (!requireWalletVerification(socket, address, callback)) {
    return; // Error already sent
  }
  
  // Continue with room creation...
});
```

## 🎨 Frontend Implementation

### 1. İlk Connection'da Sign

```typescript
// SocketContext.tsx veya benzeri
useEffect(() => {
  if (address && socket && !socket.data.verifiedAddress) {
    // Sign message
    const message = `Sign in to Ice Water Fire\nTimestamp: ${Date.now()}`;
    signMessage({ message }).then((signature) => {
      // Send to backend
      socket.emit('verify_signature', {
        address,
        signature,
        message,
      }, (response) => {
        if (response.success) {
          console.log('Session established');
        }
      });
    });
  }
}, [address, socket]);
```

### 2. Deposit/Withdraw'da Sign İstenmez

```typescript
// DepositModal.tsx
const handleDeposit = async () => {
  // NO SIGN REQUEST HERE - User already pays gas
  writeContract({
    address: contractAddress,
    abi: CONTRACT_ABI,
    functionName: 'deposit',
    value: parseEther(amount.toString()),
  });
};
```

## 🔄 Flow

```
1. User connects wallet
   ↓
2. Frontend: Sign message (ONCE)
   ↓
3. Backend: Verify signature → Store in socket.data
   ↓
4. Session established (until disconnect)
   ↓
5. Every operation checks socket.data.verifiedAddress
   ↓
6. Deposit/Withdraw: No sign needed (gas already paid)
   ↓
7. User disconnects → Session cleared
   ↓
8. User reconnects → Sign again (step 2)
```

## 🛡️ Güvenlik Kontrolleri

### Backend'de Her İşlemde:

1. ✅ `socket.data.verifiedAddress` var mı?
2. ✅ Gönderilen `address` verified address ile eşleşiyor mu?
3. ✅ Session hala geçerli mi? (disconnect kontrolü)

### Frontend'de:

1. ✅ İlk connection'da sign yapılıyor mu?
2. ✅ Sign başarılı mı?
3. ✅ Wallet değiştiğinde yeniden sign yapılıyor mu?

## 📝 Örnek Kullanım Senaryoları

### Senaryo 1: Normal Flow
```
1. User connects → Sign (1 kez)
2. User creates room → Wallet verified ✅
3. User joins game → Wallet verified ✅
4. User deposits → NO SIGN (gas paid)
5. User withdraws → NO SIGN (gas paid)
6. User disconnects → Session cleared
```

### Senaryo 2: Wallet Değişikliği
```
1. User connects → Sign with Wallet A
2. User tries to use Wallet B → ❌ Error: Wallet mismatch
3. User must disconnect and reconnect with Wallet B
4. User signs again with Wallet B
```

### Senaryo 3: Reconnection
```
1. User connects → Sign
2. User plays game
3. Connection lost → Socket disconnect
4. User reconnects → Must sign again
5. User continues game
```

## 🎯 Sonuç

Bu yaklaşım:
- ✅ Güvenlik sağlar (wallet ownership + change detection)
- ✅ UX'i iyileştirir (sadece 1 kez sign)
- ✅ Pratik (deposit/withdraw'da sign yok)
- ✅ Session-based (disconnect'e kadar geçerli)

**Not**: Deposit ve withdraw gibi işlemlerde zaten gas fee ödendiği için sign request gereksizdir. Sadece ilk connection'da sign yaparak hem güvenlik hem de UX sağlanır.

