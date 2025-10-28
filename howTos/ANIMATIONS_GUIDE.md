# 🎬 Animasyon Rehberi - Ice Water Fire Game

## 📦 Kullanılan Kütüphane
**Framer Motion v11.0.0** - React için güçlü ve performanslı bir animasyon kütüphanesi.

## 🎯 Eklenen Animasyonlar

### 1. **Card Component** (`Card.tsx`)

#### Kart Giriş Animasyonu
```tsx
initial: { 
  scale: 0,
  opacity: 0,
  rotateY: 180
}
animate: { 
  scale: 1,
  opacity: 1,
  rotateY: 0
}
```
- Kartlar 3D flip efekti ile ekrana gelir
- Spring animasyonu kullanılır (fiziksel hareket)

#### Hover Animasyonu
```tsx
hover: {
  y: -20,
  scale: 1.05,
  boxShadow: `0 15px 35px ${cardColor}60`
}
```
- Mouse kartın üzerine geldiğinde yukarı kalkar
- Hafif büyür ve kartın rengine göre gölge oluşur

#### Seçilme Animasyonu
```tsx
selected: {
  y: -30,
  scale: 1.1,
  boxShadow: `0 20px 40px ${cardColor}90`
}
```
- Seçili kart daha fazla yukarı kalkar
- Daha büyük ve parlak gölge

#### Kart Çevirme Animasyonu
```tsx
flipVariants: {
  front: { rotateY: 0 },
  back: { rotateY: 180 }
}
```
- Rakip kartları arka yüzü gösterir
- 0.6 saniye süren smooth geçiş

#### İkon Animasyonları
- Kart ikonları (🔥💧❄️) sürekli hafif döner ve büyür/küçülür
- Infinite loop ile sürekli hareket
- Her kart tipi için farklı ritim

#### Seçim İndikatörü
- Yeşil tik işareti spin yaparak belirir
- Spring animasyonu ile elastik hareket

---

### 2. **CardHand Component** (`CardHand.tsx`)

#### Container Animasyonu
```tsx
containerVariants: {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1  // Her kart 0.1s arayla gelir
    }
  }
}
```

#### Kart Slot Animasyonları
```tsx
cardSlotVariants: {
  hidden: { 
    opacity: 0, 
    y: 100,    // Aşağıdan gelir
    scale: 0   // Küçükten başlar
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    scale: 0,
    y: -100    // Yukarı doğru kaybolur
  }
}
```

#### Layout Animasyonu
- `layout` prop ile kartlar yerlerini değiştirdiğinde smooth geçiş
- Kart sayısı değiştiğinde otomatik yeniden düzenlenir
- AnimatePresence ile kartlar eklenip çıkarılırken animasyon

#### Hover Efekti
- Hover edilen kart `zIndex` değişir ve öne çıkar
- Diğer kartların önüne geçer

---

### 3. **GameRoom Component** (`GameRoom.tsx`)

#### Sayfa Giriş Animasyonu
```tsx
pageVariants: {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
}
```

#### Header Animasyonları
- **Back Button**: Hover'da sola kayar ve büyür
- **Room ID**: Scale 0'dan başlar, spring ile açılır
  - Kopyalandığında tik işareti belirir
- **Bet Amount**: Gecikmeli spring animasyonu
- **Share Button**: Hover ve tap animasyonları

#### Waiting State Animasyonları
```tsx
<WaitingIcon animate={{ rotate: 360 }} />
```
- ⏳ ikonu sürekli döner (2 saniyede bir tur)
- Başlık ve metin sırayla fade-in yapar (stagger)
- Share butonları hover'da yukarı kalkar
- Loading dots pulse animasyonu (0, 0.2, 0.4s delay)

#### Players Container Animasyonları
- **Current Player**: Soldan slide-in
- **Opponent**: Sağdan slide-in
- **VS Indicator**: 
  - -180° rotate ile merkeze gelir
  - Sürekli hafif büyür/küçülür ve döner
  - ⚔️ ikonu sürekli sallanır

#### Ready Button Animasyonları
```tsx
<ReadyButton
  whileHover={{ 
    scale: 1.1,
    boxShadow: "0 8px 24px rgba(46, 204, 113, 0.6)"
  }}
  whileTap={{ scale: 0.95 }}
/>
```
- Hover'da %10 büyür, parlak yeşil gölge
- Tıklandığında %95'e küçülür (tactile feedback)
- Ready olduğunda tik işareti sürekli sallanır

