# Card Images

Bu klasör oyun kartlarının görsellerini içerir.

## Gerekli Dosyalar

### Kart Görselleri (9 adet - ZORUNLU)
Her kart için `{tip}_{değer}.jpg` formatında görsel eklemelisiniz:

- `fire_3.jpg` - Ateş kartı, değer 3
- `fire_5.jpg` - Ateş kartı, değer 5
- `fire_7.jpg` - Ateş kartı, değer 7
- `ice_3.jpg` - Buz kartı, değer 3
- `ice_5.jpg` - Buz kartı, değer 5
- `ice_7.jpg` - Buz kartı, değer 7
- `water_3.jpg` - Su kartı, değer 3
- `water_5.jpg` - Su kartı, değer 5
- `water_7.jpg` - Su kartı, değer 7

### Kart Arkası (1 adet - OPSİYONEL)
- `card_back.jpg` - Rakip kartlarının arka yüzü için görsel

## Görsel Özellikleri

### Önerilen Boyutlar
- **Genişlik:** 400-600px
- **Yükseklik:** 600-900px
- **Oran:** 2:3 (örn: 400x600, 500x750, 600x900)

### Format
- **Birincil:** `.jpg` (daha küçük dosya boyutu)
- **Alternatif:** `.png` (şeffaflık gerekiyorsa)
- **Gelişmiş:** `.webp` (modern tarayıcılar için)

### Dosya Boyutu
- Her kart görseli **maksimum 500KB** olmalı
- Optimizasyon için TinyPNG veya Squoosh kullanın

## Fallback Mekanizması

Eğer bir görsel yüklenemezse, otomatik olarak emoji'ye geri döner:
- 🔥 Ateş kartları için
- ❄️ Buz kartları için
- 💧 Su kartları için

## Görsel Stili

### İpuçları
1. **Kontrast:** Değer ve tip yazısının okunabilir olması için alt kısımda koyu alan bırakın
2. **Tema:** Oyunun fantasy/mystical temasına uygun görseller kullanın
3. **Tutarlılık:** Tüm kartlar benzer stil ve kalitede olmalı
4. **Detay:** 100x150px'de bile görsel çekici olmalı (oyunda bu boyutta görünür)

### Örnek Konseptler

**Ateş Kartları:**
- Fire 3: Küçük alevler, kıvılcımlar
- Fire 5: Orta boy yangın, ateş topu
- Fire 7: Büyük inferno, ejderha ateşi

**Buz Kartları:**
- Ice 3: Kar taneleri, don kristalleri
- Ice 5: Buz kütleleri, buzul
- Ice 7: Kar fırtınası, buz büyüsü

**Su Kartları:**
- Water 3: Su damlaları, göl
- Water 5: Dalgalar, şelale
- Water 7: Tsunami, okyanus gücü

## Test Etme

Görselleri ekledikten sonra:

1. Tarayıcıda oyunu açın
2. Kart elini kontrol edin - görseller görünüyor mu?
3. Rakip kartının arkasını kontrol edin
4. Kart seçtiğinizde animasyonlar çalışıyor mu?
5. Farklı ekran boyutlarında test edin

## Hata Ayıklama

**Görsel görünmüyor:**
- Dosya adını kontrol edin (küçük harf, alt çizgi)
- Dosya yolunu kontrol edin (`/cards/` klasöründe mi?)
- Browser console'da hata var mı?
- Dosya boyutu çok büyük değil mi?

**Görsel bulanık:**
- Daha yüksek çözünürlüklü görsel kullanın
- Minimum 400x600px boyutunda olmalı

**Görsel bozuk:**
- Dosya formatını kontrol edin (.jpg veya .png)
- Dosya hasarlı olabilir, yeniden kaydedin

## Lisans

Kullandığınız görsellerin lisansına dikkat edin:
- Kendi oluşturduğunuz görseller
- Royalty-free stok görseller
- Creative Commons lisanslı görseller

---

**Not:** Görseller eklenmediğinde oyun emoji'lerle çalışmaya devam eder. Bu yüzden önce test edip ardından görselleri ekleyebilirsiniz.

