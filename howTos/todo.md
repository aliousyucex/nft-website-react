#Contract - solidity

Gerekli objeler
- `address-balance` ikilisi

Gerekli functionlar
- deposit & verify
    - `updateBalance` cagirilarak `address-balance` objesindeki veri guncellenecek. Eger objede kullanici varsa balance, gelen miktar kadar arttirilacak 
- withdraw & verify
    - `updateBalance` cagirilarak `address-balance` objesindeki veri guncellenecek. Eger objede kullanici varsa ve istenilen miktar, obje icerisinde belirtilene esit ya da daha az ise basariyla cekim islemi yapilacak.
- getWithdrawableUserBalance
- getUserStats
    - pass to address and get getWithdrawableBalance
- getContractBalance
- updateBalance `address-balance` for a person (ownerOnly)
- updateBalances `address-balance` for 2 person (ownerOnly)
- getWithdrawableContractBalance (ownerOnly)
- withdrawFromContract (ownerOnly)
    - We should pass an wallet address from frontend to backend to contract
- getAddressBalance (ownerOnly)
    - For safeyt and backup we can pull all users and active balances

Son olarak, daha sonradan gereksinim dahilinde bir fonksiyon eklemek isteme durumumuza göre dışarıdan fonksiyon ekleyebileceğimiz bir logic eklemeliyiz

Kullanılacak teknolojiler
- EVM alt layer'ında bulunan abstractChain için bir smartContract olacak
- @openzeppelin kullanilacak
- MIT license kullanilacak
- solidity 0.8.0 ve uzeri destekli olacak

# Deployment

## Contract deploymenti
- ENV içerisinde bir contract address varsa deployment yapılmayacak
- Deployment ve verify icin hardhat kullanilacak
- Eğer bir wallet verilmişse o wallet ile deployment gerçekleştirilecek
- Wallet yoksa, wallet oluşturulacak ve deployment sonrasında contract address, wallet information vb gerekli bilgileri, sensetiveInformation.md seklinde export almalıyız.
- Contract ABI bir dosyaya yazılacak

# Backend
websocket kullanılacak.
### WebSocket Server Konumu
- **Backend içerisinde** olmalı, ayrı servis gerekli değil
- Mevcut Express.js server ile aynı port'ta Socket.IO kullanın
- `api.js` dosyasına Socket.IO entegrasyonu yapın

## 2. Room Sistemi (Zorunlu)

10'larca kullanıcı için mutlaka room sistemi gerekli:

```javascript
// Room Structure Örneği
{
  roomId: "room_123",
  players: [
    {
        socketId: "abc",
        address: "0x123...",
        ready: false,
        roundsWon: 0,
    },
    {
        socketId: "def",
        address: "0x456...",
        ready: false,
        roundsWon: 0,
    }
  ],
  gameState: "waiting", // waiting, playing, finished
  betAmount: 0.001,
  currentRound: 1,
  winner: null,
  createdAt: new Date()
}
```

```
function handleRoundEnd(roomId, winnerId) {
  const room = rooms.get(roomId);
  const winnerPlayer = room.players.find(p => p.socketId === winnerId);
  
  winnerPlayer.roundsWon++;
  
  // 3 tur kazanan var mı kontrol et
  if (winnerPlayer.roundsWon >= 3) {
    room.winner = winnerPlayer.address;
    room.gameState = "finished";
    // Oyun sonu işlemleri...
  } else {
    // Yeni tura geç
    room.currentRound++;
    // Kartları dağıt vs...
  }
}
```

- Bütün istekler frontend tarafından secret key ile şifrelenerek gelecek, şifre doğru olmadığı sürece istekler işleme alınmayacak
    - Bu şifreleme için, JWT, http-cookie vb bir şey kullanabiliriz. En önemli kısmı güvenlikli olması. Bütün kullanıcılar istediği zaman istek yapabilir.
    fakat bu istek, frontend app'inden gelmediği sürece dikkate alınmamalı. Yapılabilecek saldırı ve sahte istekleri egale etmeli.
- Oyun içerisinde yaşanabilecek oyunlar için gerekli route'larımız bulunuyor.
Routes:
- getContractStats (contractAddress: string) // Contract'ın ulaşılabilir olduğu teyit edilecek
- deposit (address: string, depositAmount: number) // Kullanıcı smart contract'a para yatırıyor.
    - Bu işlem içerisinde, contract'taki deposit function'ı call edilecek.
- withdraw (address: string, withdrawAmount: number) // Kullanici smart contract'tan para cekiyor.
- getUserStatus (address: string) // Kullanıcının contract'taki kullanılabilir balance bilgisi getirilecek



5 Saniyelik countdown bütün oyun içinmiş gibi davranıyor. Her bir round sonunda sıfırlanmalı.
animasyonlar eklenmediği için, geçişler şu anda çok hızlı, animasyonları ekleyip, ayrıca bu animasyonları beklemeliyiz.

Gereksiz socket connection bilgileri kaldırılmalı.

emoji gönderildiğinde, diğer oyuncunun UI'ında emoji popup olarak çıkmalı.

oyunu bitiremiyoruz.

skorlari gostermiyoruz

history gostermiyoruz

gereksiz socket event bilgilerini UI'da gosteriyoruz

Her iki oyuncuda kartlarını seçtikten sonra, sonucu UI içerisinde oyunculara da göstereceğimiz bir animasyon olmalı. Şu anda backend içerisinde karar verip, yeni kart seçmelerini istiyoruz sadece.

UI oldukça büyük kart seçebilmek için, scroll etmem gerekiyor. Bunu düzenlemeliyiz.


