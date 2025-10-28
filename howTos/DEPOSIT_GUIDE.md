# 💰 Deposit & Balance Guide - Ice Water Fire

## 🚨 Sorun: "Yetersiz Bakiye" Hatası

### Durum
Wallet'ınızda **0.05 ETH** olmasına rağmen, 0.001 ETH ile oda oluşturmaya çalıştığınızda "**Insufficient balance**" hatası alıyorsunuz.

### Sebep

**Wallet Balance ≠ Contract Balance**

```
┌────────────────────────┐
│   Wallet (MetaMask)    │
│      0.05 ETH ✅       │  ← Gas fees için kullanılır
└────────────────────────┘
            │
            │ Deposit yapılmalı!
            ↓
┌────────────────────────┐
│  Smart Contract        │
│      0 ETH ❌          │  ← Oyun için kullanılır
└────────────────────────┘
```

Smart contract, oyun güvenliği için **kendi balance sistemini** kullanıyor. Bu sistem:
- ✅ Kullanıcıların balance'larını izole ediyor
- ✅ Oyun sırasında güvenli transfer sağlıyor
- ✅ Komisyon yönetimini kolaylaştırıyor
- ✅ Withdraw işlemlerini güvence altına alıyor

## 🎯 Çözüm: Deposit Yapın

### Adım 1: Deposit Modal'ını Açın

Game Lobby'de sağ üstteki **"💰 Deposit"** butonuna tıklayın.

### Adım 2: Balance'ları Kontrol Edin

```
┌─────────────────────────────┐
│  Wallet Balance: 0.05 ETH   │  ← MetaMask cüzdanınız
└─────────────────────────────┘

┌─────────────────────────────┐
│ Contract Balance: 0 ETH     │  ← Oyun balance'ı (deposit gerekli)
│ 🔄 (refresh button)          │
└─────────────────────────────┘
```

### Adım 3: Deposit Miktarı Seçin

**Preset Butonlar:**
- `0.001 ETH` - Minimum bet amount
- `0.01 ETH` - Recommended
- `0.1 ETH` - For multiple games
- `0.5 ETH` - High roller

veya custom miktar girin.

### Adım 4: Deposit İşlemini Onaylayın

1. **"Deposit X ETH"** butonuna tıklayın
2. **MetaMask** açılır
3. Gas fee'yi kontrol edin
4. **"Confirm"** tıklayın
5. Transaction onaylanmasını bekleyin (15-30 saniye)

### Adım 5: Balance'ı Refresh Edin

- Transaction tamamlandıktan sonra
- Modal'daki 🔄 butonuna tıklayın
- Contract balance güncellenecek

## 📊 Balance Yönetimi

### Deposit (Yatırma)

```solidity
function deposit() external payable
```

**Ne yapar:**
- Wallet'ınızdan ETH alır
- Contract balance'ınıza ekler
- Oyun oynamanızı sağlar

**Örnek:**
```
Before:  Wallet: 0.05 ETH | Contract: 0 ETH
Deposit: 0.01 ETH
After:   Wallet: 0.04 ETH | Contract: 0.01 ETH
         (minus gas fee)
```

### Withdraw (Çekme)

```solidity
function withdraw(uint256 amount) external
```

**Ne yapar:**
- Contract balance'ınızdan ETH çeker
- Wallet'ınıza gönderir
- Kazandığınız parayı almanızı sağlar

**Withdraw yapabilmek için:**
- ✅ Positive balance olmalı (kazanç > kayıp)
- ✅ Active game olmamalı
- ✅ Gas fee için wallet'ta ETH bulunmalı

## 🎮 Oyun Senaryoları

### Senaryo 1: İlk Oyun

```
1. Deposit: 0.01 ETH
   Contract Balance: 0.01 ETH

2. Room Oluştur: 0.001 ETH bet
   Contract Balance: 0.01 ETH (henüz kesilmedi)

3. Oyun Başlar:
   Balance: 0.01 - 0.001 = 0.009 ETH (locked)

4. Kazanırsanız:
   Balance: 0.009 + (0.002 * 0.97) = 0.01094 ETH
                       ↑
                    2x bet - 3% commission

5. Kaybederseniz:
   Balance: 0.009 ETH (bet kaybedildi)
```