#### Game Starting Overlay
```tsx
<GameStartingOverlay>
  <StartingText /> // Scale 0'dan başlar, yukarıdan gelir
  <StartingIcon />  // Sürekli döner
  <Countdown />     // Fade-in
</GameStartingOverlay>
```
- Backdrop blur efekti
- Tüm overlay fade-in/out

#### Instructions Animasyonları
- **Container**: Aşağıdan yukarı slide-in
- **Title**: Fade-in
- **Items**: Soldan sırayla gelir (stagger: 0.1s)
  - Her item'a hover edildiğinde büyür ve background değişir
  - İkonlar sürekli hareket eder:
    - 🔥 Döner ve büyür/küçülür
    - 💧 Yukarı aşağı hareket eder
    - ❄️ Ters yönde döner
    - 🏆 Daha hızlı scale ve rotate

---

## 🎨 Animasyon Tipleri ve Kullanım Alanları

### Spring Animasyonlar
```tsx
transition: {
  type: "spring",
  stiffness: 400,  // Katılık (yüksek = hızlı)
  damping: 15      // Sönümleme (düşük = daha fazla bounce)
}
```
**Kullanıldığı yerler:**
- Buton tıklamaları
- Modal açılışları
- Kart seçimleri

### Tween Animasyonlar
```tsx
transition: {
  duration: 0.4,
  ease: "easeOut"
}
```
**Kullanıldığı yerler:**
- Fade in/out efektleri
- Sayfa geçişleri

### Keyframe Animasyonlar
```tsx
animate={{ 
  rotate: [0, 10, -10, 0],
  scale: [1, 1.1, 1]
}}
transition={{
  duration: 2,
  repeat: Infinity,
  repeatType: "reverse"
}}
```
**Kullanıldığı yerler:**
- İkon hareketleri
- Loading animasyonları
- Idle state animasyonları

---

## 🚀 Performans Optimizasyonları

### 1. **Transform ve Opacity Kullanımı**
```tsx
// ✅ İyi (GPU hızlandırma)
transform: translateY(-20px)
opacity: 0

// ❌ Kötü (CPU-bound)
height: 0
margin-top: 20px
```

### 2. **Layout Animasyonları**
```tsx
<motion.div layout>
  // Framer Motion otomatik olarak FLIP tekniği kullanır
  // First, Last, Invert, Play
</motion.div>
```

### 3. **AnimatePresence**
```tsx
<AnimatePresence mode="wait">
  // Component unmount edilirken exit animasyonu oynar
</AnimatePresence>
```

### 4. **Variants Kullanımı**
```tsx
// Variants ile animasyonları merkezi bir yerden yönetebilirsiniz
// Aynı animasyonu birden fazla yerde kullanabilirsiniz
// Daha temiz ve sürdürülebilir kod
```

---

## 🎮 Oyun Akışındaki Animasyonlar

### 1. **Lobby → Room Geçişi**
1. Lobby fade-out ve scale down (0.9)
2. Room fade-in ve scale up (0.9 → 1.0)
3. Header yukarıdan slide-in
4. Content aşağıdan slide-in
5. Bileşenler stagger ile sırayla belirer

### 2. **Kart Dağıtımı** (Gelecek)
1. Kartlar deste pozisyonundan fırlar
2. Hava'da flip yapar (180°)
3. Hedef pozisyona smooth landing
4. Stagger: Her kart 0.15s arayla

### 3. **Kart Seçimi**
1. Hover: Yukarı kalkar (-20px)
2. Click: Tap animasyonu (0.95 scale)
3. Selected: Daha yukarı (-30px), büyür (1.1), glow efekti
4. Tik işareti spin ile belirir

### 4. **Round Sonucu** (Gelecek)
1. Her iki kart ortaya gelir
2. 0.5s bekle
3. Kaybeden kart opacity 0.5 olur
4. Kazanan kart parlak gölge alır ve büyür
5. Kazanan kart, kazanan oyuncuya doğru uçar
6. Fade-out

### 5. **Oyun Bitişi** (Gelecek)
1. Tüm kartlar kaybolur
2. Sonuç modal'ı scale 0'dan başlar
3. Spring animasyonu ile açılır
4. Confetti efekti (kazanırsa)

---

## 📱 Mobile Touch Desteği

Framer Motion otomatik olarak touch eventlerini destekler:

```tsx
<motion.div
  whileHover={{ scale: 1.05 }}    // Desktop: mouse hover
  whileTap={{ scale: 0.95 }}      // Mobile: touch
/>
```

**Swipe Animasyonları** (Mobil için):
```tsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  onDragEnd={(e, { offset, velocity }) => {
    if (offset.y < -100) {
      // Kart seçildi (swipe up)
      selectCard();
    }
  }}
/>
```

