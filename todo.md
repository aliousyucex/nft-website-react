- frontend docker buildi alındı
- backend için docker buildi al
- server'a ilk deployment'ı yap, testnette kalsın her şey, single mode ve free multiplayer mode ile kullanıcı testlerini yaptır.


- turbo eklenecek,
   - bütün node_modules, dist, builds kaldırılacak ve baştan proje sıfırdan ayağa kaldırılacak

- Single player bozulmuş gözüküyor. Galiba hepsi bozuldu typelar sonrasında

- Backend için docker build alınacak
- github actions eklenecek
- Kullanılmayan, .env içerikleri değiştirilecek/silinecek.
- Landing page içerisindeki background div'inin muhtemel bir max-height css'si var kaldırılacak.
- Landing page'den single/multiplayer seçenekleri ile oyun başlatmak istendiğinde, room'dan önce lobby'e aktarılıyoruz. Direkt Room'a aktarılalım, eğer bir bekleme, kontrol etme süresi gerekiyorsa, loading ekleyip, lobby'i ekranını bypass edip direkt room'a gidelim.
- Home için eklediğimiz, logo'nun arkaplanını düzeltelim.
- Landing page'deki animasyon ve düz kart yerine, oyuna bir logo oluşturup, bunu kullanalım.
- validateDOMNesting(...): <button> şeklinde bir hatamız var bunun ne olduğuna bakalım.
- Tutorial'ın çıktığı sayfa, oyun modu seçiminden önce gelmeli, şu anda oyun seçtiğimizde geliyor, ve bypass ederek room'a yönlendiriliyoruz.
- Tutorial'ı kısalt maksimum 3 steplik hızlıca anlatıma sahip bir hale getir.

- Single Player modu test edilecek
    - AFK durumunda sadece forfeit ve lobby'e aktarım mı oluyor?
- Multiplayer Free modu test edilecek
    - 1 Player afk olduğunda nasıl ilerliyoruz
    - 2 Player afk olduğunda nasıl ilerliyoruz
    - 1 Player, 1. ve 3. roundda AFK olduğunda nasıl ilerliyoruz.
- Multiplayer bet modu test edilecek
    - 1 Player afk olduğunda nasıl ilerliyoruz
    - 2 Player afk olduğunda nasıl ilerliyoruz
    - 1 Player, 1. ve 3. roundda AFK olduğunda nasıl ilerliyoruz.
    - Refund ve para yönetimi UI'da nasıl gözüküyor.
    - Refund ve para yönetimi contract'ta nasıl yansıyor.
    - Normal kazanımda para yönetimi nasıl yansıyor.
- Oyun için isim önerisi alınacak