### Senaryo 2: Multiple Games

```
Initial Deposit: 0.1 ETH

Game 1 (0.01 bet) - Win:  0.1 + 0.0094 = 0.1094 ETH
Game 2 (0.01 bet) - Lose: 0.1094 - 0.01 = 0.0994 ETH
Game 3 (0.01 bet) - Win:  0.0994 + 0.0194 = 0.1188 ETH

Profit: 0.1188 - 0.1 = 0.0188 ETH (18.8% gain)
```

### Senaryo 3: Disconnect Penalty

```
In-Game Balance: 0.05 ETH
Current Bet: 0.01 ETH
Current Score: Losing (1-2)

Disconnect/AFK:
- Bet lost: -0.01 ETH
- Penalty: Bet transferred to contract
- Remaining Balance: 0.04 ETH
```

## ⚠️ Önemli Notlar

### Deposit Sınırları

- **Minimum Deposit:** 0.001 ETH (contract'ta limit yok ama önerilen)
- **Maximum Deposit:** Wallet balance'ınızın tamamı
- **Önerilen Deposit:** En az 10x bet amount (uzun süreli oyun için)

### Bet Sınırları

- **Minimum Bet:** 0.001 ETH
- **Maximum Bet:** Contract balance'ınız
- **Örnek:** 0.01 ETH contract balance → Max 0.01 ETH bet

### Gas Fees

Her işlem için gas fee gerekir:
- **Deposit:** ~50,000 gas
- **Withdraw:** ~100,000 gas
- **Tahmini Maliyet:** 0.0001-0.0005 ETH (network durumuna göre)

⚠️ **Wallet'ta gas fee için yeterli ETH bırakın!**

### Komisyon

Her oyun kazancından **3% komisyon** kesilir:

```
Total Pot: 0.01 + 0.01 = 0.02 ETH
Commission: 0.02 * 0.03 = 0.0006 ETH
Winner Gets: 0.02 - 0.0006 = 0.0194 ETH

Net Profit: 0.0194 - 0.01 (your bet) = 0.0094 ETH
```

### Balance Koruması

Contract balance'ınız:
- ✅ **Isolated:** Diğer oyunculardan ayrı
- ✅ **Secure:** Smart contract tarafından korunuyor
- ✅ **Withdrawable:** İstediğiniz zaman çekebilirsiniz
- ❌ **Not liquid:** Active game sırasında çekilemez

## 🔧 Troubleshooting

### "Insufficient balance" Hatası

**Sebep:** Contract balance < Bet amount

**Çözüm:**
```bash
1. Deposit modal'ını açın
2. 🔄 ile balance'ı refresh edin
3. Yetersizse deposit yapın
4. Tekrar deneyin
```

### "Transaction Failed" Hatası

**Olası Sebepler:**
1. **Gas fee yetersiz** → Wallet'ta ETH kalmamış
2. **Network congestion** → Gas price'ı artırın
3. **Contract error** → Backend log'larını kontrol edin

**Çözüm:**
```bash
1. Wallet balance'ı kontrol edin (gas için)
2. Higher gas price seçin
3. Birkaç saniye bekleyip tekrar deneyin
```

### Balance Güncellen miyor

**Çözüm:**
```bash
1. Deposit modal'da 🔄 butonuna tıklayın
2. Transaction explorer'da onayı kontrol edin
3. Hala güncellenmediyse backend restart
```

### Withdraw Yapamıyorum

**Kontrol Listesi:**
- [ ] Contract balance > 0
- [ ] Active game yok
- [ ] Wallet'ta gas fee var
- [ ] Network bağlantısı stabil

## 📱 UI Akışı

### 1. Game Lobby

```
┌──────────────────────────────────────────────┐
│  🎴 Ice Water Fire         💰 Deposit       │
│  Choose your game mode                       │
├──────────────────────────────────────────────┤
│                                              │
│  🏗️ Create Room                             │
│  🔍 Find Room                                │
│  ⚡ Quick Join                               │
│                                              │
└──────────────────────────────────────────────┘
```

### 2. Deposit Modal

```
┌───────────────────────────────────────────┐
│              💰 Deposit ETH               │
│    Deposit ETH to your game balance       │
├───────────────────────────────────────────┤
│  Wallet Balance    │  Contract Balance    │
│    0.05 ETH        │    0 ETH     🔄      │
├───────────────────────────────────────────┤
│  Deposit Amount (ETH)                     │
│  [   0.01   ]                             │
│                                           │
│  [0.001] [0.01] [0.1] [0.5]              │
├───────────────────────────────────────────┤
│  ℹ️ You need to deposit ETH to your       │
│     contract balance before playing...    │
├───────────────────────────────────────────┤
│  [Cancel]     [Deposit 0.01 ETH]         │
└───────────────────────────────────────────┘
```

### 3. Transaction Flow

```
1. User clicks "Deposit"
   ↓
2. MetaMask opens
   ↓
3. User confirms + gas fee
   ↓
4. Transaction pending... (15-30s)
   ↓
5. ✅ Success notification
   ↓
6. Balance auto-refreshes
   ↓
7. Ready to play!
```

## 🎯 Best Practices

### Önerilen Deposit Stratejisi

**Yeni Oyuncular:**
```
First deposit: 0.01 ETH
Play with: 0.001 ETH bets
Games: ~10 games
Risk: Low
```

**Regular Players:**
```
Deposit: 0.1 ETH
Play with: 0.01 ETH bets  
Games: ~10 games
Risk: Medium
```

**High Rollers:**
```
Deposit: 0.5+ ETH
Play with: 0.1 ETH bets
Games: 5+ games
Risk: High
```

### Balance Yönetim İpuçları

1. **Bankroll Management:**
   - Deposit amount: 20x - 50x your bet size
   - Örnek: 0.01 ETH bet → 0.2-0.5 ETH deposit

2. **Profit Taking:**
   - Her 50% kazançta biraz withdraw edin
   - Original deposit'i koruyun

3. **Loss Limits:**
   - Max %30 kayıp → stop
   - Deposit tekrar yapmadan önce bekleyin

4. **Gas Optimization:**
   - Büyük deposit yapın (küçük frequent yerine)
   - Withdrawal'ları batch edin

## 🔐 Güvenlik

### Smart Contract Güvenliği

```solidity
✅ Ownable (only owner can manage)
✅ ReentrancyGuard (prevents attacks)
✅ Isolated balances (your funds are safe)
✅ Withdrawable anytime (when not in game)
```

### Best Security Practices

1. ✅ Contract address'i doğrulayın
2. ✅ Transaction'ları explorer'da kontrol edin
3. ✅ Private key'inizi kimseyle paylaşmayın
4. ✅ Hardware wallet kullanın (büyük miktarlar için)

## 📞 Destek

### Sorun yaşıyorsanız:

1. **Bu guide'ı okuyun** (çoğu sorun burada)
2. **Browser console'u açın** (F12 → Console tab)
3. **Error mesajını kopyalayın**
4. **Backend logs'una bakın** (development mode)
5. **Destek ekibiyle iletişime geçin** (error + transaction hash)

### Faydalı Linkler

- **Contract Explorer:** [https://explorer.testnet.abs.xyz/address/YOUR_CONTRACT](https://explorer.testnet.abs.xyz/address/0x3A895aeA91388f6b44227CDb565FDb04a8A81C79)
- **Transaction Status:** Explorer'da transaction hash'i aratın
- **Backend API:** `http://localhost:5000/api/contract/balance/YOUR_ADDRESS`

---

## ✅ Checklist: İlk Oyununuz

- [ ] Wallet'ı bağladınız (Abstract Testnet)
- [ ] Deposit modal'ını açtınız
- [ ] Balance'ları kontrol ettiniz
- [ ] Deposit yaptınız (en az 0.01 ETH önerilen)
- [ ] Transaction onaylandı
- [ ] Contract balance güncellendi
- [ ] Room oluştur/katıl → ✅ Oyun oynayabiliyorsunuz!

**İlk oyununuzda başarılar! 🎮🔥💧❄️**