---

## 🎨 Gelecekte Eklenecek Animasyonlar

### 1. **GameBoard Component**
- [ ] Oyun başlangıç countdown (3, 2, 1)
- [ ] Seçim zamanı timer animasyonu (circular progress)
- [ ] Kart reveal animasyonu (flip)
- [ ] Kazanan kartın highlight animasyonu
- [ ] Round kazanma efekti (particles)

### 2. **ResultModal Component**
- [ ] Modal giriş animasyonu
- [ ] Skor animasyonu (counting up)
- [ ] Kazanma: Confetti + glow efekti
- [ ] Kaybetme: Shake efekti
- [ ] Beraberlik: Neutral glow

### 3. **Emoji System**
- [ ] Emoji gönderme animasyonu
- [ ] Emoji uçuş animasyonu (player1 → player2)
- [ ] Emoji bounce efekti (landing)
- [ ] Emoji fade-out

### 4. **Disconnect/Reconnect**
- [ ] Disconnect warning shake
- [ ] Reconnect success pulse
- [ ] Countdown timer animation

---

## 🛠️ Animasyon Özellikleri Değiştirme

### Animasyon Hızını Ayarlama
```tsx
// Daha hızlı
transition: { duration: 0.2 }

// Daha yavaş
transition: { duration: 0.8 }

// Spring hızı
transition: { 
  type: "spring",
  stiffness: 600,  // Daha hızlı
  damping: 20      // Daha az bounce
}
```

### Gecikme Ekleme
```tsx
transition: { delay: 0.5 }
```

### Animasyonu Devre Dışı Bırakma
```tsx
// Geliştirme sırasında hızlı test için
<motion.div
  animate={{ opacity: 1 }}
  transition={{ duration: 0 }}  // Anında
/>
```

---

## 📊 Animasyon Performans İzleme

Chrome DevTools'da:
1. `Performance` sekmesini aç
2. `Record` butonuna tıkla
3. Animasyonları test et
4. `Stop` butonuna tıkla
5. `FPS` grafiğini kontrol et (60 FPS hedef)

**Önemli Metrikler:**
- **Scripting (JavaScript)**: Düşük olmalı
- **Rendering**: Düşük olmalı  
- **Painting**: Çok düşük olmalı
- **Composite**: Yüksek olabilir (GPU)

---

## 🎓 Framer Motion Özellikleri

### 1. **Variants** (Önerilen)
```tsx
const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

<motion.div variants={variants} initial="hidden" animate="visible" />
```

### 2. **Gesture Animations**
```tsx
<motion.div
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.9 }}
  whileFocus={{ scale: 1.05 }}
  whileDrag={{ scale: 1.2 }}
/>
```

### 3. **AnimatePresence**
```tsx
<AnimatePresence mode="wait">
  {show && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )}
</AnimatePresence>
```

### 4. **Layout Animations**
```tsx
<motion.div layout>
  // Framer Motion size ve position değişikliklerini otomatik animasyonlar
</motion.div>
```

### 5. **useAnimation Hook**
```tsx
const controls = useAnimation();

controls.start({
  x: 100,
  transition: { duration: 0.5 }
});
```

---

## 💡 En İyi Pratikler

1. **Variants Kullan**: Animasyonları merkezi bir yerden yönet
2. **Stagger Children**: Sıralı animasyonlar için
3. **Transform & Opacity**: GPU acceleration için
4. **AnimatePresence**: Mount/unmount animasyonları için
5. **Layout Prop**: Dinamik layout değişiklikleri için
6. **Spring**: Doğal hisli animasyonlar için
7. **Ease Functions**: Smooth başlangıç/bitiş için

---

## 🐛 Yaygın Hatalar ve Çözümleri

### 1. Animasyon Çalışmıyor
```tsx
// ❌ Yanlış
<div animate={{ x: 100 }} />

// ✅ Doğru
<motion.div animate={{ x: 100 }} />
```

### 2. Exit Animasyonu Çalışmıyor
```tsx
// AnimatePresence gerekli
<AnimatePresence>
  {show && <motion.div exit={{ opacity: 0 }} />}
</AnimatePresence>
```

### 3. Layout Shift
```tsx
// will-change ekle
<motion.div style={{ willChange: "transform" }} />
```

---

## 📚 Daha Fazla Bilgi

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Animation Examples](https://www.framer.com/motion/examples/)
- [Performance Tips](https://www.framer.com/motion/guide-performance/)

---

**Not:** Tüm animasyonlar performans gözetilerek yapılmıştır. 60 FPS'de sorunsuz çalışır. 🚀

