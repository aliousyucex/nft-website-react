# Ice Water Fire - Kart Oyunu Dokümantasyonu

> **🎴 Deste Sistemi:** Her oyuncunun **kendi 9 kartlık destesi** vardır. İki oyuncu farklı desteler kullandığı için aynı kartları oynayabilirler (örn: Fire 5 vs Fire 5). 
> 
> **📊 Kart Dağıtım Mekanizması:**
> - **Başlangıç:** 5 kart ele, 4 kart havuzda
> - **İlk 5 kart bitince:** Kalan 4 kart ele geçer (henüz karıştırma yok)
> - **Tüm 9 kart bitince:** Bütün deste karıştırılır, tekrar 5 kart dağıtılır
> 
> **⚔️ Beraberlik:** Aynı kartlar seçilirse (Ice 3 vs Ice 3), puan kazanılmaz ama kartlar kullanılmış sayılır (her iki oyuncunun da eli -1 azalır). Bu kayıp riskini artırır.

## 📋 İçindekiler
1. [Oyun Kuralları](#oyun-kuralları)
2. [Kart Sistemi](#kart-sistemi)
3. [Kazanma Koşulları](#kazanma-koşulları)
4. [Oyuna Katılım](#oyuna-katılım)
5. [Oda Sistemi](#oda-sistemi)
6. [Oynanış Akışı](#oynanış-akışı)
7. [Bağlantı Kopması ve Çıkış](#bağlantı-kopması-ve-çıkış)
8. [UI/UX Tasarımı](#uiux-tasarımı)
9. [Animasyon ve Grafik Kütüphaneleri](#animasyon-ve-grafik-kütüphaneleri)
10. [Teknik Stack](#teknik-stack)
11. [WebSocket Events](#websocket-events)
12. [Room Structure](#room-structure)
13. [Komisyon Sistemi](#komisyon-sistemi)
14. [Leaderboard Sistemi](#leaderboard-sistemi)
15. [Emoji Sistemi](#emoji-sistemi)
16. [Güvenlik Sistemi](#güvenlik-sistemi)
17. [Mobil Destek & Touch Controls](#mobil-destek--touch-controls)
18. [Reconnect & Session Sistemi](#reconnect--session-sistemi)
19. [Eksik ve Düzeltilmesi Gereken Noktalar](#eksik-ve-düzeltilmesi-gereken-noktalar)
20. [Öncelikli TODO Listesi](#öncelikli-todo-listesi)
21. [Sonuç](#sonuç)

---

## 🎮 Oyun Kuralları

### Temel Bilgiler
- **Oyuncu Sayısı**: 2 kişi (1v1)
- **Kart Sayısı**: Her oyuncuya 5 kart dağıtılır
- **Kazanma Koşulu**: İlk 3 turu kazanan oyunu kazanır
- **Tur Sistemi**: Best of 5 (3-0, 3-1, 3-2 olası skorlar)

---

## 🃏 Kart Sistemi

### Deste Yapısı
- **Her oyuncunun kendine ait 9 kartlık bir destesi vardır**
- İki oyuncu **aynı kart türlerini** kullanır ama **farklı destelere** sahiptir
- Bu sayede her iki oyuncu da aynı kartı seçebilir (örn: Fire 5 vs Fire 5)

**Örnek Senaryo 1: Aynı Kart Seçimi**
```
Oyuncu 1'in Destesi: [🔥3, 🔥5, 🔥7, ❄️3, ❄️5, ❄️7, 💧3, 💧5, 💧7]
Oyuncu 2'nin Destesi: [🔥3, 🔥5, 🔥7, ❄️3, ❄️5, ❄️7, 💧3, 💧5, 💧7]

Oyuncu 1'e dağıtılan 5 kart: [🔥5, ❄️3, 💧7, 🔥3, ❄️7]
Oyuncu 2'ye dağıtılan 5 kart: [🔥5, 💧3, ❄️5, 🔥7, 💧5]

➡️ Her ikisinin de 🔥5 kartı var, aynı turda seçebilirler!
```

**Örnek Senaryo 2: Beraberlik ve Kart Dağıtımı**
```
Başlangıç:
Oyuncu 1 El: [🔥5, ❄️3, 💧7, 🔥3, ❄️7] (5 kart)
Oyuncu 1 Kalan: [🔥7, ❄️5, 💧3, 💧5] (4 kart)

Tur 1: 🔥5 vs 🔥5 → BERABERLIK → Kartlar used pool'a gider
Oyuncu 1 El: [❄️3, 💧7, 🔥3, ❄️7] (4 karta düştü!)
Puan: 0-0 (beraberlik, puan yok)

Tur 2: ❄️3 vs 🔥7 → Oyuncu 2 Kazandı (Fire > Ice)
Oyuncu 1 El: [💧7, 🔥3, ❄️7] (3 karta düştü)
Puan: 0-1

Tur 3: 💧7 vs ❄️5 → Oyuncu 1 Kazandı (Water > Ice)
Oyuncu 1 El: [🔥3, ❄️7] (2 karta düştü)
Puan: 1-1

Tur 4: 🔥3 vs 💧3 → Oyuncu 1 Kazandı (Fire > Water)
Oyuncu 1 El: [❄️7] (1 kart kaldı)
Puan: 2-1

Tur 5: ❄️7 vs 🔥5 → Oyuncu 2 Kazandı (Fire > Ice)
Oyuncu 1 El: [] (boş!)
Puan: 2-2

→ Kalan 4 kart ele geçti: [🔥7, ❄️5, 💧3, 💧5]
→ Bildirim: "⚠️ Son 4 kartınız!"

Tur 6-9: ... (4 kart daha oynanır)

Tur 10: Oyuncu 1'in tüm kartları bitti!
→ 9 kart karıştırıldı
→ Yeni 5 kart: [🔥3, 💧7, ❄️5, 🔥5, ❄️3]
→ Bildirim: "🔄 Kartlar karıştırıldı!"
```

### Kart Tipleri
Oyunda toplam 9 farklı kart vardır (her oyuncunun destesinde):

| Tip | Değer | Açıklama |
|-----|-------|----------|
| 🔥 Fire | 3 | Ateş - Düşük |
| 🔥 Fire | 5 | Ateş - Orta |
| 🔥 Fire | 7 | Ateş - Yüksek |
| ❄️ Ice | 3 | Buz - Düşük |
| ❄️ Ice | 5 | Buz - Orta |
| ❄️ Ice | 7 | Buz - Yüksek |
| 💧 Water | 3 | Su - Düşük |
| 💧 Water | 5 | Su - Orta |
| 💧 Water | 7 | Su - Yüksek |

### Kart Dağıtımı
- **Her oyuncunun kendine ait 9 kartlık bir destesi vardır**
- Her oyuncu kendi destesinden **rastgele 5 kart** alır
- İki oyuncu **farklı desteler** kullandığı için **aynı kartları seçebilir**
  - Örnek: Her iki oyuncu da 🔥 Fire 5 kartını elinde bulundurabilir
- Her oyuncunun destesinde **4 kart kullanılmadan kalır**

---

## 🏆 Kazanma Koşulları

### 1. Tip Üstünlüğü (Rock-Paper-Scissors Mantığı)
```
🔥 Fire > ❄️ Ice (Ateş buzu eritir)
💧 Water > 🔥 Fire (Su ateşi söndürür)
❄️ Ice > 💧 Water (Buz suyu dondurur)
```

### 2. Aynı Tip İçin Değer Karşılaştırması
Aynı tip kartlar karşılaştığında, **yüksek değer kazanır**:
```
🔥 Fire 7 > 🔥 Fire 5 > 🔥 Fire 3
❄️ Ice 7 > ❄️ Ice 5 > ❄️ Ice 3
💧 Water 7 > 💧 Water 5 > 💧 Water 3
```

### 3. Beraberlik Durumu
Aynı tip ve aynı değer kartlar oynandığında:
- **Puan kazanılmaz** (0-0 kalır)
- Kartlar **kullanılmış sayılır** (her iki oyuncunun da eli -1 azalır)
- Tur **sayılır** ama kazanan yoktur
- Yeni tur başlar, kart seçimi yapılır
- Örnek: ❄️ Ice 3 vs ❄️ Ice 3 → Beraberlik → İki tarafın da eli 1 azalır

**Neden Kartlar Geri Dönmez?**
- Eğer kartlar geri dönseydi, oyuncular 9 kartın hepsini kullanamazdı
- Beraberlik sürekli tekrarlanabilirdi (sonsuz döngü)
- Şu sistem daha adil ve dengeli

**Stratejik Önem:**
- Her oyuncu kendi destesini kullandığı için, aynı kartların karşılaşması mümkün
- Beraberlik de kayıp sayılır (kart gider ama puan alınmaz)
- Bu risk/ödül dengesi katar

### 4. Oyun Sonu
- **İlk 3 tur kazanan** oyunu kazanır
- Kazanan **%3 komisyon sonrası** toplam bet miktarını alır
- Olası final skorları: 3-0, 3-1, 3-2

### 5. Uzatma Kuralı (15. Round Limiti)
Beraberlik çok sık olursa oyun uzayabilir. Bu durumda:

**15. Round Sonunda:**
```javascript
if (currentRound === 15 && !hasWinner) {
  // Puan kontrol et
  if (player1.roundsWon > player2.roundsWon) {
    // Önde olan kazanır
    winner = player1;
  } else if (player2.roundsWon > player1.roundsWon) {
    winner = player2;
  } else {
    // Eşitse: İlk skor kazanan kazanır
    const firstScorer = roundHistory.find(r => r.winner !== null);
    winner = firstScorer.winner;
  }
  
  endGame(roomId, winner, 'overtime_rule');
}
```

**Kurallar:**
1. **15. round sonunda** önde olan kazanır
2. **Eşitse** ilk skor alan kazanır
3. Maksimum oyun süresi sınırlaması

---

## 🚪 Oyuna Katılım

### Ana Menü - 3 Seçenek

#### 1️⃣ Oda Kur (Create Room)
Kullanıcı yeni oda oluşturur:

**Seçenekler:**
- **Bet Miktarı** belirleme (örn: 0.001 ETH, 0.01 ETH, vs.)
- **Şifre** koyma (opsiyonel)
- **Kazanma Puanı** (opsiyonel, varsayılan: 3)

**Özellikler:**
- Paylaşılabilir **Oda Kodu** elde edilir (örn: `ABCD1234`)
- **Davet Linki** oluşturulur (örn: `https://app.com/room/ABCD1234`)
- Oda listesinde görünür olur
- Otomatik katılıma açıktır

#### 2️⃣ Oda Bul (Find Room)
Mevcut odalara katılım:

**Yöntem 1: Kod ile**
- Oda kodunu gir (örn: `ABCD1234`)
- Doğrudan odaya katıl

**Yöntem 2: Link ile**
- Paylaşılan linke tıklayarak katıl

**Yöntem 3: Filtrele**
- Bet miktarına göre odaları listele
- Uygun odayı seç ve katıl

#### 3️⃣ Hızlı Katıl (Quick Join)
En hızlı yöntem:

**Akış:**
1. Kullanıcı bet miktarını seçer
2. "Hızlı Katıl" butonuna tıklar
3. Sistem aynı bet miktarında **1 kişilik** oda arar
4. **Eğer bulunursa** → O odaya otomatik katılır
5. **Eğer bulunmazsa** → Yeni oda oluşturur ve bekler

---

## 🏠 Oda Sistemi

### Oda Özellikleri
| Özellik | Açıklama | Varsayılan | Limit/Kısıt |
|---------|----------|------------|-------------|
| **Oyuncu Limiti** | Maksimum 2 kişi | 2 | Sabit |
| **Bet Miktarı** | Oda kurucusu belirler | 0.001 ETH | Min: 0.001 ETH, Max: User balance |
| **Bet Presets** | Hızlı seçim | - | 0.001, 0.01, 0.1 ETH + Custom |
| **Şifre** | Opsiyonel koruma | Yok | Max 8 karakter, plain text |
| **Kazanma Puanı** | Kaç tur kazanılacak | 3 | Opsiyonel (varsayılan: 3) |
| **Sahiplik** | Oda sahibi yok | - | - |
| **Kickleme** | Mümkün değil | - | - |

### Oda Durumları
```javascript
"waiting"    // 1 kişi var, 2. oyuncu bekleniyor
"ready"      // 2 kişi var, ready butonları aktif
"playing"    // Oyun başladı
"paused"     // Bir oyuncu bağlantı koptu
"finished"   // Oyun bitti
```

### Oda Kuralları
1. ❌ **Sahiplik yok**: Oda kurucusu ayrılabilir
2. ❌ **Kickleme yok**: Kimse kimseyi odadan atamaz
3. ❌ **İzleyici yok**: Sadece 2 oyuncu girebilir
4. ✅ **2 kişi doluysa**: 
   - "Oda Dolu" uyarısı gösterilir (katılmaya çalışılırsa)
   - **Oda listesinden kaldırılır** (anlamsız gösterim)
5. ✅ **1 kişi varsa**: Listelenmeye devam eder
6. ✅ **Boş odalar**: 5 dakika sonra otomatik silinir

---

## 🎯 Oynanış Akışı

### Faz 1: Hazırlık
```
1. İki oyuncu odaya katıldı
2. Her iki tarafta "Ready" butonu görünür
3. İki oyuncu da "Ready" butonuna bastı
   → Oyun başlar
```

### Faz 2: Bet Kesintisi
```
Oyun başladığında:
- Her iki oyuncunun hesabından bet miktarı çekilir
- Toplam pot = betAmount × 2
- Bu işlem WebSocket üzerinden contract'a bildirilir
```

### Faz 3: Kart Dağıtımı
```
- Her oyuncu kendi 9 kartlık destesinden rastgele 5 kart alır
- Kartlar sadece kart sahibi tarafından görülür
- Her oyuncunun destesi bağımsızdır (aynı kartlar olabilir)
- 5 saniyelik geri sayım başlar
```

### Faz 4: Kart Seçimi
```
Her oyuncu için:
1. Elindeki 5 karttan birini seçer
2. Seçilen kart kilitlenir
3. Diğer oyuncunun seçmesi beklenir

Özel Durum - AFK (Away From Keyboard):
- Süre bittiğinde seçim yapmadıysa
- Sistem otomatik olarak rastgele bir kart seçer
```

### Faz 5: Kart Açma
```
İki oyuncu da seçti:
1. Kartlar her iki tarafta da görünür hale gelir
2. Backend kazanma koşulunu kontrol eder
3. Kazanan belirlenir
```

### Faz 6: Sonuç
```javascript
if (beraberlik) {
  // Aynı kart (örn: Ice 3 vs Ice 3)
  - Puan kazanılmaz
  - Kartlar "used" pool'una gider (kullanılmış sayılır)
  - Her iki oyuncunun da el kartı sayısı -1 azalır
  - Oyun geçmişine "beraberlik" olarak kaydedilir
  - Yeni tur başlar, kart seçimi yapılır
  
} else if (kazanan_var) {
  - Kazanan oyuncunun puanı +1 artar
  - Seçilen kartlar "used" pool'una gider (artık seçilemez)
  - Her iki oyuncunun da el kartı sayısı -1 azalır
  - Yeni tura geçilir
  
  // El boş mu kontrol et
  if (player.hand.length === 0 && player.remaining.length > 0) {
    - Oyuncuya kalan 4 kart verilir
    - "⚠️ Son 4 kartınız!" bildirimi gösterilir
  }
  
  if (player.hand.length === 0 && player.remaining.length === 0) {
    - Tüm deste (9 kart) karıştırılır
    - Tekrar 5 kart dağıtılır
    - "🔄 Kartlar karıştırıldı!" bildirimi gösterilir
  }
  
  if (puan === 3) {
    // Oyun bitti
    - Kazanan belirlenir
    - %3 komisyon kesilir
    - Kazanan kalan pot'u alır
    - Oyun sonu ekranı gösterilir
  } else {
    // Bir sonraki tur
    - Yeni kart seçimi başlar
  }
}
```

### Faz 7: Kartlar Bitti (İki Aşamalı Sistem)

#### Aşama 1: İlk 5 Kart Bitti
```javascript
// Oyuncunun elindeki 5 kart bitti
if (player.hand.length === 0 && player.remaining.length > 0) {
  // Henüz kullanılmamış 4 kartı ele ver
  player.hand = player.remaining;          // Kalan 4 kart ele geçer
  player.remaining = [];                   // Artık bekleyen kart yok
  
  // ⚠️ NOT: Henüz reshuffle YOK!
  // Oyuncu şimdi son 4 kartıyla oynuyor
}
```

#### Aşama 2: Tüm 9 Kart Bitti (Reshuffle)
```javascript
// Oyuncunun tüm kartları bitti (9 kart da kullanıldı)
if (player.hand.length === 0 && player.remaining.length === 0 && player.roundsWon < 3) {
  // ŞİMDİ tüm destey karıştır ve yeniden dağıt
  const allCards = player.used;            // Kullanılmış 9 kart
  const shuffled = shuffle(allCards);
  
  player.hand = shuffled.slice(0, 5);      // Yeni 5 kart
  player.remaining = shuffled.slice(5);    // Kalan 4 kart
  player.used = [];                        // Kullanılmış kartlar sıfırlandı
  
  // Oyun devam eder
}

// NOT: Her oyuncu kendi destesini bağımsız yönetir
```

#### Stratejik Önemi
Bu sistem oyuna **taktiksel derinlik** katar:
- ✅ Oyuncular hangi kartları kullandıklarını hatırlayabilir
- ✅ Kalan 4 kartın ne olduğunu tahmin edebilirler
- ✅ Rastgele shuffle'a geçmeden önce tüm seçenekleri kullanırlar
- ✅ Beraberlik durumunda kartlar tekrar kullanılabilir (risk/ödül dengesi)

**Örnek Senaryo:**
```
Başlangıç:
- El: [🔥5, ❄️3, 💧7, 🔥3, ❄️7]
- Kalan: [🔥7, ❄️5, 💧3, 💧5]

5 tur sonra (5 kart kullanıldı):
- El: [] → [🔥7, ❄️5, 💧3, 💧5] (kalan 4 kart ele geçti)
- Kalan: []

4 tur daha sonra (toplam 9 kart kullanıldı):
- El: [] → RESHUFFLE → Rastgele 5 kart
- Kalan: [] → Rastgele 4 kart
```

---

## 🔌 Bağlantı Kopması ve Çıkış

### Health Check Sistemi
```javascript
// WebSocket ping-pong
setInterval(() => {
  socket.emit('ping');
}, 3000); // Her 3 saniyede bir

// 10 saniye cevap gelmezse
if (lastPing > 10000) {
  // Oyuncu afk kabul edilir
}
```

### Senaryolar

#### 1. Tek Oyuncu Ayrıldı
```
1. WebSocket bağlantısı koptu
2. Ekranda "Oyuncu Ayrıldı" uyarısı gösterilir
3. 10 saniye geri sayım başlar
4. 
   a) 10 saniye içinde geri döndü
      → Oyun kaldığı yerden devam eder
      → "Oyuncu geri döndü!" bildirimi
   
   b) 10 saniye içinde dönmedi
      → Ayrılan oyuncu hükmen mağlup sayılır
      → Puan durumuna göre ödeme:
         
         i) Kalan oyuncu ÖNDEYSE (skor farkı var):
            - Kalan oyuncu pot'un %60'ını alır
            - Komisyon kesilmez
            - Örnek: Pot 0.02 ETH → Kalan oyuncu 0.012 ETH alır
         
         ii) Kalan oyuncu EŞİT veya GERİDEYSE:
            - Kalan oyuncu yatırdığı miktarı geri alır (0.01 ETH)
            - Ayrılan oyuncu parasını ALAMAZ (disconnect cezası)
            - Ayrılan oyuncunun bet'i contract'ta kalır
            - Contract balance'ı güncellenir: address → -betAmount
            - Komisyon kesilmez
```

#### 2. İki Oyuncu Ayrıldı
```
1. Her iki oyuncu da 10 saniye içinde dönmedi
2. İki taraf da hükmen mağlup sayılır
3. Her iki oyuncunun bet'i contract'ta kalır
4. Contract balance güncellenir:
   - player1.address → -betAmount
   - player2.address → -betAmount
5. Kimse para alamaz (her ikisi de ceza alır)
```

#### 3. Disconnect Handling (Backend)
```javascript
// Timeout handler
function handleDisconnectTimeout(roomId, disconnectedPlayerId) {
  const room = rooms.get(roomId);
  const disconnectedPlayer = room.players.find(p => p.socketId === disconnectedPlayerId);
  const remainingPlayer = room.players.find(p => p.socketId !== disconnectedPlayerId);
  
  // Puan durumuna göre karar ver
  const disconnectedScore = disconnectedPlayer.roundsWon;
  const remainingScore = remainingPlayer.roundsWon;
  
  if (remainingScore > disconnectedScore) {
    // Kalan oyuncu öndeyse: %60 alır
    const totalPot = room.betAmount * 2;
    const remainingPlayerPrize = totalPot * 0.6;
    
    await contract.updateBalances([
      { address: remainingPlayer.address, amount: remainingPlayerPrize },
      { address: disconnectedPlayer.address, amount: -room.betAmount } // Ceza
    ]);
    
  } else {
    // Kalan oyuncu eşit/gerideyse: Kendi parasını alır, ayrılan ceza
    await contract.updateBalances([
      { address: remainingPlayer.address, amount: room.betAmount },
      { address: disconnectedPlayer.address, amount: -room.betAmount } // Ceza
    ]);
  }
  
  // Oyunu bitir
  endGame(roomId, remainingPlayer.address, 'disconnect_forfeit');
  
  // Bildirimler
  io.to(remainingPlayer.socketId).emit('game_finished', {
    winner: remainingPlayer.address,
    reason: 'opponent_disconnect',
    prize: remainingScore > disconnectedScore ? totalPot * 0.6 : room.betAmount
  });
}
```

#### 3. Oyun Başlamadan Ayrılma
```
- Oyun başlamadıysa (Ready'den önce)
- Oyuncu serbestçe ayrılabilir
- Hiçbir ceza yok
```

---

## 🎨 UI/UX Tasarımı

### Ekran Çözünürlükleri
- **1920x1080** (Full HD) - Ana hedef
- **1280x720** (HD) - Responsive destek

### Layout Yapısı

#### Ana Düzen - Split Screen
```
┌─────────────────────────────────────────────┐
│                                             │
│  👤 SOL (Aktif Oyuncu)  │  👤 SAĞ (Rakip)  │
│        50%              │       50%         │
│                         │                   │
└─────────────────────────────────────────────┘
```

#### Sol Panel (Aktif Oyuncu)
**Görüntülenen Bilgiler:**
- 🎴 **Kart sayısı** (5 veya 4, duruma göre)
- 💰 **Bet miktarı**
- ⭐ **Kazanılan tur sayısı** (örn: 2/3)
- ✅ **Ready durumu**
- ⏱️ **Kalan süre** (geri sayım)
- 🎯 **Seçilen kart** (kilitlenmiş)
- 🔄 **Deste durumu** (İlk 5 kart / Son 4 kart / Karıştırıldı)
- 📜 **Oyun geçmişi** (son 3-5 tur)

**Özel Bildirimler:**
- "⚠️ Son 4 kartınız!" (4 kart kaldığında)
- "🔄 Kartlar karıştırıldı!" (reshuffle sonrası)

**Oyun Geçmişi Görüntüleme:**
```
┌─────────────────────────────┐
│  📜 Son Turlar              │
├─────────────────────────────┤
│ Tur 5: 🔥5 vs ❄️3 → 🟢Siz  │
│ Tur 4: 💧7 vs 🔥7 → 🔴Rakip│
│ Tur 3: ❄️3 vs ❄️3 → ⚔️Draw│
└─────────────────────────────┘
```

**Not:** Oyuncular böylece hangi kartların kullanıldığını görebilirler.

#### Sağ Panel (Rakip Oyuncu)
**Görüntülenen Bilgiler:**
- 🃏 **Kart sayısı** (5, 4, 3, 2, 1) - Kartların arkası gösterilir
  - Her oyuncu kendi destesine sahip olduğundan, sadece sayı gösterilir
- ⭐ **Kazanılan tur sayısı** (örn: 1/3)
- ✅ **Ready durumu**
- 🎯 **Kart seçti mi?** (indicator - checkmark veya loading icon)

**Görüntülenmeyen:**
- ❌ Rakibin kartları (seçim yapana kadar)
- ❌ Rakibin bet miktarı (zaten aynı)
- ❌ Rakibin hangi kartları kullandığı (tur bittikten sonra sadece seçilen kart görünür)

### Kart Gösterimi

#### Kart Dizilimi
```
    🃏  🃏  🃏  🃏  🃏
     3   2   1   2   3
```
- **Oval diziliş** (poker/batak tarzı)
- Ortadaki kart hafif öne, yanlar hafif geride
- Arc (yay) şeklinde yerleşim

#### Hover Efekti
```javascript
onHover(card) {
  // Hover edilen kart
  card.translateY(-30px);
  card.scale(1.1);
  card.zIndex(10);
  
  // Diğer kartlar
  otherCards.translateY(0);
  otherCards.scale(1);
}
```

#### Kart Seçimi
```javascript
onClick(card) {
  // 1. Kart kilitlenir
  card.locked = true;
  card.glow = true; // Işıldama efekti
  
  // 2. Kartlar desteden çıkar
  allCards.animate({
    opacity: 0.3,
    disabled: true
  });
  
  // 3. Seçilen kart merkeze gelir
  selectedCard.animate({
    x: center.x,
    y: center.y,
    scale: 1.5,
    rotation: 0
  });
}
```

### Kart Savaşı Animasyonu

#### Adım 0: Özel Durumlar (Kart Dağıtımı)
```javascript
// Son 4 kart bildirimi
if (phase === 'remaining_4') {
  // Ekranın ortasında büyük bildirim
  showNotification({
    icon: '⚠️',
    message: 'Son 4 Kartınız!',
    color: 'orange',
    duration: 2000
  });
  
  // Kartlar yukarıdan aşağıya düşer (4 kart)
  animateCardDeal(cards, { 
    from: 'top',
    stagger: 100 
  });
}

// Reshuffle bildirimi
if (phase === 'reshuffled') {
  // Shuffle animasyonu
  showNotification({
    icon: '🔄',
    message: 'Kartlar Karıştırıldı!',
    color: 'blue',
    duration: 2000
  });
  
  // Kartlar dönüp karışır, sonra yeni kartlar gelir
  animateCardShuffle(() => {
    animateCardDeal(cards, { 
      from: 'center',
      stagger: 100 
    });
  });
}
```

#### Adım 1: Kart Açılma
```
Sol Oyuncu Kartı          Sağ Oyuncu Kartı
      ↓                          ↓
      🔥 Fire 5                  ❄️ Ice 3
      
Her iki kart da ekranın ortasına gelir (yan yana)
```

#### Adım 2: Kazanan Belirleme
```javascript
// Backend'den kazanan geldi
socket.on('round_result', (data) => {
  if (data.winner === 'left') {
    // Sol kazandı
    winnerCard = leftCard;
    loserCard = rightCard;
  }
});
```

#### Adım 3: Kazanan Kartın Animasyonu

**Durum 1: Kazanan Var**
```javascript
if (!isDraw) {
  // 1. Kazanan kart, kaybeden kartın üzerine gelir (0.5s)
  gsap.to(winnerCard, {
    x: loserCard.x,
    y: loserCard.y,
    duration: 0.5,
    ease: 'power2.inOut'
  });
  
  // 2. İki kart birlikte kazanan oyuncunun tarafına gider (0.8s)
  gsap.to([winnerCard, loserCard], {
    x: winnerSide.x,
    y: winnerSide.y,
    scale: 0.5,
    duration: 0.8,
    delay: 0.5
  });
  
  // 3. Kartlar kaybolur (fade out 0.3s)
  gsap.to([winnerCard, loserCard], {
    opacity: 0,
    duration: 0.3,
    delay: 1.3,
    onComplete: () => {
      // 4. Skor güncellenir (+1 animasyonu)
      updateScore(winner, '+1');
      
      // 5. Kartlar her iki oyuncunun elinden çıkar
      removeCardFromHand(winnerCard);
      removeCardFromHand(loserCard);
    }
  });
}
```

**Durum 2: Beraberlik (Aynı Kart)**
```javascript
if (isDraw) {
  // 1. Her iki kart da sarı ışıldama
  gsap.to([card1, card2], {
    filter: 'drop-shadow(0 0 20px yellow)',
    duration: 0.3,
    repeat: 3,
    yoyo: true
  });
  
  // 2. "BERABERLIK!" yazısı
  showNotification({
    icon: '⚔️',
    message: 'BERABERLIK!',
    color: 'yellow',
    duration: 1500
  });
  
  // 3. Kartlar ortada bir süre kalır (fade out)
  gsap.to([card1, card2], {
    opacity: 0.3,
    scale: 0.8,
    duration: 0.5,
    delay: 1,
    onComplete: () => {
      // 4. Kartlar her iki oyuncunun "used" pool'una gider
      // ⚠️ ÖNEMLI: Kartlar GERİ DÖNMEZ!
      // Her iki oyuncunun da el sayısı -1 azalır
      removeCardFromHand(card1);
      removeCardFromHand(card2);
      
      // 5. Oyun geçmişine kaydedilir (beraberlik olarak)
      addToRoundHistory({
        player1Card: card1,
        player2Card: card2,
        result: 'draw',
        roundNumber: currentRound
      });
      
      // 6. Yeni kart seçimi başlar
      startNewRound();
    }
  });
}
```

**ÖNEMLİ NOT - Beraberlik Mekaniği Değişikliği:**
- ❌ **ESKİ**: Kartlar geri döner, tekrar seçilebilir
- ✅ **YENİ**: Kartlar kullanılmış sayılır, her iki oyuncunun da eli -1 azalır
- **Sebep**: Aksi halde oyuncular 9 kartın hepsini kullanamazlar
- Beraberlik de bir "tur" sayılır, ama puan kazanılmaz

### Renk Paleti

```css
/* Kart Tipleri */
--fire-primary: #FF4500;      /* Ateş turuncu */
--fire-glow: #FF6347;
--ice-primary: #00BFFF;       /* Buz mavi */
--ice-glow: #87CEEB;
--water-primary: #1E90FF;     /* Su koyu mavi */
--water-glow: #4682B4;

/* UI Renkleri */
--bg-primary: #1a1a2e;        /* Koyu mavi arka plan */
--bg-secondary: #16213e;      /* Panel arka planı */
--accent-gold: #FFD700;       /* Altın vurgu */
--text-primary: #FFFFFF;
--text-secondary: #B0B0B0;

/* Durum Renkleri */
--success: #00FF00;           /* Kazanma */
--danger: #FF0000;            /* Kaybetme */
--warning: #FFA500;           /* Uyarı */
```

### UI Bileşenleri

#### 1. Lobby Ekranı
```
┌──────────────────────────────────────────────┐
│  🎮 ICE WATER FIRE                          │
├──────────────────────────────────────────────┤
│                                              │
│  ┌─────────────────┐   ┌─────────────────┐  │
│  │  🏠 Oda Kur     │   │ 🔍 Oda Bul      │  │
│  │                 │   │                 │  │
│  └─────────────────┘   └─────────────────┘  │
│                                              │
│  ┌─────────────────────────────────────────┐ │
│  │  ⚡ Hızlı Katıl                         │ │
│  └─────────────────────────────────────────┘ │
│                                              │
│  📋 Açık Odalar                              │
│  ┌────────────────────────────────────────┐  │
│  │ ABCD1234  │  0.01 ETH  │  1/2  │ 🔒?  │  │
│  │ EFGH5678  │  0.001 ETH │  1/2  │      │  │
│  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘
```

#### 2. Oyun Ekranı
```
┌──────────────────────────────────────────────────────┐
│  ⭐ 2/3               VS               ⭐ 1/3        │
├──────────────┬───────────────────────┬───────────────┤
│              │                       │               │
│              │    ⏱️ 5 saniye        │               │
│   Sizin      │                       │    Rakip      │
│   Tarafınız  │    🎴      🎴         │    Tarafı     │
│              │   (Sol)   (Sağ)       │               │
│              │                       │               │
│              │   Seçim Bekleniyor    │  Kart Sayısı  │
│              │                       │      🃏 5      │
│              │                       │               │
│  ┌────────────────────────────┐     │               │
│  │  🔥3  ❄️5  💧7  🔥5  ❄️3  │     │               │
│  │  Kartlarınız (Hover)       │     │               │
│  └────────────────────────────┘     │               │
└──────────────┴───────────────────────┴───────────────┘
```

#### 3. Sonuç Ekranı
```
┌──────────────────────────────────────┐
│                                      │
│        🏆 KAZANDINIZ! 🏆            │
│                                      │
│        Final Skor: 3-1               │
│                                      │
│   💰 Kazanç: 0.0194 ETH             │
│   (Komisyon: %3)                     │
│                                      │
│   ┌──────────┐    ┌──────────┐      │
│   │  Ana Menü │   │ Tekrar   │      │
│   └──────────┘    └──────────┘      │
│                                      │
└──────────────────────────────────────┘
```

---

## 🎬 Animasyon ve Grafik Kütüphaneleri

### Önerilen Kütüphaneler

#### 1. **Three.js** ⭐ (En Popüler)
```bash
npm install three @react-three/fiber @react-three/drei
```
**Avantajları:**
- ✅ 3D grafik desteği
- ✅ React entegrasyonu (R3F)
- ✅ Geniş topluluk
- ✅ WebGL tabanlı
- ✅ Performanslı

**Kullanım:**
```jsx
import { Canvas } from '@react-three/fiber';
import { useSpring, animated } from '@react-spring/three';

function Card3D() {
  const [spring, api] = useSpring(() => ({
    rotation: [0, 0, 0],
    position: [0, 0, 0]
  }));
  
  return (
    <animated.mesh
      rotation={spring.rotation}
      position={spring.position}
    >
      <boxGeometry />
      <meshStandardMaterial />
    </animated.mesh>
  );
}
```

#### 2. **GSAP (GreenSock)** ⭐⭐⭐ (Önerilen)
```bash
npm install gsap
```
**Avantajları:**
- ✅ En güçlü 2D animasyon kütüphanesi
- ✅ Kolay öğrenme eğrisi
- ✅ Mükemmel performans
- ✅ Timeline sistemi
- ✅ React ile sorunsuz çalışır

**Kullanım:**
```jsx
import gsap from 'gsap';
import { useRef, useEffect } from 'react';

function Card() {
  const cardRef = useRef();
  
  const handleCardSelect = () => {
    gsap.to(cardRef.current, {
      y: -50,
      scale: 1.2,
      duration: 0.3,
      ease: 'power2.out'
    });
  };
  
  return <div ref={cardRef} onClick={handleCardSelect}>🔥</div>;
}
```

#### 3. **Framer Motion** ⭐⭐ (React için ideal)
```bash
npm install framer-motion
```
**Avantajları:**
- ✅ React-first tasarım
- ✅ Declarative API
- ✅ Gesture desteği
- ✅ Layout animasyonları

**Kullanım:**
```jsx
import { motion } from 'framer-motion';

function Card() {
  return (
    <motion.div
      whileHover={{ y: -30, scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{ rotate: [0, 5, 0] }}
    >
      🔥 Fire 5
    </motion.div>
  );
}
```

#### 4. **PixiJS** (2D Game Engine)
```bash
npm install pixi.js @pixi/react
```
**Avantajları:**
- ✅ 2D oyunlar için optimize
- ✅ Sprite desteği
- ✅ Particle effects
- ✅ WebGL rendering

### Unity Entegrasyonu (Alternatif)

**Unity → WebGL Export:**
```
Unity Editor
  ↓ Build Settings
  ↓ Platform: WebGL
  ↓ Export
  ↓
React App (iframe veya window load)
```

**Zorluklar:**
- ❌ Dosya boyutu çok büyük (10-50 MB)
- ❌ Yükleme süresi uzun
- ❌ React state ile senkronizasyon zor
- ❌ WebSocket entegrasyonu karmaşık

**Sonuç:** Bu proje için **Unity kullanmanıza GEREK YOK**. GSAP + React yeterli.

### 🎯 Önerilen Stack
```
✅ GSAP (Animasyonlar için)
✅ Styled Components (Styling)
✅ React (UI)
✅ Socket.IO (Multiplayer)
✅ Ant Design (UI Components)
```

---

## 🛠️ Teknik Stack

### Frontend
```json
{
  "framework": "React 18+",
  "buildTool": "Vite",
  "language": "TypeScript",
  "styling": "Styled Components",
  "uiLibrary": "Ant Design (antd)",
  "animation": "GSAP / Framer Motion",
  "stateManagement": "React Context / Zustand",
  "networking": "Socket.IO Client"
}
```

### Backend
```json
{
  "runtime": "Node.js",
  "framework": "Express.js",
  "websocket": "Socket.IO",
  "blockchain": "ethers.js / web3.js",
  "database": "Redis (room management)",
  "language": "TypeScript"
}
```

### Smart Contract
```json
{
  "language": "Solidity ^0.8.0",
  "framework": "Hardhat",
  "libraries": "@openzeppelin/contracts",
  "network": "Abstract Chain (EVM)",
  "testing": "Hardhat + Chai"
}
```

---

## 📡 WebSocket Events

### Client → Server

#### Oda Yönetimi
```javascript
// Oda oluştur
socket.emit('create_room', {
  betAmount: 0.001,
  password: "1234", // opsiyonel
  winningScore: 3,   // opsiyonel
  address: "0x123..."
});

// Odaya katıl
socket.emit('join_room', {
  roomId: "ABCD1234",
  password: "1234", // eğer varsa
  address: "0x456..."
});

// Hızlı katıl
socket.emit('quick_join', {
  betAmount: 0.001,
  address: "0x789..."
});

// Odadan ayrıl
socket.emit('leave_room', {
  roomId: "ABCD1234",
  address: "0x123..."
});
```

#### Oyun Akışı
```javascript
// Ready butonu
socket.emit('player_ready', {
  roomId: "ABCD1234",
  address: "0x123..."
});

// Kart seç
socket.emit('select_card', {
  roomId: "ABCD1234",
  address: "0x123...",
  card: { type: "fire", value: 5 }
});

// Health check (ping)
socket.emit('ping', { timestamp: Date.now() });
```

### Server → Client

#### Oda Güncellemeleri
```javascript
// Oda oluşturuldu
socket.on('room_created', (data) => {
  // data: { roomId, shareLink, betAmount }
});

// Oyuncu katıldı
socket.on('player_joined', (data) => {
  // data: { roomId, players: [...] }
});

// Oyuncu ayrıldı
socket.on('player_left', (data) => {
  // data: { roomId, address, reason }
});

// Oda listesi (sadece 1 kişilik odalar)
socket.on('room_list', (data) => {
  // data: [
  //   { roomId, playerCount: 1, betAmount, hasPassword, createdAt },
  //   ...
  // ]
  // 
  // NOT: 2 kişilik (dolu) odalar listede GÖRÜNMEz
  // NOT: Boş odalar (0 kişi) 5 dakika sonra silinir
});
```

#### Oyun Güncellemeleri
```javascript
// Oyun başladı
socket.on('game_started', (data) => {
  // data: { roomId, cards: [...], countdown: 5 }
});

// Kart dağıtıldı (her oyuncu sadece kendi kartlarını alır)
socket.on('cards_dealt', (data) => {
  // data: { 
  //   cards: [
  //     { type: 'fire', value: 3 }, 
  //     { type: 'ice', value: 5 },
  //     ...
  //   ], // 5 adet kart (sadece bu oyuncunun kartları)
  //   phase: 'initial' | 'remaining_4' | 'reshuffled',
  //   message: 'Oyun başladı' | 'Son 4 kartınız' | 'Kartlar karıldı'
  // }
});

// Rakip kart seçti (indicator)
socket.on('opponent_selected', (data) => {
  // data: { hasSelected: true }
});

// Tur sonucu
socket.on('round_result', (data) => {
  // data: {
  //   winner: "0x123...",           // Kazanan (null ise beraberlik)
  //   yourCard: { type: 'fire', value: 5 },
  //   opponentCard: { type: 'ice', value: 3 },
  //   isDraw: false,                 // true ise aynı kart seçildi
  //   scores: { "0x123...": 2, "0x456...": 1 },
  //   result: 'player1_win' | 'player2_win' | 'draw',
  //   roundNumber: 5,
  //   cardsRemaining: { player1: 3, player2: 4 } // Kalan kart sayıları
  // }
  // 
  // NOT: Beraberlik de dahil HER durumda kartlar kullanılır (el sayısı azalır)
});

// Oyun bitti
socket.on('game_finished', (data) => {
  // data: {
  //   winner: "0x123...",
  //   finalScore: { "0x123...": 3, "0x456...": 1 },
  //   prize: 0.0194,
  //   commission: 0.0006
  // }
});

// Bağlantı kopması
socket.on('player_disconnected', (data) => {
  // data: { address, countdown: 10 }
});

// Bağlantı yeniden kuruldu
socket.on('player_reconnected', (data) => {
  // data: { address, gameState: {...} }
});

// Health check yanıtı
socket.on('pong', (data) => {
  // data: { timestamp }
});
```

#### Hata Yönetimi
```javascript
socket.on('error', (data) => {
  // data: {
  //   code: 'ROOM_FULL' | 'INVALID_BET' | 'INSUFFICIENT_BALANCE',
  //   message: 'Oda dolu'
  // }
});
```

---

## 🗂️ Room Structure

### Room Object
```javascript
{
  // Oda Bilgileri
  roomId: "ABCD1234",              // 8 karakterli benzersiz kod
  password: "mypass",              // Opsiyonel şifre (plain text, max 8 karakter)
  betAmount: 0.001,                // ETH cinsinden (min: 0.001, max: user balance)
  winningScore: 3,                 // İlk kaç tur kazanan kazanır (default: 3)
  createdAt: new Date(),
  
  // Oyuncu Bilgileri
  players: [
    {
      socketId: "abc123",          // Socket.IO ID
      address: "0x123...",         // Wallet address
      ready: false,                // Ready butonu
      roundsWon: 0,                // Kazanılan tur sayısı
      hand: [],                    // Elindeki 5 kart (sadece bu oyuncuya gönderilir)
      selectedCard: null,          // Seçilen kart (bu turda)
      isConnected: true,           // Bağlantı durumu
      lastPing: new Date(),        // Son ping zamanı
      disconnectedAt: null         // Bağlantı kopma zamanı
    },
    {
      socketId: "def456",
      address: "0x456...",
      ready: false,
      roundsWon: 0,
      hand: [],
      selectedCard: null,
      isConnected: true,
      lastPing: new Date(),
      disconnectedAt: null
    }
  ],
  
  // Oyun Durumu
  gameState: "waiting",            // waiting, ready, playing, paused, finished
  currentRound: 1,                 // Aktif tur numarası
  
  // Her oyuncunun kendi destesi
  player1Deck: {
    remaining: [],                 // Kalan 4 kart
    used: [],                      // Kullanılmış kartlar
    inHand: []                     // Eldeki 5 kart
  },
  player2Deck: {
    remaining: [],                 // Kalan 4 kart
    used: [],                      // Kullanılmış kartlar
    inHand: []                     // Eldeki 5 kart
  },
  
  // Oyun Geçmişi (Round History)
  roundHistory: [
    {
      roundNumber: 1,
      player1Card: { type: 'fire', value: 5, id: 'fire_5' },
      player2Card: { type: 'ice', value: 3, id: 'ice_3' },
      winner: '0x123...',           // veya null (beraberlik)
      result: 'player1_win' | 'player2_win' | 'draw',
      timestamp: new Date()
    },
    // ... her tur için bir kayıt
  ],
  
  // Session Tokens (Reconnect için)
  sessionTokens: {
    '0x123...': 'jwt_token_abc123',
    '0x456...': 'jwt_token_def456'
  },
  
  // Sonuç
  winner: null,                    // Kazanan oyuncu address
  finalScore: null,                // { '0x123...': 3, '0x456...': 1 }
  leaderboardPoints: null,         // { '0x123...': 7, '0x456...': 0 } (3-0 → 7pts)
  finishedAt: null,                // Oyun bitiş zamanı
  
  // Metadata
  isPublic: true,                  // Oda listesinde görünsün mü
  spectatorCount: 0                // İzleyici sayısı (şu an 0, gelecekte eklenebilir)
}
```

### Card Object
```javascript
{
  type: "fire",      // "fire", "ice", "water"
  value: 5,          // 3, 5, 7
  id: "fire_5"       // Benzersiz ID
}
```

### Deste Yönetimi Örnek Kod
```javascript
// Her oyuncu için 9 kartlık deste oluştur
function createDeck() {
  const types = ['fire', 'ice', 'water'];
  const values = [3, 5, 7];
  const deck = [];
  
  types.forEach(type => {
    values.forEach(value => {
      deck.push({
        type,
        value,
        id: `${type}_${value}`
      });
    });
  });
  
  return deck; // [fire_3, fire_5, fire_7, ice_3, ...]
}

// Kartları karıştır ve 5 kart dağıt
function dealCards(deck) {
  const shuffled = [...deck].sort(() => Math.random() - 0.5);
  const hand = shuffled.slice(0, 5);      // İlk 5 kart ele
  const remaining = shuffled.slice(5);    // Kalan 4 kart
  
  return { hand, remaining };
}

// Oyun başlangıcı
function initializeGame() {
  const player1Deck = createDeck();
  const player2Deck = createDeck();
  
  const player1Cards = dealCards(player1Deck);
  const player2Cards = dealCards(player2Deck);
  
  return {
    player1: {
      inHand: player1Cards.hand,
      remaining: player1Cards.remaining,
      used: []
    },
    player2: {
      inHand: player2Cards.hand,
      remaining: player2Cards.remaining,
      used: []
    }
  };
}

// Kart kullanımı ve yeniden dağıtım
function handleCardUsed(player, usedCard, isDraw) {
  // ⚠️ ÖNEMLİ: Beraberlik de dahil BÜTÜN durumlarda kart kullanılır
  player.used.push(usedCard);
  player.inHand = player.inHand.filter(c => c.id !== usedCard.id);
  
  // Eli boşsa yeni kart ver
  if (player.inHand.length === 0) {
    if (player.remaining.length > 0) {
      // AŞAMA 1: Son 4 kartı ver
      player.inHand = player.remaining;
      player.remaining = [];
      return { phase: 'remaining_4', cards: player.inHand };
      
    } else if (player.used.length === 9) {
      // AŞAMA 2: Tüm kartlar bitti, reshuffle
      const shuffled = shuffle(player.used);
      player.inHand = shuffled.slice(0, 5);
      player.remaining = shuffled.slice(5);
      player.used = [];
      return { phase: 'reshuffled', cards: player.inHand };
    }
  }
  
  return null; // Henüz yeni kart verme zamanı değil
}
```

### Kazanma Algoritması Örnek Kod
```javascript
// Kartları karşılaştır ve kazananı bul
function determineWinner(card1, card2) {
  // Beraberlik kontrolü
  if (card1.type === card2.type && card1.value === card2.value) {
    return {
      isDraw: true,
      winner: null,
      reason: 'same_card'
    };
  }
  
  // Tip üstünlüğü
  const advantages = {
    fire: 'ice',
    water: 'fire',
    ice: 'water'
  };
  
  // Card1 tip üstünlüğüne sahip mi?
  if (advantages[card1.type] === card2.type) {
    return {
      isDraw: false,
      winner: 'player1',
      reason: 'type_advantage'
    };
  }
  
  // Card2 tip üstünlüğüne sahip mi?
  if (advantages[card2.type] === card1.type) {
    return {
      isDraw: false,
      winner: 'player2',
      reason: 'type_advantage'
    };
  }
  
  // Aynı tip - değer karşılaştırması
  if (card1.type === card2.type) {
    if (card1.value > card2.value) {
      return {
        isDraw: false,
        winner: 'player1',
        reason: 'higher_value'
      };
    } else {
      return {
        isDraw: false,
        winner: 'player2',
        reason: 'higher_value'
      };
    }
  }
}

// Kullanım örneği
const result = determineWinner(
  { type: 'fire', value: 5 },
  { type: 'ice', value: 7 }
);
// Sonuç: { isDraw: false, winner: 'player1', reason: 'type_advantage' }
```

### Game State Transitions
```
waiting → ready → playing → finished
          ↓         ↓
        paused ← playing (bağlantı koptu)
          ↓
        playing (reconnect)
```

---

## 💰 Komisyon Sistemi

### Nasıl Çalışır?
```javascript
// Backend'de hesaplama yapılır
function calculateCommission(totalPot) {
  const COMMISSION_RATE = 0.03; // %3
  const commission = totalPot * COMMISSION_RATE;
  const winnerAmount = totalPot - commission;
  
  return {
    commission,      // 0.0006 ETH (0.02 * 0.03)
    winnerAmount,    // 0.0194 ETH
    commissionRate: '3%'
  };
}

// Contract'a güncelleme
async function updateContractBalances(winner, loser, betAmount) {
  const totalPot = betAmount * 2;
  const { commission, winnerAmount } = calculateCommission(totalPot);
  
  // Backend'den contract'a updateBalances çağrısı
  await contract.updateBalances([
    { address: winner, amount: winnerAmount },  // Kazanan
    { address: loser, amount: 0 }               // Kaybeden
  ]);
  
  // Komisyon contract'ta kalır (otomatik)
}
```

### Özellikler
- ✅ Komisyon backend'de hesaplanır
- ✅ Contract'a `updateBalances` ile gönderilir
- ✅ Minimum komisyon limiti **yok**
- ✅ Komisyon contract'ta birikir (owner çekebilir)

---

## 🏆 Leaderboard Sistemi

### Veritabanı: PostgreSQL

```sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  address VARCHAR(42) NOT NULL UNIQUE,
  total_points INT DEFAULT 0,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  draws INT DEFAULT 0,
  total_games INT DEFAULT 0,
  last_game_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_leaderboard_points ON leaderboard(total_points DESC);
```

### Puan Sistemi
| Final Skor | Kazanan Puanı | Açıklama |
|------------|---------------|----------|
| 3-0 | **7 puan** | Ezici zafer |
| 3-1 | **5 puan** | Rahat galibiyet |
| 3-2 | **3 puan** | Çekişmeli maç |

**Kaybeden:** 0 puan

### Oyun Sonu İşlemleri
```javascript
async function updateLeaderboard(winner, loser, finalScore) {
  const winnerScore = finalScore[winner];
  const loserScore = finalScore[loser];
  
  let points = 0;
  if (winnerScore === 3 && loserScore === 0) points = 7; // 3-0
  else if (winnerScore === 3 && loserScore === 1) points = 5; // 3-1
  else if (winnerScore === 3 && loserScore === 2) points = 3; // 3-2
  
  // PostgreSQL'e kaydet
  await db.query(`
    INSERT INTO leaderboard (address, total_points, wins, total_games)
    VALUES ($1, $2, 1, 1)
    ON CONFLICT (address) 
    DO UPDATE SET 
      total_points = leaderboard.total_points + $2,
      wins = leaderboard.wins + 1,
      total_games = leaderboard.total_games + 1,
      last_game_at = NOW()
  `, [winner, points]);
  
  // Kaybeden de kaydedilir (0 puan)
  await db.query(`
    INSERT INTO leaderboard (address, losses, total_games)
    VALUES ($1, 1, 1)
    ON CONFLICT (address)
    DO UPDATE SET
      losses = leaderboard.losses + 1,
      total_games = leaderboard.total_games + 1,
      last_game_at = NOW()
  `, [loser]);
}
```

### Leaderboard Görüntüleme
```javascript
// Top 100 oyuncu
socket.emit('get_leaderboard', { limit: 100 });

socket.on('leaderboard_data', (data) => {
  // data: [
  //   { rank: 1, address: '0x123...', points: 523, wins: 87, losses: 12 },
  //   { rank: 2, address: '0x456...', points: 491, wins: 79, losses: 18 },
  //   ...
  // ]
});
```

---

## 😊 Emoji Sistemi

### Kullanılabilir Emojiler (3-5 adet)
```javascript
const AVAILABLE_EMOJIS = [
  { id: 'fire', emoji: '🔥', label: 'Ateş!' },
  { id: 'ice', emoji: '❄️', label: 'Soğuk!' },
  { id: 'gg', emoji: '👍', label: 'İyi Oyun' },
  { id: 'thinking', emoji: '🤔', label: 'Düşünüyorum' },
  { id: 'clap', emoji: '👏', label: 'Alkış' }
];
```

### Nasıl Çalışır?
```javascript
// Emoji gönder
socket.emit('send_emoji', {
  roomId: 'ABCD1234',
  emojiId: 'fire'
});

// Emoji al (rakip görür)
socket.on('emoji_received', (data) => {
  // data: { from: '0x123...', emoji: '🔥', timestamp: Date }
  
  // Ekranda göster (2 saniye)
  showEmojiAnimation(data.emoji, 'opponent_side', 2000);
});
```

### UI Yerleşimi
```
┌──────────────────────────────────┐
│  Sizin Tarafınız │  Rakip Tarafı │
│                   │               │
│  🔥❄️👍🤔👏      │      🔥       │ ← Rakip emoji gönderdi
│  (Emoji Bar)      │   (Animasyon)  │
└──────────────────────────────────┘
```

---

## 🔐 Güvenlik Sistemi

### Problem
Postman gibi araçlarla WebSocket isteklerinin kopyalanması ve sahte istekler gönderilmesi.

### Çözüm: Multi-Layer Security

#### 1. API Secret Key (Backend Environment)
```javascript
// .env
API_SECRET_KEY=your_secret_key_here_change_in_production

// Backend
const API_SECRET = process.env.API_SECRET_KEY;
```

#### 2. JWT Token Authentication
```javascript
// Frontend: Oyun başlarken JWT oluştur
async function joinRoom(roomId, userAddress) {
  // Backend'den JWT token al
  const response = await fetch('/api/game/join', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Secret': API_SECRET // Frontend'de environment'tan
    },
    body: JSON.stringify({ roomId, address: userAddress })
  });
  
  const { token } = await response.json();
  
  // LocalStorage'a kaydet
  localStorage.setItem('gameToken', token);
  
  // WebSocket bağlantısında kullan
  socket.emit('authenticate', { token });
}
```

#### 3. Wallet Signature Verification
```javascript
// Her kritik işlemde wallet signature iste
async function playCard(card) {
  // Message oluştur
  const message = `Play card: ${card.id} at ${Date.now()}`;
  
  // Wallet ile imzala
  const signature = await ethereum.request({
    method: 'personal_sign',
    params: [message, userAddress]
  });
  
  // Backend'e gönder
  socket.emit('select_card', {
    card,
    signature,
    message
  });
}

// Backend: Signature doğrula
socket.on('select_card', async (data) => {
  const { card, signature, message } = data;
  
  // Signature verify
  const recoveredAddress = ethers.utils.verifyMessage(message, signature);
  
  if (recoveredAddress.toLowerCase() !== player.address.toLowerCase()) {
    socket.emit('error', { code: 'INVALID_SIGNATURE' });
    return;
  }
  
  // Timestamp kontrolü (5 saniye içinde olmalı)
  const timestamp = parseInt(message.split(' ').pop());
  if (Date.now() - timestamp > 5000) {
    socket.emit('error', { code: 'SIGNATURE_EXPIRED' });
    return;
  }
  
  // İşlemi gerçekleştir
  handleCardSelection(socket, card);
});
```

#### 4. Rate Limiting ✅
```javascript
// express-rate-limit
const rateLimit = require('express-rate-limit');

// IP bazlı rate limiting
const ipLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 dakika
  max: 100, // Maksimum 100 istek
  message: 'Çok fazla istek gönderdiniz. Lütfen bekleyin.',
  
  // Limite takılanları kaydet
  handler: (req, res) => {
    const ip = req.ip;
    banIP(ip, 60 * 60 * 1000); // 1 saat ban
    
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Çok fazla istek gönderildi. 1 saat engellendiniz.',
      bannedUntil: Date.now() + (60 * 60 * 1000)
    });
  }
});

// Address bazlı rate limiting
const addressLimiter = new Map(); // { address: { count, lastReset, bannedUntil } }

function checkAddressLimit(address) {
  const now = Date.now();
  const userData = addressLimiter.get(address) || { count: 0, lastReset: now, bannedUntil: null };
  
  // Ban kontrolü
  if (userData.bannedUntil && now < userData.bannedUntil) {
    const remainingTime = Math.ceil((userData.bannedUntil - now) / 1000 / 60); // dakika
    throw new Error(`Bu adres ${remainingTime} dakika daha engellenmiştir.`);
  }
  
  // 1 dakika geçtiyse reset
  if (now - userData.lastReset > 60000) {
    userData.count = 0;
    userData.lastReset = now;
  }
  
  userData.count++;
  
  // 100 istek limiti
  if (userData.count > 100) {
    userData.bannedUntil = now + (60 * 60 * 1000); // 1 saat ban
    addressLimiter.set(address, userData);
    throw new Error('Bu adres 1 saat engellenmiştir.');
  }
  
  addressLimiter.set(address, userData);
}

app.use('/api/game/', ipLimiter);

// Socket.IO için
socket.on('*', (data) => {
  checkAddressLimit(data.address);
  // ... devam et
});
```

**Özellikler:**
- ✅ **IP bazlı** rate limiting (100 req/min)
- ✅ **Address bazlı** rate limiting (100 req/min)
- ✅ **1 saat ban** (hem IP hem address)
- ✅ Ban süresi bilgisi döndürülür

#### 5. Socket.IO Room Verification
```javascript
// Her socket event'inde oda kontrolü
socket.on('select_card', (data) => {
  const room = rooms.get(data.roomId);
  
  // Oda var mı?
  if (!room) {
    return socket.emit('error', { code: 'ROOM_NOT_FOUND' });
  }
  
  // Oyuncu bu odada mı?
  const player = room.players.find(p => p.socketId === socket.id);
  if (!player) {
    return socket.emit('error', { code: 'NOT_IN_ROOM' });
  }
  
  // Oyun devam ediyor mu?
  if (room.gameState !== 'playing') {
    return socket.emit('error', { code: 'GAME_NOT_PLAYING' });
  }
  
  // İşlemi gerçekleştir
  handleCardSelection(socket, data.card);
});
```

### Güvenlik Katmanları Özeti
```
Layer 1: API Secret Key (Environment)
Layer 2: JWT Token (Session Authentication)
Layer 3: Wallet Signature (Action Verification)
Layer 4: Rate Limiting (DDoS Prevention)
Layer 5: Room Verification (Authorization)
```

---

## 📱 Mobil Destek & Touch Controls

### Responsive Breakpoints
```css
/* Desktop */
@media (min-width: 1280px) {
  /* 1920x1080 veya 1280x720 */
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1279px) {
  /* iPad, Tablet */
}

/* Mobile */
@media (max-width: 767px) {
  /* iPhone, Android */
  .game-container {
    flex-direction: column; /* Dikey yerleşim */
  }
}
```

### Touch Events
```javascript
// React Touch Events
function Card({ card, onSelect }) {
  const [touchStart, setTouchStart] = useState(null);
  
  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e) => {
    if (!touchStart) return;
    
    const touchEnd = e.touches[0].clientY;
    const diff = touchStart - touchEnd;
    
    // Yukarı kaydırma (>50px)
    if (diff > 50) {
      onSelect(card);
      setTouchStart(null);
    }
  };
  
  return (
    <div
      className="card"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setTouchStart(null)}
      onClick={() => onSelect(card)} // Desktop için
    >
      {card.type} {card.value}
    </div>
  );
}
```

### Mobil UI Düzenlemesi
```
Desktop (Yatay):
┌────────────────────────────┐
│  Sol (You)  │  Sağ (Opp)  │
└────────────────────────────┘

Mobile (Dikey):
┌──────────────┐
│  Rakip       │ (Üst)
├──────────────┤
│  Kartlar     │ (Orta)
├──────────────┤
│  Siz         │ (Alt)
└──────────────┘
```

### Touch Gestures
- **Swipe Up:** Kart seç
- **Tap:** Bilgi göster
- **Long Press:** Kart detayları
- **Pinch:** Zoom (opsiyonel)

---

## 🔄 Reconnect & Session Sistemi

### JWT Session Management

#### Token Oluşturma (Backend)
```javascript
const jwt = require('jsonwebtoken');

function createGameSession(roomId, playerAddress) {
  const token = jwt.sign(
    {
      roomId,
      address: playerAddress,
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 2) // 2 saat
    },
    process.env.JWT_SECRET
  );
  
  return token;
}

// Odaya katılırken token oluştur
socket.on('join_room', async (data) => {
  // ... oda işlemleri ...
  
  const token = createGameSession(roomId, data.address);
  
  // Token'ı room'a kaydet
  room.sessionTokens[data.address] = token;
  
  // Client'a gönder
  socket.emit('session_created', { token });
});
```

#### Token Saklama (Frontend)
```javascript
// LocalStorage'a kaydet
socket.on('session_created', ({ token }) => {
  localStorage.setItem('iwf_game_token', token);
  localStorage.setItem('iwf_room_id', roomId);
});

// Sayfa yüklendiğinde kontrol et
useEffect(() => {
  const token = localStorage.getItem('iwf_game_token');
  const roomId = localStorage.getItem('iwf_room_id');
  
  if (token && roomId) {
    // Token geçerli mi kontrol et
    verifyAndReconnect(token, roomId);
  }
}, []);
```

#### Reconnect Logic
```javascript
async function verifyAndReconnect(token, roomId) {
  try {
    // 1. Token'ı doğrula
    const response = await fetch('/api/game/verify-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, roomId })
    });
    
    const { valid, gameState } = await response.json();
    
    if (!valid) {
      // Token geçersiz, temizle
      localStorage.removeItem('iwf_game_token');
      localStorage.removeItem('iwf_room_id');
      return;
    }
    
    // 2. Oyun bitti mi kontrol et
    if (gameState === 'finished') {
      localStorage.removeItem('iwf_game_token');
      localStorage.removeItem('iwf_room_id');
      navigate('/game/result');
      return;
    }
    
    // 3. Oyun devam ediyorsa reconnect
    if (gameState === 'playing' || gameState === 'paused') {
      socket.emit('reconnect_game', { token, roomId });
      
      socket.on('reconnect_success', (roomData) => {
        // Oyun durumunu restore et
        navigate(`/game/room/${roomId}`);
        restoreGameState(roomData);
      });
    }
    
  } catch (error) {
    console.error('Reconnect failed:', error);
  }
}
```

### Oda Destroy Logic
```javascript
socket.on('disconnect', () => {
  const room = getRoomBySocketId(socket.id);
  if (!room) return;
  
  const remainingPlayers = room.players.filter(p => p.socketId !== socket.id);
  
  if (remainingPlayers.length === 0) {
    // Odada kimse kalmadı, destroy et
    rooms.delete(room.roomId);
    console.log(`Room ${room.roomId} destroyed`);
    
    // Oda listesini güncelle
    broadcastRoomList();
    
  } else if (remainingPlayers.length === 1) {
    // 1 kişi kaldı, oda devam eder ve LİSTELENİR
    room.players = remainingPlayers;
    room.gameState = 'paused';
    
    // Oda listesine ekle
    broadcastRoomList();
    
    // 10 saniye timeout başlat
    startDisconnectTimeout(room, socket.id);
  } else {
    // 2 kişi varsa zaten oyun devam ediyor
    room.gameState = 'paused';
    startDisconnectTimeout(room, socket.id);
  }
});

// Oda listesi broadcast (sadece 1 kişilik odalar)
function broadcastRoomList() {
  const availableRooms = Array.from(rooms.values())
    .filter(room => 
      room.players.length === 1 &&  // Sadece 1 kişilik
      room.gameState === 'waiting'  // Oyun başlamamış
    )
    .map(room => ({
      roomId: room.roomId,
      playerCount: room.players.length,
      betAmount: room.betAmount,
      hasPassword: !!room.password,
      createdAt: room.createdAt
    }))
    .sort((a, b) => b.createdAt - a.createdAt); // Yeniden eskiye
  
  io.emit('room_list', availableRooms);
}

// 2. oyuncu katıldığında oda listeden kaldırılır
socket.on('join_room', (data) => {
  const room = rooms.get(data.roomId);
  
  // ... oda join logic ...
  
  if (room.players.length === 2) {
    // Oda doldu, listeden kaldır
    broadcastRoomList();
  }
});

// Boş odaları temizle (5 dakika)
setInterval(() => {
  const now = Date.now();
  const FIVE_MINUTES = 5 * 60 * 1000;
  
  rooms.forEach((room, roomId) => {
    if (room.players.length === 0 && (now - room.createdAt) > FIVE_MINUTES) {
      rooms.delete(roomId);
      console.log(`Empty room ${roomId} deleted after 5 minutes`);
    }
  });
  
  broadcastRoomList();
}, 60000); // Her 1 dakikada kontrol et
```

**Oda Listeleme Kuralları:**
- ✅ Sadece **1 kişilik** odalar gösterilir
- ✅ **2 kişilik** (dolu) odalar listede görünmez
- ✅ **Boş** odalar 5 dakika sonra silinir
- ✅ Yeniden eskiye sıralı

---

## 🚨 Eksik ve Düzeltilmesi Gereken Noktalar

### ❗ Kritik Sorunlar

#### 1. AFK Punishment ✅
**Problem:**
- Oyuncu kasıtlı olarak zaman dolmasını bekleyebilir
- Sistem rastgele kart seçerse, AFK oyuncu haksız kazanabilir

**Çözüm:**
```javascript
// 3 kez üst üste kart seçmezse otomatik forfeit
let afkCount = 0;

socket.on('card_selection_timeout', (data) => {
  afkCount++;
  
  if (afkCount >= 3) {
    // Oyuncu hükmen mağlup sayılır
    forfeitGame(data.roomId, data.playerId);
    
    // Rakip kazanır
    const opponent = getOpponent(data.roomId, data.playerId);
    endGame(data.roomId, opponent, 'afk_forfeit');
    
    // AFK oyuncunun bet miktarı contract'a gider
    await contract.updateBalance(data.playerAddress, -betAmount);
    
  } else {
    // İlk 2 timeout: Uyarı ver
    socket.emit('afk_warning', {
      message: `Dikkat! ${3 - afkCount} tur daha seçim yapmazsanız yenilirsiniz.`,
      warningCount: afkCount
    });
    
    // Rastgele kart seçimi YOK
    // Tur atlanır, puan rakibe verilir
    givePointToOpponent(data.roomId, data.playerId);
  }
});
```

**Özellikler:**
- ✅ İlk 2 timeout: Rakip otomatik puan kazanır
- ✅ 3. timeout: Hükmen mağlubiyet
- ✅ Bet miktarı contract'a aktarılır (ceza)
- ❌ Rastgele kart seçimi YOK (haksız avantaj önlenir)

### ✅ Netleştirilmiş Detaylar

#### 1. Komisyon Sistemi ✅
- %3 komisyon **backend'de** hesaplanır
- Contract'a `updateBalances` ile gönderilir
- **Minimum komisyon yok**

#### 2. Şifre Güvenliği ✅
- **Plain text** (hash yok)
- **Maksimum 8 karakter**
- **Deneme limiti yok** (arkadaşlar arası oyun için)

#### 3. Bet Limitleri ✅
- **Minimum:** 0.001 ETH
- **Maksimum:** Kullanıcının contract bakiyesi
- **Presets:** 0.001, 0.01, 0.1 ETH + Custom input

#### 4. Reconnect Mekanizması ✅
- **JWT token** + LocalStorage
- Sayfa yenilendiğinde otomatik reconnect
- Token 2 saat geçerli
- Oda solo kalırsa destroy, değilse devam

#### 5. Spectator Mode ❌
- **Yok**, gelecekte de eklenmeyecek
- **Replay yok**
- Sadece oyun sırasında geçmiş kartlar görünür

#### 6. Chat Sistemi ❌ / Emoji Sistemi ✅
- **Chat yok**
- **Emoji var:** 3-5 adet preset emoji
- Rakip tarafta animasyon ile gösterilir

### 🎨 UI/UX İyileştirmeleri

#### 1. Loading States
- Oyun başlarken loading animation
- Kart dağılırken animasyon
- Rakip beklenirken placeholder

#### 2. Sound Effects ✅ (Düşük Öncelik)

**Gerekli Ses Efektleri:**
```javascript
const SOUND_EFFECTS = {
  // Oyun Akışı
  cardSelect: 'card_select.mp3',        // Kart seçildiğinde
  cardReveal: 'card_reveal.mp3',        // Kartlar açıldığında
  
  // Sonuçlar
  roundWin: 'round_win.mp3',            // Tur kazanıldığında
  roundLose: 'round_lose.mp3',          // Tur kaybedildiğinde
  roundDraw: 'round_draw.mp3',          // Beraberlik
  
  // Oyun Sonu
  gameWin: 'game_win.mp3',              // Oyun kazanıldığında (3 tur)
  gameLose: 'game_lose.mp3',            // Oyun kaybedildiğinde
  
  // UI İnteraksiyonları
  buttonClick: 'button_click.mp3',      // Ready, Oda Kur, Katıl butonları
  roomJoin: 'room_join.mp3',            // Odaya katılım
  roomCreate: 'room_create.mp3',        // Oda oluşturma
  
  // Diğer
  notification: 'notification.mp3',     // Genel bildirimler
  countdown: 'countdown.mp3',           // Geri sayım (son 3 saniye)
  emoji: 'emoji.mp3'                    // Emoji gönderme
};
```

**Ses Kontrolleri:**
```javascript
// Volume slider (0-100)
const [volume, setVolume] = useState(50);

// Mute toggle
const [isMuted, setIsMuted] = useState(false);

// LocalStorage persistence
localStorage.setItem('game_volume', volume);
localStorage.setItem('game_muted', isMuted);
```

**Önerilen Kütüphane:**
- `howler.js` - Hafif ve güçlü (oyunlar için ideal)
- `react-use-sound` - React hook wrapper

**Öncelik:** 🟢 Düşük (İlk versiyonda opsiyonel)

#### 3. Tutorial/Onboarding ✅

**Tasarım:**
- **Tek sayfalık görsel modal** (infographic style)
- İlk giriş yapanlara otomatik gösterilir
- "Tekrar Gösterme" checkbox'ı

**İçerik:**
```
┌────────────────────────────────────┐
│  🎮 Ice Water Fire Nasıl Oynanır  │
├────────────────────────────────────┤
│                                    │
│  [Görsel 1: Kart Tipleri]         │
│  🔥 Fire > ❄️ Ice                 │
│  💧 Water > 🔥 Fire                │
│  ❄️ Ice > 💧 Water                │
│                                    │
│  [Görsel 2: Oyun Akışı]           │
│  1. 5 kart dağıtılır               │
│  2. Kart seç (5 saniye)            │
│  3. İlk 3 tur kazanan oyunu kazanır│
│                                    │
│  [Görsel 3: Özel Kurallar]        │
│  • Beraberlik = Kart gider         │
│  • 15. round = Önde olan kazanır   │
│  • 3x AFK = Forfeit                │
│                                    │
│  [✅ Anladım, Başlayalım!]        │
│  [ ] Tekrar gösterme               │
└────────────────────────────────────┘
```

**Uygulama:**
```javascript
useEffect(() => {
  const hasSeenTutorial = localStorage.getItem('iwf_tutorial_seen');
  
  if (!hasSeenTutorial) {
    setShowTutorialModal(true);
  }
}, []);

const handleCloseTutorial = (dontShowAgain) => {
  if (dontShowAgain) {
    localStorage.setItem('iwf_tutorial_seen', 'true');
  }
  setShowTutorialModal(false);
};
```

**Erişim:**
- Ana menüde "❓ Nasıl Oynanır?" butonu
- Header'da "?" icon
- İstediği zaman tekrar açılabilir

#### 4. Mobil Destek ✅
- **Desktop:** 1920x1080 ve 1280x720
- **Mobil:** Responsive (dikey layout)
- **Touch controls:** Swipe up = kart seç
- **Breakpoints:** 1280px, 768px, 767px ve altı

#### 5. Accessibility
- Colorblind mode (renk körlüğü)
- Font size ayarları
- Keyboard shortcuts

### 🔐 Güvenlik Endişeleri ✅

#### 1. Frontend Güvenlik ✅
- **Multi-layer security** sistemi kuruldu:
  - Layer 1: API Secret Key
  - Layer 2: JWT Token
  - Layer 3: Wallet Signature
  - Layer 4: Rate Limiting
  - Layer 5: Room Verification

#### 2. Cheat Prevention ✅
- Kartlar backend'de tutulur
- Her kart seçiminde **wallet signature** zorunlu
- **Timestamp** kontrolü (5 saniye)
- Rate limiting (1 dk / 100 istek)

#### 3. Smart Contract Security 🔜
- Reentrancy guard eklenecek
- Access control (onlyOwner)
- Emergency pause mechanism
- **Not:** Contract örneği var, birlikte yazılacak

#### 4. Deployment Strategy ✅

**Network:**
- **Test:** Abstract Chain Testnet
- **Production:** Abstract Chain Mainnet

**Deployment Akışı:**
```
1. Local Development
   ├─ Smart contract yazımı ve test
   ├─ Backend implementasyonu
   ├─ Frontend implementasyonu
   └─ Entegrasyon testleri

2. Testnet Deployment
   ├─ Contract deploy (Abstract Testnet)
   ├─ Backend + Frontend local test
   ├─ End-to-end testing
   └─ Bug fixes

3. Docker Containerization
   ├─ Dockerfile (backend)
   ├─ Dockerfile (frontend)
   ├─ docker-compose.yml
   └─ Environment variables

4. Server Deployment
   ├─ Server'a docker images push
   ├─ Docker-compose up
   └─ Health check

5. Mainnet Deployment
   ├─ Contract deploy (Abstract Mainnet)
   ├─ Backend environment update
   ├─ Frontend environment update
   └─ Production release
```

**Docker Yapısı:**
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
      - JWT_SECRET=${JWT_SECRET}
      - DATABASE_URL=${DATABASE_URL}
    depends_on:
      - postgres
    restart: always
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    environment:
      - REACT_APP_API_URL=${API_URL}
      - REACT_APP_CONTRACT_ADDRESS=${CONTRACT_ADDRESS}
    restart: always
  
  postgres:
    image: postgres:15
    environment:
      - POSTGRES_DB=iwf_game
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always

volumes:
  postgres_data:
```

**Deployment Checklist:**
- [ ] Smart contract audit (opsiyonel testnet için)
- [ ] Environment variables güvenliği
- [ ] SSL certificate (HTTPS)
- [ ] Database backup stratejisi
- [ ] Monitoring ve logging (PM2, Winston)
- [ ] Error tracking (Sentry)
- [ ] Analytics (optional)

---

## 📝 Öncelikli TODO Listesi

### 🔴 Yüksek Öncelik
- [ ] Room structure'ı WebSocket ile entegre et
  - [ ] Round history sistemi
  - [ ] Session tokens (JWT)
  - [ ] Leaderboard entegrasyonu
- [ ] Her oyuncu için ayrı deste yönetim sistemi kur
  - [ ] İlk 5 kart dağıtımı
  - [ ] Kalan 4 kart dağıtımı (kullanılmamış kartlar)
  - [ ] Reshuffle mekanizması (9 kart bitti)
  - [ ] Beraberlik durumunda kartların used pool'una gitmesi
- [ ] Backend API endpoints'lerini tanımla
- [ ] Smart contract'ı yaz ve test et (örnek var)
- [ ] Kazanma koşulları algoritmasını kod olarak yaz
- [ ] Güvenlik sistemini implement et (JWT + Signature)
- [ ] PostgreSQL leaderboard tablosunu oluştur

### 🟡 Orta Öncelik
- [ ] GSAP animasyon sistemi kur
  - [ ] Kart seçimi animasyonu
  - [ ] Beraberlik animasyonu (kartlar fade out → used pool)
  - [ ] Kazanan animasyonu (kartlar kaybolur)
  - [ ] "Son 4 kartınız!" bildirim animasyonu
  - [ ] "Kartlar karıştırıldı!" shuffle animasyonu
  - [ ] Emoji animasyonları
- [ ] UI component'lerini oluştur (Card, Room, Lobby)
- [ ] Socket.IO event'lerini implement et
  - [ ] cards_dealt (phase: initial/remaining_4/reshuffled)
  - [ ] round_result (isDraw, cardsRemoved)
  - [ ] send_emoji / emoji_received
- [ ] Health check mekanizmasını kur
- [ ] Reconnect logic'i yaz (JWT + LocalStorage)
- [ ] Mobil responsive layout

### 🟢 Düşük Öncelik
- [ ] Sound effects ekle
- [ ] Tutorial modal'ı yap
- [ ] Leaderboard sistemi
- [ ] Chat sistemi
- [ ] Mobil responsive

---

## 📚 Kaynaklar

### Animasyon Öğrenme
- [GSAP Docs](https://greensock.com/docs/)
- [Framer Motion](https://www.framer.com/motion/)
- [Three.js Journey](https://threejs-journey.com/)

### WebSocket
- [Socket.IO Docs](https://socket.io/docs/v4/)
- [Multiplayer Game Tutorial](https://www.youtube.com/watch?v=PfSwUOBL1YQ)

### Smart Contracts
- [Hardhat Tutorial](https://hardhat.org/tutorial)
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/)

---

## 🎯 Sonuç

Bu dokümantasyon, **Ice Water Fire** oyununun teknik ve tasarım detaylarını içermektedir. 

**✅ Tamamlanan Sistem Güncellemeleri:**

### 🎴 Kart Sistemi
- ✅ Her oyuncunun kendi 9 kartlık destesi
- ✅ İki aşamalı dağıtım (5 kart → 4 kart → reshuffle)
- ✅ Beraberlik mekanizması (kartlar used pool'a gider)
- ✅ Round history sistemi

### 💰 Ekonomi & Komisyon
- ✅ %3 komisyon (backend'de hesaplanır)
- ✅ Bet limitleri (min: 0.001 ETH, max: user balance)
- ✅ Disconnect durumunda ödeme kuralları

### 🔐 Güvenlik
- ✅ Multi-layer security (5 katman)
- ✅ JWT + Wallet Signature
- ✅ Rate limiting
- ✅ Room verification

### 🏆 Sosyal Özellikler
- ✅ Leaderboard sistemi (PostgreSQL)
- ✅ Puan sistemi (3-0 → 7pt, 3-1 → 5pt, 3-2 → 3pt)
- ✅ Emoji sistemi (3-5 adet)

### 📱 Platform Desteği
- ✅ Desktop (1920x1080, 1280x720)
- ✅ Mobil (responsive, touch controls)
- ✅ Swipe up = kart seç

### 🔄 Session Management
- ✅ JWT token (2 saat geçerli)
- ✅ LocalStorage persistence
- ✅ Otomatik reconnect
- ✅ Oda destroy logic

**📝 Yapılması Gerekenler:**
1. ✅ ~~Kart dağıtım mantığını düzelt~~
2. ✅ ~~İki aşamalı dağıtım sistemini planla~~
3. ✅ ~~Beraberlik mekanizmasını düzelt~~ (kartlar geri dönmez)
4. ✅ ~~Komisyon detaylarını netleştir~~
5. ✅ ~~Güvenlik mekanizmalarını planla~~
6. ✅ ~~Leaderboard sistemini tasarla~~
7. ✅ ~~Emoji sistemini ekle~~
8. ✅ ~~Mobil destek planla~~
9. ✅ ~~Reconnect sistemini detaylandır~~
10. ✅ ~~15. round limiti ekle~~
11. ✅ ~~AFK forfeit sistemi (3x timeout)~~
12. ✅ ~~Sound effects listesi~~
13. ✅ ~~Tutorial/Onboarding tasarımı~~
14. ✅ ~~Deployment stratejisi (Docker + Abstract Chain)~~
15. ✅ ~~Rate limiting (1 saat ban, IP + Address)~~
16. ✅ ~~Oda listeleme kuralları (sadece 1 kişilik)~~
17. ✅ ~~Disconnect ceza sistemi~~
18. 🔜 Smart contract'ı yaz (örnek var)
19. 🔜 Backend implementasyonu
20. 🔜 Frontend implementasyonu

**Önerilen Başlangıç:**
```bash
# 1. Proje kurulumu
npm install gsap framer-motion socket.io-client antd styled-components

# 2. Backend
cd backend && npm install express socket.io ethers

# 3. Smart Contract
cd contracts && npm install --save-dev hardhat @openzeppelin/contracts
```

İyi çalışmalar! 🚀

