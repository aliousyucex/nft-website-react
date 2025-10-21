- ✅ Kullanıcı / kullanıcıların afk kontrolü steplerini tekrar kontrol etmemiz gerekiyor.
    - ✅ AFK kontrol Testleri için maddeler çıkart.
    - Dökümanlar oluşturuldu: `howTos/AFK_CONTROL_DOCUMENTATION.md` ve `howTos/AFK_TEST_CASES.md`
- ✅ Share link kopyalanıp, o link ile odaya katılmayı denediğimizde, root'a redirect ediyor.
    - Dynamic route `/game/:roomId` eklendi
    - Auto-join logic implement edildi
- ✅ gameResultModal'i gostermek icin animasyonları durduruyoruz. Fakat bu bir çok soruna yol açıyor. Timer ilerlemiyor, son oynanan kartlar reveal olmuyor. Skor güncellenmiyor ve 4.5 saniye bekliyoruz. Oyun bozulmuş gibi oluyor, neden kaybettiğimizden emin olamıyoruz. Animasyon durdurma olayını kaldıralım.
    - Animasyon durdurma logic'i kaldırıldı
    - Timer sürekli çalışıyor
    - Modal gecikmesi 2500ms'den 1000ms'e düşürüldü
    - waitingForAnimations bağımlılıkları temizlendi
- ✅ 768px pixel'in altinda ActionPanel 2x2 seklinde gozukmeye baslasin.
    - Grid layout implement edildi 


<!-- - ActionCard içerisindeki ActionIcon'larını, 768px'in altına düştüğümüzde göstermeyelim ki kullanıcı sürekli aşağı kaydırmak zorunda kalmasın. -->


- frontend docker buildi alındı
- backend için docker buildi al
- server'a ilk deployment'ı yap, testnette kalsın her şey, single mode ve free multiplayer mode ile kullanıcı testlerini yaptır.